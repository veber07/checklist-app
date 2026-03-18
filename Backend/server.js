const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const uri = process.env.MONGO_URI || "mongodb+srv://mara:Test12345678@chechlist.udypp9m.mongodb.net/?retryWrites=true&w=majority&appName=Chechlist"
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
    if (!db) return res.status(500).json({ error: "Database is not connected yet." });

    const tasks = await db.collection("tasks").find().toArray();
    res.json(tasks.map(x => ({ ...x, _id: x._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/checklists", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "Database is not connected yet." });

    const items = await db
      .collection("checklists")
      .find({}, { projection: { name: 1, createdAt: 1, updatedAt: 1 } })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json(items.map(x => ({ ...x, _id: x._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/checklists/:id", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "Database is not connected yet." });

    const item = await db.collection("checklists").findOne({ _id: new ObjectId(req.params.id) });

    if (!item) return res.status(404).json({ error: "Checklist not found" });

    res.json({ ...item, _id: item._id.toString() });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

app.post("/api/checklists", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "Database is not connected yet." });

    const now = new Date().toISOString();

    const doc = {
      name: req.body.name || "Nový checklist",
      state: req.body.state || {},
      createdAt: now,
      updatedAt: now
    };

    const result = await db.collection("checklists").insertOne(doc);
    res.json({ insertedId: result.insertedId.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/checklists/:id", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "Database is not connected yet." });

    const result = await db.collection("checklists").updateOne(
      { _id: new ObjectId(req.params.id) },
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

app.delete("/api/checklists/:id", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "Database is not connected yet." });

    const result = await db.collection("checklists").deleteOne({ _id: new ObjectId(req.params.id) });

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
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  const user = {
    email,
    password,
  };

  await db.collection("users").insertOne(user);

  res.json({ message: "User created" });
});


start();