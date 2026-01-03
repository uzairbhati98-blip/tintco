import products from '@/data/products.json';
import categories from '@/data/categories.json';
import Link from 'next/link';
import Image from 'next/image';

// ✅ Convert to async + await params
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // unwrap promise

  const category = categories.find((c) => c.slug === slug);
  const items = products.filter((p) => p.categorySlug === slug);

  if (!category)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        Category not found.
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-6 mb-6">
        <h1 className="text-3xl font-semibold">{category.name}</h1>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="rounded-2xl overflow-hidden border card-hover"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-black/70 mt-1">
                ${p.price} / {p.unit}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
