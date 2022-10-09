import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import dbConnection from "./configs/db_connection.js";
import userRoutes from "./routes/UserRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
// CORS POLICY
app.use(cors());
// JSON PARSER
app.use(express.json());

// DB CONNECTION
dbConnection(process.env.DATABASE_URL);

// ROUTES
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
