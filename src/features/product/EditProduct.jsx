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


// ""// src/pages/EditProduct.jsx
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Loader } from "lucide-react";
// import {
//   fetchProductDetails,
//   updateProductPricing,
// } from "../../services/product";

// export default function EditProduct() {
//   const { id } = useParams();
//   const [pricingData, setPricingData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [actorType, setActorType] = useState("professional");
//   const [selections, setSelections] = useState([]);

//   const [saveMessage, setSaveMessage] = useState("");
//   const [editedPrice, setEditedPrice] = useState(null);
//   const [editedAdditionalCost, setEditedAdditionalCost] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);

//   // Keep this function to update selections
//   const handleSelection = (level, value) => {
//     const newSelections = [...selections.slice(0, level), value];
//     setSelections(newSelections);
//     setEditedPrice(null);
//     setEditedAdditionalCost(null);
//   };



//   useEffect(() => {
//     const fetchPricing = async () => {
//       try {
//         const data = await fetchProductDetails(id);
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



//   const getCurrentTree = () => {
//     let current = pricingData?.pricing?.[actorType];
//     if (!current) return null;

//     for (const key of selections) {
//       if (!current || typeof current !== "object") break;
//       current = current[key];
//     }
//     return current;
//   };

//   const handlePriceChange = (field, value) => {
//     if (!value || isNaN(value)) return;
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
//     setSaveMessage("");

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
//       await updateProductPricing(id, updatedPricing.pricing);
//       setPricingData(updatedPricing);
//       setSaveMessage("Prix mis à jour avec succès!");
//     } catch (error) {
//       console.error("Erreur de mise à jour :", error);
//       setSaveMessage("Erreur lors de la mise à jour");
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

//   const [parameterKeys] = useState(["paper", "format", "color"]);




//   // ---------------------------
//   const renderDynamicSelectors = () => {
//     const selectors = [];
//     let current = pricingData?.pricing?.[actorType];
//     let level = 0;

//     while (
//       current &&
//       typeof current === "object" &&
//       !Array.isArray(current) &&
//       Object.keys(current).length > 0
//     ) {
//       const keys = Object.keys(current).filter(
//         (key) => key !== "price" && key !== "additional_cost"
//       );

//       if (keys.length === 0) break;

//       const paramKeys = keys.filter((key) => parameterKeys.includes(key));
//       const otherKeys = keys.filter((key) => !parameterKeys.includes(key));
//       const selectedKey = selections[level] || "";

//       if (paramKeys.length > 0) {
//         paramKeys.forEach((paramKey) => {
//           const options = Object.keys(current[paramKey] || {});
//           selectors.push(
//             <div key={`${level}-${paramKey}`} className="mb-4">
//               <label className="block mb-1 font-semibold text-sm text-gray-700">
//                 {paramKey} :
//               </label>
//               <select
//                 value={selections[level] || ""}
//                 onChange={(e) => handleSelection(level, e.target.value)}
//                 className="w-full border p-2 rounded-lg"
//               >
//                 <option value="" disabled>
//                   -- Sélectionner {paramKey} --
//                 </option>
//                 {options.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           );

//           current = current[paramKey][selections[level]] || null;
//           level++;
//         });
//       } else if (otherKeys.length > 1) {
//         selectors.push(
//           <div key={`group-${level}`} className="mb-4">
//             <label className="block mb-1 font-semibold text-sm text-gray-700">
//               Sélectionner une option (groupe) :
//             </label>
//             <select
//               value={selectedKey}
//               onChange={(e) => handleSelection(level, e.target.value)}
//               className="w-full border p-2 rounded-lg bg-blue-50"
//             >
//               <option value="" disabled>
//                 -- Sélectionner une option --
//               </option>
//               {otherKeys.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
//         );

//         if (!selectedKey || !current[selectedKey]) break;
//         current = current[selectedKey];
//         level++;
//       } else if (otherKeys.length === 1) {
//         const onlyKey = otherKeys[0];
//         const options = Object.keys(current[onlyKey]);

