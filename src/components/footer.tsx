import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tintco</h3>
            <p className="text-sm text-text/70">
              Premium interior services including wall painting, decorative panels, and epoxy flooring.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" className="text-text/60 hover:text-brand">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" className="text-text/60 hover:text-brand">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" className="text-text/60 hover:text-brand">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories" className="text-text/70 hover:text-brand">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-text/70 hover:text-brand">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-text/70 hover:text-brand">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text/70 hover:text-brand">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text/70 hover:text-brand">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-text/70 hover:text-brand">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text/70 hover:text-brand">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-text/60">
          © {new Date().getFullYear()} Tintco. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
