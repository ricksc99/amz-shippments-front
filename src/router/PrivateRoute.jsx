import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
    return children.props?.isLogged ? children : <Navigate to="/login" />;
}