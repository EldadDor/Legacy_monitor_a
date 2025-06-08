// /react-app/src/shared/WidgetBody.tsx

import React, { ReactNode } from 'react';
import './WidgetBodyStyles.css';

interface WidgetBodyProps {
  children: ReactNode;
  className?: string;
  loading?: boolean;
}

const WidgetBody: React.FC<WidgetBodyProps> = ({ 
  children, 
  className = '',
  loading = false
}) => {
  return (
    <div className={`widget-body ${className} ${loading ? 'loading' : ''}`}>
      {loading && <div className="widget-loading-indicator">Loading...</div>}
      <div className={loading ? 'widget-content-loading' : 'widget-content'}>
        {children}
      </div>
    </div>
  );
};

export default WidgetBody;