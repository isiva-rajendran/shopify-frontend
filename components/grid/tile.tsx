import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    isAvailable?: boolean;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div className='grid h-[500px] grid-rows-[1fr_100px] border rounded-lg bg-white dark:bg-black group'>
      <div
        className={clsx(
          'group flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-black',
          {
            relative: label,
            'border-2 border-blue-600': active,
            'border-neutral-200 dark:border-neutral-800': !active
          }
        )}
      >

        {props.src ? (
          <Image
            className={clsx('relative h-full w-full object-contain', {
              'transition duration-300 ease-in-out group-hover:scale-110': isInteractive
            })}
            {...props}
          />
        ) : null}

      </div>
      <div
        className={clsx(
          'bg-white transition-all duration-300 ease-in-out transform origin-bottom',
          'h-[100px] hover:h-[130px] hover:-translate-y-[30px] hover:bg-white',
        )}
      >
        {label ? (
          <Label
            title={label.title}
            amount={label.amount}
            currencyCode={label.currencyCode}
            isAvailable={label.isAvailable}
            position={label.position}
          />
        ) : null}
      </div>
    </div>

  );
}
