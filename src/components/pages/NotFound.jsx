import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-card flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Animation */}
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-8"
          >
            <div className="text-8xl md:text-9xl font-bold text-primary mb-4">
              404
            </div>
            <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Deal Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Looks like this deal has expired or the page you're looking for doesn't exist. 
              But don't worry - we have plenty of other amazing deals waiting for you!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4"
          >
            <Button
              variant="primary"
              size="lg"
              icon="Home"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon="TrendingUp"
              onClick={() => navigate('/trending')}
            >
              View Trending Deals
            </Button>
          </motion.div>

          {/* Suggested Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Grid3X3" className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Browse Categories
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Explore deals organized by software category
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/categories')}
              >
                Browse Now
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Star" className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Featured Deals
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Check out our hand-picked featured deals
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/?filter=featured')}
              >
                View Featured
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Plus" className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Submit a Deal
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Found a great deal? Share it with the community
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/submit')}
              >
                Submit Deal
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound