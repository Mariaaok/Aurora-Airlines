import { useEffect, useState } from 'react';
import { getUsers, createUser } from './services/api';

function App() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error);
  }, []);

  const handleAddUser = async () => {
    if (!name) return;
    const newUser = await createUser({ name });
    setUsers((prev) => [...prev, newUser]);
    setName('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista de Usuários</h1>
      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAddUser}>Adicionar</button>

      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

