
"use strict"

import express, { Request, Response, NextFunction } from "express";
import { Server, Socket } from "socket.io";
import { Manager }        from "./modules/Manager";
// import { DBconnect }      from "./DB/DataBase";
import http               from "http";
import cors               from "cors";
import bodyParser         from "body-parser";
import dotenv             from "dotenv";
dotenv.config();

export const app        = express();
export const httpServer = http.createServer(app);
export const socketIO   = new Server(httpServer);

// DBconnect();

// =================================================================================
// Disable CORS errors
// =================================================================================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use((
   error: Error,
   req:   Request,
   res:   Response,
   next:  NextFunction,
) => {

   if(error) return res.status(400).send({ message: `Invalid request !` });
   next();
});


// =================================================================================
// Methods
// =================================================================================
const handleConnect = (
   res:     Response,
   status:  number,
   message: string,
   data?:   any,
) => {
   console.log(message);
   res.status(status).send({ message, data });
}

// =================================================================================
// Routes
// =================================================================================
app.get("/", (req, res) => {

   try {
      handleConnect(res, 200, "Connected with Express !");
   }
   catch(error) {
      handleConnect(res, 500, "Failed to connect with Express !");
   }
});

app.get("/login", (req, res) => {

   try {
      handleConnect(res, 200, "Logged in successfully !");
   }
   catch(error) {
      handleConnect(res, 500, "Failed to log in !");
   }
});

socketIO.on("connection", (socket: Socket) => {
   Manager.start(socket);
});


// =================================================================================
// Start Server
// =================================================================================
httpServer.listen(process.env.PORT || 2800, () => {
   console.log(`Listening on port ${process.env.PORT}`);
});