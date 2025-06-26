import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import dealService from '@/services/api/dealService'

const SubmitDeal = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    dealPrice: '',
    affiliateLink: '',
    category: '',
    imageUrl: '',
    expiryDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const categories = [
    'Productivity',
    'Design',
    'Marketing',
    'Developer Tools',
    'Analytics',
    'Business',
    'Communication',
    'Finance'
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
      newErrors.originalPrice = 'Valid original price is required'
    }

    if (!formData.dealPrice || parseFloat(formData.dealPrice) <= 0) {
      newErrors.dealPrice = 'Valid deal price is required'
    }

    if (parseFloat(formData.dealPrice) >= parseFloat(formData.originalPrice)) {
      newErrors.dealPrice = 'Deal price must be less than original price'
    }

    if (!formData.affiliateLink.trim()) {
      newErrors.affiliateLink = 'Affiliate link is required'
    } else if (!isValidUrl(formData.affiliateLink)) {
      newErrors.affiliateLink = 'Please enter a valid URL'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required'
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL'
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    } else if (new Date(formData.expiryDate) <= new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    setIsSubmitting(true)
    try {
      const dealData = {
        ...formData,
        originalPrice: parseFloat(formData.originalPrice),
        dealPrice: parseFloat(formData.dealPrice),
        status: 'inactive', // New deals start as inactive
        featured: false,
        expiryDate: new Date(formData.expiryDate).toISOString()
      }

      await dealService.create(dealData)
      toast.success('Deal submitted successfully! It will be reviewed before going live.')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        originalPrice: '',
        dealPrice: '',
        affiliateLink: '',
        category: '',
        imageUrl: '',
        expiryDate: ''
      })
    } catch (error) {
      toast.error('Failed to submit deal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const discountPercentage = formData.originalPrice && formData.dealPrice 
    ? Math.round((1 - parseFloat(formData.dealPrice) / parseFloat(formData.originalPrice)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-card">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Plus" className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Submit a Deal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Found an amazing lifetime deal? Share it with the community! 
            All submissions are reviewed before going live.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Deal Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={errors.title}
                  placeholder="e.g., CloudSync Pro - Lifetime Access"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                      errors.description ? 'border-error' : 'border-gray-300'
                    }`}
                    placeholder="Describe what this deal offers and why it's valuable..."
                  />
                  {errors.description && (
                    <p className="text-sm text-error mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Original Price ($)"
                    name="originalPrice"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    error={errors.originalPrice}
                    placeholder="299"
                  />

                  <Input
                    label="Deal Price ($)"
                    name="dealPrice"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.dealPrice}
                    onChange={handleInputChange}
                    error={errors.dealPrice}
                    placeholder="49"
                  />
                </div>

                {discountPercentage > 0 && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                    <p className="text-accent font-medium text-sm">
                      💰 Discount: {discountPercentage}% off
                    </p>
                  </div>
                )}

                <Input
                  label="Affiliate Link"
                  name="affiliateLink"
                  type="url"
                  value={formData.affiliateLink}
                  onChange={handleInputChange}
                  error={errors.affiliateLink}
                  placeholder="https://example.com/deal-link"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.category ? 'border-error' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-error mt-1">{errors.category}</p>
                  )}
                </div>

                <Input
                  label="Image URL"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  error={errors.imageUrl}
                  placeholder="https://example.com/image.jpg"
                />

                <Input
                  label="Deal Expiry Date"
                  name="expiryDate"
                  type="datetime-local"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  error={errors.expiryDate}
                  min={new Date().toISOString().slice(0, 16)}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Submit Deal for Review
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Preview
              </h2>
              
              {formData.title || formData.imageUrl ? (
                <div className="space-y-4">
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Deal preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  )}
                  
                  {formData.title && (
                    <h3 className="text-xl font-bold text-gray-900">
                      {formData.title}
                    </h3>
                  )}
                  
                  {formData.description && (
                    <p className="text-gray-600">
                      {formData.description}
                    </p>
                  )}
                  
                  {formData.originalPrice && formData.dealPrice && (
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-primary">
                        ${formData.dealPrice}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        ${formData.originalPrice}
                      </span>
                      {discountPercentage > 0 && (
                        <span className="bg-accent text-white px-2 py-1 rounded text-sm font-bold">
                          -{discountPercentage}%
                        </span>
                      )}
                    </div>
                  )}
                  
                  {formData.category && (
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {formData.category}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <ApperIcon name="Eye" className="w-12 h-12 mx-auto mb-3" />
                  <p>Fill out the form to see a preview</p>
                </div>
              )}
            </div>

            {/* Submission Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 bg-blue-50 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Info" className="w-5 h-5 mr-2 text-blue-600" />
                Submission Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <ApperIcon name="Check" className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  Must be a genuine lifetime deal, not subscription
                </li>
                <li className="flex items-start">
                  <ApperIcon name="Check" className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  Provide accurate pricing and clear description
                </li>
                <li className="flex items-start">
                  <ApperIcon name="Check" className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  Use high-quality images and working affiliate links
                </li>
                <li className="flex items-start">
                  <ApperIcon name="Check" className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  All submissions are reviewed within 24 hours
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SubmitDeal