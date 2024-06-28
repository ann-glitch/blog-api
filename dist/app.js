"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const body_parser_1 = __importDefault(require("body-parser"));
const error_1 = __importDefault(require("./middleware/error"));
const cookieParser = require("cookie-parser");
//load env vars
dotenv_1.default.config();
// Debugging: Log environment variables to ensure they are loaded
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
//mongodb connection
(0, db_1.default)();
//route files
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const posts_1 = __importDefault(require("./routes/posts"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// body-parser
app.use(
  body_parser_1.default.json({
    limit: "500kb",
  })
);
//cookie-parser
app.use(cookieParser());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
//mount routers
app.use("/api/v1/users", users_1.default);
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/posts", posts_1.default);
//error handler middleware
app.use(error_1.default);
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
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
exports.default = app;
