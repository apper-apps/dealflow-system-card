import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import dealService from '@/services/api/dealService'
import { formatDistanceToNow } from 'date-fns'

const DealCard = ({ deal, onVote }) => {
  const navigate = useNavigate()
  
  const discountPercentage = Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)
  const timeRemaining = formatDistanceToNow(new Date(deal.expiryDate), { addSuffix: true })

  const handleVote = async (e) => {
    e.stopPropagation()
    try {
      const updatedDeal = await dealService.vote(deal.Id)
      onVote?.(updatedDeal)
      toast.success('Vote added!')
    } catch (error) {
      toast.error('Failed to vote')
    }
  }

  const handleAffiliateClick = (e) => {
    e.stopPropagation()
    window.open(deal.affiliateLink, '_blank')
  }

  const handleCardClick = () => {
    navigate(`/deal/${deal.Id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, shadow: '0 8px 25px rgba(0,0,0,0.15)' }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
<div className="relative">
        <img 
          src={deal.imageUrl} 
          alt={deal.title}
          className="w-full aspect-[16/9] object-cover"
          style={{ aspectRatio: '1024/576' }}
        />
        <div className="absolute top-3 left-3">
          <Badge variant="discount" size="sm">
            -{discountPercentage}%
          </Badge>
        </div>
        {deal.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="accent" size="sm">
              <ApperIcon name="Star" className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1 min-w-0">
            {deal.title}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
            onClick={handleVote}
            className="flex flex-col items-center ml-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ApperIcon name="ChevronUp" className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-gray-900">{deal.votes}</span>
          </motion.button>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {deal.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">${deal.dealPrice}</span>
            <span className="text-lg text-gray-400 line-through">${deal.originalPrice}</span>
          </div>
          <Badge variant="default" size="xs">
            {deal.category}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
            Ends {timeRemaining}
          </span>
          <span className="flex items-center">
            <ApperIcon name="MessageCircle" className="w-4 h-4 mr-1" />
            {Math.floor(Math.random() * 20) + 1} comments
          </span>
        </div>

        <Button 
          variant="accent" 
          className="w-full" 
          onClick={handleAffiliateClick}
        >
          Get This Deal
        </Button>
      </div>
    </motion.div>
  )
}

export default DealCard