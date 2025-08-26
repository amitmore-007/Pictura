import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../UI/Button.jsx';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, item, loading }) => {
  if (!item) return null;

  const { type, item: itemData } = item;
  const isFolder = type === 'folder';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-dark-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete {isFolder ? 'Folder' : 'Image'}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Warning Icon */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Warning Message */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Are you sure?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isFolder ? (
                    <>
                      This will permanently delete "<strong>{itemData.name}</strong>" and all its contents including subfolders and images. This action cannot be undone.
                    </>
                  ) : (
                    <>
                      This will permanently delete "<strong>{itemData.name}</strong>". This action cannot be undone.
                    </>
                  )}
                </p>
              </div>

              {/* Item Preview */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  {isFolder ? (
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: itemData.color || '#3B82F6' }}
                    >
                      <span className="text-white text-xs font-bold">
                        {itemData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={itemData.cloudinaryUrl}
                      alt={itemData.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {itemData.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isFolder ? 'Folder' : 'Image'} • Created {new Date(itemData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={onConfirm}
                  loading={loading}
                  className="flex-1"
                >
                  Delete {isFolder ? 'Folder' : 'Image'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
