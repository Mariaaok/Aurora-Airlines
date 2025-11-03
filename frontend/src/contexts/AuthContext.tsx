import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const AUTH_STATUS_URL = 'http://localhost:5000/auth/status';

interface User {
    id: number;
    name: string;
    email: string;
    type: 'admin' | 'user'; 
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void; 
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = !!user; 

    const login = (userData: User) => { 
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    /*return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );*/
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(AUTH_STATUS_URL, {
                    method: 'GET',
                    credentials: 'include', // Envia o cookie de sessão
                });

                if (response.ok) {
                    const userData = await response.json();
                    // Se o cookie for válido, logamos o usuário no React
                    login({
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        type: userData.role 
                    });
                } else {
                    // Se o cookie não for válido (ou não existir), deslogamos
                    logout();
                }
            } catch (error) {
                console.error("Erro ao verificar status de auth:", error);
                logout();
            } finally {
                // 5. Termina o 'loading'
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []); // O array vazio [] faz isso rodar SÓ UMA VEZ

    // 6. Não renderize o app até a verificação terminar
    if (isLoading) {
        return <div>Carregando...</div>; // Ou um componente de Spinner
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};