const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const uri =
  process.env.MONGO_URI ||
  "mongodb+srv://mara:Test12345678@chechlist.udypp9m.mongodb.net/?retryWrites=true&w=majority&appName=Chechlist";

let db = null;

async function connectMongo() {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db("checklist");
  console.log("MongoDB connected");
}

app.get("/", (req, res) => {
  res.send("Backend běží správně");
});

app.get("/health", (req, res) => {
  res.json({ ok: true, dbConnected: !!db });
});

app.get("/tasks", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database is not connected yet." });
    }

    const tasks = await db.collection("tasks").find().toArray();
    res.json(tasks.map((x) => ({ ...x, _id: x._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * REGISTRACE UŽIVATELE
 * Jednoduchá verze bez hashování hesla.
 */
app.post("/api/register", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database is not connected yet." });
    }

    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ error: "Email a heslo jsou povinné" });
    }

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "Uživatel už existuje" });
    }

    const result = await db.collection("users").insertOne({
      email,
      password,
      createdAt: new Date().toISOString()
    });

    res.json({
      ok: true,
      message: "User created",
      user: {
        id: result.insertedId.toString(),
        email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * LOGIN
 * Jednoduchá verze bez JWT.
 */
app.post("/api/login", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database is not connected yet." });
    }

    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    const user = await db.collection("users").findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Špatný email nebo heslo" });
    }

    res.json({
      ok: true,
      user: {
        id: user._id.toString(),
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET všechny checklisty pro konkrétního usera
 * Volání:
 * /api/checklists?userId=...
 */
app.get("/api/checklists", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database is not connected yet." });
    }

    const userId = String(req.query.userId || "").trim();

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const items = await db
      .collection("checklists")
      .find(
        { userId },
        { projection: { name: 1, createdAt: 1, updatedAt: 1, userId: 1 } }
      )
      .sort({ updatedAt: -1 })
      .toArray();

    res.json(items.map((x) => ({ ...x, _id: x._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET detail checklistu, ale jen pokud patří userovi
 * Volání:
 * /api/checklists/:id?userId=...
 */
app.get("/api/checklists/:id", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database is not connected yet." });
    }

    const userId = String(req.query.userId || "").trim();

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const item = await db.collection("checklists").findOne({
      _id: new ObjectId(req.params.id),
      userId
    });

    if (!item) {
      return res.status(404).json({ error: "Checklist not found" });
    }

    res.json({ ...item, _id: item._id.toString() });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

/**
 * CREATE checklist pro konkrétního usera
 */
app.post("/api/checklists", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database is not connected yet." });
    }

    const now = new Date().toISOString();
    const userId = String(req.body.userId || "").trim();

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const doc = {
      name: req.body.name || "Nový checklist",
      userId,
      state: req.body.state || {},
      createdAt: now,
      updatedAt: now
    };

    const result = await db.collection("checklists").insertOne(doc);

    res.json({
      ok: true,
      insertedId: result.insertedId.toString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * UPDATE checklistu, ale jen pokud patří userovi
 */
app.put("/api/checklists/:id", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database is not connected yet." });
    }

    const userId = String(req.body.userId || "").trim();

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const result = await db.collection("checklists").updateOne(
      {
        _id: new ObjectId(req.params.id),
        userId
      },
      {
        $set: {
          name: req.body.name || "Checklist",
          state: req.body.state || {},
          updatedAt: new Date().toISOString()
        }
      }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ error: "Checklist not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

/**
 * DELETE checklistu, ale jen pokud patří userovi
 */
app.delete("/api/checklists/:id", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database is not connected yet." });
    }

    const userId = String(req.query.userId || "").trim();

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const result = await db.collection("checklists").deleteOne({
      _id: new ObjectId(req.params.id),
      userId
    });

    if (!result.deletedCount) {
      return res.status(404).json({ error: "Checklist not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

async function start() {
  try {
    await connectMongo();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

start();