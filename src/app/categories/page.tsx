import categories from '@/data/categories.json'
import Link from 'next/link'
import Image from 'next/image'


export default function Categories(){
return (
<div className="mx-auto max-w-6xl px-4 py-10">
<h1 className="text-3xl font-semibold mb-6">Categories</h1>
<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
{categories.map(c => (
<Link key={c.id} href={`/categories/${c.slug}`} className="rounded-2xl overflow-hidden border card-hover">
<div className="relative aspect-[4/3]"><Image src={c.heroImage} alt={c.name} fill className="object-cover"/></div>
<div className="p-4 text-lg font-medium">{c.name}</div>
</Link>
))}
</div>
</div>
)
}