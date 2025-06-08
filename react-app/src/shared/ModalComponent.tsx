// /react-app/src/shared/Modal.tsx

import React, { useEffect, useRef } from 'react';
import './ModalStyles.css';

export interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFooter?: boolean;
  primaryButton?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
}

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  size = 'md',
  showFooter = false,
  primaryButton,
  secondaryButton
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Handle click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop">
      <div className={`modal-container modal-${size}`} ref={modalRef}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button 
            className="modal-close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        {showFooter && (
          <div className="modal-footer">
            {secondaryButton && (
              <button
                className="btn btn-secondary"
                onClick={secondaryButton.onClick}
                disabled={secondaryButton.disabled}
              >
                {secondaryButton.label}
              </button>
            )}
            {primaryButton && (
              <button
                className="btn btn-primary"
                onClick={primaryButton.onClick}
                disabled={primaryButton.disabled}
              >
                {primaryButton.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};