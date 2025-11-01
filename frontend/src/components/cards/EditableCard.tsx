import React from "react";
import { OutlineButton } from "../buttons/outlineButton";
import DangerButton from "../buttons/dangerButton"; // NOVO: Importar DangerButton

interface EditableCardProps {
  type: string;
  seats: number;
  description: string;
  onViewSeatMap?: () => void;
  // NOVOS: Funções para edição e exclusão
  onEdit: () => void;
  onDelete: () => void;
}

export const EditableCard: React.FC<EditableCardProps> = ({
  type,
  seats,
  description,
  onViewSeatMap,
  onEdit, // NOVO
  onDelete, // NOVO
}) => {
  return (
    <div className="flex justify-between items-center bg-white shadow-sm rounded-xl px-4 py-3 mb-3">
      {/* Dados do Tipo de Aeronave */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex space-x-6 text-sm text-gray-700">
            <p className="w-40 font-semibold text-gray-800">{type}</p>
            <p className="w-16">{seats} seats</p>
            <p className="flex-1">{description}</p>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex space-x-3 items-center">
        {onViewSeatMap && <OutlineButton onClick={onViewSeatMap}>See seat map</OutlineButton>}
        
        {/* NOVO: Botão de Edição (✏️) */}
        <button 
            onClick={onEdit} 
            className="text-blue-600 hover:text-blue-800 p-1 rounded transition" 
            title="Edit Type"
        >
            ✏️
        </button>
        
        {/* NOVO: Botão de Exclusão (🗑️) */}
        <DangerButton onClick={onDelete}>🗑️</DangerButton>
      </div>
    </div>
  );
};
