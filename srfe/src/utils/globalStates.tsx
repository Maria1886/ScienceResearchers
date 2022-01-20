import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IUser } from "./interfaces";


export const UserContext = createContext<[IUser | undefined, boolean]>([undefined, false]);

export const UserProvider: React.FC = ({ children }) => {
    const { pathname } = useLocation();
    const [userState, setUserState] = useState<IUser>();
    const [isLoading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/auth/user');
                
                if (response.data !== "") {
                    setUserState(response.data);
                } else {
                    setUserState(undefined);
                }
            } catch (error) {
                setUserState(undefined);
            }
            setLoading(false);
        }

        setLoading(true);
        fetchUser();
    }, [pathname])

    return (
        <UserContext.Provider value={[userState, isLoading]}>
            {children}
        </UserContext.Provider>
    )
}