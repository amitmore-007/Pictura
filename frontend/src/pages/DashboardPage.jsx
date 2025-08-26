import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Search, Grid3X3, List, Home, FolderOpen, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { folderAPI, imageAPI } from '../services/api.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Button from '../components/UI/Button.jsx';
import LoadingSpinner from '../components/UI/LoadingSpinner.jsx';
import FolderCard from '../components/Folder/FolderCard.jsx';
import ImageCard from '../components/Image/ImageCard.jsx';
import CreateFolderModal from '../components/Modal/CreateFolderModal.jsx';
import UploadImageModal from '../components/Modal/UploadImageModal.jsx';
import EditFolderModal from '../components/Modal/EditFolderModal.jsx';
import EditImageModal from '../components/Modal/EditImageModal.jsx';
import DeleteConfirmModal from '../components/Modal/DeleteConfirmModal.jsx';
import ImageViewModal from '../components/Modal/ImageViewModal.jsx';

const DashboardPage = () => {
  const { user } = useAuth();
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);

  // Modal states
  const [editFolderModal, setEditFolderModal] = useState({ isOpen: false, folder: null });
  const [editImageModal, setEditImageModal] = useState({ isOpen: false, image: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [viewImageModal, setViewImageModal] = useState({ isOpen: false, image: null });
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterContent();
  }, [searchQuery, folders, images]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Replace mock data with actual API calls
      const [foldersResponse, imagesResponse] = await Promise.all([
        folderAPI.getAll(),
        imageAPI.getAll()
      ]);
      
      setFolders(foldersResponse.data.data || []);
      setImages(imagesResponse.data.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    if (!searchQuery.trim()) {
      setFilteredFolders(folders);
      setFilteredImages(images);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredF = folders.filter(folder =>
      folder.name.toLowerCase().includes(query)
    );
    const filteredI = images.filter(image =>
      image.name.toLowerCase().includes(query) ||
      image.tags?.some(tag => tag.toLowerCase().includes(query))
    );

    setFilteredFolders(filteredF);
    setFilteredImages(filteredI);
  };

  const handleCreateFolder = async (formData) => {
    try {
      setModalLoading(true);
      const response = await folderAPI.create(formData);
      const newFolder = response.data.data;
      // Add the new folder to the folders list immediately
      setFolders(prev => [newFolder, ...prev]);
      toast.success('Folder created successfully!');
      setShowCreateFolder(false);
    } catch (error) {
      console.error('Create folder error:', error);
      toast.error(error.response?.data?.message || 'Failed to create folder');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditFolder = (folder) => {
    setEditFolderModal({ isOpen: true, folder });
  };

  const handleUpdateFolder = async (formData) => {
    try {
      setModalLoading(true);
      const response = await folderAPI.update(editFolderModal.folder._id, formData);
      const updatedFolder = response.data.data;
      // Update the folder in the folders list immediately
      setFolders(prev => prev.map(f => 
        f._id === editFolderModal.folder._id ? updatedFolder : f
      ));
      toast.success('Folder updated successfully!');
      setEditFolderModal({ isOpen: false, folder: null });
    } catch (error) {
      console.error('Update folder error:', error);
      toast.error(error.response?.data?.message || 'Failed to update folder');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteFolder = (folder) => {
    setDeleteModal({ isOpen: true, item: { type: 'folder', item: folder } });
  };

  const handleEditImage = (image) => {
    setEditImageModal({ isOpen: true, image });
  };

  const handleUpdateImage = async (formData) => {
    try {
      setModalLoading(true);
      // Mock API call
      const updatedImage = {
        ...editImageModal.image,
        name: formData.name,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      setImages(prev => prev.map(i => 
        i._id === editImageModal.image._id ? updatedImage : i
      ));
      toast.success('Image updated successfully!');
      setEditImageModal({ isOpen: false, image: null });
    } catch (error) {
      toast.error('Failed to update image');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteImage = (image) => {
    setDeleteModal({ isOpen: true, item: { type: 'image', item: image } });
  };

  const handleConfirmDelete = async () => {
    try {
      setModalLoading(true);
      const { type, item } = deleteModal.item;
      
      if (type === 'folder') {
        await folderAPI.delete(item._id);
        // Remove the folder from the folders list immediately
        setFolders(prev => prev.filter(f => f._id !== item._id));
        toast.success('Folder deleted successfully!');
      } else {
        await imageAPI.delete(item._id);
        // Remove the image from the images list immediately
        setImages(prev => prev.filter(i => i._id !== item._id));
        toast.success('Image deleted successfully!');
      }
      
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete item');
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewImage = (image) => {
    setViewImageModal({ isOpen: true, image });
  };

  const handleUploadImage = async (imageData) => {
    try {
      setModalLoading(true);
      
      // Handle multiple file uploads
      const uploadPromises = imageData.files.map(async (file, index) => {
        const formData = new FormData();
        formData.append('image', file);
        
        // Add name with index if multiple files
        const fileName = imageData.files.length > 1 
          ? `${imageData.name || 'image'}-${index + 1}` 
          : (imageData.name || file.name);
        
        formData.append('name', fileName);
        if (imageData.tags) formData.append('tags', imageData.tags);
        formData.append('folderId', 'root'); // Dashboard uploads go to root
        
        return imageAPI.upload(formData);
      });
      
      const responses = await Promise.all(uploadPromises);
      const newImages = responses.map(response => response.data.data);
      
      setImages(prev => [...newImages, ...prev]);
      toast.success(`${newImages.length} image(s) uploaded successfully!`);
      setShowUploadImage(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your folders and images
              </p>
            </div>

            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center space-x-2"
                variant="secondary"
              >
                <Plus className="w-4 h-4" />
                <span>New Folder</span>
              </Button>
              <Button
                onClick={() => setShowUploadImage(true)}
                className="flex items-center space-x-2"
                variant="gradient"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Search and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-dark-700 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search folders and images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* View Mode Toggle with improved styling */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600 gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          {/* Folders Section */}
          {filteredFolders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Folders
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({filteredFolders.length})
                  </span>
                </h2>
              </div>
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {filteredFolders.map((folder, index) => (
                  <motion.div
                    key={folder._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FolderCard
                      folder={folder}
                      onEdit={handleEditFolder}
                      onDelete={handleDeleteFolder}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Images Section */}
          {filteredImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Recent Images
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({filteredImages.length})
                  </span>
                </h2>
              </div>
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                    : 'grid-cols-1'
                }`}
              >
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ImageCard
                      image={image}
                      onEdit={handleEditImage}
                      onDelete={handleDeleteImage}
                      onView={handleViewImage}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {filteredFolders.length === 0 && filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {searchQuery ? (
                    <Search className="w-12 h-12 text-gray-400" />
                  ) : (
                    <FolderOpen className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {searchQuery ? 'No results found' : 'No content yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {searchQuery 
                    ? `No folders or images match "${searchQuery}"`
                    : 'Start by creating your first folder or uploading an image'
                  }
                </p>
                {!searchQuery && (
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => setShowCreateFolder(true)}
                      className="flex items-center space-x-2"
                      variant="secondary"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Folder</span>
                    </Button>
                    <Button
                      onClick={() => setShowUploadImage(true)}
                      className="flex items-center space-x-2"
                      variant="gradient"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onSubmit={handleCreateFolder}
        loading={modalLoading}
      />

      <UploadImageModal
        isOpen={showUploadImage}
        onClose={() => setShowUploadImage(false)}
        onSubmit={handleUploadImage}
        loading={modalLoading}
        currentFolderId={null} // Dashboard uploads to root
      />

      <EditFolderModal
        isOpen={editFolderModal.isOpen}
        onClose={() => setEditFolderModal({ isOpen: false, folder: null })}
        onSubmit={handleUpdateFolder}
        folder={editFolderModal.folder}
        loading={modalLoading}
      />

      <EditImageModal
        isOpen={editImageModal.isOpen}
        onClose={() => setEditImageModal({ isOpen: false, image: null })}
        onSubmit={handleUpdateImage}
        image={editImageModal.image}
        loading={modalLoading}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleConfirmDelete}
        item={deleteModal.item}
        loading={modalLoading}
      />

      <ImageViewModal
        isOpen={viewImageModal.isOpen}
        onClose={() => setViewImageModal({ isOpen: false, image: null })}
        image={viewImageModal.image}
      />
    </div>
  );
};

export default DashboardPage;