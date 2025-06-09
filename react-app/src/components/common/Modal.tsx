// /react-app/src/components/common/Modal.tsx

import React, { useEffect, useRef } from 'react';
import './Modal.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button className={`custom-button ${props.className || ''}`} {...props}>
      {children}
    </button>
  );
};

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle escape key to close modal
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Handle clicking outside modal to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};