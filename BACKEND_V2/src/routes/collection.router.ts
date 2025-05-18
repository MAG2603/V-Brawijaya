import express from "express";
import upload from "../middleware/uploadMiddleware";
import {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  deletePhoto,
  deleteAudio,
} from "../controllers/collection.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getCollections);
router.get("/:id", getCollectionById);
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "audio", maxCount: 1 },
  ]),
  createCollection
);
router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "audio", maxCount: 1 },
  ]),
  updateCollection
);
router.delete("/image/:id/:name", authMiddleware, deletePhoto);
router.delete("/audio/:id/:name", authMiddleware, deleteAudio);
router.delete("/:id", authMiddleware, deleteCollection);

export default router;
