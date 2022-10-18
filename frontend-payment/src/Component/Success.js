// App.js
import * as React from "react";
import { useParams , useNavigate} from "react-router-dom";
import axios from 'axios'
import { Result, Button } from 'antd';
import 'antd/dist/antd.css';

export default function Success() {
  
    const params = useParams()
    const [data, setData] = React.useState("")
    const navigate = useNavigate();
  
    return (
      <>
      
      {params.id} 
      <br />
      <br />
      <Result
      status="success"
      title="Successfully Purchased Sepatu!"
      extra={[
        <Button type="primary" key="console" onClick={() => {
          const data = {
            trx_id: params.id
          }
           axios.post("http://127.0.0.1:8000/check-payment", data).then(res => {
            console.log(res.data)
            setData(res.data.response)
          })
        }}>
          check status e wallet
        </Button>,
        <Button key="buy" onClick={() => {
          const data = {
            trx_id: params.id
          }
           axios.post("http://127.0.0.1:8000/check-payment-invoice", data).then(res => {
            console.log(res.data)
            setData(res.data.response)
          })
        }}>check status bank transfer</Button>,
  
      <Button  onClick={() => {
        navigate("/")
      }}>Back to Merchant</Button>,
      ]}
    />
    
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