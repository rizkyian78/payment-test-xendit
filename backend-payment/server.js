const express = require("express")
const cors = require("cors");
const axios = require("axios");


const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/payment", async(req, res) => {
  const APIKEY = "xnd_development_P4qDfOss0OCpl8RtKrROHjaQYNCk9dN5lSfk+R1l9Wbe+rSiCwZ3jw==:"

    const authorization = Buffer.from(APIKEY).toString("base64")
    const data = {
      "reference_id": "order-id-1665407257",
      "currency": "IDR",
      "amount": 25000,
      "checkout_method": "ONE_TIME_PAYMENT",
      "channel_code": "ID_LINKAJA",
      "channel_properties": {
          "mobile_number": "+628123123123",
          "success_redirect_url": "http://localhost:3000/success"
      },
      "metadata": { 
          "branch_area": "PLUIT",
          "branch_city": "JAKARTA"
      }
  }
  const response = await axios.post("https://api.xendit.co/ewallets/charges", data,{
    headers: {
        Authorization: "Basic " + authorization
    }
  })
  if(response.data.status === "PENDING") {
res.status(200).json({response: response.data})
  } else {
    res.status(400).json({message: "something wrong with payment"})
  }
})

app.listen(8000, () => console.log("Listening"))