import express from "express";
import dotenv from "dotenv";
import { getProfile } from "../services/profileServices.js";

const profileroute = express.Router();

dotenv.config();

profileroute.post("/getprofile", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await getProfile(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
});

export default profileroute;
