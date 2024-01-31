
"use strict"

import express, { Request, Response, NextFunction } from "express";
import { Manager }      from "./modules/Manager";
// import { DBconnect }    from "./DB/DataBase";
import http             from "http";
import bodyParser       from "body-parser";
import dotenv           from "dotenv";
dotenv.config();

export const app       = express();
export const appServer = http.createServer(app);

// DBconnect();
Manager.start();


// =================================================================================
// Disable CORS errors
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
   
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
   
   next();
});


// =====================================================================
// Routes
// =====================================================================


// =================================================================================
// Start Server
// =================================================================================
appServer.listen(process.env.PORT || 2800, () => {
   console.log(`Listening on port ${process.env.PORT}`);
});