'use client';

import { GridTileImage } from 'components/grid/tile';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Product } from 'lib/shopify/types';

export default function RelatedProductsCarousel({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log("🚀 ~ RelatedProductsCarousel ~ currentIndex:", currentIndex)
  const [itemsPerView, setItemsPerView] = useState(5); // Default for initial render

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 475) {
        setItemsPerView(1); // Mobile
      } else if (width < 640) {
        setItemsPerView(2); // Small tablet
      } else if (width < 768) {
        setItemsPerView(3); // Tablet
      } else if (width < 1024) {
        setItemsPerView(4); // Desktop
      } else {
        setItemsPerView(5); // Large desktop
      }
    };

    // Run on mount and resize
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);

    // Cleanup listener
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView); // Prevent negative maxIndex

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <div className="relative overflow-hidden">
        <ul
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {products.map((product) => (
            <li
              key={product.handle}
              className="aspect-0 flex-none w-full min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            >
              <Link
                className="relative h-full w-full block"
                href={`/product/${product.handle}`}
                prefetch={true}
              >
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode: product.priceRange.maxVariantPrice.currencyCode
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                />
              </Link>
            </li>
          ))}
        </ul>
        {products.length > itemsPerView && (
          <>
              <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 transition-all duration-200 ${
                currentIndex === 0 ? 'opacity-50 blur-sm cursor-not-allowed' : 'opacity-100 cursor-pointer'
              } dark:bg-neutral-800`}
              aria-label="Previous product"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
           <button
              onClick={handleNext}
              disabled={currentIndex === maxIndex}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 transition-all duration-200 ${
                currentIndex === maxIndex ? 'opacity-50 blur-sm cursor-not-allowed' : 'opacity-100 cursor-pointer'
              } dark:bg-neutral-800`}
              aria-label="Next product"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}