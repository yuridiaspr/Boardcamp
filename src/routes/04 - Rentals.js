import { Router } from "express";

import {
  insertRental,
  endRental,
  deleteRental,
  findAllRentals,
} from "../controllers/04 - Rentals.Controllers.js";

const router = Router();

router.post("/rentals", insertRental);
router.post("/rentals/:id/return", endRental);
router.delete("/rentals/:id", deleteRental);
router.get("/rentals", findAllRentals);

export default router;
