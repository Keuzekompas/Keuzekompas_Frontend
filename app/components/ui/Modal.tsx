import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-(--bg-card) rounded-xl shadow-lg w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-(--border-divider)">
            {title && <h3 className="text-lg font-semibold text-(--text-primary)">{title}</h3>}
            <button 
                onClick={onClose} 
                className="text-(--text-secondary) hover:text-(--text-primary) text-xl font-bold px-2"
            >
                &times;
            </button>
        </div>
        <div className="p-6 text-(--text-primary)">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
