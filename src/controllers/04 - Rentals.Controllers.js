import { connectionDB } from "../database/db.js";
import dayjs from "dayjs";

export async function insertRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  const rentDate = dayjs().format("YYYY-MM-DD");

  if (daysRented <= 0 || isNaN(daysRented)) {
    return res
      .status(400)
      .send("A quantidade de dias alugados deve ser maior do que 0");
  }

  try {
    const customerAlreadyExist = await connectionDB.query(
      "SELECT * FROM customers WHERE id=$1;",
      [customerId]
    );

    if (customerAlreadyExist.rows.length === 0) {
      return res.status(400).send("Cliente não existe");
    }

    const gameAlreadyExist = await connectionDB.query(
      "SELECT * FROM games WHERE id=$1;",
      [gameId]
    );

    if (gameAlreadyExist.rows.length === 0) {
      return res.status(400).send("Jogo não existe");
    }

    const { name, stockTotal, pricePerDay } = gameAlreadyExist.rows[0];

    const gameAvailable = await connectionDB.query(
      'SELECT * FROM rentals WHERE id=$1 AND "returnDate" IS NULL;',
      [gameId]
    );

    if (
      gameAvailable.rows.length !== 0 &&
      gameAvailable.rows.length <= stockTotal
    ) {
      return res
        .status(400)
        .send(`Todas as unidades de ${name} estão alugados(as)`);
    }

    const originalPrice = daysRented * pricePerDay;
    const returnDate = null,
      delayFee = null;

    await connectionDB.query(
      'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );

    return res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function endRental(req, res) {}

export async function deleteRental(req, res) {}

export async function findAllRentals(req, res) {}
