import express from "express";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "./config/corsOptions.js";
import globalErrorHandler from "./middlewares/global_error_handler.middleware.js";
import { ApiRouter } from "./routers/index.js";
import { notFoundMiddleware } from "./middlewares/not_found.middleware.js";

const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());


app.use("/api", ApiRouter);

// 404 Not Found Middleware
app.use(notFoundMiddleware);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
