import express from "express";
import { body, validationResult } from "express-validator";
import Driver from "../models/Driver.js";

const router = express.Router();

router.get(
  "/nearby-drivers",
  [
    body("startLocation.latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Start location latitude must be between -90 and 90."),
    body("startLocation.longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Start location longitude must be between -180 and 180."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(400).json({ message: firstError.msg });
    }

    const { startLocation } = req.body;

    try {
      const drivers = await Driver.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [startLocation.longitude, startLocation.latitude],
            },
            distanceField: "dist.calculated",
            maxDistance: 5000,
            spherical: true,
            query: {
              isAvailable: true,
              currentLocation: {
                $geoWithin: {
                  $centerSphere: [
                    [startLocation.longitude, startLocation.latitude],
                    5 / 6378.1,
                  ],
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "vehicles",
            localField: "vehicleId",
            foreignField: "_id",
            as: "vehicleDetails",
          },
        },
        {
          $unwind: {
            path: "$vehicleDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            "dist.calculated": 1,
          },
        },
      ]);

      return res.json(drivers);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching nearby drivers." });
    }
  }
);

export default router;
