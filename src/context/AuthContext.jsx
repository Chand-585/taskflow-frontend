import { createContext, useContext, useState } from 'react';

// create the context
const AuthContext = createContext(null);

// provider wraps the whole app
export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem('token') || null
    // check localStorage first — persists after refresh
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  function login(token, user) {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook — cleaner to use
export function useAuth() {
  return useContext(AuthContext);
}