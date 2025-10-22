import React, { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <section className="bg-white shadow-sm rounded-2xl p-5 mb-5">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      {children}
    </section>
  );
};
