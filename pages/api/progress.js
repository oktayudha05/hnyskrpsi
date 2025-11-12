import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("skripsiApp");

    if (req.method === 'GET') {
      const progress = await db.collection("progress").findOne({ userId: "temenCeweLu" });
      res.status(200).json({ success: true, data: progress });
    } 
    else if (req.method === 'POST') {
      const { path, data } = req.body; // Menerima path dan data (status/curhat)
      
      if (!path || !data) {
        return res.status(400).json({ success: false, message: "Path and data are required" });
      }

      // Membuat key update dinamis, misal: 'progress.babI.latarBelakang'
      const updateKey = `progress.${path}`;
      
      // Menggunakan $set untuk memperbarui field bersarang (nested)
      await db.collection("progress").updateOne(
        { userId: "temenCeweLu" },
        { 
          $set: { [updateKey]: data },
          $setOnInsert: { userId: "temenCeweLu" } // Tambahkan userId jika dokumen baru
        },
        { upsert: true } // Buat dokumen baru jika belum ada
      );

      res.status(201).json({ success: true, message: "Progress updated!" });
    }
    else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}