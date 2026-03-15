import React, { useState, useEffect, useCallback } from 'react';
import { Product } from './types';
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getProductByBarcode 
} from './db';
import Scanner from './components/Scanner';
import ProductCard from './components/ProductCard';
import EditProductModal from './components/EditProductModal';
import { 
  Plus, 
  Scan, 
  Search, 
  ShoppingBag, 
  LayoutGrid, 
  ChevronLeft,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllProducts();
      setProducts(data.sort((a, b) => b.updatedAt - a.updatedAt));
    } catch (err) {
      setError('Failed to load products from database.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleScanSuccess = async (barcode: string) => {
    setIsScanning(false);
    
    // Check if product already exists
    const existing = await getProductByBarcode(barcode);
    if (existing) {
      setEditingProduct(existing);
    } else {
      setEditingProduct({ barcode, name: '', price: 0, category: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      if (product.id) {
        await updateProduct(product);
      } else {
        await addProduct(product);
      }
      await loadProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        await loadProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.barcode.includes(searchQuery) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-black/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShoppingBag size={22} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ScanTrack</h1>
          </div>
          <button 
            onClick={() => setIsScanning(!isScanning)}
            className={`p-2 rounded-xl transition-all ${isScanning ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'}`}
          >
            {isScanning ? <ChevronLeft size={24} /> : <Scan size={24} />}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-6">
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Scan Barcode</h2>
                <p className="text-gray-500">Position the barcode within the frame</p>
              </div>
              <Scanner onScanSuccess={handleScanSuccess} />
              <button 
                onClick={() => setIsScanning(false)}
                className="w-full py-4 rounded-2xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Search products, barcodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-black/5 shadow-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Items</div>
                  <div className="text-2xl font-bold">{products.length}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Value</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    ${products.reduce((acc, p) => acc + p.price, 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="font-bold text-gray-500 text-sm uppercase tracking-widest">Inventory</h2>
                  <LayoutGrid size={18} className="text-gray-300" />
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                    <Loader2 className="animate-spin" size={32} />
                    <p>Loading your inventory...</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <AnimatePresence initial={false}>
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onEdit={(p) => {
                          setEditingProduct(p);
                          setIsModalOpen(true);
                        }}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                      <ShoppingBag size={32} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">No products found</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {searchQuery ? "Try a different search term" : "Start by scanning your first product"}
                      </p>
                    </div>
                    {!searchQuery && (
                      <button 
                        onClick={() => setIsScanning(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                      >
                        <Scan size={20} />
                        Scan Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      {!isScanning && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <button 
            onClick={() => setIsScanning(true)}
            className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-bold shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Scan size={24} />
            <span>Scan Product</span>
          </button>
        </div>
      )}

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-6 right-6 z-50 bg-red-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <AlertCircle size={24} />
            <p className="flex-1 text-sm font-medium">{error}</p>
            <button onClick={() => setError(null)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
