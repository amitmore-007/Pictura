import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, MoreVertical, Edit, Trash2, Image } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const FolderCard = ({ folder, onEdit, onDelete, viewMode = 'grid' }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleFolderClick = () => {
    if (folder.subFolders && folder.subFolders.length > 0) {
      setIsOpen(!isOpen);
    } else {
      navigate(`/folder/${folder._id}`);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(folder);
    setShowMenu(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(folder);
    setShowMenu(false);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-200"
      >
        <Link to={`/folder/${folder._id}`} className="flex items-center space-x-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: folder.color }}
          >
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{folder.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {folder.imageCount} {folder.imageCount === 1 ? 'image' : 'images'}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
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
                  onClick={handleEdit}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent"
                >
                  <Edit className="w-4 h-4" />
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
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative"
    >
      <Link to={`/folder/${folder._id}`}>
        <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-600">
          {/* Folder Icon */}
          <div className="flex items-center justify-between mb-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: folder.color }}
            >
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 bg-white/90 dark:bg-gray-800/90 shadow-lg backdrop-blur-sm"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 py-2 z-20 min-w-[120px]">
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent"
                  >
                    <Edit className="w-4 h-4" />
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

          {/* Folder Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {folder.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Image className="w-4 h-4 mr-1" />
              <span>{folder.imageCount} {folder.imageCount === 1 ? 'image' : 'images'}</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Created {new Date(folder.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default FolderCard;