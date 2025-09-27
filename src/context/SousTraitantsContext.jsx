import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchPendingSousTraitants } from '../services/client';


const SousTraitantsContext = createContext();

export function SousTraitantsProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadSousTraitants = async (pageToLoad = page) => {
    setLoading(true);
    const data = await fetchPendingSousTraitants();
    setUsers(data.users);
    setPagination(data.pagination);
    setLoading(false);
  };

  useEffect(() => {
    loadSousTraitants();
  }, [page]);

  const getUserById = (id) => users.find((u) => u.id === id);

  const updateUserInList = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  return (
    <SousTraitantsContext.Provider
      value={{
        users,
        pagination,
        page,
        setPage,
        loading,
        reload: loadSousTraitants,
        getUserById,
        updateUserInList,
      }}
    >
      {children}
    </SousTraitantsContext.Provider>
  );
}

export function useSousTraitants() {
  return useContext(SousTraitantsContext);
}
