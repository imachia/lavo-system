"use client";

import React from "react";

type ButtonVariant = "primary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  fullWidth,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-[--color-accent]/30 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm gap-2",
    md: "px-5 py-2.5 text-sm gap-2",
  };

  const variants: Record<ButtonVariant, string> = {
    primary: "text-white bg-blue-500 hover:bg-blue-400 focus:ring-blue-300 shadow",
    ghost: "text-blue-500 bg-white hover:bg-blue-50 shadow-sm border border-blue-100",
    danger: "text-white bg-red-600 hover:bg-red-500 focus:ring-red-300 shadow",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${width} ${className}`} {...props}>
      {leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
      {children}
    </button>
  );
}



