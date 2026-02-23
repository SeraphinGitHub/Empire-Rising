"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ServerManager_1 = require("./modules/ServerManager");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const httpServer = http_1.default.createServer(app);
const serverManager = new ServerManager_1.ServerManager(httpServer);
serverManager.start();
// =================================================================================
// Set BodyParser & Axios
// =================================================================================
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((error, req, res, next) => {
    if (error)
        return res.status(400).send({ message: `Invalid request !` });
    next();
});
const startAxios = () => {
    axios_1.default.get("----- URL -----")
        .then((response) => {
    }).catch((error) => console.log(error));
};
// =================================================================================
// Methods
// =================================================================================
const handleConnection = (res, status, message, data) => {
    console.log(message);
    res.status(status).send({ message, data });
};
// =================================================================================
// Routes
// =================================================================================
app.get("/wake", (req, res) => {
    try {
        handleConnection(res, 200, "Connected with Express !");
    }
    catch (error) {
        handleConnection(res, 500, "Failed to connect with Express !");
    }
});
app.post("/login", (req, res) => {
    try {
        const { auth } = req.body;
        if (!auth)
            throw Error;
        handleConnection(res, 200, "Logged in successfully !", { success: true });
    }
    catch (error) {
        handleConnection(res, 500, "Failed to log in !");
    }
});
// =================================================================================
// MongoDB connect then ==> Start Server
// =================================================================================
httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
// mongoose.connect(process.env.ATLAS_URI!)
// .then(() => {
//    console.log("Connected to MongoDB !");
//    httpServer.listen(process.env.PORT || 3000, () => {
//       console.log(`Listening on port ${process.env.PORT}`);
//    });
// }).catch(() => console.log("Failed to connect to MongoDB !"));
module.exports = app;
