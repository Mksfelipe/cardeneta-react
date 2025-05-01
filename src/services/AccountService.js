import api from "./axiosInstance";

const API_URL = "https://cardeneta.com:9090/api/account";

export async function buscarTransacoesPorConta(accountId) {
    try {
        const response = await api.get(`${API_URL}/${accountId}/transaction`);
        return { sucesso: true, data: response.data };
    } catch (error) {
        const mensagem =
            error.response?.data?.userMessage || "Erro ao buscar transações";
        return { sucesso: false, mensagem };
    }
};

export async function deletarTransacao(accountId, transactionId) {
  try {
    const response = await api.delete(`/account/${accountId}/transaction/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    throw error;
  }
}

export async function pagarTodasTransacoes(accountId, amountPaid) {
    const response = await api.post(`/account/${accountId}/payment`, { amountPaid });
    return response.data;
}



export async function registrarCompra(accountId, valor) {
    try {
        const response = await api.post(`/account/${accountId}/transaction`, {
            amount: valor
        });
        return response.data;
    } catch (err) {
        console.error("Erro ao registrar compra:", err);
        throw err;
    }
}
