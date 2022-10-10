// App.js
import * as React from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import axios from 'axios'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Payment />} />
        <Route path="/success" element={<Success />} />
      </Routes>
  );
}

function Payment() {


  const onSubmit = () => {
    axios.post("http://127.0.0.1:8000/payment").then(res => {
      if(res.status === 200) {
        console.log(res.data.response.callback_url)
        window.location.replace(res.data.response.actions.mobile_web_checkout_url)
      }
    })
  }
  return (
    <>

<div>
      Barang: Sepatu
    </div>
    <div>
      Harga: 25000
    </div>
    <div>
      Currency: IDR
    </div>
    <div>
      Pembayaran: OVO
    </div>
    <div>
      No HP: +628123123123
    </div>
    <div>
      Address: Pluit Jakarta Selatan
    </div>
    <button onClick={() => onSubmit()}>
    Bayar
    </button>
    </>
  );
}

function Success() {
  return (
    <>
    Successfully Pay
    </>
  )
}

export default App;