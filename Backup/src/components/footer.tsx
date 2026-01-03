import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Music2 } from 'lucide-react'


export function Footer(){
return (
<footer className="border-t border-brand/20 mt-16 bg-white/80 backdrop-blur shadow-subtle">
<div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-4">
<div>
<div className="text-xl font-semibold">Tintco</div>
<p className="text-sm mt-2">Premium interiors. Fast quotes.</p>
<address className="not-italic text-sm mt-3">123 Design Ave, Suite 200<br/>New York, NY</address>
</div>
<div>
<div className="font-medium mb-2">Company</div>
<div className="flex flex-col gap-1">
<Link href="/about">About Us</Link>
<Link href="/contact">Contact</Link>
<Link href="/terms">Terms</Link>
<Link href="/privacy">Privacy</Link>
</div>
</div>
<div>
<div className="font-medium mb-2">Help</div>
<div className="flex flex-col gap-1">
<Link href="/faq">FAQ</Link>
<Link href="/categories">Shop</Link>
<Link href="/quote">Get a Quote</Link>
</div>
</div>
<div>
<div className="font-medium mb-2">Follow</div>
<div className="flex gap-3">
<a href="#" aria-label="Facebook"><Facebook className="h-5 w-5"/></a>
<a href="#" aria-label="Instagram"><Instagram className="h-5 w-5"/></a>
<a href="#" aria-label="TikTok"><Music2 className="h-5 w-5"/></a>
<a href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5"/></a>
</div>
</div>
</div>
<div className="text-xs text-center py-4 border-t">© {new Date().getFullYear()} Tintco</div>
</footer>
)
}