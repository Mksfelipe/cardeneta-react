import { useEffect, useState } from "react";
import Header from "../components/Header";
import ClienteCard from "../components/ClienteCard";
import ModalNovoCliente from "../components/ModalNovoCliente";
import { buscarUsuarios } from "../services/UserService";  // Importe a função de busca de usuários

export default function DashboardFiado() {
  const [busca, setBusca] = useState("");
  const [ofuscarValores, setOfuscarValores] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Função que carrega os clientes
  const fetchClientes = async () => {
    setCarregando(true);
    try {
      const result = await buscarUsuarios(busca);  // Passa o texto da busca para filtrar clientes
      setClientes(result);  // Atualiza o estado com os clientes encontrados
    } catch (error) {
      setErro("Erro ao buscar clientes.");
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setCarregando(false);
    }
  };

  // Carregar os clientes sempre que a busca mudar
  useEffect(() => {
    fetchClientes();
  }, [busca]); // Refaz a busca sempre que o texto mudar

  const handleNovoCliente = async () => {
    await fetchClientes();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Header
          abrirModal={() => setMostrarModal(true)}
        />

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
                key={cliente.id} // Garantir chave única
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

        <footer className="mt-12 pt-6 border-t border-gray-200">
        </footer>
      </div>

      {mostrarModal && (
        <ModalNovoCliente
          onClose={() => setMostrarModal(false)}
          onSave={handleNovoCliente} // Passa a função para ser chamada após salvar o novo cliente
        />
      )}
    </div>
  );
}