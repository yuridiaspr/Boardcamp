import { connectionDB } from "../database/db.js";

export async function insertCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  if (name === "" || name === null) {
    return res.status(400).send("Nome do cliente está vazio");
  }

  const isNumPhone = /^\d+$/.test(phone);

  if (!(isNumPhone && (phone.length === 10 || phone.length === 11))) {
    return res.status(400).send("O formato de telefone não está correto");
  }

  const isNumCpf = /^\d+$/.test(cpf);

  if (!(isNumCpf && cpf.length === 11)) {
    return res.status(400).send("O formato do cpf não está correto");
  }

  if (!isValidDate(birthday)) {
    return res.status(400).send("A data de nascimento não é válida");
  }

  try {
    const customerAlreadyExist = await connectionDB.query(
      "SELECT * FROM customers WHERE cpf=$1;",
      [cpf]
    );

    if (customerAlreadyExist.rows.length !== 0) {
      return res.status(409).send("Cliente já cadastrado!");
    }

    await connectionDB.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);",
      [name, phone, cpf, birthday]
    );

    return res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function findAllCustomers(req, res) {
  let { cpf } = req.query;

  try {
    if (cpf == undefined) {
      const { rows } = await connectionDB.query(
        "SELECT *, birthday::text FROM customers;"
      );
      res.send(rows);
    } else {
      cpf = cpf + "%";
      const { rows } = await connectionDB.query(
        "SELECT *, birthday::text FROM customers WHERE cpf LIKE $1;",
        [cpf]
      );
      res.send(rows);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function findCustomer(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await connectionDB.query(
      "SELECT *, birthday::text FROM customers WHERE id=$1;",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send("Id não existe");
    }

    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function upadateCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  if (name === "" || name === null) {
    return res.status(400).send("Nome do cliente está vazio");
  }

  const isNumPhone = /^\d+$/.test(phone);

  if (!(isNumPhone && (phone.length === 10 || phone.length === 11))) {
    return res.status(400).send("O formato de telefone não está correto");
  }

  const isNumCpf = /^\d+$/.test(cpf);

  if (!(isNumCpf && cpf.length === 11)) {
    return res.status(400).send("O formato do cpf não está correto");
  }

  if (!isValidDate(birthday)) {
    return res.status(400).send("A data de nascimento não é válida");
  }

  try {
    await connectionDB.query(
      "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;",
      [name, phone, cpf, birthday, id]
    );

    return res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}
