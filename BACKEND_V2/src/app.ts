import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/user.router";
import authRoutes from "./routes/auth.router";
import collectionRoutes from "./routes/collection.router";
import categoryRoutes from "./routes/category.router";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));

app.use("/uploads", express.static("public/uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

export default app;
