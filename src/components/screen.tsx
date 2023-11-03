'use client';

import { useContext, useEffect, useState } from 'react';

import { IsSystemModeSelectContext } from '@/contexts/is-system-mode-select-provider';
import { ThemeContext } from '@/contexts/theme-provider';
import { bgVariants } from '@/utils/colorVariants';
import { updateBodyBackgroundColor } from '@/utils/updateBodyBackgroundColor';
import { updateMetaThemeColor } from '@/utils/updateMetaThemeColor';

export default function Screen({ children }: { children: React.ReactNode }) {
  const { isSystemModeSelect } = useContext(IsSystemModeSelectContext);
  const { baseColor, mainColor, mode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem('baseColor', baseColor);
    localStorage.setItem('mainColor', mainColor);
    localStorage.setItem('mode', mode);
    localStorage.setItem(
      'isSystemModeSelect',
      JSON.stringify(isSystemModeSelect),
    );
    updateBodyBackgroundColor(baseColor);
    updateMetaThemeColor(baseColor, mode);
  }, [baseColor, isLoading, isSystemModeSelect, mainColor, mode]);

  useEffect(() => {
    const HTML = document.querySelector('html');
    if (!HTML) return;
    switch (mode) {
      case 'light':
        HTML.style.colorScheme = 'light';
        HTML.classList.remove('dark-theme');
        HTML.classList.add('light-theme');
        break;
      case 'dark':
        HTML.style.colorScheme = 'dark';
        HTML.classList.remove('light-theme');
        HTML.classList.add('dark-theme');
        break;
    }
  }, [mode]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <div
        className={`min-h-[100svh] pt-[env(safe-area-inset-top)] pwa:min-h-screen ${bgVariants[baseColor]}`}
      >
        {children}
      </div>
    </>
  );
}
