import { connectionDB } from "../database/db.js";

export async function insertCategory(req, res) {
  const { name } = req.body;

  if (name === "" || name === null) {
    return res.status(400).send("Nome da categoria vazio");
  }

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM categories WHERE name=$1",
      [name]
    );

    if (rows.length !== 0) {
      return res.status(409).send("Categoria já existente");
    }

    await connectionDB.query("INSERT INTO categories (name) VALUES ($1);", [
      name,
    ]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function findAllCategories(req, res) {
  try {
    const { rows } = await connectionDB.query("SELECT * FROM categories");
    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
