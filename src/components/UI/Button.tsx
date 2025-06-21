"use client";

import React, { ButtonHTMLAttributes, useState } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loader?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Button({ loader = false, children, className = "", ...props }: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick && loader) {
      setIsLoading(true);
      try {
        await Promise.resolve(props.onClick(e));
      } finally {
        setIsLoading(false);
      }
    } else if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      {...props}
      className={`btn ${className}`}
      onClick={handleClick}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
