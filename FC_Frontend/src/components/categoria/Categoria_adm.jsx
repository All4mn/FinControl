import { useState, useRef, useEffect } from "react";
import { Utensils, BusFront, House, Cross, Store, Trash2, Tag, Pencil, Check } from "lucide-react";
import axios from "axios";
import styles from "./Categoria_adm.module.css";

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

export default function Categoria_adm() {
  const [isOpen, setIsOpen] = useState(true);
  const [selected, setSelected] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [adicionando, setAdicionando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [salvando, setSalvando] = useState(false);
  const editInputRef = useRef(null);
  const inputRef = useRef(null);
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
        setShowAddInput(false);
        setErro("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showAddInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddInput]);

  useEffect(() => {
    if (editandoId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editandoId]);

  const handleSelect = (categoria) => {
    setSelected(categoria);
    setIsOpen(false);
    setShowAddInput(false);
  };

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_BASE_URL}/categorias/${id}`, {
        withCredentials: true,
      });
      setCategorias((prev) => {
        const updated = prev.filter((cat) => cat.id !== id);
        if (selected?.id === id && updated.length > 0) {
          setSelected(updated[0]);
        }
        return updated;
      });
    } catch {
      setErro("Erro ao remover categoria");
    }
  };

  const handleStartEdit = (e, cat) => {
    e.stopPropagation();
    setEditandoId(cat.id);
    setEditValue(cat.label);
  };

  const handleSaveEdit = async (e, id) => {
    e.stopPropagation();
    const nome = editValue.trim();
    if (!nome) return;

    setSalvando(true);
    setErro("");
    try {
      await axios.put(
        `${API_BASE_URL}/categorias/${id}`,
        { nome_categoria: nome },
        { withCredentials: true },
      );
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id === id
            ? { ...cat, label: nome, icon: iconMap[nome] || Tag }
            : cat,
        ),
      );
      if (selected?.id === id) {
        setSelected((prev) => ({ ...prev, label: nome }));
      }
      setEditandoId(null);
      setEditValue("");
    } catch {
      setErro("Erro ao editar categoria");
    } finally {
      setSalvando(false);
    }
  };

  const handleEditKeyDown = (e, id) => {
    e.stopPropagation();
    if (e.key === "Enter") handleSaveEdit(e, id);
    if (e.key === "Escape") {
      setEditandoId(null);
      setEditValue("");
    }
  };

  const handleAddClick = () => {
    setShowAddInput(true);
  };

  const handleConfirmAdd = async () => {
    const nome = novaCategoria.trim();
    if (!nome) return;

    setAdicionando(true);
    setErro("");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/categorias`,
        { nome_categoria: nome },
        { withCredentials: true },
      );
      const item = res.data.dados;
      const nova = {
        id: item.id_categoria,
        label: item.nome_categoria,
        icon: iconMap[item.nome_categoria] || Tag,
      };
      setCategorias((prev) => [...prev, nova]);
      setNovaCategoria("");
      setShowAddInput(false);
    } catch {
      setErro("Erro ao adicionar categoria");
    } finally {
      setAdicionando(false);
    }
  };

  const handleAddKeyDown = (e) => {
    if (e.key === "Enter") handleConfirmAdd();
    if (e.key === "Escape") {
      setShowAddInput(false);
      setNovaCategoria("");
    }
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
              {editandoId === cat.id ? (
                <input
                  ref={editInputRef}
                  className={styles.editInput}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, cat.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className={styles.itemLabel}>{cat.label}</span>
              )}
              <button
                className={`${styles.editButton} ${editandoId === cat.id ? styles.editButtonActive : ""}`}
                onClick={(e) =>
                  editandoId === cat.id
                    ? handleSaveEdit(e, cat.id)
                    : handleStartEdit(e, cat)
                }
                disabled={salvando && editandoId === cat.id}
                type="button"
                title={editandoId === cat.id ? "Salvar" : "Editar categoria"}
              >
                {salvando && editandoId === cat.id ? (
                  "..."
                ) : editandoId === cat.id ? (
                  <Check size={14} />
                ) : (
                  <Pencil size={14} />
                )}
              </button>
              <button
                className={styles.removeButton}
                onClick={(e) => handleRemove(e, cat.id)}
                type="button"
                title="Remover categoria"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
          {erro && <li className={styles.erroItem}>{erro}</li>}
          <li className={styles.divider} />
          {showAddInput ? (
            <li className={styles.addInputItem}>
              <input
                ref={inputRef}
                className={styles.addInput}
                type="text"
                placeholder="Nome da categoria"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                onKeyDown={handleAddKeyDown}
              />
              <button
                className={styles.confirmButton}
                onClick={handleConfirmAdd}
                disabled={adicionando || !novaCategoria.trim()}
                type="button"
              >
                {adicionando ? "..." : <Cross size={16} />}
              </button>
            </li>
          ) : (
            <li className={styles.addItem} onClick={handleAddClick}>
              <span className={styles.icon}>
                <Cross size={16} />
              </span>
              <span className={styles.itemLabel}>Adicionar</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
