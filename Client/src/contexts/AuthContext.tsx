import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  forgotPasswordEmail: string | null;
  otpVerified: boolean;
  login: () => void;
  logout: () => void;
  setForgotPasswordEmail: (email: string | null) => void;
  setOtpVerified: (verified: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmailState] = useState<
    string | null
  >(null);
  const [otpVerified, setOtpVerifiedState] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage/sessionStorage)
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth_token");
    // Clear password reset flow state
    setForgotPasswordEmailState(null);
    setOtpVerifiedState(false);
  };

  const setForgotPasswordEmail = (email: string | null) => {
    setForgotPasswordEmailState(email);
    if (!email) {
      // Clear OTP verification when clearing email
      setOtpVerifiedState(false);
    }
  };

  const setOtpVerified = (verified: boolean) => {
    setOtpVerifiedState(verified);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        forgotPasswordEmail,
        otpVerified,
        login,
        logout,
        setForgotPasswordEmail,
        setOtpVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
