import express from "express";

const app = express();
app.use(express.json());

app.listen(4000, () => console.log("Server Running in port: 4000"));
