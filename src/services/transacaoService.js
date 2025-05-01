// src/services/transacaoService.js
import api from "./axiosInstance";

const API_URL = "https://cardeneta.com:9090/api/user/profile"; // Base da sua API

async function listarTransacoes() {
    try {
      const response = await api.get("/user/profile/transanctions");
      return {
        sucesso: true,
        dados: response.data, // <- agora é um array direto
      };
    } catch (error) {
      return {
        sucesso: false,
        mensagem: error.response?.data?.message || "Erro ao buscar transações",
      };
    }
  }

export default {
  listarTransacoes,
};
