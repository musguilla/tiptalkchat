import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import ffmpeg from 'fluent-ffmpeg';
import { createReadStream, createWriteStream, promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { loadEnv } from '@tiptalk/config';

const env = loadEnv();

const s3 = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  forcePathStyle: true,
  credentials: { accessKeyId: env.S3_ACCESS_KEY, secretAccessKey: env.S3_SECRET_KEY },
});

async function downloadFromS3(key: string, dest: string): Promise<void> {
  const obj = await s3.send(new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
  if (!obj.Body) throw new Error(`No body for s3://${env.S3_BUCKET}/${key}`);
  await pipeline(obj.Body as Readable, createWriteStream(dest));
}

async function uploadToS3(localPath: string, key: string, contentType: string): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: createReadStream(localPath),
      ContentType: contentType,
    }),
  );
}

export async function processImageJob(srcKey: string): Promise<{ thumbnailKey: string }> {
  const tmp = await fs.mkdtemp(join(tmpdir(), 'tiptalk-img-'));
  const srcLocal = join(tmp, 'src');
  const thumbLocal = join(tmp, 'thumb.jpg');
  try {
    await downloadFromS3(srcKey, srcLocal);
    await new Promise<void>((resolve, reject) =>
      ffmpeg(srcLocal)
        .outputOptions(['-vf', "scale=320:-1", '-q:v', '4'])
        .save(thumbLocal)
        .on('end', () => resolve())
        .on('error', reject),
    );
    const thumbKey = `thumbnails/${randomUUID()}.jpg`;
    await uploadToS3(thumbLocal, thumbKey, 'image/jpeg');
    return { thumbnailKey: thumbKey };
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
}

export async function processVideoJob(srcKey: string): Promise<{
  thumbnailKey: string;
  hlsManifestKey: string;
  durationMs: number;
}> {
  const tmp = await fs.mkdtemp(join(tmpdir(), 'tiptalk-vid-'));
  const srcLocal = join(tmp, 'src.mp4');
  const thumbLocal = join(tmp, 'thumb.jpg');
  const hlsDir = join(tmp, 'hls');
  await fs.mkdir(hlsDir, { recursive: true });

  try {
    await downloadFromS3(srcKey, srcLocal);

    // Extract thumbnail at 1s
    await new Promise<void>((resolve, reject) =>
      ffmpeg(srcLocal)
        .screenshots({ count: 1, timestamps: ['1'], folder: tmp, filename: 'thumb.jpg', size: '480x?' })
        .on('end', () => resolve())
        .on('error', reject),
    );

    // Probe duration
    const durationMs = await new Promise<number>((resolve, reject) =>
      ffmpeg.ffprobe(srcLocal, (err, data) => {
        if (err) reject(err);
        else resolve(Math.round((data.format.duration ?? 0) * 1000));
      }),
    );

    // Transcode to HLS (H.264 + AAC, single 720p rendition for simplicity)
    await new Promise<void>((resolve, reject) =>
      ffmpeg(srcLocal)
        .outputOptions([
          '-vf', 'scale=-2:720',
          '-c:v', 'libx264',
          '-crf', '23',
          '-preset', 'veryfast',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-hls_time', '6',
          '-hls_playlist_type', 'vod',
          '-f', 'hls',
          '-hls_segment_filename', join(hlsDir, 'seg-%03d.ts'),
        ])
        .save(join(hlsDir, 'master.m3u8'))
        .on('end', () => resolve())
        .on('error', reject),
    );

    const baseKey = `hls/${randomUUID()}`;
    const thumbKey = `thumbnails/${randomUUID()}.jpg`;
    await uploadToS3(thumbLocal, thumbKey, 'image/jpeg');

    const files = await fs.readdir(hlsDir);
    for (const file of files) {
      const local = join(hlsDir, file);
      const contentType = file.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t';
      await uploadToS3(local, `${baseKey}/${file}`, contentType);
    }

    return {
      thumbnailKey: thumbKey,
      hlsManifestKey: `${baseKey}/master.m3u8`,
      durationMs,
    };
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
}
