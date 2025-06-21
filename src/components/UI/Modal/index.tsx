"use client";

import React from "react";

interface ModalProps {
  innerRef: React.RefObject<HTMLDivElement>;
  onBackgroundClick: () => void;
  children: React.ReactNode;
  className?: {
    modalContainer?: string;
    modal?: string;
  }
}

function Modal({
  innerRef,
  onBackgroundClick,
  children,
  className
}: ModalProps) {
  return (
    <React.Fragment>
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50" />      <div 
        className={`fixed modal-container top-0 left-0 w-full h-full flex justify-center items-center z-50 ${className?.modalContainer || ''}`}
        onClick={onBackgroundClick}
        role="dialog"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onBackgroundClick();
        }}
      >
        <div
          className={`bg-white rounded-md shadow-lg overflow-auto ${className?.modal || ''}`}
          ref={innerRef}
          onClick={(e) => e.stopPropagation()}
          role="none"
          tabIndex={-1}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Modal;
