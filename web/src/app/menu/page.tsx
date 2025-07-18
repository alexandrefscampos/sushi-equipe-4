"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { api, MenuItem } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

const categories = [
  { id: "sashimi", label: "Sashimi" },
  { id: "maki", label: "Maki" },
  { id: "nigiri", label: "Nigiri" },
  { id: "combos", label: "Combos" },
] as const;

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("sashimi");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    addToCart,
    removeFromCart,
    clearCart,
    getProductQuantityInCart,
    cartTotal,
    cartItemCount,
  } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await api.getMenuItems(activeCategory);
        setMenuItems(items);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load menu items"
        );
        console.error("Error fetching menu items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeCategory]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sushi House</h1>
        <button className={styles.searchButton}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </header>

      <nav className={styles.categoryNav}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${
              activeCategory === category.id ? styles.active : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <main className={styles.productList}>
        {loading && (
          <div className={styles.loading}>
            <p>Carregando itens do menu...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>Erro ao carregar o menu: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {menuItems.length === 0 ? (
              <p className={styles.noItems}>
                Nenhum item disponível nesta categoria.
              </p>
            ) : (
              menuItems.map((item) => {
                const quantityInCart = getProductQuantityInCart(item.id);
                return (
                  <div key={item.id} className={styles.productCard}>
                    <div className={styles.productImage}>
                      <div className={styles.imagePlaceholder}>
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12,5 19,12 12,19" />
                        </svg>
                      </div>
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{item.name}</h3>
                      <p className={styles.productDescription}>
                        {item.description}
                      </p>
                    </div>
                    <div className={styles.productActions}>
                      <div className={styles.productPrice}>
                        {formatPrice(item.price)}
                      </div>
                      {quantityInCart > 0 ? (
                        <div className={styles.quantityControls}>
                          <button
                            className={styles.quantityButton}
                            onClick={() => removeFromCart(item.id)}
                          >
                            -
                          </button>
                          <span className={styles.quantity}>
                            {quantityInCart}
                          </span>
                          <button
                            className={styles.quantityButton}
                            onClick={() => addToCart(item)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className={styles.addButton}
                          onClick={() => addToCart(item)}
                        >
                          Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </main>

      <footer className={styles.cartSummary}>
        {cartItemCount > 0 ? (
          <div className={styles.cartFooter}>
            <button className={styles.clearButton} onClick={clearCart}>
              Limpar
            </button>
            <Link href="/cart" className={styles.cartButton}>
              Ver Carrinho ({cartItemCount}) - {formatPrice(cartTotal)}
            </Link>
          </div>
        ) : (
          <button className={styles.cartButton} disabled>
            Carrinho vazio
          </button>
        )}
      </footer>
    </div>
  );
}
