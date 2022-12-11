import express from "express";
import Categories from "./routes/01 - Categories.js";
import Games from "./routes/02 - Games.js";

const app = express();
app.use(express.json());
app.use(Categories);
app.use(Games);

app.listen(4000, () => console.log("Server Running in port: 4000"));
