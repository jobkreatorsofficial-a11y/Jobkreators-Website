"use client";

import { useState } from "react";
import { MessageCircle, Link2, Check } from "lucide-react";
import { LinkedInIcon } from "@/components/ui/SocialIcons";

/**
 * ShareButtons — LinkedIn, WhatsApp and copy-link for a job. URLs are built from
 * the live location on the client, so it works on any deploy domain.
 */
export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const url = () => (typeof window !== "undefined" ? window.location.href : "");
  const text = `${title} — via JOBKREATORS`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  const base =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-accent hover:text-accent";

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-caption text-text-subtle">Share</span>
      <a
        className={base}
        aria-label="Share on LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`}
      >
        <LinkedInIcon size={16} />
      </a>
      <a
        className={base}
        aria-label="Share on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
        href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url()}`)}`}
      >
        <MessageCircle size={16} aria-hidden />
      </a>
      <button type="button" className={base} aria-label="Copy link" onClick={copy}>
        {copied ? <Check size={16} className="text-accent" aria-hidden /> : <Link2 size={16} aria-hidden />}
      </button>
    </div>
  );
}
