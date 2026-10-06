import { CategorySidebar } from "@/components/shop/category-sidebar";
import { HeroBanner } from "@/components/shop/hero-banner";
import { QuickCategories } from "@/components/shop/quick-categories";
import { TrustBand } from "@/components/shop/trust-band";
import { FlashSale } from "@/components/shop/flash-sale";
import { ProductCard } from "@/components/shop/product-card";
import { SectionHeading } from "@/components/shop/section-heading";
import { InstallationCta } from "@/components/shop/installation-cta";
import { Realisations } from "@/components/shop/realisations";
import { Testimonials } from "@/components/shop/testimonials";
import { BlogPreview } from "@/components/shop/blog-preview";
import { FLASH_SALE_END } from "@/features/products/data";
import { getFlashProducts, getProducts } from "@/features/products/queries";
import { CATEGORIES } from "@/lib/constants";

export default async function Home() {
  const [products, flashProducts] = await Promise.all([
    getProducts(),
    getFlashProducts(),
  ]);

  // Une section par catégorie qui contient des produits
  const sections = CATEGORIES.map((c) => ({
    ...c,
    items: products.filter((p) => p.categoryId === c.slug).slice(0, 8),
  })).filter((s) => s.items.length > 0);
  return (
    <main className="container mx-auto flex flex-col gap-8 px-4 py-6">
      {/* Bannière + colonne catégories */}
      <div className="animate-fade-up flex gap-4">
        <CategorySidebar />
        <div className="min-w-0 flex-1">
          <HeroBanner />
        </div>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
        <QuickCategories />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
        <TrustBand />
      </div>

      {flashProducts.length > 0 && (
        <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
          <FlashSale products={flashProducts} endsAt={FLASH_SALE_END} />
        </div>
      )}

      {/* Grilles par catégorie */}
      {sections.map((s, i) => (
        <section
          key={s.slug}
          className="animate-fade-up"
          style={{ animationDelay: `${320 + i * 80}ms` }}
        >
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
      ))}

      <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
        <InstallationCta />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: "480ms" }}>
        <Realisations />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: "560ms" }}>
        <Testimonials />
      </div>
      <div className="animate-fade-up" style={{ animationDelay: "640ms" }}>
        <BlogPreview />
      </div>
    </main>
  );
}
