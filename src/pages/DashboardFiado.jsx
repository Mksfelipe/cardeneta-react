import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClienteCard from "../components/ClienteCard";
import ModalNovoCliente from "../components/ModalNovoCliente";
import { buscarUsuarios } from "../services/UserService";

export default function DashboardFiado() {
  const [busca, setBusca] = useState("");
  const [ofuscarValores, setOfuscarValores] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchClientes = async () => {
    setCarregando(true);
    try {
      const result = await buscarUsuarios(busca);
      setClientes(result);
    } catch (error) {
      setErro("Erro ao buscar clientes.");
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [busca]);

  const handleNovoCliente = async () => {
    await fetchClientes();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Linha com botões lado a lado */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Painel de Fiado</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMostrarModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl transition"
            >
              Novo Cliente
            </button>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl transition"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 rounded-xl px-4 py-3 transition outline-none"
          />
        </div>

        {carregando && <p>Carregando clientes...</p>}
        {erro && <p className="text-red-500">{erro}</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <ClienteCard
                key={cliente.id}
                cliente={cliente}
                ofuscarValores={ofuscarValores}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10 text-lg">
              Nenhum cliente encontrado.
            </p>
          )}
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200"></footer>
      </div>

      {mostrarModal && (
        <ModalNovoCliente
          onClose={() => setMostrarModal(false)}
          onSave={handleNovoCliente}
        />
      )}
    </div>
  );
}