//         selectors.push(
//           <div key={`${level}-${onlyKey}`} className="mb-4">
//             <label className="block mb-1 font-semibold text-sm text-gray-700">
//               {onlyKey} :
//             </label>
//             <select
//               value={selections[level] || ""}
//               onChange={(e) => handleSelection(level, e.target.value)}
//               className="w-full border p-2 rounded-lg"
//             >
//               <option value="" disabled>
//                 -- Sélectionner {onlyKey} --
//               </option>
//               {options.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>
//         );

//         if (!selections[level] || !current[onlyKey][selections[level]]) break;
//         current = current[onlyKey][selections[level]];
//         level++;
//       } else {
//         break;
//       }
//     }

//     // Display current price if found at the final node
//     if (
//       current &&
//       typeof current === "object" &&
//       ("price" in current || "additional_cost" in current)
//     ) {
//       const price = current.price || {};
//       selectors.push(
//         <div key="price-display" className="mt-4 p-4 border rounded bg-green-50">
//           <p className="font-semibold text-gray-800">Prix actuel :</p>
//           {"base" in price && <p>Base : {price.base} DA</p>}
//           {"bulk" in price && <p>Bulk : {price.bulk} DA</p>}
//           {"thresholds" in price && <p>Seuil : {price.thresholds}</p>}
//           {"additional_cost" in current && (
//             <p>Coût additionnel : {current.additional_cost} DA</p>
//           )}
//         </div>
//       );
//     }


//     return selectors;
//   };

//   // ------------------------------------------------------

//   const finalNode = getCurrentTree();
//   const hasPrice =
//     finalNode &&
//     typeof finalNode === "object" &&
//     ("price" in finalNode || "additional_cost" in finalNode);

//   useEffect(() => {
//     // Reset states first
//     setEditedPrice(null);
//     setEditedAdditionalCost(null);
//     setSaveMessage("");

//     // Then set new values if they exist
//     if (finalNode && typeof finalNode === "object") {
//       if ("price" in finalNode) {
//         const price = finalNode.price;
//         setEditedPrice({
//           base: parseFloat(price.base) || 0,
//           bulk: parseFloat(price.bulk) || 0,
//           thresholds: parseFloat(price.thresholds) || 0
//         });
//       }
//       if ("additional_cost" in finalNode) {
//         const additionalCost = finalNode.additional_cost;
//         setEditedAdditionalCost(
//           typeof additionalCost === "object" 
//             ? additionalCost 
//             : { base: parseFloat(additionalCost) || 0 }
//         );
//       }
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
//           className={`px-4 py-2 rounded-lg border ${actorType === "professional"
//             ? "bg-blue-600 text-white"
//             : "bg-white text-blue-600 border-blue-600"
//             }`}
//         >
//           Professionnel
//         </button>

//         <button
//           onClick={() => {
//             setActorType("sous-traitant");
//             setSelections([]);
//           }}
//           className={`px-4 py-2 rounded-lg border ${actorType === "sous-traitant"
//             ? "bg-green-600 text-white"
//             : "bg-white text-green-600 border-green-600"
//             }`}
//         >
//           Sous-traitant
//         </button>
//       </div>

//       {renderDynamicSelectors()}

//       {hasPrice && (
//         <div className="mt-6 p-4 border rounded-xl bg-green-50 space-y-4">
//           <h2 className="text-lg font-bold text-green-800 mb-2">
//             Modifier les coûts :
//           </h2>

//           {editedPrice && (
//             <div className="space-y-2 text-green-800">
//               <h3 className="font-semibold">Prix de base :</h3>
//               <div>
//                 <label className="block text-sm">Base (DA):</label>
//                 <input
//                   type="number"
//                   value={editedPrice.base}
//                   onChange={(e) =>
//                     handlePriceChange("base", parseFloat(e.target.value))
//                   }
//                   className="w-full p-2 rounded border"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm">Bulk (DA):</label>
//                 <input
//                   type="number"
//                   value={editedPrice.bulk}
//                   onChange={(e) =>
//                     handlePriceChange("bulk", parseFloat(e.target.value))
//                   }
//                   className="w-full p-2 rounded border"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm">Thresholds:</label>
//                 <input
//                   type="number"
//                   value={editedPrice.thresholds}
//                   onChange={(e) =>
//                     handlePriceChange("thresholds", parseFloat(e.target.value))
//                   }
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

