
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
// Routes
// =================================================================================
app.get("/", (req, res) => {

   socketIO.on("connection", (socket: Socket) => {
      Manager.start(socket);
   });

   res.status(200).send({message: "Connected with SocketIO"});
});


// =================================================================================
// Start Server
// =================================================================================
httpServer.listen(process.env.PORT || 2800, () => {
   console.log(`Listening on port ${process.env.PORT}`);
});