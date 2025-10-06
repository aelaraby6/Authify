import { Router } from "express";
import { AuthRouter } from "./Auth/auth.routes.js";
import { ProductRouter } from "./Product/product.routes.js";
import { CartRouter } from "./Cart/cart.routes.js";
import { OrderRouter } from "./Order/order.routes.js";
import { UserRouter } from "./User/user.routes.js";
import { CategoryRouter } from "./Category/category.routes.js";

const router = Router();

router.use("/user", UserRouter);
router.use("/auth", AuthRouter);
router.use("/products", ProductRouter);
router.use("/cart", CartRouter);
router.use("/order", OrderRouter);
router.use("/category", CategoryRouter);

export { router as ApiRouter };
