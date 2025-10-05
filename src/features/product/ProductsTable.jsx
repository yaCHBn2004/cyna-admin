import { useState, useEffect } from "react";
import { Search, ChevronDown, Loader2, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ProductsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("Petit format");
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatOptions = ["Petit format", "Grand format"];

  // Fetch data
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://server.cyna.dz/api/v1/services?is_detailed=false"
        );
        if (!response.ok)
          throw new Error("Erreur lors du chargement des services");
        const data = await response.json();
        setProductsData(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (format) => {
    setSelectedFormat(format);
    setIsOpen(false);
  };

  // Filter logic
  const filtered = productsData.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFormat =
      selectedFormat === "Petit format" ? p.type === "small" : p.type === "large";
    return matchesSearch && matchesFormat;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Chargement des produits...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 py-10">⚠️ Erreur: {error}</div>
    );

  return (
    <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 w-full">
      {/* Title */}
      <h1 className="text-3xl xl:text-4xl font-bold text-primary">
        Edit Products
      </h1>

      {/* Search + Type filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex gap-2 w-full">
          {/* Search */}
          <div className="relative flex-1 bg-lightBlue rounded-xl text-gray-500">
            <Search
              size={16}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Rechercher des produits"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 pr-3 py-3 rounded-md text-sm w-full bg-lightBlue focus:outline-none"
            />
          </div>

          {/* Type dropdown */}
          <div className="relative w-44">
            <button
              onClick={toggleDropdown}
              className="flex justify-between items-center w-full bg-lightBlue rounded-xl text-gray-800 py-3 px-3 text-sm"
            >
              {selectedFormat}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
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
                  {formatOptions.map((option) => (
                    <li
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-[var(--lightAccent)] rounded-xl hover:text-[var(--special)] ${
                        selectedFormat === option ? "bg-lightAccent" : ""
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

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 mt-4">
        {filtered.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
            className="cursor-pointer  shadow-md rounded-2xl overflow-hidden border hover:shadow-lg transition"
          >
            <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <ImageOff className="text-gray-400 w-10 h-10" />
              )}
            </div>

            <div className="p-3 text-center">
              <h2 className=" !text-xl  text-textMain truncate">
                {product.name}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          Aucun produit trouvé.
        </p>
      )}

     
    </main>
  );
}
