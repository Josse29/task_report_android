// all dependecies apps
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// import all my-routing
import authRoutes from "./routes/authRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";
import taskroutes from "./routes/taskRoutes.js";

// initial express app
const app = express();

// middleware cors
app.use(cors());

// configure dotenv
dotenv.config();
// parsing json in server
app.use(express.json());

// routing
app.use("/api/auth", authRoutes);
app.use("/api/unitrs", unitRoutes);
app.use("/api/taskrs", taskroutes);

// connect to mongodb atlas/compas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Apps is Listening port on http://localhost:${process.env.PORT}`
      );
    });
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });
