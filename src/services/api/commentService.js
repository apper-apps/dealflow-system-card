import mockComments from '@/services/mockData/comments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CommentService {
  constructor() {
    this.comments = [...mockComments]
  }

  async getAll() {
    await delay(300)
    return [...this.comments]
  }

  async getById(id) {
    await delay(200)
    const comment = this.comments.find(c => c.Id === parseInt(id, 10))
    if (!comment) {
      throw new Error('Comment not found')
    }
    return { ...comment }
  }

  async getByDealId(dealId) {
    await delay(300)
    return this.comments
      .filter(comment => comment.dealId === parseInt(dealId, 10))
      .map(comment => ({ ...comment }))
  }

  async create(commentData) {
    await delay(400)
    const maxId = Math.max(...this.comments.map(c => c.Id), 0)
    const newComment = {
      ...commentData,
      Id: maxId + 1,
      timestamp: new Date().toISOString(),
      votes: 0
    }
    this.comments.push(newComment)
    return { ...newComment }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.comments.findIndex(c => c.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Comment not found')
    }
    
    const updatedComment = {
      ...this.comments[index],
      ...updates,
      Id: this.comments[index].Id // Prevent Id modification
    }
    this.comments[index] = updatedComment
    return { ...updatedComment }
  }

  async delete(id) {
    await delay(300)
    const index = this.comments.findIndex(c => c.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Comment not found')
    }
    
    const deletedComment = { ...this.comments[index] }
    this.comments.splice(index, 1)
    return deletedComment
  }

  async vote(id) {
    await delay(200)
    const comment = this.comments.find(c => c.Id === parseInt(id, 10))
    if (!comment) {
      throw new Error('Comment not found')
    }
    
    comment.votes += 1
    return { ...comment }
  }
}

const commentService = new CommentService()
export default commentService