import Footer from 'components/layout/footer';
import Collections from 'components/layout/search/collections';
import FilterList from 'components/layout/search/filter';
import { sorting } from 'lib/constants';
import ChildrenWrapper from './children-wrapper';
import { Suspense } from 'react';

export default function SearchLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className=" mx-5 flex max-w-(--breakpoint-4xl) flex-col gap-8 justify-between mt-6 px-4 pb-4 text-black md:flex-row dark:text-white">
        <div className="order-first w-full flex-col md:max-w-[125px] space-y-4 md:order-none md:flex">
          <Collections />
            <FilterList list={sorting} title="Sort by" />
        </div>
        <div className="order-last min-h-screen w-full md:order-none">
          <Suspense fallback={null}>
            <ChildrenWrapper>{children}</ChildrenWrapper>
          </Suspense>
        </div>
        {/* <div className="order-none flex-none md:order-last md:w-[125px]">
          <FilterList list={sorting} title="Sort by" />
        </div> */}
      </div>
      <Footer />
    </>
  );
}
