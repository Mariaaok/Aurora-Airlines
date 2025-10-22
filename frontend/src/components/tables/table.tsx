import React, { ReactNode } from "react";

interface TableProps {
  headers: string[];
  children: ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((header, idx) => (
            <th
              key={idx}
              className="text-left px-4 py-2 text-sm font-semibold text-gray-700"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};
