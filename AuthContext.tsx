import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'admin';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  isPatientPortalEnabled: boolean;
  setPatientPortalEnabled: (enabled: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isPatientPortalEnabled, setPatientPortalEnabledState] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('smilecare_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const portalStatus = localStorage.getItem('patient_portal_enabled');
    if (portalStatus !== null) {
      setPatientPortalEnabledState(portalStatus === 'true');
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === "admin@smilecare.com" && password === "admin123") {
      const adminUser = { id: "1", name: "Super Admin", email, role: "admin" as const };
      setUser(adminUser);
      localStorage.setItem('smilecare_user', JSON.stringify(adminUser));
      return true;
    }
    if (email === "patient@smilecare.com" && password === "patient123") {
      const patientUser = { id: "2", name: "Rahul Sharma", email, role: "patient" as const };
      setUser(patientUser);
      localStorage.setItem('smilecare_user', JSON.stringify(patientUser));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    const newUser = { id: Date.now().toString(), name, email, role: "patient" as const };
    setUser(newUser);
    localStorage.setItem('smilecare_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smilecare_user');
  };

  const setPatientPortalEnabled = (enabled: boolean) => {
    setPatientPortalEnabledState(enabled);
    localStorage.setItem('patient_portal_enabled', enabled.toString());
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAdmin,
      isPatientPortalEnabled,
      setPatientPortalEnabled
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
