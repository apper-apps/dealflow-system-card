import mockDeals from '@/services/mockData/deals.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class DealService {
  constructor() {
    this.deals = [...mockDeals]
  }

  async getAll() {
    await delay(300)
    return [...this.deals]
  }

  async getById(id) {
    await delay(200)
    const deal = this.deals.find(d => d.Id === parseInt(id, 10))
    if (!deal) {
      throw new Error('Deal not found')
    }
    return { ...deal }
  }

  async getFeatured() {
    await delay(300)
    return this.deals.filter(deal => deal.featured).map(deal => ({ ...deal }))
  }

  async getByCategory(category) {
    await delay(300)
    return this.deals.filter(deal => deal.category === category).map(deal => ({ ...deal }))
  }

  async getTrending() {
    await delay(300)
    return [...this.deals]
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 10)
      .map(deal => ({ ...deal }))
  }

  async create(dealData) {
    await delay(400)
    const maxId = Math.max(...this.deals.map(d => d.Id), 0)
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      votes: 0,
      postedDate: new Date().toISOString(),
      updates: []
    }
    this.deals.push(newDeal)
    return { ...newDeal }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.deals.findIndex(d => d.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Deal not found')
    }
    
    const updatedDeal = {
      ...this.deals[index],
      ...updates,
      Id: this.deals[index].Id // Prevent Id modification
    }
    this.deals[index] = updatedDeal
    return { ...updatedDeal }
  }

  async delete(id) {
    await delay(300)
    const index = this.deals.findIndex(d => d.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Deal not found')
    }
    
    const deletedDeal = { ...this.deals[index] }
    this.deals.splice(index, 1)
    return deletedDeal
  }

  async vote(id) {
    await delay(200)
    const deal = this.deals.find(d => d.Id === parseInt(id, 10))
    if (!deal) {
      throw new Error('Deal not found')
    }
    
    deal.votes += 1
    return { ...deal }
  }

  async addUpdate(id, update) {
    await delay(300)
    const deal = this.deals.find(d => d.Id === parseInt(id, 10))
    if (!deal) {
      throw new Error('Deal not found')
    }
    
    const newUpdate = {
      Id: Date.now(),
      content: update.content,
      timestamp: new Date().toISOString()
    }
    
    deal.updates = deal.updates || []
    deal.updates.unshift(newUpdate)
return { ...deal }
  }

  async ignore(id) {
    await delay(300)
    const deal = this.deals.find(d => d.Id === parseInt(id, 10))
    if (!deal) {
      throw new Error('Deal not found')
    }
    
    // Mark deal as ignored (could be used for filtering)
    deal.ignored = true
    deal.ignoredDate = new Date().toISOString()
    
    return { ...deal }
  }

  async addToFavorites(id) {
    await delay(300)
    const deal = this.deals.find(d => d.Id === parseInt(id, 10))
    if (!deal) {
      throw new Error('Deal not found')
    }
    
    // Mark deal as favorited
    deal.favorited = true
    deal.favoritedDate = new Date().toISOString()
    
    return { ...deal }
  }
}

const dealService = new DealService()
export default dealService