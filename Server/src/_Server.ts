
"use strict"

import express, { Request, Response, NextFunction } from "express";
import { ServerManager }   from "./modules/_Export";
import http                from "http";
import cors                from "cors";
import dotenv              from "dotenv";
import bodyParser          from "body-parser";
import mongoose            from "mongoose";
import axios               from "axios";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const httpServer = http.createServer(app);
const SManager   = new ServerManager();

// ********************  Tempory  ********************
const battleParams = {
   id: "47",

   playersList: [
      { id: "1", name: "Illidan",   faction: "Orange" },
      { id: "2", name: "Malfurion", faction: "Purple" },
   ],
   
   settings: {
      maxPop:  "_500",
      mapSize: "small",
   },
}
// ********************  Tempory  ********************

SManager.start(httpServer);
SManager.createBattle(battleParams);
SManager.startBattle (battleParams.id);


// =================================================================================
// Set BodyParser & Axios
// =================================================================================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((
   error: Error,
   req:   Request,
   res:   Response,
   next:  NextFunction,
) => {

   if(error) return res.status(400).send({ message: `Invalid request !` });
   next();
});

const startAxios = () => {

   axios.get("----- URL -----")
   .then((response) => {
            
   }).catch((error) => console.log(error));
}


// =================================================================================
// Methods
// =================================================================================
const handleConnection = (
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
app.get("/wake", (req, res) => { // To hold server standby with axios

   try {
      handleConnection(res, 200, "Connected with Express !");
   }
   catch(error) {
      handleConnection(res, 500, "Failed to connect with Express !");
   }
});

app.post("/login", (req, res) => {

   try {
      const { auth } = req.body;

      if(!auth) throw Error;
      
      handleConnection(res, 200, "Logged in successfully !", { success: true });
   }

   catch(error) {
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