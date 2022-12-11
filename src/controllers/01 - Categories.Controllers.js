import { connectionDB } from "../database/db.js";

export async function insertCategory(req, res) {
  const { name } = req.body;

  try {
    await connectionDB.query("INSERT INTO categories name VALUE $1;", [name]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function findAllCategories(req, res) {}
