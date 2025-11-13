import React from 'react';

const NailongDecoration = () => {
  return (
    // Container ini bakal nampung semua gambar dekorasi
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Gambar 1: Pojok Kiri Atas - Animasi Bounce */}
      <img
        src="/images/nailong-wave.png"
        alt="Nailong waving"
        className="absolute top-4 left-4 w-20 h-20 md:w-28 md:h-28 object-contain animate-bounce"
      />

      {/* Gambar 2: Sebelah Kiri Tengah - Animasi Pulse */}
      <img
        src="/images/nailong-heart.png"
        alt="Nailong with heart"
        className="absolute top-1/3 left-2 w-16 h-16 md:w-24 md:h-24 object-contain animate-pulse"
      />

      {/* Gambar 3: Sebelah Kanan Tengah - Animasi Bounce (delayed) */}
      <img
        src="/images/nailong-book.png"
        alt="Nailong reading"
        className="absolute top-1/2 right-2 w-20 h-20 md:w-28 md:h-28 object-contain animate-bounce"
        style={{ animationDelay: '1s' }} // Biar nggak barengan
      />

      {/* Gambar 4: Pojok Kanan Bawah - Animasi Pulse (delayed) */}
      <img
        src="/images/nailong-sleep.png"
        alt="Nailong sleeping"
        className="absolute bottom-4 right-4 w-24 h-24 md:w-32 md:h-32 object-contain animate-pulse"
        style={{ animationDelay: '0.5s' }} // Biar nggak barengan
      />

    </div>
  );
};

export default NailongDecoration;