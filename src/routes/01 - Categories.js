import { Router } from "express";

import {
  insertCategory,
  findAllCategories,
} from "../controllers/01 - Categories.Controllers.js";

const router = Router();

router.post("/categories", insertCategory);
router.get("/categories", findAllCategories);

export default router;
