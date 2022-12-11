import { connectionDB } from "../database/db.js";

export async function insertGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  if (name === "" || name === null) {
    return res.status(400).send("Nome do jogo está vazio");
  }

  if (stockTotal === "" || stockTotal <= 0) {
    return res.status(400).send("A quantidade em estoque precisa ser positiva");
  }

  if (pricePerDay === "" || pricePerDay <= 0) {
    return res.status(400).send("O preço diário precisa ser positivo");
  }

  if (categoryId === "") {
    return res.status(400).send("O Jogo precisa ter uma categoria");
  }

  try {
    const categoryAlreadyExist = await connectionDB.query(
      "SELECT * FROM categories WHERE id=$1;",
      [categoryId]
    );

    if (categoryAlreadyExist.rows.length === 0) {
      return res.status(400).send("Categoria de jogo não existe!");
    }

    const nameAlreadyExist = await connectionDB.query(
      "SELECT * FROM games WHERE name=$1;",
      [name]
    );

    if (nameAlreadyExist.rows.length !== 0) {
      return res.status(409).send("Jogo já existente");
    }

    await connectionDB.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',
      [name, image, stockTotal, categoryId, pricePerDay]
    );

    return res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function findAllGames(req, res) {
  try {
    const { rows } = await connectionDB.query("SELECT * FROM games;");
    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
