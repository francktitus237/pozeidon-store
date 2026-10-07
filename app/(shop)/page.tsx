import { CategorySidebar } from "@/components/shop/category-sidebar";
import { HeroBanner } from "@/components/shop/hero-banner";
import { QuickCategories } from "@/components/shop/quick-categories";
import { TrustBand } from "@/components/shop/trust-band";
import { FlashSale } from "@/components/shop/flash-sale";
import { ProductCard } from "@/components/shop/product-card";
import { SectionHeading } from "@/components/shop/section-heading";
import { InstallationCta } from "@/components/shop/installation-cta";
import { PromoVideoSection } from "@/components/shop/promo-video";
import { Realisations } from "@/components/shop/realisations";
import { Testimonials } from "@/components/shop/testimonials";
import { BlogPreview } from "@/components/shop/blog-preview";
import { FLASH_SALE_END } from "@/features/products/data";
import {
  getCategories,
  getFlashProducts,
  getProducts,
} from "@/features/products/queries";
import { Reveal } from "@/components/reveal";

export default async function Home() {
  const [products, flashProducts, categories] = await Promise.all([
    getProducts(),
    getFlashProducts(),
    getCategories(),
  ]);

  // Une section par catégorie qui contient des produits
  const sections = categories
    .map((c) => ({
      ...c,
      items: products.filter((p) => p.categoryId === c.slug).slice(0, 8),
    }))
    .filter((s) => s.items.length > 0);
  return (
    <main className="container mx-auto flex flex-col gap-8 px-4 py-6">
      {/* Bannière + colonne catégories */}
      <Reveal className="flex gap-4">
        <CategorySidebar />
        <div className="min-w-0 flex-1">
          <HeroBanner />
        </div>
      </Reveal>

      <Reveal delay={80}>
        <QuickCategories />
      </Reveal>
      <Reveal delay={120}>
        <TrustBand />
      </Reveal>

      {flashProducts.length > 0 && (
        <Reveal delay={160}>
          <FlashSale products={flashProducts} endsAt={FLASH_SALE_END} />
        </Reveal>
      )}

      {/* Grilles par catégorie */}
      {sections.map((s, i) => (
        <Reveal key={s.slug} delay={200 + i * 60}>
          <section>
            <SectionHeading
              title={s.name}
              href={`/boutique/${s.slug}`}
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {s.items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </Reveal>
      ))}

      <Reveal delay={80}>
        <InstallationCta />
      </Reveal>
      <Reveal delay={80}>
        <PromoVideoSection />
      </Reveal>
      <Reveal delay={80}>
        <Realisations />
      </Reveal>
      <Reveal delay={80}>
        <Testimonials />
      </Reveal>
      <Reveal delay={80}>
        <BlogPreview />
      </Reveal>
    </main>
  );
}
