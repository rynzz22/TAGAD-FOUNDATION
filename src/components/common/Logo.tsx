import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${iconSizes[size]} rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0 tracking-wider`}>
        TG
      </div>
      <div className="flex flex-col">
        <span className={`${titleSizes[size]} text-slate-900 dark:text-white tracking-tight leading-none`}>
          TAGAD
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 whitespace-nowrap">
            Talibon GAD Analytics
          </span>
        )}
      </div>
    </div>
  );
};
