// /react-app/src/shared/Widget.tsx

import React, { ReactNode } from 'react';
import './WidgetStyles.css';

interface WidgetProps {
  children: ReactNode;
  className?: string;
}

const Widget: React.FC<WidgetProps> = ({ children, className = '' }) => {
  return (
    <div className={`widget ${className}`}>
      {children}
    </div>
  );
};

export default Widget;