const express = require("express")
const cors = require("cors");
const axios = require("axios");
const { uuid} = require('uuidv4');
const sequelize = require("./models/index").sequelize
const {DataTypes} = require("sequelize")
const transactionModel = require("./models/transaction")
const inquiryModel = require("./models/inquiry")

const app = express();


app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/inquiry", async(req, res)=> {
  const data = await inquiryModel(sequelize, DataTypes).create({
    name: req.body.name,
    price: req.body.price,
    area: req.body.area,
    city: req.body.city,
    phone: req.body.phone
  })
  res.status(200).json({data})
})

app.get("/inquiry/:id", async(req, res)=> {
  const id = req.params.id
  const data = await inquiryModel(sequelize, DataTypes).findByPk(id)
  res.status(200).json({data})
})

app.post("/payment", async(req, res) => {
  const APIKEY = "<change_me>"

    const authorization = Buffer.from(APIKEY).toString("base64")
    const reference_id = uuid()
    const data = {
      "reference_id": reference_id,
      "currency": "IDR",
      "amount": req.body.price,
      "checkout_method": "ONE_TIME_PAYMENT",
      "channel_code": req.body.payment_method,
      "channel_properties": {
          "mobile_number": req.body.phone,
          "success_redirect_url": `http://localhost:3000/${reference_id}/success`
      },
      "metadata": { 
          "branch_area": req.body.area,
          "branch_city": req.body.city
      }
  }
  const response = await axios.post("https://api.xendit.co/ewallets/charges", data,{
    headers: {
        Authorization: "Basic " + authorization,
    }
  })
  await transactionModel(sequelize, DataTypes).create({
    reference_id: response.data.id,
    trx_id: reference_id
  })
  if(response.data.status === "PENDING") {
res.status(200).json({response: response.data})
  } else {
    res.status(400).json({message: "something wrong with payment"})
  }
})

app.post("/check-payment", async(req, res) => {
  const APIKEY = "<change_me>"

    const authorization = Buffer.from(APIKEY).toString("base64")
    console.log(req.body)
    const data = await transactionModel(sequelize, DataTypes).findOne({
      where: {
      trx_id: req.body.trx_id
      }
    })
    const response = await axios.get("https://api.xendit.co/ewallets/charges/"+ data.reference_id,{
    headers: {
        Authorization: "Basic " + authorization,
    }
  })
res.status(200).json({response: JSON.stringify(response.data)})
})

app.post("/check-payment-invoice", async(req, res) => {
  const APIKEY = "<change_me>"

    const authorization = Buffer.from(APIKEY).toString("base64")
    const data = await transactionModel(sequelize, DataTypes).findOne({
      where: {
        trx_id: req.body.trx_id
        }
    })
    const response = await axios.get("https://api.xendit.co/v2/invoices/"+ data.reference_id,{
    headers: {
        Authorization: "Basic " + authorization,
    }
  })
res.status(200).json({response: JSON.stringify(response.data)})
})

app.post("/invoice", async(req, res) => {
  const APIKEY = "<change_me>"

    const authorization = Buffer.from(APIKEY).toString("base64")
    const reference_id = uuid()
    const data = {
      "external_id": reference_id,
      "amount": 25000,
      "description": "Invoice Demo #123",
      "invoice_duration": 31536000,
      "customer": {
          "given_names": "rizky",
          "surname": "ian",
          "email": "rizkyian78@gmail.com",
          "mobile_number": "+6285156937959",
          "addresses": [
              {
                  "city": "Jakarta Selatan",
                  "country": "Indonesia",
                  "postal_code": "12345",
                  "state": "Daerah Khusus Ibukota Jakarta",
                  "street_line1": "Jalan Makan",
                  "street_line2": "Kecamatan Kebayoran Baru"
              }
          ]
      },
      "customer_notification_preference": {
          "invoice_created": [
              "whatsapp",
              "sms",
              "email",
              "viber"
          ],
          "invoice_reminder": [
              "whatsapp",
              "sms",
              "email",
              "viber"
          ],
          "invoice_paid": [
              "whatsapp",
              "sms",
              "email",
              "viber"
          ],
          "invoice_expired": [
              "whatsapp",
              "sms",
              "email",
              "viber"
          ]
      },
      "success_redirect_url": `http://localhost:3000/${reference_id}/success`,
      "failure_redirect_url": `http://localhost:3000/${reference_id}/success`,
      "currency": "IDR",
      "items": [
          {
              "name": "sepatu",
              "quantity": 1,
              "price": 2500000,
              "category": "Electronic",
              "url": "https://yourcompany.com/example_item"
          }
      ],
      "fees": [
          {
              "type": "ADMIN",
              "value": 500
          }
      ]
  }

    const response = await axios.post("https://api.xendit.co/v2/invoices", data,{
    headers: {
        Authorization: "Basic " + authorization,
    }
  })
  await transactionModel(sequelize, DataTypes).create({
    reference_id: response.data.id,
    trx_id: reference_id
  })
res.status(200).json({response: response.data})
})

app.listen(8000, () => console.log("Listening"))

