import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import DealList from '@/components/organisms/DealList'
import dealService from '@/services/api/dealService'

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('filter') || 'all')
  const [loading, setLoading] = useState(true)

  const categoryIcons = {
    'Productivity': 'Zap',
    'Design': 'Palette',
    'Marketing': 'Megaphone',
    'Developer Tools': 'Code',
    'Analytics': 'BarChart3',
    'Business': 'Briefcase',
    'Communication': 'MessageCircle',
    'Finance': 'DollarSign'
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory !== 'all') {
      setSearchParams({ filter: selectedCategory })
    } else {
      setSearchParams({})
    }
  }, [selectedCategory, setSearchParams])

  const loadCategories = async () => {
    try {
      const deals = await dealService.getAll()
      const uniqueCategories = [...new Set(deals.map(deal => deal.category))]
      const categoriesWithCounts = uniqueCategories.map(category => ({
        name: category,
        count: deals.filter(deal => deal.category === category).length,
        icon: categoryIcons[category] || 'Package'
      }))
      setCategories(categoriesWithCounts)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-card">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect lifetime deals organized by software category. 
            From productivity tools to design software, we've got you covered.
          </p>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('all')}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <ApperIcon name="Grid3X3" className="w-8 h-8 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-1">All Categories</h3>
            <p className="text-sm opacity-75">
              {categories.reduce((sum, cat) => sum + cat.count, 0)} deals
            </p>
          </motion.button>

          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.name)}
              className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                selectedCategory === category.name
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <ApperIcon name={category.icon} className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
              <p className="text-sm opacity-75">{category.count} deals</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Selected Category Header */}
        {selectedCategory !== 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <ApperIcon 
                name={categoryIcons[selectedCategory] || 'Package'} 
                className="w-8 h-8 text-primary" 
              />
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedCategory} Deals
              </h2>
            </div>
            <p className="text-gray-600">
              Discover the best lifetime deals in {selectedCategory.toLowerCase()}
            </p>
          </motion.div>
        )}

        {/* Deal List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DealList 
            showFilters={false}
            categoryFilter={selectedCategory === 'all' ? null : selectedCategory}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default Categories