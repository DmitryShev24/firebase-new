import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

exports.moderator = functions.database.ref("/books/{Id}").onWrite((change) => {
  const book = change.after.val();

  if (book && !book.description) {
    change.after.ref.update({
      description: "Скоро здесь будет описание…",
    });
  }
  return null;
});

const express = require("express");
const cors = require("cors");
const formData = require("express-form-data");
const admin = require("firebase-admin");

const serviceAccount = require("../path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://netology-nest-default-rtdb.firebaseio.com",
});
const db = admin.database();

const app = express();
app.use(formData.parse());
app.use(cors());

app.get("/api/books/", async (req: any, res: any) => {
  const info = await db.ref("books").once("value").val();
  res.json(info || {});
});

app.get("/api/books/:id", async (req: any, res: any) => {
  let { id } = req.params();
  const info = await db.ref("books").child(id).once("value");
  res.json(info.val() || {});
});

app.post("/api/books/", async (req: any, res: any) => {
  console.log("tst", req.body);
  const { title, desc } = req.body;
  const book = await db.ref("books").push({ title, desc });

  res.status(201);
  res.json({ book: book, id: book.key });
});

app.put("/api/books/:id", async (req: any, res: any) => {
  const { body } = req;
  const { id } = req.params;

  const el = await db.ref("books").child(id).update(body);

  console.log(el);
  if (el) {
    res.json(true);
  } else {
    return res.status(404).json("not found");
  }
});

app.delete("/api/books/:id", async (req: any, res: any) => {
  let { id } = req.params();
  const info = await db.ref("books").child(id).remove();
  res.json("ok", info);
});
exports.widgets = functions.https.onRequest(app);
