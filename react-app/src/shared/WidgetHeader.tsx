// /react-app/src/shared/WidgetHeader.tsx

import React, { ReactNode } from 'react';
import './WidgetHeaderStyles.css';

interface WidgetHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({ 
  title, 
  subtitle, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`widget-header ${className}`}>
      <div className="widget-header-title">
        <h3>{title}</h3>
        {subtitle && <span className="widget-header-subtitle">{subtitle}</span>}
      </div>
      {children && <div className="widget-header-actions">{children}</div>}
    </div>
  );
};

export default WidgetHeader;