import clientPromise from "../../lib/mongodb";
import Cors from "cors";

// --- Inisialisasi CORS ---
// Ini yang ngizinin frontend dari mana aja (bisa disesuaikan)
// Buat development, bolehin semua origin. Buat production, sebaiknya spesifik.
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://skrip-si-hani.oyudha.me",
          "https://www.skrip-si-hani.oyudha.me",
        ] // GANTI dengan domain frontend lu
      : true, // Di development, bolehin semua origin
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Helper buat nge-run middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  // --- Jalankan CORS middleware sebelum logic lain ---
  await runMiddleware(req, res, Cors(corsOptions));

  try {
    // --- Logic API lu tetep sama di bawah sini ---
    const client = await clientPromise;
    const db = client.db("skripsiApp");

    if (req.method === "GET") {
      const progress = await db
        .collection("progress")
        .findOne({ userId: "temenCeweLu" });
      res.status(200).json({ success: true, data: progress });
    } else if (req.method === "POST") {
      const { path, data } = req.body;

      if (!path || !data) {
        return res
          .status(400)
          .json({ success: false, message: "Path and data are required" });
      }

      const updateKey = `progress.${path}`;

      await db.collection("progress").updateOne(
        { userId: "temenCeweLu" },
        {
          $set: { [updateKey]: data },
          $setOnInsert: { userId: "temenCeweLu" },
        },
        { upsert: true }
      );

      res.status(201).json({ success: true, message: "Progress updated!" });
    } else {
      res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}