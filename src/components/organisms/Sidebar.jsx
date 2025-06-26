import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import bannerService from '@/services/api/bannerService'

const Sidebar = () => {
  const [banners, setBanners] = useState([])
  const [email, setEmail] = useState('')

  useEffect(() => {
    loadSidebarBanners()
  }, [])

  const loadSidebarBanners = async () => {
    try {
      const data = await bannerService.getByPosition('sidebar')
      setBanners(data)
    } catch (error) {
      console.error('Failed to load sidebar banners:', error)
    }
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    
    // Newsletter signup logic would go here
    console.log('Newsletter signup:', email)
    setEmail('')
    alert('Thanks for subscribing!')
  }

  return (
    <div className="space-y-6">
      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-secondary p-6 rounded-xl text-white"
      >
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="Mail" className="w-6 h-6" />
          <h3 className="font-semibold text-lg">Never Miss a Deal</h3>
        </div>
        <p className="text-primary-100 text-sm mb-4">
          Get the best lifetime deals delivered to your inbox weekly.
        </p>
        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <Button
            type="submit"
            variant="outline"
            className="w-full border-white text-white hover:bg-white hover:text-primary"
          >
            Subscribe
          </Button>
        </form>
      </motion.div>

      {/* Trending Deals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="TrendingUp" className="w-6 h-6 text-accent" />
          <h3 className="font-semibold text-lg">Trending This Week</h3>
        </div>
        <div className="space-y-3">
          {[
            { title: 'CloudSync Pro', votes: 127, category: 'Productivity' },
            { title: 'EmailFlow Platform', votes: 156, category: 'Marketing' },
            { title: 'SocialGrowth Analytics', votes: 94, category: 'Analytics' }
          ].map((deal, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex flex-col items-center">
                <ApperIcon name="ChevronUp" className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">{deal.votes}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{deal.title}</p>
                <p className="text-xs text-gray-500">{deal.category}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dynamic Banners */}
      {banners.map((banner, index) => (
        <motion.div
          key={banner.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
        >
          <a
            href={banner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:opacity-90 transition-opacity"
          >
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-sm mb-1">{banner.title}</h4>
              <p className="text-xs text-gray-600">{banner.description}</p>
            </div>
          </a>
        </motion.div>
      ))}

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="Grid3X3" className="w-6 h-6 text-secondary" />
          <h3 className="font-semibold text-lg">Categories</h3>
        </div>
        <div className="space-y-2">
          {[
            { name: 'Productivity', count: 23, icon: 'Zap' },
            { name: 'Design', count: 18, icon: 'Palette' },
            { name: 'Marketing', count: 15, icon: 'Megaphone' },
            { name: 'Developer Tools', count: 12, icon: 'Code' },
            { name: 'Analytics', count: 9, icon: 'BarChart3' }
          ].map((category, index) => (
            <a
              key={index}
              href={`/categories?filter=${category.name.toLowerCase()}`}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-sm"
            >
              <div className="flex items-center space-x-2">
                <ApperIcon name={category.icon} className="w-4 h-4 text-gray-500" />
                <span>{category.name}</span>
              </div>
              <span className="text-gray-400 text-xs">{category.count}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Sidebar