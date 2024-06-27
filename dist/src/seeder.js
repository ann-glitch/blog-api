"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User"));
// Load environment variables
dotenv_1.default.config({ path: "./config/config.env" });
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGO_URI);
// Read users.json file
const usersRawData = fs_1.default.readFileSync(`${__dirname}/_data/users.json`, "utf-8");
const usersData = JSON.parse(usersRawData);
// Function to import data
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.create(usersData);
        console.log("Data Imported!");
        process.exit();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
// Function to delete data
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.deleteMany();
        console.log("Data Deleted!");
        process.exit();
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
// Check command line argument to decide action
if (process.argv[2] === "-i") {
    importData();
}
else if (process.argv[2] === "-d") {
    deleteData();
}
