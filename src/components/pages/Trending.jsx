import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import DealCard from '@/components/molecules/DealCard'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import dealService from '@/services/api/dealService'

const Trending = () => {
  const [trendingDeals, setTrendingDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState('week') // 'week', 'month', 'all'

  useEffect(() => {
    loadTrendingDeals()
  }, [timeframe])

  const loadTrendingDeals = async () => {
    setLoading(true)
    setError(null)
    try {
      const deals = await dealService.getTrending()
      setTrendingDeals(deals)
    } catch (err) {
      setError(err.message || 'Failed to load trending deals')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = (updatedDeal) => {
    setTrendingDeals(prev => prev.map(deal => 
      deal.Id === updatedDeal.Id ? updatedDeal : deal
    ))
  }

  const timeframeOptions = [
    { value: 'week', label: 'This Week', icon: 'Calendar' },
    { value: 'month', label: 'This Month', icon: 'CalendarDays' },
    { value: 'all', label: 'All Time', icon: 'Clock' }
  ]

  return (
    <div className="min-h-screen bg-card">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-warning rounded-2xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Trending Deals
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most popular lifetime deals based on community votes and engagement. 
            These are the deals everyone is talking about!
          </p>
        </motion.div>

        {/* Timeframe Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            <div className="flex space-x-1">
              {timeframeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeframe(option.value)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                    timeframe === option.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <ApperIcon name={option.icon} className="w-4 h-4" />
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trending Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="ChevronUp" className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {trendingDeals.reduce((sum, deal) => sum + deal.votes, 0)}
            </h3>
            <p className="text-gray-600">Total Votes</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Star" className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {trendingDeals.filter(deal => deal.featured).length}
            </h3>
            <p className="text-gray-600">Featured Deals</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Zap" className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {trendingDeals.length}
            </h3>
            <p className="text-gray-600">Hot Deals</p>
          </div>
        </motion.div>

        {/* Deals Grid */}
        {loading ? (
          <SkeletonLoader count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadTrendingDeals} />
        ) : trendingDeals.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="TrendingUp" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No trending deals found
            </h3>
            <p className="text-gray-600">
              Check back later for the hottest deals!
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Top Deal */}
            {trendingDeals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="absolute -top-4 left-8 z-10">
                  <div className="bg-gradient-to-r from-accent to-warning text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    🏆 #1 Trending
                  </div>
                </div>
                <div className="pt-4">
                  <DealCard 
                    deal={trendingDeals[0]} 
                    onVote={handleVote}
                  />
                </div>
              </motion.div>
            )}

            {/* Rest of the deals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingDeals.slice(1).map((deal, index) => (
                <motion.div
                  key={deal.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      #{index + 2}
                    </div>
                  </div>
                  <DealCard 
                    deal={deal} 
                    onVote={handleVote}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 text-white"
        >
          <ApperIcon name="Megaphone" className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            Know a Great Deal?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Help the community by submitting lifetime deals you've discovered. 
            The best submissions get featured and earn recognition!
          </p>
          <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-200 hover:scale-105">
            Submit a Deal
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Trending