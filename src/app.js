import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "NYSC Connect Backend API",
    timestamp: new Date(),
  });
});

// Router paths goes here(Didn't write it cause idk what models to write yet)

app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `The requested path [${req.method}] ${req.originalUrl} was not found`,
  });
});

app.use((err, req, res, next) => {
  console.error("Internal application error:", err.stack);
  res.status(500).json({
    status: "error",
    message: "An unexpected internal server error occured.",
  });
});
export default app;
