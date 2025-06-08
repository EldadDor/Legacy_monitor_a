// /react-app/src/shared/WidgetFooter.tsx

import React, { ReactNode } from 'react';
import './WidgetFooterStyles.css';

interface WidgetFooterProps {
  children: ReactNode;
  className?: string;
}

const WidgetFooter: React.FC<WidgetFooterProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`widget-footer ${className}`}>
      {children}
    </div>
  );
};

export default WidgetFooter;