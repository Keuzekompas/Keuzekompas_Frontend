import React, { useEffect, useId, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // focus naar close button (minimale a11y)
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop = native button, dus geen Sonar warning */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="relative bg-(--bg-card) rounded-xl shadow-lg w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-(--border-divider)">
          {title && (
            <h3 id={titleId} className="text-lg font-semibold text-(--text-primary)">
              {title}
            </h3>
          )}

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="text-(--text-secondary) hover:text-(--text-primary) text-xl font-bold px-2"
          >
            &times;
          </button>
        </div>

        <div className="p-6 text-(--text-primary)">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
