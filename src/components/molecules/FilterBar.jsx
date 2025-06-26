import { useState } from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const FilterBar = ({ 
  categories = [], 
  onFilterChange,
  className = '' 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [status, setStatus] = useState('all')

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    onFilterChange?.({
      category: category === 'all' ? null : category,
      sortBy,
      status: status === 'all' ? null : status
    })
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    onFilterChange?.({
      category: selectedCategory === 'all' ? null : selectedCategory,
      sortBy: newSort,
      status: status === 'all' ? null : status
    })
  }

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus)
    onFilterChange?.({
      category: selectedCategory === 'all' ? null : selectedCategory,
      sortBy,
      status: newStatus === 'all' ? null : newStatus
    })
  }

  return (
    <div className={`flex flex-wrap gap-4 items-center ${className}`}>
      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Category:</span>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Status:</span>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant={status === 'all' ? 'primary' : 'ghost'}
            onClick={() => handleStatusChange('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={status === 'active' ? 'primary' : 'ghost'}
            onClick={() => handleStatusChange('active')}
          >
            Active
          </Button>
          <Button
            size="sm"
            variant={status === 'featured' ? 'primary' : 'ghost'}
            onClick={() => handleStatusChange('featured')}
          >
            Featured
          </Button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant={sortBy === 'newest' ? 'primary' : 'ghost'}
            onClick={() => handleSortChange('newest')}
          >
            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
            Newest
          </Button>
          <Button
            size="sm"
            variant={sortBy === 'votes' ? 'primary' : 'ghost'}
            onClick={() => handleSortChange('votes')}
          >
            <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1" />
            Most Voted
          </Button>
          <Button
            size="sm"
            variant={sortBy === 'ending' ? 'primary' : 'ghost'}
            onClick={() => handleSortChange('ending')}
          >
            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
            Ending Soon
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar