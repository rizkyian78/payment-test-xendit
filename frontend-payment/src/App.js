// App.js
import * as React from "react";
import { Routes, Route, Link, BrowserRouter, useParams } from "react-router-dom";
import axios from 'axios'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Payment />} />
        <Route path="/:id/success" element={<Success />} />
      </Routes>
  );
}

function Payment() {
  const [payment, setPayment] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [city, setCity] = React.useState("")
  const [area, setArea] = React.useState("")

  const onSubmit = () => {
    const data = {
      price: 2500,
      payment_method: payment,
      phone: phone,
      area: city,
      city: area
    }
    axios.post("http://127.0.0.1:8000/payment", data).then(res => {
      if(res.status === 200 && payment === "ID_LINKAJA") {
        console.log(res.data)
        window.location.replace(res.data.response.actions.mobile_web_checkout_url)
      }
      if(res.status === 200 && payment === "ID_SHOPEEPAY") {
        console.log(res.data)
        window.location.replace(res.data.response.actions.mobile_deeplink_checkout_url)
      }
      if(res.status === 200 && payment === "ID_OVO") {
        console.log(res.data)
        window.location.replace(res.data.response.channel_properties.success_redirect_url)
      }
    })
  }
  const onSubmitTransfer = () => {
    const data = {
      price: 2500,
      payment_method: payment,
      phone: phone,
      area: city,
      city: area
    }
    axios.post("http://127.0.0.1:8000/invoice", data).then(res => {
      window.location.replace(res.data.response.invoice_url)
    })
  }
  return (
    <>
    <img src="https://s3.bukalapak.com/bukalapak-kontenz-production/content_attachments/67893/w-740/92802586_225540215456856_7684868667231593088_n.jpg"/>

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
      Pembayaran: <select onChange={(e) => setPayment(e.target.value)}>
      <option value={"ID_LINKAJA"}>linkaja</option>
      <option value={"ID_OVO"}>ovo</option>
      <option value={"ID_SHOPEEPAY"}>Shopee</option>
      </select>
    </div>
    <div>
      No HP: <input onChange={(e) => setPhone(e.target.value)}/>
    </div>
    <div>
      Area: <input onChange={(e) => setArea(e.target.value)}/>
    </div>
    <div>
      City: <input onChange={(e) => setCity(e.target.value)}/>
    </div>
    <button onClick={() => onSubmit()}>
    Bayar dengan ewallet
    </button>
    <button onClick={() => onSubmitTransfer()}>
    Bayar dengan bank transfer
    </button>
    </>
  );
}

function Success() {
  const params = useParams()
  const [data, setData] = React.useState("")

  return (
    <>
    {params.id} Successfully paid <button onClick={() => {
      const data = {
        trx_id: params.id
      }
       axios.post("http://127.0.0.1:8000/check-payment", data).then(res => {
        console.log(res.data)
        setData(res.data.response)
      })
    }}>Check Status</button>
    <br />
    <br />
    <br />
    <br />
    
    {data && (
      <>
      {data}
      </>
    )}
   
    </>
  )
}

export default App;