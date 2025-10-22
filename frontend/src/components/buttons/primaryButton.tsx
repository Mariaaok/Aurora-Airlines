import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition"
    >
      {children}
    </button>
  );
};
