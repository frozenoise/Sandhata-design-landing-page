import { prisma } from "./prisma";

// Trash: deleting a project or a page sets deletedAt instead of removing the
// row. Deleted items are hidden everywhere (lib/access.ts treats them as not
// found), listed in the builder's Trash for TRASH_DAYS, and purged after that.
// Purging is lazy - it runs when the project list or the Trash loads - so no
// scheduled job is needed.
export const TRASH_DAYS = 30;

export function purgeAfter(deletedAt: Date): Date {
  return new Date(deletedAt.getTime() + TRASH_DAYS * 24 * 60 * 60 * 1000);
}

/** Permanently removes anything that has been in the Trash longer than
 * TRASH_DAYS. A project's pages go with it (cascade). */
export async function purgeExpiredTrash(): Promise<void> {
  const cutoff = new Date(Date.now() - TRASH_DAYS * 24 * 60 * 60 * 1000);
  await prisma.project.deleteMany({ where: { deletedAt: { lt: cutoff } } });
  await prisma.builderSession.deleteMany({ where: { deletedAt: { lt: cutoff } } });
}
