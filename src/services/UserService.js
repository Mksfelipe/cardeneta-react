import api from "./axiosInstance";

const API_URL = "https://cardeneta.com:9090/api/";

export async function cadastrarUsuario(dadosUsuario) {
  try {
    const response = await api.post("/auth/signup", dadosUsuario);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error.response?.data);
    throw error;
  }
}

export async function buscarUsuarios(nome = "") {
  try {
    const endpoint = nome
      ? `/users/search?fullName=${encodeURIComponent(nome)}&sort=updated,desc`
      : "/users?size=9&sort=updated,desc";

    const response = await api.get(api.get(`${API_URL}/${endpoint}`));
    return response.data.content || response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error.response?.data);
    throw error;
  }
}

export async function buscarUsuarioPorId(id) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error.response?.data);
    throw error;
  }
}

