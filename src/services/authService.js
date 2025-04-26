// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:9090/api/auth";

const login = async (cpf, password) => {
    try {
        const response = await axios.post(`${API_URL}/signin`, {
            cpf,
            password,
        });

        const { token } = response.data;

        localStorage.setItem("token", token);

        return { sucesso: true };
    } catch (error) {
        const mensagem =
            error.response?.data?.userMessage || "Erro ao fazer login";
        return { sucesso: false, mensagem };
    }
};

const logout = () => {
    localStorage.removeItem("token");
};

const isLogado = () => {
    return !!localStorage.getItem("token");
};

export default {
    login,
    logout,
    isLogado,
};
