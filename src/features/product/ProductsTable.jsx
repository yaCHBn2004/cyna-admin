import { useState } from 'react';
import React from 'react';
import { Search, ChevronDown, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('Petit format');
  const [expandedRow, setExpandedRow] = useState(null); // NEW: track which row is expanded

  const productsData = [
    { id: 1, name: 'Cartes de visite', price: '10/08 DZD', status: 'Actif' },
    { id: 2, name: 'Flyers', price: '10/08 DZD', status: 'Actif' },
    { id: 3, name: 'Affiches', price: '10/08 DZD', status: 'Actif' },
    { id: 4, name: 'Brochures', price: '10/08 DZD', status: 'Actif' },
    { id: 5, name: 'Autocollants', price: '10/08 DZD', status: 'Actif' },
  ];

  const filtered = productsData.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (format) => { setSelectedFormat(format); setIsOpen(false); };
  const formatOptions = ['Petit format', 'Grand format'];

  return (
    <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 w-full">
      <div className="w-full">
        <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold pb-6">Produits</h1>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div className="flex gap-2 w-full">
            <div className="relative flex-2/3 bg-lightBlue rounded-xl text-gray-500">
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des produits"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-7 pr-3 py-3 rounded-md text-sm w-full"
              />
            </div>

            {/* Format dropdown */}
            <div className="relative flex-1/3">
              <button
                onClick={toggleDropdown}
                className="flex justify-between items-center w-full bg-lightBlue rounded-xl text-gray-800 py-3 px-3 text-sm"
              >
                {selectedFormat}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={16} />
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
                    {formatOptions.map(option => (
                      <li
                        key={option}
                        onClick={() => handleSelect(option)}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-[var(--lightAccent)] rounded-xl hover:text-[var(--special)] ${
                          selectedFormat === option ? 'hover:bg-lightAccent' : ''
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
        <div className="border rounded-lg overflow-x-auto border-[var(--secondary)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="py-3 px-3 text-left">Produit</th>
                {/* hide price & status on very small screens */}
                <th className="py-3 px-3 hidden sm:table-cell">Prix</th>
                <th className="py-3 px-3 hidden md:table-cell">Statut</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <React.Fragment key={product.id}>
                  <tr className="border-t-2 border-gray-50">
                    <td className="py-5 px-3 text-left">{product.name}</td>

                    {/* hidden on small screens */}
                    <td className="py-5 px-3 hidden sm:table-cell">{product.price}</td>
                    <td className="py-5 px-3 hidden md:table-cell">
                      <span className="px-4 py-1 text-xs rounded-full bg-gray-100 text-textMain">{product.status}</span>
                    </td>
                    <td className="py-5 px-3 flex items-center gap-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="text-primary hover:underline text-xs"
                      >
                        Modifier
                      </Link>
                      {/* more button: visible on small screens */}
                      <button onClick={() => setExpandedRow(expandedRow === product.id ? null : product.id)}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row content: only shows when clicked */}
                  <AnimatePresence>
                    {expandedRow === product.id && (
                      <motion.tr
                        className="border-t bg-gray-50 md:hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td colSpan="4" className="px-3 py-2">
                          <div className="flex flex-col gap-1 text-xs text-gray-700">
                            <div><span className="font-semibold">Prix:</span> {product.price}</div>
                            <div><span className="font-semibold">Statut:</span> {product.status}</div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4 text-sm">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-2 py-1 rounded ${
                page === num ? 'bg-primary text-white' : 'border text-gray-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
