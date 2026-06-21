'use client';
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export function HlsPlayer({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Safari + iOS play HLS natively.
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }
    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 30 });
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
    // Fallback: try direct (unlikely to work for HLS in older browsers)
    video.src = src;
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      preload="metadata"
      poster={poster}
      className={className ?? 'max-h-72 rounded-lg'}
    />
  );
}
