import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ottRoutes from "./src/routes/ottRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ott", ottRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
