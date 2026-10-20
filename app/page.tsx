'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // State Form Input
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState<number | ''>('');

  // Fetch Data Produk dari API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Gagal memuat produk:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Submit Handler (Simpan Produk)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || harga === '') return;

    setLoading(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, deskripsi, harga: Number(harga) }),
      });

      if (res.ok) {
        setNama('');
        setDeskripsi('');
        setHarga('');
        fetchProducts();
      }
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Gagal menghapus produk:', err);
    }
  };

  // Kalkulasi Stats Card
  const totalItem = products.length;
  const totalValuasi = products.reduce((acc, curr) => acc + Number(curr.harga), 0);
  const rataRataHarga = totalItem > 0 ? totalValuasi / totalItem : 0;

  // Filter Search
  const filteredProducts = products.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans text-slate-900 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              K Vault{' '}
              <span className="text-xs bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-md border border-slate-300">
                STANDARD V2.0
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sistem Manajemen Inventaris • Next.js & MySQL
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white text-slate-700 text-xs px-4 py-2 rounded-full border border-slate-200 shadow-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Database Connected
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">TOTAL ITEM</p>
            <p className="text-3xl font-bold mt-1 text-slate-900">
              {totalItem} <span className="text-sm font-normal text-slate-500">Produk</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">TOTAL VALUASI</p>
            <p className="text-3xl font-bold mt-1 text-slate-900">
              Rp {totalValuasi.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">RATA-RATA HARGA</p>
            <p className="text-3xl font-bold mt-1 text-slate-900">
              Rp {Math.round(rataRataHarga).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Tambah Produk */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm self-start">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Tambah Produk
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">NAMA PRODUK</label>
                <input
                  type="text"
                  placeholder="Cth: Nama Barang"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">DESKRIPSI</label>
                <textarea
                  placeholder="Keterangan spesifikasi..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">HARGA (RP)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg text-sm mt-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Menyimpan...' : 'Simpan Produk'}
              </button>
            </form>
          </div>

          {/* Tabel Data Produk */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Cari nama produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
                />
                <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-bold">ID / PRODUK</th>
                    <th className="p-4 font-bold">DESKRIPSI</th>
                    <th className="p-4 font-bold">HARGA</th>
                    <th className="p-4 font-bold text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">
                        Belum ada data produk tersimpan.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold text-slate-900">{item.nama}</p>
                          <p className="text-xs text-slate-400">#PRD-{item.id}</p>
                        </td>
                        <td className="p-4 text-slate-600 text-xs max-w-xs truncate">
                          {item.deskripsi || '-'}
                        </td>
                        <td className="p-4 font-semibold text-slate-900">
                          Rp {Number(item.harga).toLocaleString('id-ID')}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-md transition-colors font-semibold cursor-pointer"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}