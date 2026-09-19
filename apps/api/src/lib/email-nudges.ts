import { prisma } from '@tiptalk/db';
import {
  emailConfigured,
  sendEmail,
  renderAvatarNudgeEmail,
  renderGalleryNudgeEmail,
} from './email.js';

const BATCH = 50;
const FIVE_DAYS_MS = 5 * 24 * 3600 * 1000;

/**
 * Send onboarding nudge emails to registered users who are missing a profile
 * photo and/or gallery photos.
 *
 * At most ONE nudge per user per run, avatar first. So a user missing both
 * gets the avatar nudge now and the gallery nudge only on a later run, at
 * least 5 days after the avatar one — never both at once (no saturation).
 * State lives in User.avatarNudgeAt / galleryNudgeAt, so it's sent once each.
 */
export async function sweepOnboardingNudges(): Promise<{ avatarSent: number; gallerySent: number }> {
  if (!emailConfigured()) return { avatarSent: 0, gallerySent: 0 };
  const fiveDaysAgo = new Date(Date.now() - FIVE_DAYS_MS);

  const users = await prisma.user.findMany({
    where: {
      blockedAt: null,
      OR: [
        { avatarUrl: null, avatarNudgeAt: null },
        { profilePhotos: { none: {} }, galleryNudgeAt: null },
      ],
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      avatarNudgeAt: true,
      galleryNudgeAt: true,
    },
    take: BATCH,
  });

  let avatarSent = 0;
  let gallerySent = 0;

  for (const u of users) {
    const sendAvatar = u.avatarUrl === null && u.avatarNudgeAt === null;

    let sendGallery = false;
    if (!sendAvatar && u.galleryNudgeAt === null) {
      const galleryCount = await prisma.profilePhoto.count({ where: { userId: u.id } });
      if (galleryCount === 0) {
        // 5-day spacing: hold the gallery nudge if the avatar one went out
        // less than 5 days ago (or is going out this run).
        const avatarRecent = u.avatarNudgeAt !== null && u.avatarNudgeAt > fiveDaysAgo;
        if (!avatarRecent) sendGallery = true;
      }
    }

    if (sendAvatar) {
      const { subject, html } = renderAvatarNudgeEmail({ recipientName: u.displayName, userId: u.id });
      const r = await sendEmail({ to: u.email, subject, html });
      await prisma.user.update({ where: { id: u.id }, data: { avatarNudgeAt: new Date() } });
      if (r.ok) avatarSent += 1;
    } else if (sendGallery) {
      const { subject, html } = renderGalleryNudgeEmail({ recipientName: u.displayName, userId: u.id });
      const r = await sendEmail({ to: u.email, subject, html });
      await prisma.user.update({ where: { id: u.id }, data: { galleryNudgeAt: new Date() } });
      if (r.ok) gallerySent += 1;
    }
  }

  return { avatarSent, gallerySent };
}
