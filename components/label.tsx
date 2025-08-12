import clsx from 'clsx';
import Price from './price';

const Label = ({
  title,
  amount,
  currencyCode,
  isAvailable,
  position = 'bottom'
}: {
  title: string;
  amount: string;
  currencyCode: string;
  isAvailable?: boolean;
  position?: 'bottom' | 'center';
}) => {
  return (
    <div
      className={clsx('flex flex-col pt-2 h-full w-full', {
        'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex flex-col h-full justify-between items-start border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        {/* Title (always visible) */}
        <h3 className="mr-4 line-clamp-2 w-full pl-2 text-[16px] text-slate-600 dark:text-slate-400 leading-none">{title}</h3>
        
        {/* Conditional elements - shown on hover above the price */}
        <div className="hidden group-hover:block w-full transition-all duration-300">
          <h3 className={`mr-4 pl-2 leading-none ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {isAvailable ? 'In stock' : 'Out of stock'}
          </h3>
          {/* Add more details here if needed */}
        </div>
        
        {/* Price (always visible at bottom) */}
        <div className="w-full">
          <Price
            className="flex-none rounded-full bg-blue-600 p-2 text-white"
            amount={amount}
            currencyCode={currencyCode}
            currencyCodeClassName="hidden @[275px]/label:inline"
          />
        </div>
      </div>
    </div>
  );
};

export default Label;
