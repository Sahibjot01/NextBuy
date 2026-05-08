import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tags";
import Products from "@/components/products/products";
import { db } from "@/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  const featured = data.slice(0, 3);
  return (
    <main className="relative pb-20">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.2),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(248,250,252,0.96))] px-6 py-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)] md:px-10 md:py-14 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(15,23,42,0.88))]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)] opacity-40 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div className="max-w-3xl">
            <Badge className="mb-4 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-primary">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              NextBuy storefront refresh
            </Badge>
            <h2 className="max-w-2xl text-4xl font-black tracking-tight text-balance sm:text-5xl md:text-6xl">
              A sharper, calmer storefront for products that should feel worth remembering.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Search, filter, and shop through a polished catalog with secure checkout, reviews, and a cleaner product discovery flow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#catalog"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                Explore catalog
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-secondary"
              >
                Open dashboard
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
              {[
                "Secure Stripe checkout",
                "Admin inventory controls",
                "Algolia-powered search",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-border/70 bg-background/85 p-5 shadow-xl backdrop-blur md:p-6">
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div>
                <p className="text-sm text-muted-foreground">Live catalog snapshot</p>
                <p className="text-2xl font-bold">{data.length} variants</p>
              </div>
              <div className="rounded-2xl bg-primary/10 px-3 py-2 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="grid gap-3">
              {featured.map((variant) => (
                <Link
                  key={variant.id}
                  href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}&color=${variant.color}`}
                  className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 p-3 transition hover:-translate-y-0.5 hover:bg-secondary"
                >
                  <div
                    className="h-16 w-16 shrink-0 rounded-2xl bg-cover bg-center shadow-sm transition group-hover:scale-105"
                    style={{ backgroundImage: `url(${variant.variantImages[0].url})` }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{variant.product.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{variant.productType}</p>
                  </div>
                  <Badge variant="secondary">${variant.product.price.toFixed(2)}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["Built for recruiters", "Looks like a product people would actually browse and buy."],
          ["Security-first", "Product HTML, search results, and checkout inputs are safer now."],
          ["Production-minded", "Inventory, transactions, and CI are already wired in."],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-lg font-semibold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      <section id="catalog" className="mt-12 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1">
              Catalog
            </Badge>
            <h3 className="text-3xl font-bold tracking-tight">Find products faster, then browse the full collection.</h3>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Search is now the front door, tags are the shortcuts, and product cards feel less generic.
          </p>
        </div>
        <Algolia />
        <ProductTags />
        <Products variants={data} />
      </section>
    </main>
  );
}
