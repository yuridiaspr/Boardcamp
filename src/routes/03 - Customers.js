import { Router } from "express";

import {
  insertCustomer,
  findAllCustomers,
  findCustomer,
  upadateCustomer,
} from "../controllers/03 - Customers.Controllers.js";

const router = Router();

router.post("/customers", insertCustomer);
router.get("/customers", findAllCustomers);
router.get("/customers/:id", findCustomer);
router.put("/customers/:id", upadateCustomer);

export default router;
