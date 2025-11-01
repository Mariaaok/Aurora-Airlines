import React from 'react';

// --- Tipagem de Dados (Reaproveitada) ---
type CellType = 'seat' | 'aisle' | 'exit' | 'galley';
type SeatLayout = CellType[][]; 

interface SeatMapViewerProps {
  layoutData: string; // O JSON string do layout
  typeName: string; // Nome da aeronave para título
}

// Mapeamento de tipos para classes Tailwind (Apenas cores estáticas, sem hover)
const cellClasses: Record<CellType, string> = {
  'seat': 'bg-blue-200',
  'aisle': 'bg-gray-100 border-dashed border-gray-300',
  'exit': 'bg-yellow-400',
  'galley': 'bg-red-200',
};

const SeatMapViewer: React.FC<SeatMapViewerProps> = ({ layoutData, typeName }) => {
  let layout: SeatLayout = [];
  let rows = 0;
  let cols = 0;

  try {
    layout = JSON.parse(layoutData);
    rows = layout.length;
    cols = layout[0]?.length || 0;
  } catch (e) {
    return <p className="text-red-500">Error loading seat map data.</p>;
  }

  if (rows === 0 || cols === 0) {
    return <p className="text-gray-500">No seat map defined for this aircraft type.</p>;
  }

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white">
      <h3 className="text-lg font-bold mb-4 text-center">{typeName} Seat Map</h3>

      <div className="overflow-auto max-h-[80vh]">
        <div 
          style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}
          className="inline-grid gap-1 border p-2 bg-gray-50 shadow-inner"
        >
          {layout.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cellType, colIndex) => (
                <div
                  key={colIndex}
                  // Removido cursor-pointer e select-none, pois é apenas visualização
                  className={`w-10 h-10 flex items-center justify-center text-xs border 
                              ${cellClasses[cellType]} 
                              ${cellType === 'aisle' ? 'border-dashed' : 'rounded-sm'}`}
                  title={`Row ${rowIndex + 1}, Col ${colIndex + 1}: ${cellType}`}
                >
                  {cellType === 'seat' && `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`}
                  {cellType === 'exit' && 'Exit'}
                  {cellType === 'galley' && 'Galley'}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-600 text-center">Total seats: {layout.flat().filter(cell => cell === 'seat').length}</p>
    </div>
  );
};

export default SeatMapViewer;