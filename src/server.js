import express from "express";
import Categories from "./routes/01 - Categories.js";

const app = express();
app.use(express.json());
app.use(Categories);

app.listen(4000, () => console.log("Server Running in port: 4000"));
