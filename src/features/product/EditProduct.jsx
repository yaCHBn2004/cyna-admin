// // src/pages/EditProduct.jsx
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { buildApiUrl, getAuthHeaders } from "../../services/config";
// import { Loader } from "lucide-react";

// export default function EditProduct() {
//   const { id } = useParams();
//   const [pricingData, setPricingData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [actorType, setActorType] = useState("professional");
//   const [selections, setSelections] = useState([]);
//   const [editedPrice, setEditedPrice] = useState(null);
//   const [editedAdditionalCost, setEditedAdditionalCost] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     const fetchPricing = async () => {
//       try {
//         const res = await fetch(buildApiUrl(`admin/services/${id}/pricing`), {
//           headers: getAuthHeaders(),
//         });
//         if (!res.ok) throw new Error("Failed to fetch pricing data");

//         const data = await res.json();
//         setPricingData(data);

//         const tree = data?.pricing?.[actorType];
//         if (tree) {
//           const paramPath = getParameterPathFromPricingTree(tree);
//           console.log("🧩 Paramètres hiérarchiques détectés :", paramPath);
//         }
//       } catch (error) {
//         console.error("Error fetching pricing data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchPricing();
//   }, [id]);

//   const handleSelection = (levelIndex, selectedKey) => {
//     const newSelections = [...selections.slice(0, levelIndex), selectedKey];
//     setSelections(newSelections);
//     setEditedPrice(null);
//     setEditedAdditionalCost(null);
//   };

//   const getCurrentTree = () => {
//     let current = pricingData?.pricing?.[actorType];
//     for (const key of selections) {
//       if (current && typeof current === "object") {
//         current = current[key];
//       }
//     }
//     return current;
//   };

//   const handlePriceChange = (field, value) => {
//     setEditedPrice((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const updatePriceInTree = (tree, selections, newPrice, additionalCost) => {
//     const updated = { ...tree };
//     let current = updated;

//     for (let i = 0; i < selections.length - 1; i++) {
//       const key = selections[i];
//       current[key] = { ...current[key] };
//       current = current[key];
//     }

//     const lastKey = selections[selections.length - 1];
//     current[lastKey] = {
//       ...current[lastKey],
//       ...(newPrice ? { price: newPrice } : {}),
//       ...(additionalCost ? { additional_cost: additionalCost } : {}),
//     };

//     return updated;
//   };

//   const handleSave = async () => {
//     if (!editedPrice && !editedAdditionalCost) return;

//     setIsSaving(true);
//     const updatedPricing = {
//       ...pricingData,
//       pricing: {
//         ...pricingData.pricing,
//         [actorType]: updatePriceInTree(
//           pricingData.pricing[actorType],
//           selections,
//           editedPrice,
//           editedAdditionalCost
//         ),
//       },
//     };

//     try {
//       const res = await fetch(buildApiUrl(`admin/services/${id}/pricing`), {
//         method: "PUT",
//         headers: {
//           ...getAuthHeaders(),
//           "Content-Type": "application/json",
//           "lang_code": "fr",
//         },
//         body: JSON.stringify({
//           pricing: updatedPricing.pricing,
//         }),
//       });

//       if (!res.ok) throw new Error("Échec de la mise à jour");

//       alert("Prix mis à jour avec succès !");
//       setPricingData(updatedPricing);
//     } catch (error) {
//       console.error("Erreur de mise à jour :", error);
//       alert("Erreur lors de la mise à jour.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const getParameterPathFromPricingTree = (node) => {
//     const path = [];
//     while (
//       node &&
//       typeof node === "object" &&
//       !Array.isArray(node) &&
//       !("price" in node) &&
//       !("additional_cost" in node)
//     ) {
//       const keys = Object.keys(node);
//       if (keys.length === 0) break;
//       const paramKey = keys[0];
//       path.push(paramKey);
//       const firstValueKey = Object.keys(node[paramKey])[0];
//       node = node[paramKey][firstValueKey];
//     }
//     return path;
//   };

//   const renderDynamicSelectors = () => {
//     const selectors = [];
//     let current = pricingData?.pricing?.[actorType];
//     let level = 0;

//     while (
//       current &&
//       typeof current === "object" &&
//       !Array.isArray(current) &&
//       Object.keys(current).length > 0 &&
//       !("price" in current && Object.keys(current).length === 1)
//     ) {
//       const keys = Object.keys(current);
//       const keysToUse = keys.filter((key) => key !== "price" && key !== "additional_cost");
//       if (keysToUse.length === 0) break;

//       const selectedKey = selections[level] || "";

