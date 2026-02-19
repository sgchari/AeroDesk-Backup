import React from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-2 mb-10">
      <div>
        <h2 className="text-4xl font-bold tracking-tight font-headline">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      <div className="flex items-center space-x-2">{children}</div>
    </div>
  );
}
