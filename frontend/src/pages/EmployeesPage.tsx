import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEmployeeModal from '../components/addModal';
import UpdateEmployeeModal from '../components/updateModal';
import { API_BASE_URL, Employee } from '../constants';

const EmployeesPage: React.FC = () => {
    // Tipagem do estado de lista e do funcionário selecionado
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [employeeToUpdate, setEmployeeToUpdate] = useState<Employee | null>(null);

    // Função para buscar a lista de funcionários
    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            // Define o tipo de dado esperado na resposta do GET
            const response = await axios.get<Employee[]>(API_BASE_URL); 
            setEmployees(response.data);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            alert('Erro ao carregar a lista de funcionários.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Lida com a abertura do modal de edição
    const handleEdit = (employee: Employee) => {
        setEmployeeToUpdate(employee);
        setIsUpdateModalOpen(true);
    };

    // Lida com a exclusão do funcionário (DELETE /employees/:id)
    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Tem certeza que deseja deletar o funcionário ${name}?`)) {
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            alert(`Funcionário ${name} deletado com sucesso!`);
            fetchEmployees(); // Recarrega a lista
        } catch (error) {
            console.error('Erro ao deletar funcionário:', error);
            alert('Erro ao deletar funcionário. Verifique o console.');
        }
    };

    if (isLoading) {
        return <div style={pageStyles.loading}>Carregando funcionários...</div>;
    }

    return (
        <div style={pageStyles.container}>
            
            {/* Cabeçalho da Página e Botão Adicionar */}
            <div style={pageStyles.header}>
                <h1 style={pageStyles.title}>Employees</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    style={pageStyles.addButton}
                >
                    Add new employee
                </button>
            </div>

            {/* Listagem de Funcionários */}
            <div style={pageStyles.listContainer}>
                {employees.length === 0 ? (
                    <p>Nenhum funcionário cadastrado.</p>
                ) : (
                    employees.map(employee => (
                        // A tipagem garante que 'employee' tem a estrutura de 'Employee'
                        <div key={employee.id} style={cardStyles.card}>
                            <div style={cardStyles.dataGroup}>
                                <p style={cardStyles.dataLabel}>**Name:**</p>
                                <p style={cardStyles.dataValue}>{employee.name}</p>
                            </div>
                            <div style={cardStyles.dataGroup}>
                                <p style={cardStyles.dataLabel}>**Birthday:**</p>
                                <p style={cardStyles.dataValue}>{employee.birthday}</p>
                            </div>
                            <div style={cardStyles.dataGroup}>
                                <p style={cardStyles.dataLabel}>**E-mail:**</p>
                                <p style={cardStyles.dataValue}>{employee.email}</p>
                            </div>
                            <div style={cardStyles.dataGroup}>
                                <p style={cardStyles.dataLabel}>**Phone:**</p>
                                <p style={cardStyles.dataValue}>{employee.phoneNumber}</p>
                            </div>
                            <div style={cardStyles.dataGroup}>
                                <p style={cardStyles.dataLabel}>**Category:**</p>
                                <p style={cardStyles.dataValue}>{employee.category}</p>
                            </div>

                            {/* Ícones de Ação */}
                            <div style={cardStyles.actions}>
                                <span 
                                    onClick={() => handleEdit(employee)} 
                                    style={cardStyles.icon}
                                    title="Editar"
                                >
                                    ✏️ 
                                </span>
                                <span 
                                    onClick={() => handleDelete(employee.id, employee.name)} 
                                    style={{...cardStyles.icon, color: 'red'}}
                                    title="Deletar"
                                >
                                    🗑️ 
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modais */}
            <AddEmployeeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onEmployeeAdded={fetchEmployees}
            />
            <UpdateEmployeeModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                employeeToUpdate={employeeToUpdate}
                onEmployeeUpdated={fetchEmployees}
            />
        </div>
    );
};

export default EmployeesPage;
interface CustomStyles {
    container: React.CSSProperties;
    header: React.CSSProperties;
    title: React.CSSProperties;
    addButton: React.CSSProperties;
    listContainer: React.CSSProperties;
    loading: React.CSSProperties;
}
// Estilos básicos para a página e cards
const pageStyles: CustomStyles = {
    container: { // TS agora sabe que esta chave deve ser um objeto React.CSSProperties
        padding: '20px', 
        maxWidth: '1000px', 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '2px solid #eee',
        paddingBottom: '15px', marginBottom: '20px',
    },
    title: {
        color: '#003366', fontSize: '28px', margin: 0,
    },
    addButton: {
        backgroundColor: '#003366', color: 'white', padding: '10px 15px',
        border: 'none', borderRadius: '5px', cursor: 'pointer',
        fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    listContainer: {
        display: 'flex', flexWrap: 'wrap', gap: '20px',
    },
    loading: {
        textAlign: 'center', paddingTop: '50px', fontSize: '18px',
        color: '#555',
    }
};

const cardStyles: React.CSSProperties & {
    card: React.CSSProperties;
    dataGroup: React.CSSProperties;
    dataLabel: React.CSSProperties;
    dataValue: React.CSSProperties;
    actions: React.CSSProperties;
    icon: React.CSSProperties;
} = {
    card: {
        backgroundColor: '#fff', border: '1px solid #ddd',
        borderRadius: '8px', padding: '20px', width: '300px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)', position: 'relative',
    },
    dataGroup: {
        display: 'flex', marginBottom: '5px',
    },
    dataLabel: {
        fontWeight: 'bold', color: '#333', marginRight: '5px',
    },
    dataValue: {
        color: '#555', margin: 0,
    },
    actions: {
        position: 'absolute', bottom: '10px', right: '10px',
        display: 'flex', gap: '10px',
    },
    icon: {
        cursor: 'pointer', fontSize: '18px',
        transition: 'transform 0.1s',
        padding: '5px',
    }
};