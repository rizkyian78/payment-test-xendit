import * as React from "react";
import {  useNavigate} from "react-router-dom";
import axios from 'axios'
import { Typography } from 'antd';
import 'antd/dist/antd.css';
import { Card } from 'antd';
import logo from '../ndp.png'

const {Meta} = Card

export default function Payment() {
    const [phone, setPhone] = React.useState("")
    const [city, setCity] = React.useState("")
    const [area, setArea] = React.useState("")
    const navigate = useNavigate();
  
    const onSubmitTransfer = () => {
      const data = {
        price: 2500,
        phone: phone,
        area: city,
        city: area,
      }
      axios.post("http://127.0.0.1:8000/invoice", data).then(res => {
        window.location.replace(res.data.response.invoice_url)
      })
    }
  
    const onSubmit = () => {
      const data = {
        price: 2500,
        phone: phone,
        area: city,
        city: area,
        name: "Rizky",
      }
      axios.post("http://127.0.0.1:8000/inquiry", data).then(res => {
        navigate("/select-payment/"+res.data.data.id)
      })
    }
    return (
      <>
      <div style={{
        display: "flex",
        justifyContent: "center"
      }}>
        <img alt="example" src={logo} width={150} height={60} style={{
          marginRight: 50
        }}/>
  <Typography.Title >NDP Shop</Typography.Title>
  
      </div>
  
      <div style={{
        display: "flex",
        justifyContent: "center"
      }}>
      <Card
      style={{
        width: 500
      }}
      cover={<img alt="example" src="https://s3.bukalapak.com/bukalapak-kontenz-production/content_attachments/67893/w-740/92802586_225540215456856_7684868667231593088_n.jpg" width={200} height={300} />}
    >
      <Meta title="Sepatu Keren" />
  
  <div>
        Product: Sepatu
      </div>
      <div>
        Price: 25000
      </div>
      <div>
        Currency: IDR
      </div>
      <div>
        No HP: <input onChange={(e) => setPhone(e.target.value)}/>
      </div>
      <div>
        City: <input onChange={(e) => setCity(e.target.value)}/>
      </div>
      <div>
        Area: <input onChange={(e) => setArea(e.target.value)}/>
      </div>
      <button onClick={() => onSubmit()}>
      Bayar dengan custom PG
      </button>
      <button onClick={() => onSubmitTransfer()}>
      Bayar dengan PG Xendit
      </button>
    </Card>
      </div>
  
      </>
    );
  }