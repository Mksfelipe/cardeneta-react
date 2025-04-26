import React from 'react';

function TransacoesList({ transacoes, onDelete }) {
  if (!transacoes || transacoes.length === 0) {
    return <div className="text-gray-500 mt-6">Nenhuma transação encontrada.</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Histórico de Compras</h3>
      <ul className="divide-y divide-gray-200 bg-gray-50 rounded-lg shadow-sm">
        {transacoes.map((t) => (
          <li key={t.id} className="p-4 flex justify-between items-center">
            <div>
              <p><strong>Valor:</strong> R$ {t.amount.toFixed(2)}</p>
              <p><strong>Data:</strong> {new Date(t.transactionDate).toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium px-2 py-1 rounded ${
                  t.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {t.paid ? 'Pago' : 'Pendente'}
              </span>

              <button
                onClick={() => onDelete && onDelete(t.id)}
                className="text-red-600 hover:text-red-800 text-sm ml-2"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransacoesList;
