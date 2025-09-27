// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import { OrdersProvider } from "./context/OrdersContext";
import { SousTraitantsProvider } from "./context/SousTraitantsContext";

function App() {
  return (

      <Router>
        <OrdersProvider>
          <SousTraitantsProvider>
            <AdminRoutes />
          </SousTraitantsProvider>
        </OrdersProvider>
      </Router>
   
  );
}

export default App;
