import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../pages/contexts/AuthContext";
import { Spinner, Center } from "@chakra-ui/react";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Si no hay usuario, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute; 