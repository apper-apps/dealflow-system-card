import { motion } from 'framer-motion'
import FeaturedBanner from '@/components/organisms/FeaturedBanner'
import DealList from '@/components/organisms/DealList'
import Sidebar from '@/components/organisms/Sidebar'

const Home = () => {
  return (
    <div className="min-h-screen bg-card">
      <div className="container mx-auto px-4 py-8">
        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <FeaturedBanner />
        </motion.div>

{/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Deal List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 lg:flex-[3]"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Latest Deals
              </h2>
              <p className="text-gray-600">
                Discover the best lifetime software deals, curated by our community
              </p>
            </div>
            <DealList showFilters={true} />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-1 lg:flex-[1]"
          >
            <Sidebar />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home