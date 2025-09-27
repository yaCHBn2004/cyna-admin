// OrdersContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { fetchOrders as fetchOrdersApi } from "../services/orders";

/* ---------- context skeleton ---------- */
const OrdersContext = createContext({
  orders: [],
  loading: true,
  error: null,
  refresh: () => {},
});

/* ---------- provider ---------- */
export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const apiOrders = await fetchOrdersApi();       // ONE request 🔥
      setOrders(apiOrders);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* fetch once on mount */
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /* expose helpers */
  const value = useMemo(
    () => ({
      orders,
      loading,
      error,
      refresh: loadOrders,
      getOrderById: (id) => orders.find((o) => o.id === Number(id)),
    }),
    [orders, loading, error, loadOrders]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

/* ---------- hook ---------- */
export const useOrders = () => useContext(OrdersContext);
