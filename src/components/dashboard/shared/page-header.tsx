import React from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-headline text-white">
          {title}
        </h2>
        <p className="text-white/80 text-sm sm:text-base">
          {description}
        </p>
      </div>
      {children && <div className="flex items-center space-x-2 self-end md:self-center">{children}</div>}
    </div>
  );
}
