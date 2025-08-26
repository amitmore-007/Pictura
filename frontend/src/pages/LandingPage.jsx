import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, FolderOpen, Search, Shield, Zap, Cloud } from 'lucide-react';
import Button from '../components/UI/Button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FolderOpen,
      title: 'Nested Folders',
      description: 'Create unlimited nested folders just like Google Drive',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Upload,
      title: 'Image Upload',
      description: 'Upload and organize your images with custom names and tags',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find your images instantly with powerful search functionality',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and only accessible by you',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern technology for optimal performance',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Cloud,
      title: 'Cloud Storage',
      description: 'Reliable cloud storage powered by Cloudinary',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-950 dark:to-dark-900 w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 w-full">
        <div className="absolute inset-0 bg-moving-gradient opacity-10"></div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8"
            >
              Organize Your
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Images Like Magic
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              The most beautiful and intuitive way to organize, store, and search your images. 
              Create nested folders, upload with ease, and find anything instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="large" variant="gradient" className="group">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="large" variant="gradient" className="group">
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="large" variant="secondary">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Floating Animation Elements */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0] 
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -5, 0] 
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2 
            }}
            className="absolute top-40 right-10 w-32 h-32 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full opacity-20 blur-xl"
          />

          {/* Hero Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 mx-auto max-w-4xl"
          >
            <div className="relative">
              {/* Main Dashboard Mockup */}
              <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-dark-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">Pictura Dashboard</div>
                </div>
                
                {/* Mock Interface */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 flex items-center space-x-3">
                      <FolderOpen className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white dark:bg-dark-800 rounded-xl p-3 shadow-lg border border-gray-200 dark:border-dark-700"
              >
                <Search className="w-6 h-6 text-blue-600" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-dark-800 rounded-xl p-3 shadow-lg border border-gray-200 dark:border-dark-700"
              >
                <Cloud className="w-6 h-6 text-green-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 dark:bg-black/20 backdrop-blur-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage your images efficiently and beautifully.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative w-full"
              >
                <div className="card-glow">
                  <div className="relative bg-white dark:bg-dark-800 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-dark-700">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Dobbt for their image organization needs.
            </p>
            {!isAuthenticated && (
              <Link to="/signup">
                <Button size="large" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                  Create Your Free Account
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;