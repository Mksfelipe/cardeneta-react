import { useState } from "react";
import { useAuth } from "../context/authContext"; // Pega o contexto de autenticação
import { formatarCPF } from "../utils/formatters"; // Utiliza o formatter para CPF
import authService from "../services/authService";

export default function Login() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const { login } = useAuth(); // Pega a função login do contexto

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Chama a função login do contexto (que vai utilizar o authService)
        try {
            const resposta = await authService.login(cpf, senha);
            if (resposta.sucesso) {
                login(cpf, senha); // Chama a função login do contexto se o login for bem-sucedido
            } else {
                setErro(resposta.mensagem);
            }
        } catch (err) {
            setErro("Erro ao tentar realizar o login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                {erro && (
                    <div className="text-red-600 text-sm mb-4 text-center">
                        {erro}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(formatarCPF(e.target.value))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4"
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-6"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 w-full rounded-xl"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}