//           {saveMessage && (
//             <div className="text-green-700 mt-2 font-semibold">{saveMessage}</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { fetchProductDetails, updateProductPricing } from "../../services/product";

export default function EditProduct() {
  const { id = "1" } = useParams();
  const [pricingData, setPricingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actorType, setActorType] = useState("professional");
  const [path, setPath] = useState([]); // [{ paramKey, optionValue }, ...]
  const [editedPrice, setEditedPrice] = useState(null);
  const [editedAdditionalCost, setEditedAdditionalCost] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Load pricing
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProductDetails(id);
        setPricingData(data);
      } catch (err) {
        console.error("Erreur fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  // Build deep default path when data or actor changes
  useEffect(() => {
    if (!pricingData?.pricing?.[actorType]) return;
    const tree = pricingData.pricing[actorType];
    const deepPath = buildDeepDefaultPath(tree);
    setPath(deepPath);
  }, [pricingData, actorType]);

  // Compute merged price & additional_cost
  useEffect(() => {
    if (!pricingData?.pricing?.[actorType]) {
      setEditedPrice(null);
      setEditedAdditionalCost(null);
      return;
    }

    const { mergedPrice, mergedAdditional } = computeMergedValuesForPath(
      pricingData.pricing[actorType],
      path
    );

    setEditedPrice(Object.keys(mergedPrice).length > 0 ? mergedPrice : null);
    setEditedAdditionalCost(
      Object.keys(mergedAdditional).length > 0 ? mergedAdditional : null
    );
    setSaveMessage("");
  }, [path, pricingData, actorType]);

  // ---------- Helper functions ----------

  const buildDeepDefaultPath = (subtree) => {
    const res = [];
    let current = subtree;

    while (current && typeof current === "object") {
      const paramKeys = Object.keys(current).filter(
        (k) => k !== "price" && k !== "additional_cost"
      );
      if (!paramKeys.length) break;

      const paramKey = paramKeys[0];
      const options = Object.keys(current[paramKey] || {});
      if (!options.length) break;

      const firstOption = options[0];
      res.push({ paramKey, optionValue: firstOption });
      current = current[paramKey]?.[firstOption];
    }

    return res;
  };

  const computeMergedValuesForPath = (rootSubtree, pathArr) => {
    const mergedPrice = {};
    const mergedAdditional = {};
    let node = rootSubtree;

    // Merge root price/additional_cost
    if (node?.price) Object.assign(mergedPrice, node.price);
    if (node?.price?.additional_cost !== undefined) {
      if (typeof node.price.additional_cost === "object") {
        Object.assign(mergedAdditional, node.price.additional_cost);
      } else {
        mergedAdditional.default = node.price.additional_cost;
      }
    }
    if (node?.additional_cost !== undefined) {
      if (typeof node.additional_cost === "object") {
        Object.assign(mergedAdditional, node.additional_cost);
      } else {
        mergedAdditional.default = node.additional_cost;
      }
    }

    // Merge along path
    for (const step of pathArr) {
      if (!node || typeof node !== "object") break;
      node = node[step.paramKey]?.[step.optionValue];
      if (!node || typeof node !== "object") break;

      if (node.price) Object.assign(mergedPrice, node.price);
      if (node.price?.additional_cost !== undefined) {
        if (typeof node.price.additional_cost === "object") {
          Object.assign(mergedAdditional, node.price.additional_cost);
        } else {
          mergedAdditional.default = node.price.additional_cost;
        }
      }
      if (node.additional_cost !== undefined) {
        if (typeof node.additional_cost === "object") {
          Object.assign(mergedAdditional, node.additional_cost);
        } else {
          mergedAdditional.default = node.additional_cost;
        }
      }
    }

    return { mergedPrice, mergedAdditional };
  };

  const handleOptionChange = (levelIndex, newOptionValue) => {
    const newPath = path.slice(0, levelIndex);
    const paramKey = path[levelIndex].paramKey;
    newPath.push({ paramKey, optionValue: newOptionValue });

    // Auto-fill children
    let subtree = pricingData.pricing[actorType];
    for (let i = 0; i <= levelIndex; i++) {
      const s = newPath[i];
      if (!subtree || typeof subtree !== "object") {
        subtree = null;
        break;
      }
      subtree = subtree[s.paramKey]?.[s.optionValue];
    }

    const children = subtree ? buildDeepDefaultPath(subtree) : [];
    setPath([...newPath, ...children]);
  };

const handleSave = async () => {
  if (!editedPrice && !editedAdditionalCost) return;

  setIsSaving(true);
  setSaveMessage("");

  try {
    // Deep clone pricing
    const newPricing = JSON.parse(JSON.stringify(pricingData.pricing));
    let node = newPricing[actorType];
    const nodesAlongPath = [node]; // Keep track of all nodes

    for (const step of path) {
      if (!node || typeof node !== "object") throw new Error("Invalid path");
      node = node[step.paramKey][step.optionValue];
      nodesAlongPath.push(node);
    }

    if (!node) throw new Error("No node found for current path");

    // Clean editedPrice
    const cleanedPrice = {};
    if (editedPrice) {
      if (editedPrice.base != null && editedPrice.base !== "") cleanedPrice.base = Number(editedPrice.base);
      if (editedPrice.bulk != null && editedPrice.bulk !== "") cleanedPrice.bulk = Number(editedPrice.bulk);
      if (editedPrice.thresholds != null && editedPrice.thresholds !== "") cleanedPrice.thresholds = Number(editedPrice.thresholds);
    }

    const cleanedAdditional = {};
    if (editedAdditionalCost) {
      for (const [k, v] of Object.entries(editedAdditionalCost)) {
        if (v != null && v !== "") cleanedAdditional[k] = Number(v);
      }
    }

    // ---------- Propagation logic ----------

    // 1️ Update node price
    if (Object.keys(cleanedPrice).length > 0) {
      node.price = { ...(node.price || {}), ...cleanedPrice };
    } else {
      delete node.price;
    }

    // 2 Forward propagation: if node has finition.none, update it too
    if (node.finition?.none) {
      node.finition.none.price = { ...(node.finition.none.price || {}), ...node.price };
    }

    // 3️ Reverse propagation: if node is a finition.none node, update parent price
    const parentNode = nodesAlongPath[nodesAlongPath.length - 2]; // parent of current node
    if (parentNode && parentNode.price && path.length > 0) {
      const lastStep = path[path.length - 1];
      if (parentNode[lastStep.paramKey]?.[lastStep.optionValue] === node) {
        parentNode.price = { ...(parentNode.price || {}), ...node.price };
      }
    }

    // 4️ Update API
    await updateProductPricing(id, newPricing);

    // 5️ Update local state
    setPricingData((prev) => ({ ...prev, pricing: newPricing }));
    setSaveMessage(" Prix mis à jour avec succès !");
  } catch (err) {
    console.error("Erreur save:", err);
    setSaveMessage(" Erreur lors de la mise à jour");
  } finally {
    setIsSaving(false);
  }
};



  // ---------- Render helpers ----------

  const renderSelectors = () => {
    if (!pricingData?.pricing?.[actorType]) return null;
    const selectors = [];
    let current = pricingData.pricing[actorType];

    for (let i = 0; i < path.length; i++) {
      const step = path[i];
      const optionsObj = current?.[step.paramKey] || {};
      const options = Object.keys(optionsObj);

      selectors.push(
        <div key={i} className="mb-4">
          <label className="block mb-1 font-semibold text-sm text-textMain">
            {step.paramKey} :
          </label>
          <select
            value={step.optionValue}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-pimary"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

      current = current?.[step.paramKey]?.[step.optionValue];
      if (!current || typeof current !== "object") break;
    }

    return selectors;
  };

 const renderPriceEditor = () => {
  if (!editedPrice && !editedAdditionalCost) return null;

  return (
    <div className="mt-6 p-6  space-y-4">
      <h2 className="text-lg font-bold mb-4" style={{ color: "var(--primary)" }}>
        Modifier les prix :
      </h2>

      {editedPrice && (
        <div className="space-y-3">
          {["base", "bulk", "thresholds"].map((key) => (
            <div key={key}>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--textMain)" }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} (DA):
              </label>
              <input
                type="number"
                value={editedPrice[key] ?? ""}
                onChange={(e) =>
                  setEditedPrice((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="w-full p-2 rounded"
                style={{
                  border: "1px solid #ccc",
                  color: "var(--textMain)",
                  backgroundColor: "var(--primBg)",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {editedAdditionalCost && (
        <div className="mt-4 space-y-3">
          <h3 className="font-semibold mb-2" style={{ color: "var(--primary)" }}>
            Coûts additionnels :
          </h3>
          {Object.entries(editedAdditionalCost).map(([key, val]) => (
            <div key={key} className="flex items-center gap-3">
              <div className="flex-1">
                <label
                  className="block text-sm capitalize"
                  style={{ color: "var(--textMain)" }}
                >
                  {key} (DA):
                </label>
                <input
                  type="number"
                  value={val}
                  onChange={(e) =>
                    setEditedAdditionalCost((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="w-full p-2 rounded"
                  style={{
                    border: "1px solid #ccc",
                    color: "var(--textMain)",
                    backgroundColor: "var(--primBg)",
                  }}
                />
              </div>
            
            </div>
          ))}

         
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-4 px-6 py-2 rounded-lg text-[var(--primBg)] font-medium "
        style={{ backgroundColor: "var(--primary)" }}
      >
        {isSaving ? "Enregistrement..." : "Enregistrer"}
      </button>

      {saveMessage && (
        <div
          className="mt-2 font-semibold"
          style={{
            color: saveMessage.includes("succès") ? "#38a169" : "#e53e3e",
          }}
        >
          {saveMessage}
        </div>
      )}
    </div>
  );
};
  // ---------- UI ----------

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
    <div className="p-6 max-w-4xl mx-auto ">
  <h1 className="text-3xl font-bold mb-6" style={{ color: "var(--primary)" }}>
    Modifier un produit
  </h1>
  <p className="text-sm mb-4" style={{ color: "var(--textMain)" }}>
    {pricingData.service_name}
  </p>

  <div className="mb-6 flex gap-4">
    <button
      onClick={() => {
        setActorType("professional");
        setPath([]);
      }}
      className={`px-6 py-2 rounded-lg font-medium transition ${
        actorType === "professional"
          ? "bg-primary text-lightBlue"
          : "bg-lightBlue text-primary hover:bg-lightBlue"
      }`}
      style={{ color: actorType === "professional" ? "var(--lightBlue)" : "var(--primary)" }}
    >
      Professionnel
    </button>

    <button
      onClick={() => {
        setActorType("sous-traitant");
        setPath([]);
      }}
      className={`px-6 py-2 rounded-lg font-medium transition ${
        actorType === "sous-traitant"
          ? "bg-primary text-lightBlue"
          : "bg-lightBlue text-primary hover:bg-lightBlue"
      }`}
      style={{ color: actorType === "sous-traitant" ? "var(--lightBlue)" : "var(--primary)" }}
    >
      Sous-traitant
    </button>
  </div>

  {/* Selector container */}
  <div className=" p-6 rounded-lg ">
    <div className="grid grid-cols-2 gap-4">{renderSelectors()}</div>
  </div>

  {/* Price editor */}
  <div className="mt-6 ">
    {renderPriceEditor()}
  </div>
</div>

  );
}
