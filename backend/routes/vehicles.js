
const express = require("express");
const { ObjectId } = require("mongodb");
const { randomUUID } = require("node:crypto");
const { getDB } = require("../db");

const router = express.Router();

// Uses the existing MongoDB connection from db.js.
const vehicles = () => getDB().collection("vehicles");

// Convert a route parameter to a MongoDB ObjectId.
function parseId(id) {
  if (!/^[a-fA-F0-9]{24}$/.test(id)) return null;
  return new ObjectId(id);
}

function validNumber(value) {
  return typeof value === "number" &&
    Number.isFinite(value);
}

// Validate and accept only supported vehicle fields.
// This prevents clients from modifying arbitrary database fields.
function validateVehicle(body) {
  const v = body?.vehicle ?? body;

  if (!v || typeof v !== "object" || Array.isArray(v)) {
    return { error: "Vehicle object is required" };
  }

  if (typeof v.userId !== "string" ||
      !v.userId.trim() ||
      v.userId.length > 128) {
    return { error: "Valid userId is required" };
  }

  if (typeof v.name !== "string" ||
      !v.name.trim() ||
      v.name.length > 120) {
    return { error: "Valid vehicle name is required" };
  }

  if (!validNumber(v.weightWithoutDriver) ||
      v.weightWithoutDriver <= 0 ||
      !validNumber(v.weightWithDriver) ||
      v.weightWithDriver <= 0) {
    return { error: "Vehicle weights must be positive numbers" };
  }

  if (v.weightWithDriver < v.weightWithoutDriver) {
    return { error: "Weight with driver cannot be smaller" };
  }

  if (v.photoUrl != null &&
      (typeof v.photoUrl !== "string" ||
       v.photoUrl.length > 2048 ||
       !/^https?:\/\//i.test(v.photoUrl))) {
    return { error: "photoUrl must be null or an HTTP(S) URL" };
  }

  return {
    vehicle: {
      userId: v.userId.trim(),
      name: v.name.trim(),
      weightWithoutDriver: v.weightWithoutDriver,
      weightWithDriver: v.weightWithDriver,
      photoUrl: v.photoUrl ?? null
    }
  };
}

// Validate one driving session.
function validateSession(body) {
  if (!body || typeof body !== "object" ||
      Array.isArray(body)) {
    return { error: "Session object is required" };
  }

  if (typeof body.startedAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(body.startedAt) ||
      !Number.isFinite(Date.parse(body.startedAt))) {
    return { error: "startedAt must be an ISO 8601 timestamp with timezone" };
  }

  if (!validNumber(body.durationS) || body.durationS < 0 ||
      !validNumber(body.peakG) || body.peakG < 0 ||
      !validNumber(body.avgG) || body.avgG < 0) {
    return { error: "Invalid durationS, peakG, or avgG" };
  }

  if (!Array.isArray(body.samples) ||
      body.samples.length > 1000 ||
      !body.samples.every(s =>
        s && typeof s === "object" &&
        ["t", "x", "y", "z"].every(k => validNumber(s[k])) &&
        s.t >= 0
      )) {
    return { error: "samples must be an array of up to 1000 valid samples" };
  }

  return {
    session: {
      id: randomUUID(), // Server generates the session ID.
      startedAt: body.startedAt,
      durationS: body.durationS,
      peakG: body.peakG,
      avgG: body.avgG,
      samples: body.samples.map(s => ({
        t: s.t, x: s.x, y: s.y, z: s.z
      }))
    }
  };
}

// GET /api/vehicles?userId=...
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (typeof userId !== "string" || !userId.trim()) {
      return res.status(400).json({
        error: "userId query parameter is required"
      });
    }

    const results = await vehicles()
      .find({ "vehicle.userId": userId.trim() })
      .toArray();

    return res.status(200).json(results);
  } catch (err) {
    console.error("Get vehicles error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/vehicles/:id
router.get("/:id", async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }

    const doc = await vehicles().findOne({ _id: id });

    if (!doc) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    return res.status(200).json(doc);
  } catch (err) {
    console.error("Get vehicle error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/vehicles
router.post("/", async (req, res) => {
  try {
    const { vehicle, error } = validateVehicle(req.body);
    if (error) return res.status(400).json({ error });

    const doc = {
      vehicle,
      sessions: []
    };

    const result = await vehicles().insertOne(doc);

    return res.status(201).json({
      _id: result.insertedId,
      ...doc
    });
  } catch (err) {
    console.error("Create vehicle error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/vehicles/:id
router.put("/:id", async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }

    const { vehicle, error } = validateVehicle(req.body);
    if (error) return res.status(400).json({ error });

    const result = await vehicles().updateOne(
      { _id: id },
      { $set: { vehicle } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const updated = await vehicles().findOne({ _id: id });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Update vehicle error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/vehicles/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }

    const result = await vehicles().deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    return res.status(200).json({
      message: "Vehicle deleted successfully"
    });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/vehicles/:id/sessions
router.post("/:id/sessions", async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid vehicle ID" });
    }

    const { session, error } = validateSession(req.body);
    if (error) return res.status(400).json({ error });

    // Atomically append the session to the existing array.
    const result = await vehicles().updateOne(
      { _id: id },
      { $push: { sessions: session } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    return res.status(201).json({
      message: "Session added successfully",
      session
    });
  } catch (err) {
    console.error("Add session error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
