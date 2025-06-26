import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DealCard from "@/components/molecules/DealCard";
import FilterBar from "@/components/molecules/FilterBar";
import SkeletonLoader from "@/components/atoms/SkeletonLoader";
import ErrorState from "@/components/atoms/ErrorState";
import EmptyState from "@/components/atoms/EmptyState";
import dealService from "@/services/api/dealService";

const DealList = ({ showFilters = true }) => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([])
  const [filteredDeals, setFilteredDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await dealService.getAll()
      setDeals(data)
      setFilteredDeals(data)
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(deal => deal.category))]
      setCategories(uniqueCategories)
    } catch (err) {
      setError(err.message || 'Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = ({ category, sortBy, status }) => {
    let filtered = [...deals]

    // Filter by category
    if (category) {
      filtered = filtered.filter(deal => deal.category === category)
    }

    // Filter by status
    if (status === 'active') {
      filtered = filtered.filter(deal => deal.status === 'active')
    } else if (status === 'featured') {
      filtered = filtered.filter(deal => deal.featured)
    }

    // Sort
    if (sortBy === 'votes') {
      filtered.sort((a, b) => b.votes - a.votes)
    } else if (sortBy === 'ending') {
      filtered.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    } else {
      filtered.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
    }

    setFilteredDeals(filtered)
  }

  const handleVote = (updatedDeal) => {
    setDeals(prev => prev.map(deal => 
      deal.Id === updatedDeal.Id ? updatedDeal : deal
    ))
    setFilteredDeals(prev => prev.map(deal => 
      deal.Id === updatedDeal.Id ? updatedDeal : deal
    ))
  }

  if (loading) {
    return <SkeletonLoader count={6} />
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={loadDeals}
      />
    )
  }

  if (deals.length === 0) {
    return (
      <EmptyState
        title="No deals found"
        description="Be the first to submit a great deal!"
        actionLabel="Submit Deal"
        onAction={() => navigate('/submit')}
      />
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <FilterBar
          categories={categories}
          onFilterChange={handleFilterChange}
        />
      )}

      {filteredDeals.length === 0 ? (
        <EmptyState
          title="No deals match your filters"
          description="Try adjusting your filter criteria"
          actionLabel="Clear Filters"
          onAction={() => handleFilterChange({ category: null, sortBy: 'newest', status: null })}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDeals.map((deal, index) => (
            <motion.div
              key={deal.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DealCard 
                deal={deal} 
                onVote={handleVote}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default DealList