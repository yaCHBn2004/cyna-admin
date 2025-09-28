import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPendingSousTraitants } from "../../services/client";

export default function SousTraitantsTable() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Newest");

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (filter) => {
    setSelectedFilter(filter);
    setIsOpen(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchPendingSousTraitants(page, 10);
    setUsers(data.users || []);
    setPagination(data.pagination || { current_page: 1, last_page: 1 });
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const filtered = users.filter((s) =>
    s.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 w-full">
      <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold pb-6">
        Sous Traitant
      </h1>

      {/* Header: search + filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex gap-2 w-full">
          <div className="relative flex-2/3 bg-lightBlue rounded-xl text-gray-500">
            <Search
              size={16}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Sous Traitant"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 pr-3 py-3 rounded-md text-sm w-full"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative flex-1/3">
            <button
              onClick={toggleDropdown}
              className="flex justify-between items-center w-full bg-lightBlue rounded-xl text-gray-800 py-3 px-3 text-sm"
            >
              Filter: {selectedFilter}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="ml-1" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.ul
                  className="absolute left-0 right-0 mt-2 bg-lightBlue rounded-xl z-10"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {[
                    "Newest",
                    "Oldest",
                    "Status: Active",
                    "Status: Refused",
                  ].map((option) => (
                    <li
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-[var(--lightAccent)] rounded-xl hover:text-[var(--special)] ${
                        selectedFilter === option ? "hover:bg-lightAccent" : ""
                      }`}
                    >
                      {option}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Table */}
      {/* Table */}
      <div className="border rounded-lg overflow-x-auto border-[var(--secondary)]">
        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-10 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="py-3 px-3 text-left">Name</th>
                <th className="py-3 px-3 text-left">Location</th>
                <th className="py-3 px-3 text-left">Status</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((s) => (
                  <tr key={s.id} className="border-t-2 border-gray-50">
                    <td className="py-5 px-3 text-left">{s.full_name}</td>
                    <td className="py-5 px-3 text-left">{s.address || "-"}</td>
                    <td className="py-5 px-3 text-left">
                      <span className="px-4 py-1 text-xs rounded-full bg-gray-100 text-textMain">
                        {s.approval_status || "Pending"}
                      </span>
                    </td>
                    <td className="py-5 px-3">
                      <Link
                        to={`/admin/clients/subcontractors/${s.id}`}
                        className="text-primary hover:underline text-xs"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-5 px-3 text-center text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4 text-sm">
        {Array.from({ length: pagination.last_page || 1 }, (_, i) => i + 1).map(
          (num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-2 py-1 rounded ${
                page === num ? "bg-primary text-white" : "border text-gray-700"
              }`}
            >
              {num}
            </button>
          )
        )}
      </div>
    </main>
  );
}
