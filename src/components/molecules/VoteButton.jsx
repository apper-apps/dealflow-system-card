import { motion } from 'framer-motion'
import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const VoteButton = ({ votes, onVote, disabled = false }) => {
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async () => {
    if (disabled || isVoting) return
    
    setIsVoting(true)
    try {
      await onVote()
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={handleVote}
      disabled={disabled || isVoting}
      className={`
        flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200
        ${disabled || isVoting 
          ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
          : 'border-primary text-primary hover:bg-primary hover:text-white'
        }
      `}
    >
      <motion.div
        animate={isVoting ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon name="ChevronUp" className="w-6 h-6" />
      </motion.div>
      <span className="text-sm font-semibold mt-1">
        {votes}
      </span>
    </motion.button>
  )
}

export default VoteButton