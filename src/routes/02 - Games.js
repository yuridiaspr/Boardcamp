import { Router } from "express";

import {
  insertGame,
  findAllGames,
} from "../controllers/02 - Games.Controllers.js";

const router = Router();

router.post("/games", insertGame);
router.get("/games", findAllGames);

export default router;
