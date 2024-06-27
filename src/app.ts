import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db";
import body from "body-parser";
import errorHandler from "./middleware/error";
import cookieParser from "cookie-parser";

//load env vars
dotenv.config();

//mongodb connection
connectDB();

//route files
import users from "./routes/users";
import auth from "./routes/auth";
import posts from "./routes/posts";

const app = express();
const port = process.env.PORT || 3000;

// body-parser
app.use(
  body.json({
    limit: "500kb",
  })
);

//cookie-parser
app.use(cookieParser());

const corsConfig = {
  origin: "",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(morgan("dev"));
app.use(helmet());

//mount routers
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/posts", posts);

//error handler middleware
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

// handle unhandled promise rejections
process.on("unhandledRejection", (err: any, promise) => {
  console.log(`MongoServerError: ${err.message}`);

  //close server and exit process
  server.close(() => {
    process.exit(1);
  });
});

export default app;
