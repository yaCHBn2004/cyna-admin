// Dashboard.jsx

import Orders from "../features/orders/Orders";
import Statistics from "../features/orders/Statistics";


export default function Dashboard() {
 



  return (
    <div className=" p-6 flex gap-6 flex-col"> 
      <Statistics/>
      <Orders />
    </div>
  );
}
