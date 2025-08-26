import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Edit3, Trash2, Download, Eye, Tag } from 'lucide-react';

const ImageCard = ({ image, onEdit, onDelete, onView, viewMode = 'grid' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit(image);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(image);
  };

  const handleView = () => {
    onView(image);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    window.open(image.cloudinaryUrl, '_blank');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-200 cursor-pointer"
        onClick={handleView}
      >
        <div className="flex items-center space-x-4">
          <img
            src={image.cloudinaryUrl}
            alt={image.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{image.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatFileSize(image.size)} • {image.format?.toUpperCase()}
            </p>
            {image.tags && image.tags.length > 0 && (
              <div className="flex items-center space-x-1 mt-1">
                <Tag className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {image.tags.slice(0, 3).join(', ')}
                  {image.tags.length > 3 && '...'}
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 bg-transparent"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 py-2 z-20 min-w-[120px]">
                <button
                  onClick={handleView}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative cursor-pointer"
      onClick={handleView}
    >
      <div className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300 group-hover:border-purple-300 dark:group-hover:border-purple-600">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image.cloudinaryUrl}
            alt={image.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleView();
                }}
                className="p-2 bg-white/90 dark:bg-dark-800/90 rounded-full text-gray-700 dark:text-white hover:bg-white dark:hover:bg-dark-700"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(image.cloudinaryUrl, '_blank');
                }}
                className="p-2 bg-white/90 dark:bg-dark-800/90 rounded-full text-gray-700 dark:text-white hover:bg-white dark:hover:bg-dark-700"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 bg-white/95 dark:bg-gray-800/95 rounded-full text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg backdrop-blur-sm"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-12 right-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 py-2 z-20 min-w-[120px]">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {image.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {formatFileSize(image.size)} • {image.format?.toUpperCase()}
          </p>
          
          {/* Tags */}
          {image.tags && image.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {image.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  {tag}
                </span>
              ))}
              {image.tags.length > 2 && (
                <span className="text-xs text-gray-400">+{image.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;