import { BookOpen } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-12 text-center">
      <div className="mb-5 rounded-lg bg-primary p-4 text-primary-fg shadow-card">
        <BookOpen size={36} aria-hidden />
      </div>
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">Selamat Datang</p>
      <h2 className="mt-1 font-display text-3xl font-bold">BPPS 2026 Generator</h2>
      <p className="mt-4 text-muted">
        Pilih bahagian daripada panel sebelah kiri untuk mula membina Buku Panduan Pengurusan Sekolah 2026.
      </p>
      <p className="mt-2 text-xs text-muted md:hidden">Ketik ikon menu di penjuru kiri atas untuk membuka panel.</p>
    </div>
  );
}
