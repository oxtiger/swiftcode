import React from 'react';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/stores/theme';
import { cn } from '@/utils';
import type { Theme } from '@/types';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = false,
}) => {
  const { theme, setTheme } = useThemeStore();

  const themes: Array<{ value: Theme; icon: React.ReactNode; label: string }> =
    [
      { value: 'light', icon: <IconSun className="h-4 w-4" />, label: '浅色' },
      { value: 'dark', icon: <IconMoon className="h-4 w-4" />, label: '深色' },
      {
        value: 'system',
        icon: <IconDeviceDesktop className="h-4 w-4" />,
        label: '系统',
      },
    ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div className={cn('relative', className)}>
      <motion.button
        className={cn(
          'flex items-center space-x-2 rounded-md px-3 py-2',
          'bg-gray-100 dark:bg-gray-800',
          'text-gray-700 dark:text-gray-300',
          'hover:bg-gray-200 dark:hover:bg-gray-700',
          'transition-colors duration-200',
          'focus:ring-primary-500 focus:ring-2 focus:outline-none'
        )}
        onClick={() => {
          const currentIndex = themes.findIndex((t) => t.value === theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          setTheme(themes[nextIndex].value);
        }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            {currentTheme.icon}
          </motion.span>
        </AnimatePresence>
        {showLabel && (
          <span className="text-sm font-medium">{currentTheme.label}</span>
        )}
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
