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
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER || "dorisaugustine.me@gmail.com",
            pass: process.env.EMAIL_PASSWORD || "tojp zyhs edia obes",
        },
    });
    // send mail with defined transport object
    // const message = {
    //   from: `${process.env.FROM_NAME! || "Bitfrika Blog"} <${
    //     process.env.FROM_EMAIL! || "noreply@bitafrika-blog.io"
    //   }>`,
    //   to: options.email,
    //   subject: options.subject,
    //   text: options.message,
    // };
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    const info = yield transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
});
exports.default = sendEmail;
