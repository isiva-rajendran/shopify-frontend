const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
  
      <div className="border-t border-neutral-200 py-6 bg-slate-100 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 lg:px-6 xl:px-8">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          {/* <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" /> */}
          <p>
            {/* <a href="https://github.com/vercel/commerce">View the source</a> */}
          </p>
          <p className="md:ml-auto">
            <a className="text-black dark:text-white">
              Created by Siva
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
