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


const app: Application = express();

// Middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use(session(loadSessionConfig()));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.use("/api", ApiRouter);

// 404 Not Found Middleware
app.use(notFoundMiddleware);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
