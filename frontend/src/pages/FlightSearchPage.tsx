import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { API_BASE_URL } from '../config';

interface SearchFormData {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
}

const FlightSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setSearchData, clearBooking } = useBooking();

  const [formData, setFormData] = useState<SearchFormData>({
    from: '',
    to: '',
    departureDate: '',
    returnDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    clearBooking();
    setSearchData(formData);

    try {
      const response = await fetch(`${API_BASE_URL}/flights/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (response.ok) {
        const results = await response.json();
        navigate('/flight-results', {
          state: { results, searchData: formData, isReturn: false }
        });
      } else {
        console.error('Search failed');
        alert('Failed to search for flights. Please try again.');
      }
    } catch (error) {
      console.error('Error searching for flights:', error);
      alert('Error searching for flights. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        logout();
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Error logging out:', error);
      logout();
      navigate('/', { replace: true });
    }
  };

  return (
    <div style={styles.page}>
      {/* Top Bar */}
      <nav style={styles.nav}>
        <img src="/logo-branca.png" alt="Aurora Airlines" style={styles.logo} />
        {/* Mantém funcionalidade de sair, apenas estilizado como no protótipo */}
        <button onClick={handleSignOut} style={styles.signBtn}>Sign in</button>
      </nav>

      {/* “Moldura” branca com a imagem ao centro */}
      <div style={styles.canvas}>
        <div style={styles.photoArea}>
          {/* fundo com a imagem aurora.jpg */}
          <div style={styles.bg}>
            {/* Painel glass com o formulário */}
            <div style={styles.panel}>
              <h2 style={styles.title}>Search for your next flight here:</h2>

              <form onSubmit={handleSearch} style={styles.form}>
                <div style={styles.row}>
                  <div style={styles.group}>
                    <label style={styles.label}>From:</label>
                    <input
                      type="text"
                      name="from"
                      value={formData.from}
                      onChange={handleChange}
                      placeholder=""
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.group}>
                    <label style={styles.label}>To:</label>
                    <input
                      type="text"
                      name="to"
                      value={formData.to}
                      onChange={handleChange}
                      placeholder=""
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                {/* Botão circular de swap entre as linhas */}
                <div style={styles.swapWrap}>
                  <div style={styles.swap}>
                    <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                      <path d="M8 7h11M19 7l-3-3m3 3l-3 3" />
                      <path d="M16 17H5m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </div>
                </div>

                <div style={styles.row}>
                  <div style={styles.group}>
                    <label style={styles.label}>Departure:</label>
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      style={styles.input}
                      required
                    />
                  </div>

                  <div style={styles.group}>
                    <label style={styles.label}>Return:</label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>

                <button type="submit" style={styles.search}>
                  Search
                  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" style={{ marginLeft: 8 }}>
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =====================  STYLES  ===================== */
const styles: { [k: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background: '#e5e5e5',
    display: 'flex',
    flexDirection: 'column'
  },

  nav: {
    height: 72,
    background: '#0f335a',        // azul do topo
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px'
  },
  logo: { height: 44, width: 'auto' },
  signBtn: {
    background: '#1fd0a0',       // botão verde
    color: '#0b1f36',
    border: 'none',
    borderRadius: 10,
    padding: '8px 18px',
    fontWeight: 600,
    cursor: 'pointer'
  },

  canvas: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 0'
  },

  // “margens” brancas como no mock
  photoArea: {
    width: '86%',
    maxWidth: 1080,
    background: '#ffffff',
    boxShadow: 'inset 0 0 0 1px #e5e5e5',
    padding: 24
  },

  // bloco com a foto de fundo
  bg: {
    width: '100%',
    height: 520,
    backgroundImage: 'url("/aurora.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  // painel translúcido
  panel: {
    width: '78%',
    maxWidth: 760,
    background: 'rgba(255,255,255,0.35)',
    backdropFilter: 'blur(6px)',
    borderRadius: 10,
    padding: '22px 26px',
    boxShadow: '0 2px 8px rgba(0,0,0,.15)'
  },

  title: {
    margin: 0,
    marginBottom: 18,
    color: '#1d2a36',
    fontSize: 20,
    fontWeight: 700
  },

  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 },

  group: { display: 'flex', flexDirection: 'column' },
  label: { color: '#334155', fontSize: 14, marginBottom: 6 },

  input: {
    height: 42,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    padding: '0 14px',
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0,0,0,.06)',
    outline: 'none'
  },

  swapWrap: { display: 'flex', justifyContent: 'center', marginTop: -4, marginBottom: -4 },
  swap: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#ffffff',
    color: '#0f335a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,.2)'
  },

  search: {
    alignSelf: 'center',
    marginTop: 6,
    minWidth: 170,
    height: 40,
    borderRadius: 8,
    border: '1px solid #275c86',
    background: '#1f5e87',
    color: '#ffffff',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,.15)'
  }
};

export default FlightSearchPage;
