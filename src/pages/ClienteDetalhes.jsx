import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscarUsuarioPorId } from '../services/UserService';
import { buscarTransacoesPorConta, registrarCompra, deletarTransacao, pagarTodasTransacoes } from '../services/AccountService';
import TransacoesList from '../components/TransacoesList';
import { Dialog } from '@headlessui/react';

function ClienteDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [transacoes, setTransacoes] = useState([]);
    const [isCompraModalOpen, setIsCompraModalOpen] = useState(false);
    const [isPagamentoModalOpen, setIsPagamentoModalOpen] = useState(false);
    const [valorCompra, setValorCompra] = useState('');
    const [valorRecebido, setValorRecebido] = useState('');
    const [troco, setTroco] = useState(0);

    const fetchDados = async () => {
        try {
            const data = await buscarUsuarioPorId(id);
            setCliente(data);

            if (data.account?.id) {
                const response = await buscarTransacoesPorConta(data.account.id);
                if (response.sucesso) {
                    setTransacoes(response.data?.content || response.data || []);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    useEffect(() => {
        fetchDados();
    }, [id]);

    const handleDeletarTransacao = async (transactionId) => {
        const accountId = cliente?.account?.id;
        if (!accountId || !transactionId) {
            console.error("ID da conta ou transação inválido.");
            return;
        }

        try {
            await deletarTransacao(accountId, transactionId);
            await fetchDados();
        } catch (error) {
            alert("Erro ao deletar transação.");
        }
    };

    const handleCompra = async (e) => {
        e.preventDefault();
        try {
            await registrarCompra(cliente.account.id, parseFloat(valorCompra));
            setValorCompra('');
            setIsCompraModalOpen(false);
            await fetchDados();
        } catch (error) {
            console.error('Erro ao adicionar compra:', error);
        }
    };

    const abrirModalPagamento = () => {
        setValorRecebido("");
        setTroco(0);
        setIsPagamentoModalOpen(true);
    };

    const calcularTroco = (valor) => {
        if (!cliente?.account?.balance) return;
        const saldo = cliente.account.balance;
        const recebido = parseFloat(valor);
        if (isNaN(recebido)) {
            setTroco(0);
            return;
        }
        setTroco(recebido - saldo);
    };

    const confirmarPagamento = async (e) => {
        e.preventDefault();
        const accountId = cliente?.account?.id;
        if (!accountId) return;

        try {
            await pagarTodasTransacoes(accountId, valorRecebido); // <- corrigido aqui
            setValorRecebido('');
            setTroco(0);
            setIsPagamentoModalOpen(false);
            await fetchDados();
        } catch (error) {
            alert("Erro ao pagar todas as transações.");
        }
    };

    if (!cliente) {
        return <div className="text-center text-gray-600 mt-10 text-lg">Carregando...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
            <button
                onClick={() => navigate("/dashboard")}
                className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
                ← Voltar
            </button>

            <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">Detalhes do Cliente</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <div><span className="font-semibold">Nome:</span> {cliente.firstName} {cliente.lastName}</div>
                <div><span className="font-semibold">Email:</span> {cliente.email}</div>
                <div><span className="font-semibold">CPF:</span> {cliente.cpf}</div>
                <div><span className="font-semibold">Data de Criação:</span> {new Date(cliente.created).toLocaleString()}</div>
                <div><span className="font-semibold">Data de Atualização:</span> {new Date(cliente.updated).toLocaleString()}</div>
            </div>

            {cliente.account && (
                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Informações da Conta</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsCompraModalOpen(true)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
                            >
                                + Adicionar Compra
                            </button>
                            <button
                                onClick={abrirModalPagamento}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow"
                            >
                                💳 Pagar Tudo
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <div><span className="font-semibold">ID da Conta:</span> {cliente.account.id}</div>
                        <div><span className="font-semibold">Saldo Atual:</span> R$ {cliente.account.balance.toFixed(2)}</div>
                        <div><span className="font-semibold">Criado em:</span> {new Date(cliente.account.created).toLocaleString()}</div>
                        <div><span className="font-semibold">Atualizado em:</span> {new Date(cliente.account.updated).toLocaleString()}</div>
                    </div>
                </div>
            )}

            <TransacoesList transacoes={transacoes} onDelete={handleDeletarTransacao} />

            {/* Modal de adicionar compra */}
            <Dialog open={isCompraModalOpen} onClose={() => setIsCompraModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                    <Dialog.Title className="text-lg font-bold mb-4">Adicionar Compra</Dialog.Title>
                    <form onSubmit={handleCompra} className="space-y-4">
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Valor da compra"
                            value={valorCompra}
                            onChange={(e) => setValorCompra(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsCompraModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                Confirmar
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </Dialog>

            {/* Modal de pagamento */}
            <Dialog open={isPagamentoModalOpen} onClose={() => setIsPagamentoModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                <Dialog.Panel className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                    <Dialog.Title className="text-lg font-bold mb-4">Finalizar Pagamento</Dialog.Title>
                    <div className="space-y-4">
                        <div className="text-gray-700">
                            Valor a pagar: <strong>R$ {cliente.account.balance.toFixed(2)}</strong>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Valor recebido"
                            value={valorRecebido}
                            onChange={(e) => {
                                setValorRecebido(e.target.value);
                                calcularTroco(e.target.value);
                            }}
                            required
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                        <div className="text-gray-700">
                            Troco: <strong>R$ {troco > 0 ? troco.toFixed(2) : '0.00'}</strong>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsPagamentoModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarPagamento}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                disabled={parseFloat(valorRecebido) < cliente.account.balance}
                            >
                                Confirmar Pagamento
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    );
}

export default ClienteDetalhes;
