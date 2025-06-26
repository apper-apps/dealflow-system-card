import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">DealFlow Hub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Discover the best lifetime software deals curated by our community of deal hunters.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="space-y-2">
              <NavLink to="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </NavLink>
              <NavLink to="/categories" className="block text-gray-400 hover:text-white transition-colors">
                Categories
              </NavLink>
              <NavLink to="/trending" className="block text-gray-400 hover:text-white transition-colors">
                Trending
              </NavLink>
              <NavLink to="/submit" className="block text-gray-400 hover:text-white transition-colors">
                Submit Deal
              </NavLink>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Popular Categories</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <div>Productivity</div>
              <div>Design</div>
              <div>Marketing</div>
              <div>Developer Tools</div>
              <div>Analytics</div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-gray-400 text-sm">
              Get the best deals delivered to your inbox weekly.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors">
                <ApperIcon name="Send" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 DealFlow Hub. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <ApperIcon name="Twitter" className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <ApperIcon name="Github" className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <ApperIcon name="Mail" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer