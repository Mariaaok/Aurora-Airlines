import React, { ReactNode } from "react";

interface FormRowProps {
  label: string;
  children: ReactNode;
}

export const FormRow: React.FC<FormRowProps> = ({ label, children }) => {
  return (
    // Usa classes Tailwind para layout vertical e espaçamento
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
};