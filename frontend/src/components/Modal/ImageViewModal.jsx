import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Maximize, Tag, Calendar, HardDrive, FolderOpen } from 'lucide-react';

const ImageViewModal = ({ isOpen, onClose, image }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!image) return null;

  const handleDownload = () => {
    window.open(image.cloudinaryUrl, '_blank');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative ${
              isFullscreen 
                ? 'w-screen h-screen' 
                : 'w-full max-w-6xl h-full max-h-[90vh] mx-4'
            } bg-white dark:bg-dark-900 rounded-xl overflow-hidden shadow-2xl flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {image.name}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors bg-transparent"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors bg-transparent"
                  title="Toggle Fullscreen"
                >
                  <Maximize className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors bg-transparent"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-dark-900 p-4">
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={image.cloudinaryUrl}
                  alt={image.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>

              {/* Sidebar (hidden in fullscreen) */}
              {!isFullscreen && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-80 bg-white dark:bg-dark-800 border-l border-gray-200 dark:border-dark-700 p-6 overflow-y-auto"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Image Details
                  </h3>

                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Basic Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <HardDrive className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Size</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatFileSize(image.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {new Date(image.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        {image.format && (
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-400">
                                {image.format.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Format</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {image.format.toUpperCase()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Folder Info */}
                    {image.folder && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Location
                        </h4>
                        <div className="flex items-center space-x-3">
                          <FolderOpen 
                            className="w-4 h-4" 
                            style={{ color: image.folder.color || '#3B82F6' }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {image.folder.name}
                            </p>
                            {image.folder.path && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {image.folder.path}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {image.tags && image.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {image.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Actions
                      </h4>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Original</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageViewModal;
