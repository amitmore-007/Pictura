import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Clock, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { imageAPI } from '../services/api.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingSpinner from '../components/UI/LoadingSpinner.jsx';
import ImageCard from '../components/Image/ImageCard.jsx';
import EditImageModal from '../components/Modal/EditImageModal.jsx';
import DeleteConfirmModal from '../components/Modal/DeleteConfirmModal.jsx';
import ImageViewModal from '../components/Modal/ImageViewModal.jsx';

const SearchPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [images, setImages] = useState([]); // Ensure default empty array
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recentSearches, setRecentSearches] = useState([]); // Ensure default empty array

  // Modal states
  const [showEditImage, setShowEditImage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageView, setShowImageView] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== searchQuery) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query = searchQuery, page = 1) => {
    if (!query.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      
      const response = await imageAPI.search(query, page);
      // Add safety checks for the response data
      setImages(response.data?.data || response.data?.images || []);
      setTotalPages(response.data?.totalPages || 1);
      setCurrentPage(page);

      // Update URL
      setSearchParams({ q: query, page: page.toString() });

      // Save to recent searches
      saveRecentSearch(query);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const saveRecentSearch = (query) => {
    const recent = recentSearches.filter(s => s !== query);
    const updated = [query, ...recent].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleRecentSearch = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
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

  const handleDeleteImage = (image) => {
    setDeleteItem({ type: 'image', item: image });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await imageAPI.delete(deleteItem.item._id);
      setImages(prev => prev.filter(img => img._id !== deleteItem.item._id));
      toast.success('Image deleted successfully');
      setShowDeleteConfirm(false);
      setDeleteItem(null);
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleViewImage = (image) => {
    setSelectedImage(image);
    setShowImageView(true);
  };

  const handlePageChange = (page) => {
    handleSearch(searchQuery, page);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Search Your Images
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find any image instantly by searching through names, tags, and metadata
            </p>
          </motion.div>
        </div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-dark-700 mb-8 w-full"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by image name, tags, or folder..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </>
                )}
              </motion.button>

              {/* View Mode Toggle */}
              {hasSearched && (
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-dark-600 text-blue-600 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-dark-600 text-blue-600 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !hasSearched && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleRecentSearch(search)}
                    className="px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Search Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center py-16 w-full">
                <LoadingSpinner size="large" />
              </div>
            ) : (images || []).length > 0 ? (
              <div className="w-full">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6 w-full">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Search Results for "{searchQuery}"
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {(images || []).length} image{(images || []).length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {/* Images Grid */}
                <div className={`w-full grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
                    : 'grid-cols-1'
                }`}>
                  {(images || []).map((image, index) => (
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
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-12 space-x-2 w-full">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                        }`}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-16 w-full">
                <div className="w-24 h-24 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No images found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  We couldn't find any images matching "{searchQuery}". Try different keywords or check your spelling.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Search Tips */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 w-full"
          >
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
              Search Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800 dark:text-blue-200">
              <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Search by tags</p>
                  <p className="text-sm opacity-80">Use tags like "nature", "vacation", or "work"</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Search className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Search by name</p>
                  <p className="text-sm opacity-80">Find images by their filename or custom name</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
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

export default SearchPage;
