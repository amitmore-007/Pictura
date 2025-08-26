import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Upload, Search, Grid, List, Home, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { folderAPI, imageAPI } from '../services/api.jsx';
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

const FolderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [currentFolder, setCurrentFolder] = useState(null);
  const [subfolders, setSubfolders] = useState([]);
  const [images, setImages] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // ...existing modal states and handlers (same as DashboardPage)...
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [showEditImage, setShowEditImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageView, setShowImageView] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    if (id) {
      loadFolderData();
    }
  }, [id]);

  const loadFolderData = async () => {
    try {
      setLoading(true);
      const [folderRes, subfoldersRes, imagesRes, allFoldersRes] = await Promise.all([
        folderAPI.getById(id),
        folderAPI.getAll(id),
        imageAPI.getAll(id),
        folderAPI.getAll()
      ]);
      
      // Add null checks and default values
      setCurrentFolder(folderRes?.data?.data || null);
      setSubfolders(Array.isArray(subfoldersRes?.data?.data) ? subfoldersRes.data.data : []);
      setImages(Array.isArray(imagesRes?.data?.data) ? imagesRes.data.data : []);
      setAllFolders(Array.isArray(allFoldersRes?.data?.data) ? allFoldersRes.data.data : []);
    } catch (error) {
      console.error('Load folder data error:', error);
      toast.error('Failed to load folder data');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (folderData) => {
    try {
      const response = await folderAPI.create({ ...folderData, parent: id });
      // Add the new folder to the subfolders list immediately
      setSubfolders(prev => [response.data.data, ...prev]);
      toast.success('Folder created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create folder');
      throw error;
    }
  };

  const handleUploadImage = async (imageData) => {
    try {
      // Create FormData and add current folder ID
      const formData = new FormData();
      
      // Add all files
      imageData.files.forEach((file, index) => {
        formData.append('image', file);
      });
      
      // Add metadata
      if (imageData.name) formData.append('name', imageData.name);
      if (imageData.tags) formData.append('tags', imageData.tags);
      formData.append('folderId', id);
      
      // Upload each file (for now, just upload the first one)
      if (imageData.files.length > 0) {
        const singleFormData = new FormData();
        singleFormData.append('image', imageData.files[0]);
        if (imageData.name) singleFormData.append('name', imageData.name);
        if (imageData.tags) singleFormData.append('tags', imageData.tags);
        singleFormData.append('folderId', id);
        
        const response = await imageAPI.upload(singleFormData);
        setImages(prev => [response.data.data, ...prev]);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
      throw error;
    }
  };

  // ...existing handlers (same pattern as DashboardPage)...
  const handleEditFolder = (folder) => {
    setSelectedFolder(folder);
    setShowEditFolder(true);
  };

  const handleUpdateFolder = async (folderData) => {
    try {
      const response = await folderAPI.update(selectedFolder._id, folderData);
      if (selectedFolder._id === id) {
        setCurrentFolder(response.data.folder);
      } else {
        setSubfolders(prev => prev.map(f => f._id === selectedFolder._id ? response.data.folder : f));
      }
      toast.success('Folder updated successfully');
      setShowEditFolder(false);
      setSelectedFolder(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update folder');
      throw error;
    }
  };

  const handleEditImage = (image) => {
    setSelectedImage(image);
    setShowEditImage(true);
  };

  const handleUpdateImage = async (imageData) => {
    try {
      const response = await imageAPI.update(selectedImage._id, imageData);
      setImages(prev => prev.map(img => img._id === selectedImage._id ? response.data.image : img));
      toast.success('Image updated successfully');
      setShowEditImage(false);
      setSelectedImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update image');
      throw error;
    }
  };

  const handleDeleteFolder = (folder) => {
    setDeleteItem({ type: 'folder', item: folder });
    setShowDeleteConfirm(true);
  };

  const handleDeleteImage = (image) => {
    setDeleteItem({ type: 'image', item: image });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteItem.type === 'folder') {
        await folderAPI.delete(deleteItem.item._id);
        if (deleteItem.item._id === id) {
          // If current folder is deleted, navigate back
          navigate('/dashboard');
          return;
        }
        setSubfolders(prev => prev.filter(f => f._id !== deleteItem.item._id));
        toast.success('Folder deleted successfully');
      } else {
        await imageAPI.delete(deleteItem.item._id);
        setImages(prev => prev.filter(img => img._id !== deleteItem.item._id));
        toast.success('Image deleted successfully');
      }
      setShowDeleteConfirm(false);
      setDeleteItem(null);
    } catch (error) {
      toast.error(`Failed to delete ${deleteItem.type}`);
    }
  };

  const handleViewImage = (image) => {
    setSelectedImage(image);
    setShowImageView(true);
  };

  const filteredSubfolders = subfolders.filter(folder =>
    folder && folder.name && folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredImages = images.filter(image =>
    image && image.name && (
      image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (image.tags && Array.isArray(image.tags) && image.tags.some(tag => 
        tag && typeof tag === 'string' && tag.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!currentFolder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Folder not found
          </h2>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <FolderOpen 
                    className="w-6 h-6"
                    style={{ color: currentFolder.color || '#3B82F6' }}
                  />
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentFolder.name}
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentFolder.path && `Path: ${currentFolder.path}`}
                </p>
              </div>
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
          className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-dark-700 mb-8 w-full"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search in this folder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content with full width */}
        <div className="w-full">
          {/* Subfolders Section */}
          {filteredSubfolders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 w-full"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Subfolders
              </h2>
              <div className={`w-full grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                  : 'grid-cols-1'
              }`}>
                {filteredSubfolders.map((folder, index) => (
                  <motion.div
                    key={folder._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full"
                  >
                    <FolderCard
                      folder={folder}
                      onEdit={handleEditFolder}
                      onDelete={handleDeleteFolder}
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
              className="w-full"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Images
              </h2>
              <div className={`w-full grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                  : 'grid-cols-1'
              }`}>
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full"
                  >
                    <ImageCard
                      image={image}
                      onEdit={handleEditImage}
                      onDelete={handleDeleteImage}
                      onView={handleViewImage}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {filteredSubfolders.length === 0 && filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: currentFolder.color + '20' }}
              >
                <FolderOpen 
                  className="w-12 h-12"
                  style={{ color: currentFolder.color || '#3B82F6' }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No results found' : 'This folder is empty'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {searchQuery 
                  ? `No items match "${searchQuery}" in this folder`
                  : 'Create a subfolder or upload an image to get started'
                }
              </p>
              {!searchQuery && (
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button
                    onClick={() => setShowCreateFolder(true)}
                    variant="secondary"
                  >
                    Create Subfolder
                  </Button>
                  <Button
                    onClick={() => setShowUploadImage(true)}
                    variant="gradient"
                  >
                    Upload Image
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals - same as DashboardPage */}
      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onSubmit={handleCreateFolder}
        loading={loading}
      />

      <UploadImageModal
        isOpen={showUploadImage}
        onClose={() => setShowUploadImage(false)}
        onSubmit={handleUploadImage}
        folders={[currentFolder, ...allFolders]}
        loading={loading}
        currentFolderId={id}
      />

      <EditFolderModal
        isOpen={showEditFolder}
        onClose={() => {
          setShowEditFolder(false);
          setSelectedFolder(null);
        }}
        onSubmit={handleUpdateFolder}
        folder={selectedFolder}
        loading={loading}
      />

      <EditImageModal
        isOpen={showEditImage}
        onClose={() => {
          setShowEditImage(false);
          setSelectedImage(null);
        }}
        onSubmit={handleUpdateImage}
        image={selectedImage}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteItem(null);
        }}
        onConfirm={handleConfirmDelete}
        item={deleteItem}
        loading={loading}
      />

      <ImageViewModal
        isOpen={showImageView}
        onClose={() => {
          setShowImageView(false);
          setSelectedImage(null);
        }}
        image={selectedImage}
      />
    </div>
  );
};

export default FolderPage;