//       selectors.push(
//         <div key={level} className="mb-4">
//           <label className="block mb-1 font-semibold text-sm text-gray-700">
//             Choisissez une option:
//           </label>
//           <select
//             value={selectedKey}
//             onChange={(e) => handleSelection(level, e.target.value)}
//             className="w-full border p-2 rounded-lg"
//           >
//             <option value="" disabled>
//               -- Sélectionner --
//             </option>
//             {keysToUse.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         </div>
//       );

//       if (!selectedKey || !current[selectedKey]) break;
//       current = current[selectedKey];
//       level++;
//     }

//     return selectors;
//   };

//   const finalNode = getCurrentTree();
//   const hasPrice =
//     finalNode &&
//     typeof finalNode === "object" &&
//     ("price" in finalNode || "additional_cost" in finalNode);

//   useEffect(() => {
//     if (finalNode && typeof finalNode === "object") {
//       if ("price" in finalNode) setEditedPrice(finalNode.price);
//       if ("additional_cost" in finalNode) setEditedAdditionalCost(finalNode.additional_cost);
//     }
//   }, [finalNode]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <Loader className="animate-spin w-8 h-8 text-gray-500" />
//         <span className="ml-2 text-gray-500">Chargement...</span>
//       </div>
//     );
//   }

//   if (!pricingData) {
//     return (
//       <div className="text-center text-red-600 mt-10">
//         Impossible de charger les données du service.
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Modifier un produit</h1>

//       <div className="mb-6 flex gap-4">
//         <button
//           onClick={() => {
//             setActorType("professional");
//             setSelections([]);
//           }}
//           className={`px-4 py-2 rounded-lg border ${
//             actorType === "professional"
//               ? "bg-blue-600 text-white"
//               : "bg-white text-blue-600 border-blue-600"
//           }`}
//         >
//           Professionnel
//         </button>

//         <button
//           onClick={() => {
//             setActorType("sous-traitant");
//             setSelections([]);
//           }}
//           className={`px-4 py-2 rounded-lg border ${
//             actorType === "sous-traitant"
//               ? "bg-green-600 text-white"
//               : "bg-white text-green-600 border-green-600"
//           }`}
//         >
//           Sous-traitant
//         </button>
//       </div>

//       {renderDynamicSelectors()}

//       {hasPrice && (
//         <div className="mt-6 p-4 border rounded-xl bg-green-50 space-y-4">
//           <h2 className="text-lg font-bold text-green-800 mb-2">Modifier les coûts :</h2>

//           {editedPrice && (
//             <div className="space-y-2 text-green-800">
//               <h3 className="font-semibold">Prix de base :</h3>
//               <div>
//                 <label className="block text-sm">Base (DA):</label>
//                 <input
//                   type="number"
//                   value={editedPrice.base}
//                   onChange={(e) => handlePriceChange("base", parseFloat(e.target.value))}
//                   className="w-full p-2 rounded border"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm">Bulk (DA):</label>
//                 <input
//                   type="number"
//                   value={editedPrice.bulk}
//                   onChange={(e) => handlePriceChange("bulk", parseFloat(e.target.value))}
//                   className="w-full p-2 rounded border"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm">Thresholds:</label>
//                 <input
//                   type="number"
//                   value={editedPrice.thresholds}
//                   onChange={(e) => handlePriceChange("thresholds", parseFloat(e.target.value))}
//                   className="w-full p-2 rounded border"
//                 />
//               </div>
//             </div>
//           )}

//           {editedAdditionalCost && (
//             <div className="space-y-2 text-green-800">
//               <h3 className="font-semibold mt-4">Coût additionnel :</h3>
//               {Object.entries(editedAdditionalCost).map(([key, value]) => (
//                 <div key={key}>
//                   <label className="block text-sm capitalize">{key} (DA):</label>
//                   <input
//                     type="number"
//                     value={value}
//                     onChange={(e) =>
//                       setEditedAdditionalCost((prev) => ({
//                         ...prev,
//                         [key]: parseFloat(e.target.value),
//                       }))
//                     }
//                     className="w-full p-2 rounded border"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//           <button
//             onClick={handleSave}
//             disabled={isSaving}
//             className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             {isSaving ? "Enregistrement..." : "Enregistrer"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


""// src/pages/EditProduct.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import {
  fetchProductDetails,
  updateProductPricing,
} from "../../services/product";

