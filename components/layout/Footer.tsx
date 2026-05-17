import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { LinkedInIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { SITE, NAV_LINKS } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#1D1D1F] dark:bg-[#0A0A0A] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <div className="inline-block bg-white rounded-xl p-2">
                <Image
                  src="/logo.png"
                  alt="JOBKREATORS"
                  width={140}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-[#A1A1A6] text-sm leading-relaxed max-w-xs mb-6">
              India&apos;s premium AI-powered recruitment and consultancy firm. Trusted by 242+ companies
              across all industries. Headquartered in Agra since 2019.
            </p>
            <p className="text-[#0066FF] font-semibold italic text-sm">
              &ldquo;Hire smarter. Hire in 72 hours.&rdquo;
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Navigation</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A1A1A6] text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/submit-cv" className="text-[#A1A1A6] text-sm hover:text-white transition-colors">
                  Submit Your CV
                </Link>
              </li>
              <li>
                <Link href="/submit-role" className="text-[#A1A1A6] text-sm hover:text-white transition-colors">
                  Submit a Role
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${SITE.phone}`}
                  className="flex items-center gap-2 text-[#A1A1A6] text-sm hover:text-white transition-colors"
                >
                  <Phone size={14} />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2 text-[#A1A1A6] text-sm hover:text-white transition-colors"
                >
                  <Mail size={14} />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SITE.whatsapp.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#A1A1A6] text-sm hover:text-white transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-start gap-2 text-[#A1A1A6] text-sm">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                Agra, Uttar Pradesh, India
              </li>
            </ul>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-[#0066FF] transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={16} />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-[#E1306C] transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10 my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[#6E6E73] text-xs">
          <p>© {new Date().getFullYear()} JOBKREATORS Recruitment and Consultancy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
