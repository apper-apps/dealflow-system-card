import { motion } from 'framer-motion'
import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import { formatDistanceToNow } from 'date-fns'

const DealKanbanCard = ({ deal, onDragStart, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false)
  
  const discountPercentage = Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)
  const timeRemaining = formatDistanceToNow(new Date(deal.expiryDate), { addSuffix: true })

  const handleToggleFeatured = () => {
    onEdit(deal.Id, { featured: !deal.featured })
  }

  const handleToggleStatus = () => {
    const newStatus = deal.status === 'active' ? 'inactive' : 'active'
    onEdit(deal.Id, { status: newStatus })
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-move hover:shadow-md transition-all duration-200"
    >
      {/* Drag Handle */}
      <div className="flex items-center justify-between mb-3">
        <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
        <div className="flex items-center space-x-1">
          <Badge variant="discount" size="xs">
            -{discountPercentage}%
          </Badge>
          {deal.featured && (
            <Badge variant="accent" size="xs">
              <ApperIcon name="Star" className="w-3 h-3" />
            </Badge>
          )}
        </div>
      </div>

      {/* Deal Image */}
      <img
        src={deal.imageUrl}
        alt={deal.title}
        className="w-full h-24 object-cover rounded-lg mb-3"
      />

      {/* Deal Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
          {deal.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-primary text-sm">
              ${deal.dealPrice}
            </span>
            <span className="text-xs text-gray-400 line-through">
              ${deal.originalPrice}
            </span>
          </div>
          <Badge variant="default" size="xs">
            {deal.category}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <ApperIcon name="ChevronUp" className="w-3 h-3" />
            <span>{deal.votes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" className="w-3 h-3" />
            <span>Ends {timeRemaining}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: showActions ? 1 : 0, 
          height: showActions ? 'auto' : 0 
        }}
        className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between overflow-hidden"
      >
        <div className="flex items-center space-x-1">
          <button
            onClick={handleToggleFeatured}
            className={`p-1 rounded transition-colors ${
              deal.featured 
                ? 'text-accent bg-accent/10' 
                : 'text-gray-400 hover:text-accent'
            }`}
            title={deal.featured ? 'Remove from featured' : 'Make featured'}
          >
            <ApperIcon name="Star" className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToggleStatus}
            className={`p-1 rounded transition-colors ${
              deal.status === 'active'
                ? 'text-success bg-success/10'
                : 'text-gray-400 hover:text-success'
            }`}
            title={deal.status === 'active' ? 'Make inactive' : 'Make active'}
          >
            <ApperIcon name={deal.status === 'active' ? 'Eye' : 'EyeOff'} className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            className="p-1 rounded text-gray-400 hover:text-primary transition-colors"
            title="Edit deal"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(deal.Id)}
            className="p-1 rounded text-gray-400 hover:text-error transition-colors"
            title="Delete deal"
          >
            <ApperIcon name="Trash" className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DealKanbanCard