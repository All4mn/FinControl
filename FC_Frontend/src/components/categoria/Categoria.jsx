import { useState, useRef, useEffect } from "react";
import { Utensils, BusFront, House, Cross, Store, Tag } from "lucide-react";
import axios from "axios";
import styles from "./Categoria.module.css";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

const iconMap = {
  "Alimentação": Utensils,
  "Lazer": BusFront,
  "Moradia": House,
  "Saúde": Cross,
  "Mercado": Store,
};

function mapCategorias(dados) {
  return dados.map((item) => ({
    id: item.id_categoria,
    label: item.nome_categoria,
    icon: iconMap[item.nome_categoria] || Tag,
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
          {categorias.map((cat) => (
            <li
              key={cat.id}
              className={`${styles.dropdownItem} ${selected?.id === cat.id ? styles.selectedItem : ""}`}
              onClick={() => handleSelect(cat)}
            >
              <span className={styles.icon}>
                <cat.icon size={16} />
              </span>
              <span className={styles.itemLabel}>{cat.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
