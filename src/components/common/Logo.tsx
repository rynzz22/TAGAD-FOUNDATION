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
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/talibon-seal.png"
        alt="Municipality of Talibon Official Seal"
        className={`${iconSizes[size]} object-contain shrink-0`}
      />
      <div className="flex flex-col">
        <span className={`${titleSizes[size]} text-slate-900 dark:text-white tracking-tight leading-none`}>
          TAGAD
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 whitespace-nowrap">
            Municipality of Talibon
          </span>
        )}
      </div>
    </div>
  );
};
