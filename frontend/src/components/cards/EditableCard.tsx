import React from "react";
import { OutlineButton } from "../buttons/outlineButton";

interface EditableCardProps {
  type: string;
  seats: number;
  description: string;
  onViewSeatMap?: () => void;
}

export const EditableCard: React.FC<EditableCardProps> = ({
  type,
  seats,
  description,
  onViewSeatMap,
}) => {
  return (
    <div className="flex justify-between items-center bg-white shadow-sm rounded-xl px-4 py-3 mb-3">
      <div>
        <h3 className="font-semibold text-gray-800">{type}</h3>
        <p className="text-sm text-gray-600">
          {seats} seats — {description}
        </p>
      </div>
      <OutlineButton onClick={onViewSeatMap}>See seat map</OutlineButton>
    </div>
  );
};
