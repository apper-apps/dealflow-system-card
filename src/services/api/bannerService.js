import mockBanners from '@/services/mockData/banners.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class BannerService {
  constructor() {
    this.banners = [...mockBanners]
  }

  async getAll() {
    await delay(300)
    return [...this.banners]
  }

  async getById(id) {
    await delay(200)
    const banner = this.banners.find(b => b.Id === parseInt(id, 10))
    if (!banner) {
      throw new Error('Banner not found')
    }
    return { ...banner }
  }

  async getByPosition(position) {
    await delay(300)
    return this.banners
      .filter(banner => banner.position === position && banner.active)
      .sort((a, b) => a.priority - b.priority)
      .map(banner => ({ ...banner }))
  }

  async create(bannerData) {
    await delay(400)
    const maxId = Math.max(...this.banners.map(b => b.Id), 0)
    const newBanner = {
      ...bannerData,
      Id: maxId + 1
    }
    this.banners.push(newBanner)
    return { ...newBanner }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.banners.findIndex(b => b.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Banner not found')
    }
    
    const updatedBanner = {
      ...this.banners[index],
      ...updates,
      Id: this.banners[index].Id // Prevent Id modification
    }
    this.banners[index] = updatedBanner
    return { ...updatedBanner }
  }

  async delete(id) {
    await delay(300)
    const index = this.banners.findIndex(b => b.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Banner not found')
    }
    
    const deletedBanner = { ...this.banners[index] }
    this.banners.splice(index, 1)
    return deletedBanner
  }
}

const bannerService = new BannerService()
export default bannerService