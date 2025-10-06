import { Router } from "express";
import { AuthRouter } from "@/routers/Auth/auth.routes.js";

const router = Router();

router.use("/auth", AuthRouter);

export { router as ApiRouter };