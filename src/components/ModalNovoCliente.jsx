import { useState } from "react";
import { cadastrarUsuario } from "../services/UserService";
import { formatarCPF } from "../utils/formatters";

export default function ModalNovoCliente({ onClose, onSave }) {
    const [erro, setErro] = useState("");
    const [cpf, setCpf] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const novoUsuario = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            cpf: cpf, // usa o estado com o CPF formatado
        };

        try {
            const resposta = await cadastrarUsuario(novoUsuario);
            onSave(resposta);
            onClose();
        } catch (error) {
            setErro("Erro ao cadastrar usuário. Tente novamente.");
        }
    };

    const handleCpfChange = (e) => {
        const rawValue = e?.target?.value || "";
        const valorFormatado = formatarCPF(rawValue);
        setCpf(valorFormatado);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-4">Novo Cliente</h2>

                {erro && <p className="text-red-500 mb-3 text-sm">{erro}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="firstName"
                        type="text"
                        placeholder="Nome"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2"
                        required
                    />
                    <input
                        name="lastName"
                        type="text"
                        placeholder="Sobrenome"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2"
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2"
                    />
                    <input
                        name="cpf"
                        type="text"
                        placeholder="CPF"
                        value={cpf}
                        onChange={handleCpfChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4"
                        required
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
