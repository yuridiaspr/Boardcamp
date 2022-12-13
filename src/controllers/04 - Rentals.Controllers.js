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

    const borrowedGames = await connectionDB.query(
      'SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;',
      [gameId]
    );

    const gamesUnavailable = borrowedGames.rows.length;

    if (gamesUnavailable !== 0 && stockTotal - gamesUnavailable <= 0) {
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

export async function endRental(req, res) {
  const { id } = req.params;

  try {
    // Check if rental id exists
    const rentalAlreadyExist = await connectionDB.query(
      "SELECT * FROM rentals WHERE id=$1;",
      [id]
    );

    if (rentalAlreadyExist.rows.length === 0) {
      return res.status(404).send("Aluguel não cadastrado");
    }

    // Check if the rent is already paid
    const rentAlreadyPaid = rentalAlreadyExist.rows[0].returnDate;

    if (rentAlreadyPaid !== null) {
      return res.status(400).send("Jogo já está pago");
    }

    // Calculate delayFee
    const { gameId, rentDate, daysRented } = rentalAlreadyExist.rows[0];

    const game = await connectionDB.query("SELECT * FROM games WHERE id=$1;", [
      gameId,
    ]);

    const { pricePerDay } = game.rows[0];

    let expectedDate = new Date(rentDate);
    expectedDate.setDate(expectedDate.getDate() + daysRented);
    expectedDate = dayjs(expectedDate).format("YYYY-MM-DD");

    let teste = new Date(dayjs());
    teste.setDate(teste.getDate() + 2);
    teste = dayjs(teste).format("YYYY-MM-DD");

    const returnDate = dayjs(teste).format("YYYY-MM-DD");
    let delayFee = null;

    if (expectedDate < returnDate) {
      const newReturn = new Date(returnDate);
      const newExpected = new Date(expectedDate);

      let lateDays = newReturn.getTime() - newExpected.getTime();
      lateDays = lateDays / (24 * 3600 * 1000);

      delayFee = pricePerDay * parseInt(lateDays);
    }

    // Insert data
    await connectionDB.query(
      'UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;',
      [returnDate, delayFee, id]
    );

    return res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {}

export async function findAllRentals(req, res) {}
