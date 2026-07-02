import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/data/products";

export type Role = "user" | "admin";
export type User = { id: string; email: string; name: string; address?: string; role: Role };
export type CartItem = { productId: number; qty: number };
export type Order = {
  id: string;
  userId: string;
  items: { productId: number; qty: number; price: number; name: string; image: string }[];
  subtotal: number;
  shipping: number;
  total: number;
  address: string;
  createdAt: number;
  status: "Pending" | "Paid" | "Shipped" | "Delivered";
};

type AppState = {
  user: User | null;
  users: User[];
  cart: CartItem[];
  orders: Order[];
  products: Product[];
  signup: (input: { email: string; password: string; name: string }) => { error?: string };
  login: (email: string, password: string) => { error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "address">>) => void;
  addToCart: (productId: number, qty?: number) => void;
  setCartQty: (productId: number, qty: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  placeOrder: (address: string) => Order | null;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  upsertProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
};

const AppContext = createContext<AppState | null>(null);

const KEY = "luxe.state.v1";
type Persisted = {
  user: User | null;
  users: (User & { password: string })[];
  cart: CartItem[];
  orders: Order[];
  products: Product[];
};

const initial: Persisted = {
  user: null,
  users: [
    { id: "admin", email: "admin@luxe.com", name: "Admin", role: "admin", password: "admin" },
  ],
  cart: [],
  orders: [],
  products: PRODUCTS,
};

function load(): Persisted {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<AppState>(() => ({
    user: state.user,
    users: state.users.map(({ password: _p, ...u }) => u),
    cart: state.cart,
    orders: state.orders,
    products: state.products,

    signup: ({ email, password, name }) => {
      email = email.trim().toLowerCase();
      if (state.users.some((u) => u.email === email)) return { error: "Email already registered" };
      const role: Role = email === "admin@luxe.com" ? "admin" : "user";
      const user = { id: crypto.randomUUID(), email, name, role, password };
      setState((s) => ({ ...s, users: [...s.users, user], user: { id: user.id, email, name, role } }));
      return {};
    },

    login: (email, password) => {
      email = email.trim().toLowerCase();
      const found = state.users.find((u) => u.email === email && u.password === password);
      if (!found) return { error: "Invalid email or password" };
      const { password: _p, ...safe } = found;
      setState((s) => ({ ...s, user: safe }));
      return {};
    },

    logout: () => setState((s) => ({ ...s, user: null })),

    updateProfile: (patch) => {
      setState((s) => {
        if (!s.user) return s;
        const user = { ...s.user, ...patch };
        return {
          ...s,
          user,
          users: s.users.map((u) => (u.id === user.id ? { ...u, ...patch } : u)),
        };
      });
    },

    addToCart: (productId, qty = 1) =>
      setState((s) => {
        const existing = s.cart.find((c) => c.productId === productId);
        const cart = existing
          ? s.cart.map((c) => (c.productId === productId ? { ...c, qty: c.qty + qty } : c))
          : [...s.cart, { productId, qty }];
        return { ...s, cart };
      }),

    setCartQty: (productId, qty) =>
      setState((s) => ({
        ...s,
        cart: qty <= 0 ? s.cart.filter((c) => c.productId !== productId) : s.cart.map((c) => (c.productId === productId ? { ...c, qty } : c)),
      })),

    removeFromCart: (productId) =>
      setState((s) => ({ ...s, cart: s.cart.filter((c) => c.productId !== productId) })),

    clearCart: () => setState((s) => ({ ...s, cart: [] })),

    placeOrder: (address) => {
      if (!state.user) return null;
      const items = state.cart.map((c) => {
        const p = state.products.find((x) => x.id === c.productId)!;
        return { productId: p.id, qty: c.qty, price: p.price, name: p.name, image: p.image };
      });
      if (items.length === 0) return null;
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const shipping = subtotal > 200 ? 0 : 12;
      const order: Order = {
        id: crypto.randomUUID(),
        userId: state.user.id,
        items,
        subtotal,
        shipping,
        total: subtotal + shipping,
        address,
        createdAt: Date.now(),
        status: "Pending",
      };
      setState((s) => ({ ...s, orders: [order, ...s.orders], cart: [] }));
      return order;
    },

    updateOrderStatus: (orderId, status) =>
      setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)) })),

    upsertProduct: (product) =>
      setState((s) => ({
        ...s,
        products: s.products.some((p) => p.id === product.id)
          ? s.products.map((p) => (p.id === product.id ? product : p))
          : [product, ...s.products],
      })),

    deleteProduct: (id) => setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) })),
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}