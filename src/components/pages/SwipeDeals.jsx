import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import EmptyState from '@/components/atoms/EmptyState'
import dealService from '@/services/api/dealService'

const SwipeDeals = () => {
  const [deals, setDeals] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [likedDeals, setLikedDeals] = useState([])
  const [passedDeals, setPassedDeals] = useState([])

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0, 1, 1, 1, 0])

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dealService.getAll()
      // Only show active deals
      const activeDeals = data.filter(deal => deal.status === 'active')
      setDeals(activeDeals)
    } catch (err) {
      setError('Failed to load deals')
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = (direction, dealId) => {
    setSwipeDirection(direction)
    
    if (direction === 'right') {
      setLikedDeals(prev => [...prev, dealId])
      toast.success('❤️ Deal liked!')
    } else {
      setPassedDeals(prev => [...prev, dealId])
      toast.info('👋 Deal passed')
    }

    // Move to next deal after animation
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setSwipeDirection(null)
      x.set(0)
    }, 300)
  }

  const handleDragEnd = (event, info) => {
    const threshold = 100
    const { offset, velocity } = info

    if (offset.x > threshold || velocity.x > 500) {
      handleSwipe('right', currentDeal?.Id)
    } else if (offset.x < -threshold || velocity.x < -500) {
      handleSwipe('left', currentDeal?.Id)
    } else {
      // Snap back to center
      x.set(0)
    }
  }

  const handleButtonAction = (action) => {
    if (currentIndex >= deals.length) return
    handleSwipe(action, currentDeal?.Id)
  }

  const resetSwipe = () => {
    setCurrentIndex(0)
    setLikedDeals([])
    setPassedDeals([])
    setSwipeDirection(null)
    x.set(0)
    toast.info('🔄 Starting fresh!')
  }

  const currentDeal = deals[currentIndex]
  const nextDeal = deals[currentIndex + 1]
  const isComplete = currentIndex >= deals.length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-md mx-auto pt-20">
          <SkeletonLoader className="w-full h-96 rounded-2xl mb-4" />
          <div className="flex justify-center space-x-4">
            <SkeletonLoader className="w-16 h-16 rounded-full" />
            <SkeletonLoader className="w-16 h-16 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-md mx-auto pt-20">
          <ErrorState 
            message={error}
            onRetry={loadDeals}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Swipe Deals
          </h1>
          <p className="text-gray-600">
            Swipe right to like, left to pass
          </p>
          <div className="flex justify-center items-center space-x-4 mt-4">
            <div className="text-sm text-gray-500">
              {deals.length - currentIndex} deals remaining
            </div>
            {(likedDeals.length > 0 || passedDeals.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                icon="RotateCcw"
                onClick={resetSwipe}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Card Stack */}
        <div className="relative h-96 mb-8">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <EmptyState
                  icon="Heart"
                  title="All done!"
                  message={`You liked ${likedDeals.length} deals and passed on ${passedDeals.length}`}
                  actionLabel="Start Over"
                  onAction={resetSwipe}
                />
              </motion.div>
            ) : (
              <>
                {/* Next Card (Background) */}
                {nextDeal && (
                  <motion.div
                    key={`next-${nextDeal.Id}`}
                    className="absolute inset-0 bg-white rounded-2xl shadow-lg scale-95 opacity-50"
                    initial={{ scale: 0.95, opacity: 0.5 }}
                    animate={{ scale: 0.95, opacity: 0.5 }}
                  >
                    <div className="h-48 bg-gray-200 rounded-t-2xl" />
                  </motion.div>
                )}

                {/* Current Card */}
                {currentDeal && (
                  <motion.div
                    key={currentDeal.Id}
                    className="absolute inset-0 bg-white rounded-2xl shadow-xl cursor-grab active:cursor-grabbing"
                    style={{ x, rotate, opacity }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={handleDragEnd}
                    animate={swipeDirection ? {
                      x: swipeDirection === 'right' ? 300 : -300,
                      opacity: 0,
                      scale: 0.8
                    } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {/* Deal Image */}
                    <div className="h-48 bg-gray-200 rounded-t-2xl overflow-hidden">
                      <img
                        src={currentDeal.imageUrl}
                        alt={currentDeal.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
                        }}
                      />
                      {currentDeal.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="accent" icon="Star">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Deal Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {currentDeal.title}
                        </h3>
                        <Badge variant="secondary">
                          {currentDeal.category}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {currentDeal.description}
                      </p>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-primary">
                            ${currentDeal.dealPrice}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            ${currentDeal.originalPrice}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-600 font-medium">
                            {Math.round((1 - currentDeal.dealPrice / currentDeal.originalPrice) * 100)}% OFF
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="ThumbsUp" size={14} />
                          <span>{currentDeal.votes} votes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="Clock" size={14} />
                          <span>
                            {formatDistanceToNow(new Date(currentDeal.expiryDate), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Swipe Indicators */}
                    <motion.div
                      className="absolute top-1/2 left-8 transform -translate-y-1/2 text-6xl font-bold text-red-500 opacity-0"
                      style={{ opacity: useTransform(x, [-100, -50], [1, 0]) }}
                    >
                      PASS
                    </motion.div>
                    <motion.div
                      className="absolute top-1/2 right-8 transform -translate-y-1/2 text-6xl font-bold text-green-500 opacity-0"
                      style={{ opacity: useTransform(x, [50, 100], [1, 0]) }}
                    >
                      LIKE
                    </motion.div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {!isComplete && currentDeal && (
          <div className="flex justify-center space-x-8">
            <motion.button
              className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
              onClick={() => handleButtonAction('left')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="X" size={24} />
            </motion.button>
            
            <motion.button
              className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center text-white hover:from-pink-600 hover:to-red-600 transition-colors"
              onClick={() => handleButtonAction('right')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="Heart" size={28} />
            </motion.button>
          </div>
        )}

        {/* Stats */}
        {(likedDeals.length > 0 || passedDeals.length > 0) && (
          <div className="mt-8 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-green-500">{likedDeals.length}</div>
                <div className="text-sm text-gray-500">Liked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{passedDeals.length}</div>
                <div className="text-sm text-gray-500">Passed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SwipeDeals