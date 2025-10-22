import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "@/config/corsOptions";
import { ApiRouter } from "@/routers/index";
import globalErrorHandler from "@/middlewares/global_error_handler.middleware";
import { notFoundMiddleware } from "@/middlewares/not_found.middleware";
import session from 'express-session';
import passport from 'passport';
import "@/config/passportConfig";
import { loadSessionConfig } from "@/helper/sessionhelper";
import cookieParser from "cookie-parser";
import { swaggerSpec, swaggerUi } from "./utils/swagger";


const app: Application = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/* ---------- 🔹 1. Security & CORS ---------- */
app.use(helmet());
app.use(cors(corsOptions));

/* ---------- 🔹 2. Body Parsing ---------- */
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

/* ---------- 🔹 3. Cookies & Sessions ---------- */
app.use(cookieParser());
app.use(session(loadSessionConfig())); // Must come after cookieParser

/* ---------- 🔹 4. Passport ---------- */
app.use(passport.initialize());
app.use(passport.session());

/* ---------- 🔹 5. Routes ---------- */
app.use("/api", ApiRouter);

// 404 Not Found Middleware
app.use(notFoundMiddleware);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
