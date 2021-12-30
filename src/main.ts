import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//@ts-ignore

const express = require("express")
const cors = require("cors")
const formData = require("express-form-data")
const admin = require("firebase-admin");

const serviceAccount = require("../path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://netology-nest-default-rtdb.firebaseio.com"
});
const db = admin.database()

const app = express();
app.use(formData.parse())
app.use(cors())

app.get("/api/books/", async (req, res) => {
  const info = (await db.ref("books").once("value").val())
  res.json(info || {})
})


app.get("/api/books/:id", async (req, res) => {
  let {id} = req.params();
  const info = (await db.ref("books").child(id).once("value"))
  res.json(info.val() || {})
})


app.post("/api/books/", async (req, res) => {
  console.log('tst', req.body)
  const {title, desc} = req.body
  const book = (await db.ref("books").push({title, desc}))

  res.status(201)
  res.json({book: book, id: book.key})
})

app.put("/api/books/:id", async (req, res) => {
    const {body} = req
  const {id} = req.params;

  const el = await db.ref("books").child(id).update(body)

    console.log(el)
    if (el) {
        res.json(true)
    } else {
        return res.status(404).json('not found')
    }

})


app.delete("/api/books/:id", async (req, res) => {
    let {id} = req.params();
    const info = (await db.ref("books").child(id).remove())
    res.json("ok")
})
const PORT = 3000
app.listen(PORT, () => {
  console.log(PORT)
})
