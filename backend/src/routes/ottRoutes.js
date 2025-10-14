import express from "express";
import { getOttReleases } from "../controllers/ottController.js";

const router = express.Router();

router.get("/releases", getOttReleases);

export default router;
