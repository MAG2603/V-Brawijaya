import { NextFunction, Request, Response } from "express";
import Collection, { ICollection } from "../models/collection.model";
import fs from "fs";
import path from "path";
import { ApiError } from "../middleware/errorHandler";
import { generateIdentifier } from "../utils/collection.util";
import Category from "../models/category.model";

export const createCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      year,
      category,
      description,
      history,
      language,
      creator,
      subject,
      publisher,
      contributor,
      copyright,
      date,
      format,
      identifierCode,
      source,
      museumEntryYear,
      createdBy,
    } = req.body;

    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    const images =
      files?.["images"]?.map((file) => ({
        name: file.filename,
        url: `${process.env.BASE_URL}/uploads/${file.filename}`,
      })) || [];

    const audio = files?.["audio"]?.[0]
      ? {
          name: files["audio"][0].filename,
          url: `${process.env.BASE_URL}/uploads/${files["audio"][0].filename}`,
        }
      : undefined;

    const newCollection = new Collection({
      identifier: generateIdentifier(),
      name,
      year,
      category,
      description,
      history,
      language,
      creator,
      subject,
      publisher,
      contributor,
      copyright,
      date,
      format,
      identifierCode,
      source,
      museumEntryYear,
      images,
      audio,
      createdBy,
    });

    await newCollection.save();

    res.status(201).json({
      message: "Collection created successfully",
      collection: newCollection,
    });
  } catch (error) {
    next(new ApiError(500, `Error creating collection: ${error}`));
  }
};

export const getCollections = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, search } = req.query;

    let filter: any = {};

    if (category && category !== "") {
      const categoryDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${category}$`, "i") },
      });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        res.status(200).json([]);
        return;
      }
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const collections = await Collection.find(filter)
      .populate("category", "name")
      .populate("createdBy", "fullname username");

    res.status(200).json(collections);
  } catch (error) {
    next(new ApiError(500, `Error fetching collections: ${error}`));
  }
};

export const getCollectionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const collection = await Collection.findById(id)
      .populate("category", "name")
      .populate("createdBy", "fullname username");

    if (!collection) return next(new ApiError(404, "Collection not found"));

    res.status(200).json(collection);
  } catch (error) {
    next(new ApiError(500, `Error creating collection, ${error}`));
  }
};

export const updateCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<ICollection> = req.body;

    const collection = await Collection.findById(id);
    if (!collection) {
      return next(new ApiError(404, "Collection not found"));
    }

    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    if (files?.["images"]) {
      const newImages = files["images"].map((file) => ({
        name: file.filename,
        url: `${process.env.BASE_URL}/uploads/${file.filename}`,
      }));

      updateData.images = [...(collection.images || []), ...newImages];
    }

    if (files?.["audio"]?.[0]) {
      const newAudio = files["audio"][0];

      if (collection.audio?.name) {
        const oldAudioPath = path.join(
          __dirname,
          "../../public/uploads",
          collection.audio.name
        );
        if (fs.existsSync(oldAudioPath)) {
          fs.unlinkSync(oldAudioPath);
        }
      }

      updateData.audio = {
        name: newAudio.filename,
        url: `${process.env.BASE_URL}/uploads/${newAudio.filename}`,
      };
    }

    const allowedKeys = [
      "_id",
      "images",
      "audio",
      "createdBy",
      "identifier",
      "updatedAt",
    ];

    const existingData = collection.toObject();
    const unsetFields: Record<string, "" | undefined> = {};

    Object.keys(existingData).forEach((key) => {
      if (!allowedKeys.includes(key) && !(key in updateData)) {
        unsetFields[key] = "";
      }
    });

    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        $unset: unsetFields,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      data: updatedCollection,
    });
  } catch (error) {
    next(new ApiError(500, `Error updating collection: ${error}`));
  }
};

export const deleteCollection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id);
    if (!collection) {
      return next(new ApiError(404, "Collection not found"));
    }

    if (collection.images && collection.images.length > 0) {
      collection.images.forEach((image) => {
        const filePath = path.join(
          __dirname,
          "../../public/uploads",
          image.name
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    if (collection.audio && collection.audio.name) {
      const oldAudioPath = path.join(
        __dirname,
        "../../public/uploads",
        collection.audio.name
      );
      if (fs.existsSync(oldAudioPath)) {
        fs.unlinkSync(oldAudioPath);
      }
    }

    await Collection.findByIdAndDelete(id);

    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    next(new ApiError(500, `Error deleting collection, ${error}`));
  }
};

export const deleteAudio = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, name } = req.params;

    const collection = await Collection.findById(id);
    if (!collection) {
      return next(new ApiError(404, "Collection not found"));
    }

    if (collection.audio && collection.audio.name == "") {
      return next(new ApiError(404, "Audio not found"));
    }

    if (collection.audio) {
      const audio = collection.audio;
      if (audio.name == name) {
        const filePath = path.join(
          __dirname,
          "../../public/uploads",
          audio.name
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        collection.audio = { name: "", url: "" };

        await collection.save();
      }
    }

    res.status(200).json({ message: "Collection delete audio successfully" });
  } catch (error) {
    next(new ApiError(500, `Error deleting photo collection, ${error}`));
  }
};

export const deletePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, name } = req.params;

    const collection = await Collection.findById(id);
    if (!collection) {
      return next(new ApiError(404, "Collection not found"));
    }

    if (Array.isArray(collection.images) && collection.images.length > 0) {
      const imageToDelete = collection.images.find(
        (image) => image.name === name
      );

      if (!imageToDelete) {
        return next(new ApiError(404, "Image not found in collection"));
      }

      const filePath = path.join(
        __dirname,
        "../../public/uploads",
        imageToDelete.name
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      collection.images = collection.images.filter(
        (image) => image.name !== name
      );

      await collection.save();
      res.status(200).json({ message: "Photo deleted successfully" });
    }

    return next(new ApiError(400, "No images found in collection"));
  } catch (error) {
    next(new ApiError(500, `Error deleting photo collection, ${error}`));
  }
};
