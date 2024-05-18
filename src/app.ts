import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { asyncHandler } from "./utils/AsyncHandler";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});
const app = express();

//middleware declaration
app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, //to allow cookies from the client
  })
);
app.disable("x-powered-by");
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//health check route
app.get(
  "/",
  asyncHandler((req: Request, res: Response) => {
    res.status(200).json({ message: "Is Healthy" });
  })
);

import authRouter from "./routes/auth.route";

app.use("/api/v1/auth", authRouter);

export default app;
