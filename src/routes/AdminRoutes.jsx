import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AdminLayout from "../layout/AdminLayout";
import EditProduct from "../features/product/EditProduct";
import ProductsTable from "../features/product/ProductsTable";
import SousTraitantsTable from "../features/client/SousTraitantsTable";
import SousTraitantDetails from "../features/client/SousTraitantDetails";
import OrderDetails from "../pages/OrderDetails";
import ClientStatsPage from "../pages/ClientStatsPage";
import AuthPage from "../pages/AuthPage";
import Orders from "../features/orders/Orders";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* 🛠️ Admin Area */}
      <Route path="/admin" element={<AdminLayout />}>

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard type="main" />} />
        <Route path="dashboard/large-format" element={<Dashboard type="large" />} />
        <Route path="dashboard/small-format" element={<Dashboard type="small" />} />
        <Route path="dashboard/Main" element={<Dashboard type="main" />} />  

      
        
        

        {/* Clients */}
        <Route path="clients/statistics" element={<ClientStatsPage />} />
        <Route path="clients" element={<ClientStatsPage />} />
        <Route path="clients/subcontractors" element={<SousTraitantsTable />} />
        <Route path="clients/subcontractors/:id" element={<SousTraitantDetails />} />

        {/* Products */}
        <Route path="products" element={<ProductsTable />} />
        <Route path="products/:id/edit" element={<EditProduct />} />

        {/* Orders */}
        <Route path="orders/" element={ <Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
      </Route>

      {/* Auth / Profile */}
      <Route path="/profile/auth" element={<AuthPage />} />

      {/* Default redirection */}
      <Route path="*" element={<Navigate to="/profile/auth" replace />} />
    </Routes>
  );
}
