import React from 'react';

type CellType = 'seat' | 'aisle' | 'exit' | 'galley';
type SeatLayout = CellType[][];

interface SeatSelectorProps {
  layoutData: string;
  typeName: string;
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
}

const cellClasses: Record<CellType, string> = {
  'seat': 'bg-blue-200 hover:bg-blue-300',
  'aisle': 'bg-gray-100 border-dashed border-gray-300',
  'exit': 'bg-yellow-400',
  'galley': 'bg-red-200',
};

const SeatSelector: React.FC<SeatSelectorProps> = ({ 
  layoutData, 
  typeName, 
  selectedSeats, 
  onSeatToggle 
}) => {
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

  const getSeatId = (rowIndex: number, colIndex: number): string => {
    return `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
  };

  const isSeatSelected = (seatId: string): boolean => {
    return selectedSeats.includes(seatId);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white">
      <h3 className="text-lg font-bold mb-4 text-center">{typeName} Seat Map</h3>

      <div className="overflow-auto max-h-[70vh]">
        <div 
          style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}
          className="inline-grid gap-1 border p-2 bg-gray-50 shadow-inner"
        >
          {layout.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cellType, colIndex) => {
                const seatId = getSeatId(rowIndex, colIndex);
                const isSelected = isSeatSelected(seatId);
                const isSeat = cellType === 'seat';

                return (
                  <div
                    key={colIndex}
                    onClick={() => isSeat && onSeatToggle(seatId)}
                    className={`w-10 h-10 flex items-center justify-center text-xs border 
                                ${cellClasses[cellType]} 
                                ${cellType === 'aisle' ? 'border-dashed' : 'rounded-sm'}
                                ${isSeat ? 'cursor-pointer select-none' : ''}
                                ${isSelected ? 'bg-green-500 text-white font-bold' : ''}`}
                    title={isSeat ? `${seatId} - Click to ${isSelected ? 'deselect' : 'select'}` : `${cellType}`}
                  >
                    {cellType === 'seat' && seatId}
                    {cellType === 'exit' && 'Exit'}
                    {cellType === 'galley' && 'Galley'}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Total seats: {layout.flat().filter(cell => cell === 'seat').length}</p>
        <p className="mt-2">
          <span className="inline-block w-4 h-4 bg-blue-200 border mr-1"></span> Available
          <span className="inline-block w-4 h-4 bg-green-500 border ml-4 mr-1"></span> Selected
        </p>
      </div>
    </div>
  );
};

export default SeatSelector;
