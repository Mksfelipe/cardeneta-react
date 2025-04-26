import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import Login from "./pages/Login";
import DashboardFiado from "./pages/DashboardFiado";
import ClienteDetalhes from "./pages/ClienteDetalhes";

// Componente para proteger rotas privadas
function PrivateRoute({ children }) {
  const { auth } = useAuth();

  if (auth === null) {
    return null; // ou um loading spinner
  }

  return auth ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          auth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardFiado />
          </PrivateRoute>
        }
      />
      <Route
        path="/clientes/:id"
        element={
          <PrivateRoute>
            <ClienteDetalhes />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
