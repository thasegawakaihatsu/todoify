'use client';

import { ThemeContext } from '@/contexts/theme-provider';
import { bgVariants } from '@/utils/colorVariants';
import { useContext } from 'react';

export default function Screen({ children }: { children: React.ReactNode }) {
  const theme = useContext(ThemeContext);
  const { baseColor } = theme;

  return (
    <>
      <div
        className={`min-h-[100svh] overscroll-none pt-[env(safe-area-inset-top)] pwa:min-h-screen ${bgVariants[baseColor]}`}
      >
        {children}
      </div>
    </>
  );
}
