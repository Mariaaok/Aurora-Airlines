import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddEmployeeModal from '../components/addModal';
import UpdateEmployeeModal from '../components/updateModal';
import { API_BASE_URL, Employee } from '../constants';
import Navbar from "../components/layouts/navbar"; 
import PageContainer from "../components/layouts/pageContainer"; 
import SectionHeader from "../components/layouts/sectionHeader"; 
import { AdminTabs } from "../components/layouts/adminTabs"; 

const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [employeeToUpdate, setEmployeeToUpdate] = useState<Employee | null>(null);

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
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

    const handleEdit = (employee: Employee) => {
        setEmployeeToUpdate(employee);
        setIsUpdateModalOpen(true);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Tem certeza que deseja deletar o funcionário ${name}?`)) {
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            alert(`Funcionário ${name} deletado com sucesso!`);
            fetchEmployees(); 
        } catch (error) {
            console.error('Erro ao deletar funcionário:', error);
            alert('Erro ao deletar funcionário. Verifique o console.');
        }
    };

    if (isLoading) {
        return (
             <div className="min-h-screen bg-gray-50">
                 <Navbar />
                 <div style={loadingStyles}>Carregando funcionários...</div>
             </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AdminTabs /> 
            <PageContainer>
                
                <SectionHeader 
                    title="Employees" 
                    buttonText="Add new employee" 
                    onButtonClick={() => setIsAddModalOpen(true)} 
                />

                <div style={listContainerStyles}>
                    {employees.length === 0 ? (
                        <p>Nenhum funcionário cadastrado.</p>
                    ) : (
                        employees.map(employee => (
                            <div key={employee.id} style={cardStyles.card}>
                                <div style={cardStyles.dataGroup}>
                                    <p style={cardStyles.dataLabel}>Name:</p>
                                    <p style={cardStyles.dataValue}>{employee.name}</p>
                                </div>
                                <div style={cardStyles.dataGroup}>
                                    <p style={cardStyles.dataLabel}>Birthday:</p>
                                    <p style={cardStyles.dataValue}>{employee.birthday}</p>
                                </div>
                                <div style={cardStyles.dataGroup}>
                                    <p style={cardStyles.dataLabel}>E-mail:</p>
                                    <p style={cardStyles.dataValue}>{employee.email}</p>
                                </div>
                                <div style={cardStyles.dataGroup}>
                                    <p style={cardStyles.dataLabel}>Phone:</p>
                                    <p style={cardStyles.dataValue}>{employee.phoneNumber}</p>
                                </div>
                                <div style={cardStyles.dataGroup}>
                                    <p style={cardStyles.dataLabel}>Category:</p>
                                    <p style={cardStyles.dataValue}>{employee.category}</p>
                                </div>

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
            </PageContainer>
        </div>
    );
};

export default EmployeesPage;

const listContainerStyles: React.CSSProperties = {
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '20px',
};

const loadingStyles: React.CSSProperties = {
    textAlign: 'center', paddingTop: '50px', fontSize: '18px',
    color: '#555',
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