import React, { useState } from 'react';
import { Product } from '../types';
import { Edit2, Trash2, Package, Barcode, Tag, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden mb-4"
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Package size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {product.name || 'Unnamed Product'}
              </h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <Barcode size={14} />
                <span className="font-mono">{product.barcode}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-emerald-600 font-bold text-lg">
              ${product.price.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
              {product.category || 'General'}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-black/5 bg-gray-50/50">
              {product.notes && (
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Notes</span>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.notes}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Calendar size={12} />
                  <span>Updated {formatDate(product.updatedAt)}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(product.id!);
                    }}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
