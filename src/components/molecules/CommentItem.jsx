import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'
import Button from '@/components/atoms/Button'
import commentService from '@/services/api/commentService'
import { formatDistanceToNow } from 'date-fns'

const CommentItem = ({ comment, onReply, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [votes, setVotes] = useState(comment.votes)

  const timeAgo = formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })

  const handleVote = async () => {
    try {
      const updatedComment = await commentService.vote(comment.Id)
      setVotes(updatedComment.votes)
      toast.success('Vote added!')
    } catch (error) {
      toast.error('Failed to vote')
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    setIsReplying(true)
    try {
      const newReply = await commentService.create({
        dealId: comment.dealId,
        userId: 'current-user',
        username: 'You',
        content: replyContent,
        parentId: comment.Id
      })
      onReply?.(newReply)
      setReplyContent('')
      setShowReplyForm(false)
      toast.success('Reply posted!')
    } catch (error) {
      toast.error('Failed to post reply')
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${level > 0 ? 'ml-8 pl-4 border-l-2 border-gray-100' : ''}`}
    >
      <div className="flex space-x-3">
        <Avatar 
          alt={comment.username} 
          fallback={comment.username}
          size="sm"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">{comment.username}</span>
            <span className="text-sm text-gray-500">{timeAgo}</span>
          </div>
          
          <p className="text-gray-700 mb-3 break-words">
            {comment.content}
          </p>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVote}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary"
            >
              <ApperIcon name="ChevronUp" className="w-4 h-4" />
              <span>{votes}</span>
            </motion.button>
            
            {level < 2 && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-sm text-gray-500 hover:text-primary"
              >
                Reply
              </button>
            )}
          </div>
          
          {showReplyForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleReply}
              className="mt-4 space-y-3"
            >
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              />
              <div className="flex space-x-2">
                <Button 
                  type="submit"
                  size="sm"
                  loading={isReplying}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
                <Button 
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CommentItem