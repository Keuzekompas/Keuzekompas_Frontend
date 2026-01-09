"use client";

import React, { useEffect, useId, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
      setTimeout(() => closeBtnRef.current?.focus(), 0);
      return;
    }

    if (dialog.open) dialog.close();
  }, [isOpen]);

  
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      onClose();
    };

    dialog.addEventListener("close", handleNativeClose);
    return () => dialog.removeEventListener("close", handleNativeClose);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? titleId : undefined}
      className="p-0 border-0 bg-transparent"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close modal"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <div className="relative bg-(--bg-card) rounded-xl shadow-lg w-full max-w-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-(--border-divider)">
            {title && (
              <h3
                id={titleId}
                className="text-lg font-semibold text-(--text-primary)"
              >
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
    </dialog>
  );
};

export default Modal;
