import Link from "next/link";
import Logo from "@/components/Logo";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { LinkedInIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { SITE, NAV_LINKS } from "@/lib/data";

const whatsappHref = `https://wa.me/${SITE.whatsapp.replace("+", "")}`;

const contactLinkClass =
  "flex items-center gap-2 text-body-sm text-text-muted transition-colors hover:text-text";
const socialClass =
  "rounded-full border border-border p-2 text-text-muted transition-colors hover:border-accent hover:text-accent";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-text">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-5">
              {/* Dark surface → original-color lockup on a refined cream tile. */}
              <Logo variant="lockup" surface="tile" size="xl" />
            </div>
            <p className="mb-6 max-w-xs text-body-sm leading-relaxed text-text-muted">
              India&apos;s premium AI-powered recruitment and consultancy firm. Trusted by 242+
              companies across all industries. Headquartered in Agra since 2019.
            </p>
            <p className="mb-6 text-body-sm font-semibold italic text-accent">
              &ldquo;{SITE.tagline}&rdquo;
            </p>
            <div className="flex gap-3">
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="JOBKREATORS on LinkedIn">
                <LinkedInIcon size={16} />
              </a>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className={socialClass} aria-label="JOBKREATORS on Instagram">
                <InstagramIcon size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="mb-4 text-eyebrow uppercase text-text-subtle">Navigation</h2>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-sm text-text-muted transition-colors hover:text-text">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/submit-cv" className="text-body-sm text-text-muted transition-colors hover:text-text">
                  Submit Your CV
                </Link>
              </li>
              <li>
                <Link href="/submit-role" className="text-body-sm text-text-muted transition-colors hover:text-text">
                  Submit a Role
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="mb-4 text-eyebrow uppercase text-text-subtle">Contact</h2>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${SITE.phone}`} className={contactLinkClass}>
                  <Phone size={14} aria-hidden />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className={contactLinkClass}>
                  <Mail size={14} aria-hidden />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={contactLinkClass}>
                  <MessageCircle size={14} aria-hidden />
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-start gap-2 text-body-sm text-text-muted">
                <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden />
                Agra, Uttar Pradesh, India
              </li>
            </ul>
          </div>
        </div>

        <div className="my-10 h-px bg-border" />

        {/* Fine print — © / Privacy / Terms separated by middle dots. */}
        <div className="flex flex-col items-center justify-between gap-4 text-caption text-text-subtle md:flex-row">
          <p>© {new Date().getFullYear()} JOBKREATORS Recruitment and Consultancy. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="transition-colors hover:text-text">Privacy</Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="transition-colors hover:text-text">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
