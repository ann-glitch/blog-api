"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
app.use(body_parser_1.default.json({
    limit: "500kb",
}));
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
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
exports.default = app;
