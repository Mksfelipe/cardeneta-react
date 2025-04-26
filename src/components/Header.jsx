export default function Header({abrirModal }) {


    return (
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800">Carteira de Fiado</h1>
            <div className="flex gap-3">
                <button
                    onClick={abrirModal}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow"
                >
                    + Novo Cliente
                </button>

            </div>
        </header>
    );
}
