import express from "express";
import Categories from "./routes/01 - Categories.js";
import Games from "./routes/02 - Games.js";
import Customers from "./routes/03 - Customers.js";

const app = express();
app.use(express.json());
app.use(Categories);
app.use(Games);
app.use(Customers);

app.listen(4000, () => console.log("Server Running in port: 4000"));
