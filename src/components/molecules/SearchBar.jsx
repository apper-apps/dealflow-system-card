import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  placeholder = 'Search deals...', 
  onSearch, 
  className = '' 
}) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch?.('')
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchBar