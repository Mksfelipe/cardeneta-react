import axios from "axios";
import { jwtDecode } from 'jwt-decode';


const api = axios.create({
  baseURL: "https://cardeneta.com:9090/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // em segundos

      if (decoded.exp && decoded.exp < currentTime) {
        console.warn("Token expirado");
        localStorage.removeItem("token");
        
        // ✅ Redireciona para o login
        window.location.href = "/login";
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      localStorage.removeItem("token");

      // ✅ Redireciona para o login se o token estiver inválido
      window.location.href = "/login";
    }
  }

  return config;
});

export default api;
