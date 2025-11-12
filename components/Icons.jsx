// Kita ngimpor ikon-ikon yang kita butuhin dari Heroicons
// Kita pake yang versi 'outline' biar kelihatan lebih clean dan ringan
import {
  SunIcon,
  BookOpenIcon,
  MapPinIcon,
  BeakerIcon,
  ChartBarIcon,
  FlagIcon,
  HeartIcon,
  MoonIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';

// --- Ikon untuk Bagian ---
export const SunflowerIcon = SunIcon; // Ganti pake ikon matahari
export const BookIcon = BookOpenIcon;
export const BrainnIcon = MapPinIcon;
export const MicroscopeIcon = BeakerIcon; // Ganti pake tabung reaksi, lebih universal
export const ChartIcon = ChartBarIcon;
export const FinishLineIcon = FlagIcon; // Ganti pake bendera finish
export const FlowerIcon = HeartIcon; // Pas accordion dibuka, pake hati

// --- Ikon untuk Status ---
export const SleepyIcon = MoonIcon; // Belum dimulai = tidur
export const RocketIcon = RocketLaunchIcon; // Dikerjain = roket
export const CheckIcon = CheckCircleIcon; // Selesai = centang

// --- Ikon lainnya ---
export const SaveIcon = BookmarkIcon; // Simpan = bookmark
export const TargetIcon = DocumentTextIcon; // Ganti target jadi ikon dokumen, lebih cocok buat skripsi