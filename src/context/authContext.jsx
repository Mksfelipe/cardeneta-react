import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { jwtDecode } from "jwt-decode";  // Usando exportação nomeada

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode(token);  // Decodifica o token
                const currentTime = Date.now() / 1000;  // Tempo atual em segundos


                console.log(decodedToken)
                // Verifica se o token não expirou
                if (decodedToken.exp > currentTime) {
                    setAuth(true);
                } else {
                    localStorage.removeItem("token");  // Remove token se expirado
                    setAuth(false);
                }
            } catch (error) {
                console.error("Erro ao decodificar token:", error);
                localStorage.removeItem("token");  // Remove token se inválido
                setAuth(false);
            }
        } else {
            setAuth(false);  // Se não houver token
        }
    }, []);

    const login = async (cpf, password) => {
        try {
            const resposta = await authService.login(cpf, password);
    
            if (resposta.sucesso) {
                setAuth(true);
    
                const token = localStorage.getItem("token");
    
                if (token) {
                    const decoded = jwtDecode(token);
                    const rolesString = decoded.roles || "";
                    const roles = rolesString.split(","); // Transforma em array
    
                    if (roles.includes("ROLE_USER")) {
                        navigate("/compras");
                    } else {
                        navigate("/dashboard");
                    }
                } else {
                    console.error("Token não encontrado");
                }
            } else {
                throw new Error(resposta.mensagem);
            }
        } catch (error) {
            throw new Error(resposta.mensagem);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
