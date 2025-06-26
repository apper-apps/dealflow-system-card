import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import dealService from '@/services/api/dealService'

const FeaturedBanner = () => {
  const [featuredDeals, setFeaturedDeals] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadFeaturedDeals()
  }, [])

  useEffect(() => {
    if (featuredDeals.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredDeals.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [featuredDeals.length])

  const loadFeaturedDeals = async () => {
    try {
      const deals = await dealService.getFeatured()
      setFeaturedDeals(deals)
    } catch (error) {
      console.error('Failed to load featured deals:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-primary to-secondary rounded-2xl animate-pulse">
        <div className="absolute inset-0 bg-black/20 rounded-2xl" />
      </div>
    )
  }

  if (featuredDeals.length === 0) {
    return null
  }

  const currentDeal = featuredDeals[currentIndex]
  const discountPercentage = Math.round((1 - currentDeal.dealPrice / currentDeal.originalPrice) * 100)

  return (
    <div className="relative h-96 rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={currentDeal.imageUrl}
            alt={currentDeal.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <motion.div
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Badge variant="accent" size="md">
                  <ApperIcon name="Star" className="w-4 h-4 mr-1" />
                  Featured Deal
                </Badge>
                <Badge variant="discount" size="md">
                  Save {discountPercentage}%
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {currentDeal.title}
              </h1>

              <p className="text-xl text-gray-200 mb-6 line-clamp-2">
                {currentDeal.description}
              </p>

              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-white">
                    ${currentDeal.dealPrice}
                  </span>
                  <span className="text-xl text-gray-300 line-through">
                    ${currentDeal.originalPrice}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-gray-200">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="ChevronUp" className="w-5 h-5" />
                    <span>{currentDeal.votes} votes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" className="w-5 h-5" />
                    <span>Limited time</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => window.open(currentDeal.affiliateLink, '_blank')}
                >
                  Get This Deal
                  <ApperIcon name="ExternalLink" className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(`/deal/${currentDeal.Id}`)}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      {featuredDeals.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredDeals.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {featuredDeals.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : featuredDeals.length - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          >
            <ApperIcon name="ChevronLeft" className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentIndex((currentIndex + 1) % featuredDeals.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          >
            <ApperIcon name="ChevronRight" className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  )
}

export default FeaturedBanner