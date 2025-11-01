import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';

// --- Tipagem de Dados ---
type CellType = 'seat' | 'aisle' | 'exit' | 'galley';
type SeatLayout = CellType[][]; 

interface SeatMapEditorProps {
  initialLayout: string; 
  onLayoutChange: (layoutJson: string) => void;
  // NOVO: Função para notificar o componente pai sobre a contagem de assentos
  onSeatCountChange: (count: number) => void; 
  isEditing?: boolean;
}

const cellClasses: Record<CellType, string> = {
  'seat': 'bg-blue-200 hover:bg-blue-300',
  'aisle': 'bg-gray-100 hover:bg-gray-200 border-dashed border-gray-300',
  'exit': 'bg-yellow-400 hover:bg-yellow-500',
  'galley': 'bg-red-200 hover:bg-red-300',
};

const typeColors: Record<CellType, string> = {
    'seat': 'bg-blue-600',
    'aisle': 'bg-gray-500',
    'exit': 'bg-yellow-600',
    'galley': 'bg-red-600',
};

const SeatMapEditor: React.FC<SeatMapEditorProps> = ({ initialLayout, onLayoutChange, onSeatCountChange, isEditing = false }) => {
  const [layout, setLayout] = useState<SeatLayout>([]);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(6);
  const [activeTool, setActiveTool] = useState<CellType>('seat');

  // Função auxiliar para contar assentos
  const countSeats = (currentLayout: SeatLayout): number => {
    return currentLayout.flat().filter(cell => cell === 'seat').length;
  };

  // Efeito para sincronizar a contagem de assentos sempre que o layout muda localmente
  useEffect(() => {
    if (layout.length > 0) {
        const count = countSeats(layout);
        onSeatCountChange(count);
    }
  }, [layout, onSeatCountChange]);


  // Inicializa o layout com base nos props ou valores padrão
  useEffect(() => {
    if (initialLayout) {
      try {
        const parsedLayout: SeatLayout = JSON.parse(initialLayout);
        setLayout(parsedLayout);
        setRows(parsedLayout.length);
        setCols(parsedLayout[0]?.length || 0);
        return;
      } catch (e) {
        console.error("Erro ao carregar layout inicial:", e);
      }
    }
    handleInitializeLayout(10, 6); 
  }, [initialLayout]);

  // Função para criar/resetar o grid. 
  const handleInitializeLayout = useCallback((newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);
    
    // Cria o novo layout (ex: todos 'seat')
    const newLayout: SeatLayout = Array.from({ length: newRows }, () =>
      Array.from({ length: newCols }, () => 'seat' as CellType)
    );
    
    setLayout(newLayout);
    
    // Salva o novo layout no formulário pai (layoutData)
    onLayoutChange(JSON.stringify(newLayout)); 
    // A contagem de assentos será atualizada pelo useEffect acima
  }, [onLayoutChange]);

  // Função para lidar com o clique na célula (aplicar a ferramenta ativa)
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!isEditing) return;
    
    const newLayout = layout.map((row, rIdx) =>
      row.map((cell, cIdx) => {
        if (rIdx === rowIndex && cIdx === colIndex) {
          return activeTool; 
        }
        return cell;
      })
    );
    setLayout(newLayout);
    onLayoutChange(JSON.stringify(newLayout)); 
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-md font-semibold mb-3">Seat Map Editor</h3>

      {/* Ferramentas e Configurações de Dimensão */}
      <div className="flex justify-between items-end mb-4 p-3 bg-gray-50 rounded-md border">
        {/* Ferramentas de Desenho */}
        <div className="flex space-x-2">
            {(['seat', 'aisle', 'exit', 'galley'] as CellType[]).map(type => (
                <button
                    key={type}
                    onClick={() => setActiveTool(type)}
                    type="button" 
                    className={`py-1 px-3 text-sm font-medium rounded-full transition 
                    ${activeTool === type ? `${typeColors[type]} text-white shadow-md` : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
            ))}
        </div>

        {/* Controles de Dimensão (Permanece como input, mas o botão Redraw é necessário) */}
        <div className="flex space-x-3 items-center text-sm">
            <label>Rows: 
                <input 
                    type="number" 
                    value={rows} 
                    onChange={(e) => setRows(Number(e.target.value))} 
                    className="w-16 ml-1 p-1 border rounded"
                />
            </label>
            <label>Cols: 
                <input 
                    type="number" 
                    value={cols} 
                    onChange={(e) => setCols(Number(e.target.value))} 
                    className="w-16 ml-1 p-1 border rounded"
                />
            </label>
            <Button 
                onClick={() => handleInitializeLayout(rows, cols)}
                type="button" 
                variant="destructive"
                size="sm"
            >
                Redraw Grid
            </Button>
        </div>
      </div>


      {/* Grid do Mapa de Assentos */}
      <div className="overflow-auto max-h-96">
        <div 
          style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}
          className="inline-grid gap-1 border p-2 bg-white shadow-inner"
        >
          {layout.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cellType, colIndex) => (
                <div
                  key={colIndex}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`w-10 h-10 flex items-center justify-center text-xs border cursor-pointer select-none 
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
      
    </div>
  );
};

export default SeatMapEditor;