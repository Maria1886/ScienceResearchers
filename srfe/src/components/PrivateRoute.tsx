import  React, { useContext } from  "react";
import { Navigate } from  "react-router-dom";
import LoaderComponent from "../components/Loader";
import { IUser } from "../utils/interfaces";
import { UserContext } from "../utils/globalStates";

const PrivateRoute: React.FC<{ component: React.ComponentType, authenticated: boolean }> = ({ component: RouteComponent, authenticated }) => {
    const [userState, isLoading] = useContext<[IUser | undefined, boolean]>(UserContext);

    if (isLoading) {
        return <LoaderComponent type="Circles" />
    }
    
    if ((authenticated && userState !== undefined) || (!authenticated && userState === undefined)) {
        return <RouteComponent />;
    }

    if (authenticated && userState === undefined) {
        return <Navigate  to="/login" />;
    }

    return <Navigate  to="/" />;
};

export default PrivateRoute;