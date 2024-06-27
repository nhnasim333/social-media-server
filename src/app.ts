import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./app/config";
import notFount from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
const app: Application = express();

// parsers
app.use(express.json());
app.use(
  cors({
    origin: ["https://nh-social-media.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send(`Server Running on port ${config.port}`);
});

app.use("/api", router);

app.use(globalErrorHandler);

app.use(notFount);
export default app;
