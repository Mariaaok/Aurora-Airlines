import React from "react";
import { OutlineButton } from "../buttons/outlineButton";

interface TableRowProps {
  type: string;
  seats: number;
  description: string;
  onSeatMapClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  type,
  seats,
  description,
  onSeatMapClick,
}) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-4 py-2 font-medium text-gray-800">{type}</td>
      <td className="px-4 py-2">{seats}</td>
      <td className="px-4 py-2">{description}</td>
      <td className="px-4 py-2 text-right">
        <OutlineButton onClick={onSeatMapClick}>See seat map</OutlineButton>
      </td>
    </tr>
  );
};
