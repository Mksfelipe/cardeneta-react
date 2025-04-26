export default function Footer({ total, ofuscarValores }) {
    return (
      <footer className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-right text-xl font-bold text-gray-700">
          Total em aberto:{" "}
          <span className="text-green-700">
            {ofuscarValores ? "R$ ***" : `R$ ${total.toFixed(2)}`}
          </span>
        </p>
      </footer>
    );
  }
  