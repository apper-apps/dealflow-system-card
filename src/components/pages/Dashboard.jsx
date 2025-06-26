import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import DealKanbanCard from '@/components/molecules/DealKanbanCard'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import dealService from '@/services/api/dealService'

const Dashboard = () => {
  const [deals, setDeals] = useState([])
  const [filteredDeals, setFilteredDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [draggedDeal, setDraggedDeal] = useState(null)

  const columns = [
    { id: 'inactive', title: 'Inactive', color: 'bg-gray-100' },
    { id: 'active', title: 'Active', color: 'bg-blue-50' },
    { id: 'featured', title: 'Featured', color: 'bg-accent/10' }
  ]

  useEffect(() => {
    loadDeals()
  }, [])

  useEffect(() => {
    filterDeals()
  }, [deals, searchQuery])

  const loadDeals = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await dealService.getAll()
      setDeals(data)
    } catch (err) {
      setError(err.message || 'Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const filterDeals = () => {
    let filtered = [...deals]
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredDeals(filtered)
  }

  const getDealsByStatus = (status) => {
    if (status === 'featured') {
      return filteredDeals.filter(deal => deal.featured)
    }
    return filteredDeals.filter(deal => deal.status === status)
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault()
    
    if (!draggedDeal) return

    const updates = {}
    
    if (targetStatus === 'featured') {
      updates.featured = true
      updates.status = 'active'
    } else {
      updates.status = targetStatus
      if (targetStatus !== 'active') {
        updates.featured = false
      }
    }

    try {
      const updatedDeal = await dealService.update(draggedDeal.Id, updates)
      setDeals(prev => prev.map(deal => 
        deal.Id === updatedDeal.Id ? updatedDeal : deal
      ))
      toast.success('Deal updated successfully!')
    } catch (error) {
      toast.error('Failed to update deal')
    } finally {
      setDraggedDeal(null)
    }
  }

  const handleQuickEdit = async (dealId, updates) => {
    try {
      const updatedDeal = await dealService.update(dealId, updates)
      setDeals(prev => prev.map(deal => 
        deal.Id === updatedDeal.Id ? updatedDeal : deal
      ))
      toast.success('Deal updated!')
    } catch (error) {
      toast.error('Failed to update deal')
    }
  }

  const handleDeleteDeal = async (dealId) => {
    if (!confirm('Are you sure you want to delete this deal?')) return
    
    try {
      await dealService.delete(dealId)
      setDeals(prev => prev.filter(deal => deal.Id !== dealId))
      toast.success('Deal deleted!')
    } catch (error) {
      toast.error('Failed to delete deal')
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-card">
        <div className="container mx-auto px-6 py-8">
          <SkeletonLoader count={8} type="list" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-card flex items-center justify-center">
        <ErrorState message={error} onRetry={loadDeals} />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-card">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deal Management</h1>
            <p className="text-gray-600">Manage your deals with drag & drop</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <SearchBar
              placeholder="Search deals..."
              onSearch={setSearchQuery}
              className="w-64"
            />
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
                size="sm"
                icon="Columns"
                onClick={() => setViewMode('kanban')}
              >
                Kanban
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                icon="List"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
            
            <Button variant="primary" icon="Plus">
              Add Deal
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'kanban' ? (
          <div className="h-full p-6">
            <div className="grid grid-cols-3 gap-6 h-full">
              {columns.map((column) => (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${column.color} rounded-xl p-4 flex flex-col h-full`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg text-gray-900">
                      {column.title}
                    </h2>
                    <span className="bg-white rounded-full px-2 py-1 text-sm font-medium text-gray-600">
                      {getDealsByStatus(column.id).length}
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
                    <AnimatePresence>
                      {getDealsByStatus(column.id).map((deal) => (
                        <DealKanbanCard
                          key={deal.Id}
                          deal={deal}
                          onDragStart={handleDragStart}
                          onEdit={handleQuickEdit}
                          onDelete={handleDeleteDeal}
                        />
                      ))}
                    </AnimatePresence>
                    
                    {getDealsByStatus(column.id).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <ApperIcon name="Package" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No deals in {column.title.toLowerCase()}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Votes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDeals.map((deal) => (
                      <motion.tr
                        key={deal.Id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={deal.imageUrl}
                              alt={deal.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 truncate">
                                {deal.title}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {deal.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {deal.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold text-primary">
                              ${deal.dealPrice}
                            </span>
                            <span className="text-gray-400 line-through">
                              ${deal.originalPrice}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {deal.votes}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              deal.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {deal.status}
                            </span>
                            {deal.featured && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-accent/20 text-accent">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" icon="Edit">
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              icon="Trash"
                              onClick={() => handleDeleteDeal(deal.Id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard