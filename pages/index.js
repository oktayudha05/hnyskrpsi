import { useState, useEffect } from "react";
import Head from "next/head";
import Bee from "../components/Bee"; // Komponen Bee masih kita pake
import NailongDecoration from "../components/NailongDecoration"; //

// Data skripsi, sekarang pake emoji langsung di properti 'icon'
const thesisStructure = [
  {
    id: "bagianAwal",
    icon: "🌻",
    nailongImage: "/images/nailong-book.png",
    label: "Bagian Awal",
    children: [
      { id: "halamanSampul", name: "Halaman Sampul" },
      { id: "halamanJudul", name: "Halaman Judul" },
      { id: "halamanPersetujuan", name: "Halaman Persetujuan" },
      { id: "halamanPengesahan", name: "Halaman Pengesahan" },
      { id: "pernyataanKeaslian", name: "Pernyataan Keaslian" },
      { id: "kataPengantar", name: "Kata Pengantar" },
      { id: "abstrak", name: "Abstrak" },
      { id: "daftarIsi", name: "Daftar Isi" },
      { id: "daftarTabelGambar", name: "Daftar Tabel dan Gambar" },
    ],
  },
  {
    id: "babI",
    icon: "📖",
    label: "Bab I: Pendahuluan",
    nailongImage: "/images/nailong-heart.png",
    children: [
      { id: "latarBelakang", name: "Latar Belakang Masalah" },
      { id: "rumusanMasalah", name: "Rumusan Masalah" },
      { id: "tujuanPenelitian", name: "Tujuan Penelitian" },
      { id: "manfaatPenelitian", name: "Manfaat Penelitian" },
    ],
  },
  {
    id: "babII",
    icon: "🧠",
    label: "Bab II: Landasan Teori",
    nailongImage: "/images/nailong-muntah.png",
    children: [
      { id: "kajianPustaka", name: "Kajian Pustaka" },
      { id: "kerangkaPenelitian", name: "Kerangka Penelitian" },
      { id: "hipotesis", name: "Hipotesis (jika ada)" },
    ],
  },
  {
    id: "babIII",
    icon: "🔬",
    label: "Bab III: Metode Penelitian",
    nailongImage: "/images/nailong-sleep.png",
    children: [
      { id: "tempatWaktu", name: "Tempat dan Waktu Penelitian" },
      { id: "jenisPenelitian", name: "Jenis Penelitian" },
      { id: "subjekPenelitian", name: "Subjek Penelitian" },
      { id: "teknikPengumpulanData", name: "Teknik Pengumpulan Data" },
      { id: "teknikAnalisisData", name: "Teknik Analisis Data" },
    ],
  },
  {
    id: "babIV",
    icon: "📊",
    label: "Bab IV: Hasil Penelitian dan Pembahasan",
    nailongImage: "/images/nailong-gosong.png",
    children: [
      { id: "hasilPenelitian", name: "Hasil Penelitian" },
      { id: "pembahasan", name: "Pembahasan" },
    ],
  },
  {
    id: "babV",
    icon: "🏁",
    label: "Bab V: Kesimpulan dan Saran",
    nailongImage: "/images/nailong-cape.png",
    children: [
      { id: "kesimpulan", name: "Kesimpulan" },
      { id: "implikasi", name: "Implikasi" },
      { id: "saran", name: "Saran" },
    ],
  },
  {
    id: "bagianAkhir",
    icon: "🌷",
    label: "Bagian Akhir",
    nailongImage: "/images/nailong-santuy.png",
    children: [
      { id: "daftarPustaka", name: "Daftar Pustaka" },
      { id: "lampiran", name: "Lampiran" },
    ],
  },
];

const statusOptions = [
  { value: "not-started", label: "Belum", icon: "🥱", color: "bg-gray-200" },
  {
    value: "in-progress",
    label: "Dikerjain",
    icon: "🚀",
    color: "bg-yellow-300",
  },
  { value: "done", label: "Selesai", icon: "✨", color: "bg-green-400" },
];

export default function Home() {
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  // const [openAccordions, setOpenAccordions] = useState(["babI"]);
  const [openAccordions, setOpenAccordions] = useState([]);
  const [curhatDrafts, setCurhatDrafts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({});

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj) || {};
  };

  const loadProgress = async () => {
    try {
      const res = await fetch("/api/progress");
      const data = await res.json();
      if (data.success && data.data && data.data.progress) {
        setProgress(data.data.progress);
        const initialDrafts = {};
        thesisStructure.forEach((section) => {
          section.children.forEach((child) => {
            const path = `${section.id}.${child.id}`;
            const curhatValue = getNestedValue(data.data.progress, path).curhat;
            if (curhatValue && curhatValue.trim() !== "") {
              initialDrafts[path] = curhatValue;
            }
          });
        });
        setCurhatDrafts(initialDrafts);
      }
    } catch (error) {
      console.error("Gagal mengambil progres:", error);
    }
  };

  useEffect(() => {
    loadProgress().finally(() => setIsLoading(false));
  }, []);

  const handleUpdate = async (path, field, value) => {
    const currentNestedData = getNestedValue(progress, path);
    const newNestedData = { ...currentNestedData, [field]: value };
    const newProgress = { ...progress };
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => {
      if (!acc[key]) acc[key] = {};
      return acc[key];
    }, newProgress);
    target[lastKey] = newNestedData;
    setProgress(newProgress);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, data: newNestedData }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan ke server");
    } catch (error) {
      console.error("Gagal update, mengembalikan ke data server...", error);
      await loadProgress();
    }
  };

  const handleCurhatChange = (path, value) => {
    setCurhatDrafts((prev) => ({ ...prev, [path]: value }));
  };

  const handleCurhatSubmit = async (path) => {
    setIsSubmitting((prev) => ({ ...prev, [path]: true }));
    const valueToSubmit = (curhatDrafts[path] || "").trim();
    await handleUpdate(path, "curhat", valueToSubmit);
    setCurhatDrafts((prev) => ({ ...prev, [path]: valueToSubmit }));
    setIsSubmitting((prev) => ({ ...prev, [path]: false }));
  };

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculateProgress = () => {
    let totalSubItems = 0;
    let doneSubItems = 0;
    thesisStructure.forEach((section) => {
      section.children.forEach((child) => {
        totalSubItems++;
        if (
          getNestedValue(progress, `${section.id}.${child.id}`).status ===
          "done"
        )
          doneSubItems++;
      });
    });
    return totalSubItems > 0
      ? Math.round((doneSubItems / totalSubItems) * 100)
      : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-amber-700 bg-yellow-50">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 relative overflow-hidden font-sans">
      {/* --- DEKORASI BACKGROUND DIHAPUS --- */}
      {/* <NailongDecoration /> */}
      {/* <Bee /> */}

      <Head>
        <title>Ayow Berprogres ckyipcii! 🌻</title>
        <meta
          name="description"
          content="Website progres ckyipci untuk jmeth gwejhh"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl relative z-10">
        <header className="text-center mb-8 md:mb-12 bg-white bg-opacity-80 p-6 md:p-8 rounded-3xl shadow-lg bee-shadow">
          <h1 className="text-3xl md:text-6xl font-bold text-yellow-600 mb-4 flex items-center justify-center gap-2">
            <span className="text-pink-500">❤️</span> semangat berprogres sygg!{" "}
            <span className="text-pink-500">❤️</span>
          </h1>
          <p className="text-base md:text-lg text-amber-800">
            sedikit dukungan buat km mihh! Kamu bica kasi ceyita paling berkesan
            ketika berprogres juga dicini! ✨
          </p>
          <div className="mt-6 md:mt-8">
            <p className="text-xl md:text-2xl font-bold text-amber-700 flex items-center justify-center gap-2">
              Progres Kamu: {calculateProgress()}%{" "}
              <span className="text-yellow-600">🎯</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-6 md:h-8 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 transition-all duration-700 ease-out flex items-center justify-center text-amber-900 font-bold text-sm md:text-lg"
                style={{ width: `${calculateProgress()}%` }}
              >
                {calculateProgress() > 10 && `${calculateProgress()}%`}
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-3 md:space-y-4">
          {thesisStructure.map((section) => {
            return (
              <div
                key={section.id}
                className="bg-white bg-opacity-90 rounded-xl md:rounded-2xl shadow-md overflow-hidden border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(section.id)}
                  className="w-full px-4 md:px-6 py-3 md:py-4 text-left flex justify-between items-center hover:bg-yellow-100 transition-colors duration-200"
                >
                  {/* --- PERUBAHAN UTAMA DI SINI --- */}
                  <div className="flex items-center gap-2 md:gap-4">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-amber-900 flex items-center gap-2">
                      <span className="text-xl md:text-2xl">
                        {section.icon}
                      </span>{" "}
                      <span className="hidden sm:inline">{section.label}</span>
                      <span className="sm:hidden text-base">
                        {section.label.replace("Bab ", "").replace(": ", "")}
                      </span>
                    </h2>
                  </div>
                  <img
                    src={section.nailongImage}
                    alt={`${section.label} avatar`}
                    className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-full"
                  />
                </button>
                {openAccordions.includes(section.id) && (
                  <div className="px-4 md:px-6 pb-4 space-y-3 md:space-y-4 bg-gradient-to-b from-yellow-50 to-white">
                    {section.children.map((child) => {
                      const path = `${section.id}.${child.id}`;
                      const currentData = getNestedValue(progress, path);
                      const statusDetail =
                        statusOptions.find(
                          (s) => s.value === currentData.status
                        ) || statusOptions[0];
                      const currentCurhatDraft = Object.hasOwn(
                        curhatDrafts,
                        path
                      )
                        ? curhatDrafts[path]
                        : currentData.curhat || "";
                      return (
                        <div
                          key={child.id}
                          className="border-l-4 border-pink-300 pl-3 md:pl-4 bg-white rounded-lg p-3 md:p-4 shadow-sm"
                        >
                          <h3 className="text-base md:text-lg font-semibold text-gray-800">
                            {child.name}
                          </h3>
                          <div className="mt-3 flex flex-wrap items-center gap-1 md:gap-2">
                            <span
                              className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusDetail.color} text-gray-800`}
                            >
                              <span>{statusDetail.icon}</span>{" "}
                              {statusDetail.label}
                            </span>
                            {statusOptions.map((option) => {
                              return (
                                <button
                                  key={option.value}
                                  onClick={() =>
                                    handleUpdate(path, "status", option.value)
                                  }
                                  className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold transition-all duration-200 transform hover:scale-105 flex items-center gap-1 ${
                                    currentData.status === option.value
                                      ? "bg-amber-500 text-white shadow-md"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  <span>{option.icon}</span>{" "}
                                  <span className="hidden sm:inline">
                                    {option.label}
                                  </span>
                                  <span className="sm:hidden">
                                    {option.label.split(" ")[0]}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-4">
                            <label
                              htmlFor={`curhat-${path}`}
                              className="block text-sm font-bold text-purple-700 mb-1"
                            >
                              💬 Keluhan:
                            </label>
                            <textarea
                              id={`curhat-${path}`}
                              rows="2"
                              className="w-full px-3 py-2 text-yellow-700 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                              placeholder="Ceritain di sini..."
                              value={currentCurhatDraft}
                              onChange={(e) =>
                                handleCurhatChange(path, e.target.value)
                              }
                            ></textarea>
                            <button
                              onClick={() => handleCurhatSubmit(path)}
                              disabled={isSubmitting[path]}
                              className="mt-2 w-full sm:w-auto px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 disabled:bg-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                              <span>💾</span>{" "}
                              {isSubmitting[path] ? "Menyimpan..." : "Simpan"}
                            </button>
                            {currentData.curhat &&
                              currentData.curhat.trim() !== "" && (
                                <div className="mt-3 p-3 bg-purple-50 border-l-4 border-purple-300 rounded">
                                  <p className="text-xs font-semibold text-purple-700 mb-1">
                                    Catatan:
                                  </p>
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {currentData.curhat}
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <footer className="mt-8 md:mt-12 text-center bg-white bg-opacity-80 p-4 md:p-6 rounded-2xl shadow-md">
          <p className="italic text-base md:text-lg text-amber-800">
            "Kamu fokus sama skripsi, aku fokus jadi alasan kamu buat semangat."
          </p>
          <p className="mt-4 font-bold text-xl md:text-2xl text-yellow-600 flex items-center justify-center gap-2">
            Love, Your #1 Fan! <span className="text-pink-500">❤️</span>
          </p>
        </footer>
      </main>
    </div>
  );
}