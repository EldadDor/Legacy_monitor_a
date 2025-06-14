// /react-app/src/shared/WidgetHeader.tsx

import React, { ReactNode } from 'react';
import './WidgetHeaderStyles.css';

export interface WidgetHeaderProps {
  title: string;
  onClose?: () => void;
  actions?: React.ReactNode;
  className?: string;
}


const WidgetHeader: React.FC<WidgetHeaderProps> = ({
                                                     title,
                                                     onClose,
                                                     actions,
                                                     className = ''
                                                   }) => {
  return (
      <div className={`widget-header ${className}`}>
        <h3 className="widget-title">{title}</h3>
        <div className="widget-header-actions">
          {actions}
          {onClose && (
              <button
                  className="close-widget-btn"
                  onClick={onClose}
                  aria-label="Close widget"
              >
                <span aria-hidden="true">&times;</span>
              </button>
          )}
        </div>
      </div>
  );
};

export default WidgetHeader;
