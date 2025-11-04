import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/layouts/navbar';
import PageContainer from '../components/layouts/pageContainer';
import { AdminTabs } from '../components/layouts/adminTabs';
import { API_BASE_URL as FLIGHT_TYPES_API, FlightType } from '../flight-types.constants';

// Interface para o estado do formulário
interface ReportFormData {
  category: string;
  filterByType: string;
  filterByValue: string;
  startDate: string;
  endDate: string;
}

interface ReportData {
  category: string;
  period: string;
  filterDescription: string;
  totalSales?: string;
  ticketsSold?: number;
  occupationRate?: string;
  // ... ou poderia ser uma lista:
  // items: any[];
}

// Opções do formulário
const categoryOptions = [
  { value: 'sales', label: 'Sum of sales' },
  { value: 'tickets', label: 'Tickets sold' },
  { value: 'occupation', label: 'Seats occupation' },
];

const filterOptions = [
  { value: 'all', label: 'All flights' },
  { value: 'type', label: 'Type of flight' },
  { value: 'number', label: 'Flight number' },
];

/**
 * Componente para a página de Relatórios do Admin.
 */
const AdminReportsPage: React.FC = () => {
  const [formData, setFormData] = useState<ReportFormData>({
    category: '',
    filterByType: 'all',
    filterByValue: '',
    startDate: '',
    endDate: '',
  });

  // Estado para carregar os tipos de voo (para o filtro)
  const [allFlightTypes, setAllFlightTypes] = useState<FlightType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  // Busca os tipos de voo (necessário para o "Filter By")
  useEffect(() => {
    const fetchFlightTypes = async () => {
      setIsLoadingTypes(true);
      try {
        const response = await axios.get<FlightType[]>(FLIGHT_TYPES_API);
        setAllFlightTypes(response.data);
      } catch (error) {
        console.error('Failed to fetch flight types', error);
      } finally {
        setIsLoadingTypes(false);
      }
    };
    fetchFlightTypes();
  }, []);

  // Handler genérico para mudanças nos inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      
      // Se o usuário mudou o *tipo* de filtro, reseta o *valor* do filtro
      if (name === 'filterByType') {
        newState.filterByValue = '';
      }
      return newState;
    });
  };

  // Handler para limpar o formulário
  const handleClearFields = () => {
    setFormData({
      category: '',
      filterByType: 'all',
      filterByValue: '',
      startDate: '',
      endDate: '',
    });
  };

  // Handler para submeter o formulário
  const handleSubmit = (e: React.FormEvent) => {
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Ativa o loading e limpa resultados antigos
    setIsReportLoading(true);
    setReportData(null);
    setReportError('');

    // 2. Constrói o payload da requisição
    const reportRequest = {
      category: formData.category,
      startDate: formData.startDate,
      endDate: formData.endDate,
      filter: formData.filterByType !== 'all' ? {
        type: formData.filterByType,
        value: formData.filterByValue,
      } : undefined,
    };
    
    console.log('Gerando relatório com os dados:', reportRequest);

    try {
      // --- CHAMADA DE API (Substitua pela sua API real) ---
      // const response = await axios.post<ReportData>('http://localhost:5000/api/reports', reportRequest);
      
      // SIMULAÇÃO DE CHAMADA DE API (Remova isso quando tiver a API real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fakeResponseData: ReportData = {
        category: categoryOptions.find(c => c.value === formData.category)?.label || formData.category,
        period: `${formData.startDate} to ${formData.endDate}`,
        filterDescription: filterOptions.find(f => f.value === formData.filterByType)?.label || 'Custom Filter',
        totalSales: "$1,234,567.89",
        ticketsSold: 1234,
        occupationRate: "82.5%",
      };
      // --- Fim da Simulação ---

      // 3. Salva os dados no estado
      setReportData(fakeResponseData); // Use 'response.data' com a API real
    
    } catch (error) {
      // 4. Salva o erro
      console.error('Falha ao gerar relatório:', error);
      if (axios.isAxiosError(error) && error.response) {
        setReportError(error.response.data.message || 'Um erro desconhecido ocorreu.');
      } else {
        setReportError('Não foi possível conectar ao servidor de relatórios.');
      }
    } finally {
      // 5. Para o loading
      setIsReportLoading(false);
    }
  };
  };

  /**
   * Renderiza o campo de filtro condicional (o "combo box").
   * Este é o input que muda baseado no dropdown "Filter By".
   */
  const renderConditionalFilter = () => {
    const { filterByType, filterByValue } = formData;

    // Se for "Flight number", mostra um input de texto
    if (filterByType === 'number') {
      return (
        <div style={styles.formField}>
          <label style={styles.label} htmlFor="filterByValue">Flight Number</label>
          <input
            type="text"
            id="filterByValue"
            name="filterByValue"
            value={filterByValue}
            onChange={handleChange}
            placeholder="e.g., AA1077"
            style={styles.input}
            required
          />
        </div>
      );
    }
    
    // Se for "Type of flight", mostra um dropdown de tipos
    if (filterByType === 'type') {
      return (
        <div style={styles.formField}>
          <label style={styles.label} htmlFor="filterByValue">Flight Type</label>
          <select
            id="filterByValue"
            name="filterByValue"
            value={filterByValue}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={isLoadingTypes}
          >
            <option value="" disabled>Select a flight type...</option>
            {allFlightTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      );
    }

    // Se for "All flights" ou o padrão, não renderiza nada
    // Retorna um div vazio para manter o alinhamento do grid
    return <div></div>; 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AdminTabs /> {/* Mantém as abas de navegação do admin */}
      <PageContainer>
        {/* Usando um <h2> simples para o título, como na imagem */}
        <h2 style={styles.title}>Reports</h2>

        <form onSubmit={handleSubmit} style={styles.formContainer}>
          {/* Linha 1: Category e Filter By */}
          <div style={styles.formRow}>
            <div style={styles.formField}>
              <label style={styles.label} htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="" disabled>Select category...</option>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.formField}>
              <label style={styles.label} htmlFor="filterByType">Filter By</label>
              <select
                id="filterByType"
                name="filterByType"
                value={formData.filterByType}
                onChange={handleChange}
                style={styles.input}
              >
                {filterOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Linha 2: Filtro Condicional (O "Combo Box") */}
          <div style={styles.formRow}>
            {renderConditionalFilter()}
            {/* Espaço reservado para manter o grid 2x2 */}
            {formData.filterByType !== 'all' && <div></div>}
          </div>

          {/* Linha 3: Date Pickers */}
          <div style={styles.formRow}>
            <div style={styles.formField}>
              <label style={styles.label} htmlFor="startDate">Period starting date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formField}>
              <label style={styles.label} htmlFor="endDate">Period ending date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Linha 4: Botões */}
          <div style={styles.buttonContainer}>
            <button type="button" onClick={handleClearFields} style={styles.clearButton}>
              Clear fields
            </button>
            <button type="submit" style={styles.generateButton}>
              Generate report
            </button>
          </div>
        </form>

        <div 
          style={{
            ...styles.resultsContainer,
            // Esconde o container se não houver nada para mostrar
            display: isReportLoading || reportError || reportData ? 'block' : 'none'
          }}
        >
          {isReportLoading && (
            <p style={styles.loadingText}>Generating report, please wait...</p>
          )}
          
          {reportError && (
            <p style={styles.errorText}>{reportError}</p>
          )}

          {reportData && (
            <div>
              <h3 style={styles.resultsTitle}>Report Results</h3>
              {/* Usei <pre> para exibir os dados brutos. 
                Substitua isso por seus <DataCard> ou tabelas
                quando souber a estrutura final dos dados.
              */}
              <pre style={styles.preformatted}>
                {JSON.stringify(reportData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

// Estilos para o formulário, baseados na imagem
const styles: { [key: string]: React.CSSProperties } = {
  title: {
    fontSize: '1.875rem', // 30px
    fontWeight: '600',
    color: '#374151', // text-gray-700
    marginBottom: '1.5rem', // mb-6
  },
  formContainer: {
    maxWidth: '700px',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb', // border-gray-200
    margin: 'auto',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem', // gap-6
    marginBottom: '1.5rem', // mb-6
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem', // mb-2
    fontSize: '0.875rem', // 14px
    fontWeight: '500',
    color: '#374151', // text-gray-700
  },
  input: {
    padding: '0.625rem 0.75rem', // 10px 12px
    border: '1px solid #D1D5DB', // border-gray-300
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: 'white',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1.5rem',
  },
  clearButton: {
    color: '#00254A',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    textDecoration: 'underline',
  },
  generateButton: {
    backgroundColor: '#00254A', // Cor do botão da imagem
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.625rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
  },

  resultsContainer: {
    maxWidth: '700px',
    margin: '2rem auto 0 auto', // Margem no topo, centralizado
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#555',
    fontWeight: 500,
  },
  errorText: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#d9534f', // Vermelho
    fontWeight: 500,
  },
  resultsTitle: {
    fontSize: '1.25rem', // 20px
    fontWeight: '600',
    color: '#00254A',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  },
  preformatted: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #eee',
    padding: '1rem',
    borderRadius: '6px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap', // Garante a quebra de linha
    wordBreak: 'break-all',
  },
};

export default AdminReportsPage;