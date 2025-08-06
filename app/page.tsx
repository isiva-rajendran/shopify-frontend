import Grid from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';
import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import { getProducts } from 'lib/shopify';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function HomePage() {
    const products = await getProducts({});

  return (
    <>
      <ThreeItemGrid />
        {products.length > 0 ? (
              <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <ProductGridItems products={products} />
              </Grid>
            ) : null}
      <Carousel />
      <Footer />
    </>
  );
}
