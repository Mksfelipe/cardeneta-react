import { useEffect, useState } from "react";
import transacaoService from "../services/transacaoService";

export default function Compras() {
  const [transacoes, setTransacoes] = useState([]);
  const [erro, setErro] = useState(null);
  const [total, setTotal] = useState(0);
  const [quantidadeCompras, setQuantidadeCompras] = useState(0); // Estado para contar as transações

  useEffect(() => {
    async function carregarTransacoes() {
      const resposta = await transacaoService.listarTransacoes();

      if (resposta.sucesso) {
        const dados = resposta.dados;
        setTransacoes(dados);
        const soma = dados.reduce((acc, transacao) => acc + transacao.amount, 0);
        setTotal(soma);
        setQuantidadeCompras(dados.length); // Contando o número de transações
      } else {
        setErro(resposta.mensagem);
      }
    }

    carregarTransacoes();
  }, []);

  if (erro) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg font-semibold">Erro: {erro}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 text-indigo-600">Compras</h1>

        {/* Exibindo o total de compras em quantidade e o total em valor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-lg font-semibold text-gray-800">Total de Compras</p>
            <span className="text-4xl font-bold text-green-600">{quantidadeCompras}</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-lg font-semibold text-gray-800">Total em Valor</p>
            <span className="text-4xl font-bold text-green-600">
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Se não houver transações, exibe uma mensagem */}
        {transacoes.length === 0 ? (
          <p className="text-center text-gray-600">Nenhuma transação encontrada.</p>
        ) : (
          <div className="grid gap-6">
            {transacoes.map((transacao) => (
              <div
                key={transacao.id}
                className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <p className="text-gray-800 font-semibold text-lg">
                    Valor:{" "}
                    <span className="text-green-600">
                      R$ {transacao.amount.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm">
                    Data:{" "}
                    {`${new Date(transacao.transactionDate).toLocaleDateString("pt-BR")} às ${new Date(transacao.transactionDate).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    transacao.paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {transacao.paid ? "Pago" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
