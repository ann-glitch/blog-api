import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db";
import body from "body-parser";
import errorHandler from "./middleware/error";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

const app = express();
const port = process.env.PORT || 3000;

//route files
import users from "./routes/users";
import auth from "./routes/auth";
import posts from "./routes/posts";

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//load env vars
dotenv.config();

//mongodb connection
connectDB();

//set mongo sanitize
app.use(mongoSanitize());

// set security policy
app.use(helmet());

// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});

app.use(limiter);

// prevent http param pollution
app.use(hpp());

//cookie-parser
app.use(cookieParser());

const corsConfig = {
  origin: "",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

//cookie-parser
app.use(cookieParser());

//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mount routers
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);
app.use("/api/v1/posts", posts);

//error handler middleware
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ann's Blog API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          background-color: #f4f4f4;
          color: #333;
        }
        header {
          background-color: #333;
          color: #fff;
          padding: 10px 0;
          text-align: center;
        }
        .container {
          max-width: 800px;
          margin: 20px auto;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          margin-top: 0;
        }
        p {
          margin-bottom: 20px;
        }
        code {
          background: #eee;
          padding: 2px 4px;
          border-radius: 4px;
        }
        a {
          color: #3498db;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>Welcome to Ann's Blog API</h1>
      </header>
      <div class="container">
        <p>To access different routes, use the following format:</p>
        <p>
          <code>/api/v1/{route-name}</code>
        </p>
        <p>For example, to fetch all blog posts, use the following URL:</p>
        <p>
          <a href="https://anns-blog-api.vercel.app/api/v1/posts" target="_blank">
            https://anns-blog-api.vercel.app/api/v1/posts
          </a>
        </p>
        <h2>For instance</h2>
        <ul>
          <li><a href="/api/v1/posts" target="_blank">/api/v1/posts</a> - Get all blog posts</li>
          <li><a href="/api/v1/posts/:id" target="_blank">/api/v1/posts/:id</a> - Get a single blog post by ID</li>
          <li><a href="/api/v1/users" target="_blank">/api/v1/users</a> - Get all users</li>
          <li><a href="/api/v1/users/:id" target="_blank">/api/v1/users/:id</a> - Get a single user by ID</li>
          <!-- Add more routes as needed -->
        </ul>
        <h2>API Documentation</h2>
        <p>For detailed documentation of the API routes, visit the following Postman documentation:</p>
        <ul>
          <li><a href="https://documenter.getpostman.com/view/23110999/2sA3dsoEjA" target="_blank">Authentication Routes</a></li>
          <li><a href="https://documenter.getpostman.com/view/23110999/2sA3duECJA" target="_blank">Posts Routes</a></li>
          <li><a href="https://documenter.getpostman.com/view/23110999/2sA3duECJ8" target="_blank">Users Routes</a></li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

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
