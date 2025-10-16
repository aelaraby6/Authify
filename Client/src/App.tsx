import "reflect-metadata";
import "./App.css";
import { AppRouter } from "@/router/AppRouter";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
