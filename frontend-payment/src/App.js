// App.js
import * as React from "react";
import { Routes, Route} from "react-router-dom";
import 'antd/dist/antd.css';
import Success from "./Component/Success";
import Payment from "./Component/Demoshop";
import CustomPage from "./Component/CustomPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Payment />} />
        <Route path="/:id/success" element={<Success />} />
        <Route path="/select-payment/:id" element={<CustomPage />} />
      </Routes>
  );
}


export default App;