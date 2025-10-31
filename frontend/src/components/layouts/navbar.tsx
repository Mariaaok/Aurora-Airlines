import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom"; 
import React from "react"; 

const styles: { [key: string]: React.CSSProperties } = {
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        
        marginBottom: '0', 
    },
    logo: {
        width: '80px', 
        height: 'auto',
        marginRight: '10px',
    },
    logoText: {
        color: 'white',
        fontSize: '20px', 
        fontWeight: 'bold',
        letterSpacing: '2px',
    },
};

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth(); 
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/");
    }
  };

  const userBaseRoute = user?.type === "admin" ? "/admin/employees" : "/home"; 

  return (
    <nav className="bg-blue-900 text-white flex justify-between items-center px-8 py-3">
      <div className="flex items-center space-x-8">
        <Link to={userBaseRoute} className="flex items-center space-x-2">
          
          <div style={styles.logoContainer}>
              <img src="/logo-branca.png" alt="Aurora Airlines Logo" style={styles.logo} />
          </div>
          

        </Link>
      </div>

      <div className="flex items-center space-x-3">
        {isAuthenticated && user?.type === 'admin' && (
             <Button variant="outline" className="text-white border-white hover:bg-blue-800">
                Reports
             </Button>
        )}
        
        <Button 
            onClick={handleAuthClick} 
            className={`${isAuthenticated ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white`}>
          {isAuthenticated ? 'Sign out' : 'Sign in'}
        </Button>
      </div>
    </nav>
  );
}