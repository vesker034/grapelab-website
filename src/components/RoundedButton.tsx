"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode, useState, CSSProperties } from "react";

interface RoundedButtonProps extends LinkProps {
  children: ReactNode;
  variant?: "filled" | "outlined";
  className?: string;
}

const RoundedButton: React.FC<RoundedButtonProps> = ({
  children,
  variant = "filled",
  className = "",
  ...props
}) => {
  const baseClasses =
    "rounded-[30px] font-semibold text-base py-3 px-8 text-center transition-all duration-300 " +
    "flex items-center justify-center w-full";

  const [isHovered, setIsHovered] = useState(false);

  const defaultStyle: CSSProperties = {
    background:
      "linear-gradient(var(--color-site-background), var(--color-site-background)) padding-box, " +
      "linear-gradient(90deg, var(--color-navbar), var(--color-light-cards-text)) border-box",
    WebkitBackgroundClip: "padding-box, border-box",
    backgroundClip: "padding-box, border-box",
    border: "2px solid transparent",
    fontFamily: "Montserrat, sans-serif",
  };

  const hoverStyle: CSSProperties = {
    backgroundColor: "var(--color-light-cards-text)",
    border: "2px solid var(--color-light-cards-text)",
    fontFamily: "Montserrat, sans-serif",
  };

  if (variant === "outlined") {
    return (
      <Link
        {...props}
        className={`${baseClasses} text-[var(--color-buttons)] ${className}`}
        style={isHovered ? hoverStyle : defaultStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          className={`inline-block w-full text-center transition-colors duration-300 ${
            isHovered ? "text-white" : ""
          }`}
        >
          {children}
        </span>
      </Link>
    );
  }

  return (
    <Link
      {...props}
      className={`${baseClasses} bg-[var(--color-buttons)] text-white hover:bg-[var(--color-light-cards-text)] ${className}`}
    >
      <span className="w-full text-center">{children}</span>
    </Link>
  );
};

export default RoundedButton;