export default function EditProduct() {
  const { id } = useParams();
  const [pricingData, setPricingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actorType, setActorType] = useState("professional");
  const [selections, setSelections] = useState([]);

  const [saveMessage, setSaveMessage] = useState("");
  const [editedPrice, setEditedPrice] = useState(null);
  const [editedAdditionalCost, setEditedAdditionalCost] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Keep this function to update selections
  const handleSelection = (level, value) => {
    const newSelections = [...selections.slice(0, level), value];
    setSelections(newSelections);
    setEditedPrice(null);
    setEditedAdditionalCost(null);
  };



  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await fetchProductDetails(id);
        setPricingData(data);

        const tree = data?.pricing?.[actorType];
        if (tree) {
          const paramPath = getParameterPathFromPricingTree(tree);
          console.log("🧩 Paramètres hiérarchiques détectés :", paramPath);
        }
      } catch (error) {
        console.error("Error fetching pricing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, [id]);



  const getCurrentTree = () => {
    let current = pricingData?.pricing?.[actorType];
    if (!current) return null;

    for (const key of selections) {
      if (!current || typeof current !== "object") break;
      current = current[key];
    }
    return current;
  };

  const handlePriceChange = (field, value) => {
    if (!value || isNaN(value)) return;
    setEditedPrice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };



  const updatePriceInTree = (tree, selections, newPrice, additionalCost) => {
    const updated = { ...tree };
    let current = updated;

    for (let i = 0; i < selections.length - 1; i++) {
      const key = selections[i];
      current[key] = { ...current[key] };
      current = current[key];
    }

    const lastKey = selections[selections.length - 1];
    current[lastKey] = {
      ...current[lastKey],
      ...(newPrice ? { price: newPrice } : {}),
      ...(additionalCost ? { additional_cost: additionalCost } : {}),
    };

    return updated;
  };



  const handleSave = async () => {
    if (!editedPrice && !editedAdditionalCost) return;

    setIsSaving(true);
    setSaveMessage("");

    const updatedPricing = {
      ...pricingData,
      pricing: {
        ...pricingData.pricing,
        [actorType]: updatePriceInTree(
          pricingData.pricing[actorType],
          selections,
          editedPrice,
          editedAdditionalCost
        ),
      },
    };

    try {
      await updateProductPricing(id, updatedPricing.pricing);
      setPricingData(updatedPricing);
      setSaveMessage("Prix mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      setSaveMessage("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };



  const getParameterPathFromPricingTree = (node) => {
    const path = [];
    while (
      node &&
      typeof node === "object" &&
      !Array.isArray(node) &&
      !("price" in node) &&
      !("additional_cost" in node)
    ) {
      const keys = Object.keys(node);
      if (keys.length === 0) break;
      const paramKey = keys[0];
      path.push(paramKey);
      const firstValueKey = Object.keys(node[paramKey])[0];
      node = node[paramKey][firstValueKey];
    }
    return path;
  };

  const [parameterKeys] = useState(["paper", "format", "color"]);




  // ---------------------------
  const renderDynamicSelectors = () => {
    const selectors = [];
    let current = pricingData?.pricing?.[actorType];
    let level = 0;

    while (
      current &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      Object.keys(current).length > 0
    ) {
      const keys = Object.keys(current).filter(
        (key) => key !== "price" && key !== "additional_cost"
      );

      if (keys.length === 0) break;

      const paramKeys = keys.filter((key) => parameterKeys.includes(key));
      const otherKeys = keys.filter((key) => !parameterKeys.includes(key));
      const selectedKey = selections[level] || "";

      if (paramKeys.length > 0) {
        paramKeys.forEach((paramKey) => {
          const options = Object.keys(current[paramKey] || {});
          selectors.push(
            <div key={`${level}-${paramKey}`} className="mb-4">
              <label className="block mb-1 font-semibold text-sm text-gray-700">
                {paramKey} :
              </label>
              <select
                value={selections[level] || ""}
                onChange={(e) => handleSelection(level, e.target.value)}
                className="w-full border p-2 rounded-lg"
              >
                <option value="" disabled>
                  -- Sélectionner {paramKey} --
                </option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );

          current = current[paramKey][selections[level]] || null;
          level++;
        });
      } else if (otherKeys.length > 1) {
        selectors.push(
          <div key={`group-${level}`} className="mb-4">
            <label className="block mb-1 font-semibold text-sm text-gray-700">
              Sélectionner une option (groupe) :
            </label>
            <select
              value={selectedKey}
              onChange={(e) => handleSelection(level, e.target.value)}
              className="w-full border p-2 rounded-lg bg-blue-50"
            >
              <option value="" disabled>
                -- Sélectionner une option --
              </option>
              {otherKeys.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

        if (!selectedKey || !current[selectedKey]) break;
        current = current[selectedKey];
        level++;
      } else if (otherKeys.length === 1) {
        const onlyKey = otherKeys[0];
        const options = Object.keys(current[onlyKey]);

        selectors.push(
          <div key={`${level}-${onlyKey}`} className="mb-4">
            <label className="block mb-1 font-semibold text-sm text-gray-700">
              {onlyKey} :
            </label>
            <select
              value={selections[level] || ""}
              onChange={(e) => handleSelection(level, e.target.value)}
              className="w-full border p-2 rounded-lg"
            >
              <option value="" disabled>
                -- Sélectionner {onlyKey} --
              </option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

        if (!selections[level] || !current[onlyKey][selections[level]]) break;
        current = current[onlyKey][selections[level]];
        level++;
      } else {
        break;
      }
    }

    // Display current price if found at the final node
    if (
      current &&
      typeof current === "object" &&
      ("price" in current || "additional_cost" in current)
    ) {
      const price = current.price || {};
      selectors.push(
        <div key="price-display" className="mt-4 p-4 border rounded bg-green-50">
          <p className="font-semibold text-gray-800">Prix actuel :</p>
          {"base" in price && <p>Base : {price.base} DA</p>}
          {"bulk" in price && <p>Bulk : {price.bulk} DA</p>}
          {"thresholds" in price && <p>Seuil : {price.thresholds}</p>}
          {"additional_cost" in current && (
            <p>Coût additionnel : {current.additional_cost} DA</p>
          )}
        </div>
      );
    }


    return selectors;
  };

  // ------------------------------------------------------

  const finalNode = getCurrentTree();
  const hasPrice =
    finalNode &&
    typeof finalNode === "object" &&
    ("price" in finalNode || "additional_cost" in finalNode);

  useEffect(() => {
    // Reset states first
    setEditedPrice(null);
    setEditedAdditionalCost(null);
    setSaveMessage("");

    // Then set new values if they exist
    if (finalNode && typeof finalNode === "object") {
      if ("price" in finalNode) {
        const price = finalNode.price;
        setEditedPrice({
          base: parseFloat(price.base) || 0,
          bulk: parseFloat(price.bulk) || 0,
          thresholds: parseFloat(price.thresholds) || 0
        });
      }
      if ("additional_cost" in finalNode) {
        const additionalCost = finalNode.additional_cost;
        setEditedAdditionalCost(
          typeof additionalCost === "object" 
            ? additionalCost 
            : { base: parseFloat(additionalCost) || 0 }
        );
      }
    }
  }, [finalNode]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin w-8 h-8 text-gray-500" />
        <span className="ml-2 text-gray-500">Chargement...</span>
      </div>
    );
  }

  if (!pricingData) {
    return (
      <div className="text-center text-red-600 mt-10">
        Impossible de charger les données du service.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Modifier un produit</h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => {
            setActorType("professional");
            setSelections([]);
          }}
          className={`px-4 py-2 rounded-lg border ${actorType === "professional"
            ? "bg-blue-600 text-white"
            : "bg-white text-blue-600 border-blue-600"
            }`}
        >
          Professionnel
        </button>

        <button
          onClick={() => {
            setActorType("sous-traitant");
            setSelections([]);
          }}
          className={`px-4 py-2 rounded-lg border ${actorType === "sous-traitant"
            ? "bg-green-600 text-white"
            : "bg-white text-green-600 border-green-600"
            }`}
        >
          Sous-traitant
        </button>
      </div>

      {renderDynamicSelectors()}

      {hasPrice && (
        <div className="mt-6 p-4 border rounded-xl bg-green-50 space-y-4">
          <h2 className="text-lg font-bold text-green-800 mb-2">
            Modifier les coûts :
          </h2>

          {editedPrice && (
            <div className="space-y-2 text-green-800">
              <h3 className="font-semibold">Prix de base :</h3>
              <div>
                <label className="block text-sm">Base (DA):</label>
                <input
                  type="number"
                  value={editedPrice.base}
                  onChange={(e) =>
                    handlePriceChange("base", parseFloat(e.target.value))
                  }
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label className="block text-sm">Bulk (DA):</label>
                <input
                  type="number"
                  value={editedPrice.bulk}
                  onChange={(e) =>
                    handlePriceChange("bulk", parseFloat(e.target.value))
                  }
                  className="w-full p-2 rounded border"
                />
              </div>
              <div>
                <label className="block text-sm">Thresholds:</label>
                <input
                  type="number"
                  value={editedPrice.thresholds}
                  onChange={(e) =>
                    handlePriceChange("thresholds", parseFloat(e.target.value))
                  }
                  className="w-full p-2 rounded border"
                />
              </div>
            </div>
          )}

          {editedAdditionalCost && (
            <div className="space-y-2 text-green-800">
              <h3 className="font-semibold mt-4">Coût additionnel :</h3>
              {Object.entries(editedAdditionalCost).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm capitalize">{key} (DA):</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setEditedAdditionalCost((prev) => ({
                        ...prev,
                        [key]: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full p-2 rounded border"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>

          {saveMessage && (
            <div className="text-green-700 mt-2 font-semibold">{saveMessage}</div>
          )}
        </div>
      )}
    </div>
  );
}

