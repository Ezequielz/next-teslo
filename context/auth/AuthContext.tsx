import { createContext } from 'react';
import { IUser } from '../../interfaces';


interface ContextProps {
 
    isLoggedIn: boolean;
    user?: IUser;

    // Methods
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, password: string, email: string) => Promise<{ hasError: boolean; message?: string; }>;
    logout: () => void;
}   


export const AuthContext = createContext({} as ContextProps );