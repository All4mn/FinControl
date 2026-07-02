import { useState, useRef, useEffect } from "react";
import {
  Utensils,
  BusFront,
  House,
  Cross,
  Store,
  Tag,
  CircleDollarSign,
} from "lucide-react";
import axios from "axios";
import styles from "./Categoria.module.css";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

const iconGroupMap = {
  Utensils: [
    "alimentacao",
    "comida",
    "restaurante",
    "almoco",
    "jantar",
    "cafe",
    "lanche",
    "fastfood",
    "padaria",
    "gourmet",
    "refeicao",
    "marmita",
    "pizzaria",
    "churrasco",
  ],
  BusFront: [
    "lazer",
    "viagem",
    "transporte",
    "onibus",
    "passagem",
    "cinema",
    "show",
    "teatro",
    "festa",
    "balada",
    "passeio",
    "entretenimento",
    "ferias",
    "turismo",
    "combustivel",
    "uber",
  ],
  House: [
    "moradia",
    "casa",
    "aluguel",
    "condominio",
    "luz",
    "agua",
    "internet",
    "gas",
    "energia",
    "reforma",
    "moveis",
    "iptu",
    "imovel",
  ],
  Cross: [
    "saude",
    "medico",
    "hospital",
    "farmacia",
    "remedio",
    "consulta",
    "dentista",
    "exame",
    "clinica",
    "psicologo",
    "convenio",
    "seguro",
  ],
  Store: [
    "mercado",
    "supermercado",
    "compras",
    "hipermercado",
    "mercearia",
    "feira",
    "sacolao",
    "atacado",
    "varejo",
  ],
  CircleDollarSign: [
    "salario",
    "renda",
    "receita",
    "bonus",
    "dividendos",
    "pix",
    "transferencia",
    "investimento",
    "lucro",
    "ganho",
  ],
};

// Função auxiliar para remover acentos e cedilhas
function removerAcentos(texto) {
  if (!texto) return "";
  return texto
    .normalize("NFD") // Separa os acentos das letras (ex: 'ã' vira 'a' + '~')
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos que foram separados
    .toLowerCase(); // Garante que tudo fique em minúsculo
}

function encontrarIcone(iconGroupMap, palavra) {
  // Limpa a palavra que veio do banco/input
  const palavraLimpa = removerAcentos(palavra);

  // Objeto de mapeamento para resolver o erro anterior dos componentes
  const lookup = { Utensils, BusFront, House, Cross, Store, CircleDollarSign };

  for (const [key, termos] of Object.entries(iconGroupMap)) {
    // Limpa cada termo da lista antes de comparar
    if (
      termos.some((t) => {
        const termoLimpo = removerAcentos(t);
        return (
          palavraLimpa.includes(termoLimpo) || termoLimpo.includes(palavraLimpa)
        );
      })
    ) {
      return lookup[key] || Tag;
    }
  }
  return Tag;
}

function mapCategorias(dados) {
  return dados.map((item) => ({
    id: item.id_categoria,
    label: item.nome_categoria,
    icon: encontrarIcone(iconGroupMap, item.nome_categoria),
  }));
}

export default function Categoria() {
  const [isOpen, setIsOpen] = useState(true);
  const [selected, setSelected] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/categorias`, { withCredentials: true })
      .then((res) => {
        const lista = mapCategorias(res.data.dados);
        setCategorias(lista);
        if (lista.length > 0) setSelected(lista[0]);
      })
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (categoria) => {
    setSelected(categoria);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <label className={styles.label}>Categoria</label>

      <button
        className={`${styles.selectButton} ${isOpen ? styles.activeButton : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        disabled={carregando}
      >
        {carregando ? "Carregando..." : selected?.label || "Selecione"}
      </button>

      {isOpen && !carregando && (
        <ul className={styles.dropdownList}>
          {categorias.map((cat) => {
            // Criamos UMA ÚNICA variável com letra maiúscula aqui.
            // Ela vai guardar dinamicamente o ícone da vez (seja House, Cross, Utensils, etc.)
            const IconeDinamico = cat.icon;

            return (
              <li
                key={cat.id}
                className={`${styles.dropdownItem} ${selected?.id === cat.id ? styles.selectedItem : ""}`}
                onClick={() => handleSelect(cat)}
              >
                <span className={styles.icon}>
                  {/* Usamos a variável com letra maiúscula aqui */}
                  <IconeDinamico size={16} />
                </span>
                <span className={styles.itemLabel}>{cat.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
