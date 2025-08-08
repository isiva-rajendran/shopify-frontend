import clsx from 'clsx';
import Image from 'next/image';

export default function LogoIcon(props: React.ComponentProps<'svg'>) {
  return (
   <Image src="/pandalogo.png" alt="Panda Logo" width={32} height={32}></Image>
  );
}
