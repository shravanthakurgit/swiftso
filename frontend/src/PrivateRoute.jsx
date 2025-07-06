import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';



const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // From context

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


export default PrivateRoute