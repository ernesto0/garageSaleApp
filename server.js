const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const sales = require("./routes/api/sales");

const app = express();

//DB config & connection
const db = require("./config/keys").mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello"));

app.use("/api/users", users);
app.use("/api/sales", sales);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
