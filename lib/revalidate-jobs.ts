import { revalidatePath } from "next/cache";

// On-demand revalidation after an admin job mutation, so the ISR-cached public
// pages (and the admin list shell) update immediately instead of waiting out the
// 60s window. Pass the affected slug(s) — including the OLD slug on rename/delete/
// close — so those detail pages re-render (or 404).
export function revalidateJobs(...slugs: (string | null | undefined)[]) {
  revalidatePath("/jobs"); // public listing
  revalidatePath("/admin/jobs"); // admin list shell
  const seen = new Set<string>();
  for (const s of slugs) {
    if (s && !seen.has(s)) {
      seen.add(s);
      revalidatePath(`/jobs/${s}`); // public detail
    }
  }
}
