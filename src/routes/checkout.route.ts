import { Router } from "express";
import {
  checkout,
  getAllOrders,
  getOrder,
} from "../controllers/checkout.controller";
import { Roles } from "../constants";
import { verifyUser } from "../middlewares/auth.middleware";

const router = Router();

router.route("/checkout").post(verifyUser([Roles.ADMIN, Roles.USER]), checkout);
router.route("/").get(verifyUser([Roles.ADMIN, Roles.USER]), getAllOrders);
router.route("/:orderId").get(verifyUser([Roles.ADMIN, Roles.USER]), getOrder);
export default router;
