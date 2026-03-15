import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Save, Package, Tag, DollarSign, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditProductModalProps {
  product: Partial<Product>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    notes: '',
    ...product
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        price: 0,
        category: '',
        notes: '',
        ...product
      });
    }
  }, [isOpen, product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...product,
      ...formData,
      updatedAt: Date.now(),
    } as Product);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {product.id ? 'Edit Product' : 'New Product'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-black/5 mb-6">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Barcode</div>
                <div className="font-mono text-gray-700">{product.barcode}</div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Package size={16} className="text-gray-400" />
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-400" />
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Tag size={16} className="text-gray-400" />
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="e.g. Food"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all h-24 resize-none"
                  placeholder="Add any additional details..."
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-[0.98]"
              >
                <Save size={20} />
                Save Product
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProductModal;
