import React from "react";

interface OutlineButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-1.5 px-3 rounded-lg transition"
    >
      {children}
    </button>
  );
};
