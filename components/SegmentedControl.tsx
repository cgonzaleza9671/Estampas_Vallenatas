import React from 'react';
import { motion } from 'motion/react';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  layoutId = 'segmented-indicator',
  size = 'md',
  className = '',
}: SegmentedControlProps<T>) {
  const sizeClasses = {
    sm: {
      container: 'p-1 rounded-xl',
      button: 'px-3 py-1.5 text-xs',
      icon: 'text-xs',
    },
    md: {
      container: 'p-1.5 rounded-2xl',
      button: 'px-5 py-2.5 text-xs md:text-sm',
      icon: 'text-sm',
    },
    lg: {
      container: 'p-2 rounded-2xl',
      button: 'px-7 py-3 text-sm md:text-base',
      icon: 'text-base',
    },
  }[size];

  return (
    <div
      role="tablist"
      className={`inline-flex items-center bg-stone-900/5 backdrop-blur-md border border-stone-900/10 shadow-inner ${sizeClasses.container} relative select-none ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            className={`relative flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-colors duration-200 z-10 ${sizeClasses.button} ${
              isSelected
                ? 'text-white'
                : 'text-vallenato-blue/60 hover:text-vallenato-blue'
            }`}
          >
            {/* Pastilla deslizante elástica con motion layoutId */}
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 32,
                }}
                className="absolute inset-0 bg-vallenato-blue rounded-xl shadow-lg border border-white/10 -z-10"
              />
            )}

            {option.icon && (
              <span className={`shrink-0 transition-transform duration-200 ${isSelected ? 'scale-110 text-vallenato-mustard' : ''}`}>
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>
            {option.badge !== undefined && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  isSelected
                    ? 'bg-vallenato-mustard text-vallenato-blue'
                    : 'bg-black/5 text-gray-500'
                }`}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
