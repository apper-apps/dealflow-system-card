import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import VoteButton from '@/components/molecules/VoteButton'
import CommentItem from '@/components/molecules/CommentItem'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import dealService from '@/services/api/dealService'
import commentService from '@/services/api/commentService'

const DealDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [deal, setDeal] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)

  useEffect(() => {
    loadDealData()
  }, [id])

  const loadDealData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dealData, commentsData] = await Promise.all([
        dealService.getById(id),
        commentService.getByDealId(id)
      ])
      setDeal(dealData)
      setComments(commentsData)
    } catch (err) {
      setError(err.message || 'Failed to load deal')
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async () => {
    try {
      const updatedDeal = await dealService.vote(id)
      setDeal(updatedDeal)
      toast.success('Vote added!')
    } catch (error) {
      toast.error('Failed to vote')
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsCommenting(true)
    try {
      const comment = await commentService.create({
        dealId: parseInt(id, 10),
        userId: 'current-user',
        username: 'You',
        content: newComment,
        parentId: null
      })
      setComments(prev => [comment, ...prev])
      setNewComment('')
      toast.success('Comment posted!')
    } catch (error) {
      toast.error('Failed to post comment')
    } finally {
      setIsCommenting(false)
    }
  }

  const handleReply = (newReply) => {
    setComments(prev => [newReply, ...prev])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-card">
        <div className="container mx-auto px-4 py-8">
          <SkeletonLoader count={1} type="banner" />
          <div className="mt-8">
            <SkeletonLoader count={3} type="list" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <ErrorState
          message={error}
          onRetry={loadDealData}
        />
      </div>
    )
  }

  if (!deal) return null

  const discountPercentage = Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)
  const timeRemaining = formatDistanceToNow(new Date(deal.expiryDate), { addSuffix: true })

  return (
    <div className="min-h-screen bg-card">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6"
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          <span>Back to deals</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Deal Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={deal.imageUrl}
                  alt={deal.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  <Badge variant="discount" size="md">
                    -{discountPercentage}%
                  </Badge>
                  {deal.featured && (
                    <Badge variant="accent" size="md">
                      <ApperIcon name="Star" className="w-4 h-4 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {deal.title}
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {deal.description}
                    </p>
                  </div>
                  <div className="ml-6">
                    <VoteButton votes={deal.votes} onVote={handleVote} />
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-4xl font-bold text-primary">
                        ${deal.dealPrice}
                      </span>
                      <span className="text-2xl text-gray-400 line-through">
                        ${deal.originalPrice}
                      </span>
                    </div>
                    <Badge variant="default">
                      {deal.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Clock" className="w-4 h-4" />
                      <span>Ends {timeRemaining}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="MessageCircle" className="w-4 h-4" />
                      <span>{comments.length} comments</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="accent"
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={() => window.open(deal.affiliateLink, '_blank')}
                >
                  Get This Deal
                  <ApperIcon name="ExternalLink" className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>

            {/* Updates Section */}
            {deal.updates && deal.updates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="Bell" className="w-5 h-5 mr-2" />
                  Deal Updates
                </h2>
                <div className="space-y-4">
                  {deal.updates.map((update) => (
                    <div key={update.Id} className="border-l-4 border-primary pl-4">
                      <p className="text-gray-700">{update.content}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(update.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <ApperIcon name="MessageCircle" className="w-5 h-5 mr-2" />
                Comments ({comments.length})
              </h2>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-8">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this deal..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="4"
                />
                <div className="flex justify-end mt-3">
                  <Button
                    type="submit"
                    loading={isCommenting}
                    disabled={!newComment.trim()}
                  >
                    Post Comment
                  </Button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.Id}
                    comment={comment}
                    onReply={handleReply}
                  />
                ))}
                
                {comments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="MessageCircle" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Deal Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-lg mb-4">Deal Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Votes</span>
                  <span className="font-semibold">{deal.votes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comments</span>
                  <span className="font-semibold">{comments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold">{deal.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-semibold">
                    {formatDistanceToNow(new Date(deal.postedDate), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-lg mb-4">Share This Deal</h3>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <ApperIcon name="Twitter" className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <ApperIcon name="Facebook" className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <ApperIcon name="Link" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DealDetail