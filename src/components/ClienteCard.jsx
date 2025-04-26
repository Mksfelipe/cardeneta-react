import { useNavigate } from "react-router-dom";

export default function ClienteCard({ cliente }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{cliente.firstName} {cliente.lastName}</h2>
                    <p className="text-sm text-gray-500 mt-1">CPF: {cliente.cpf}</p> {/* Alterado para CPF */}
                </div>

            </div>
            <button
                onClick={() => navigate(`/clientes/${cliente.id}`)}
                className="text-green-600 hover:underline"
            >
                Ver detalhes
            </button>
        </div>
    );
}
