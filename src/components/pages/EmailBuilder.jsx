import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Badge from '@/components/atoms/Badge'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import dealService from '@/services/api/dealService'

const EmailBuilder = () => {
  const [deals, setDeals] = useState([])
  const [filteredDeals, setFilteredDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMain, setSelectedMain] = useState(null)
  const [selectedSecondary, setSelectedSecondary] = useState([])
  const [emailHTML, setEmailHTML] = useState('')
  const [showPreview, setShowPreview] = useState(false)

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
      // Sort by frontend display order (featured first, then by votes)
      const sortedDeals = [...data].sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.votes - a.votes
      })
      setDeals(sortedDeals)
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

  const handleMainSelection = (deal) => {
    setSelectedMain(deal)
    // Remove from secondary if it was selected
    setSelectedSecondary(prev => prev.filter(d => d.Id !== deal.Id))
  }

  const handleSecondaryToggle = (deal) => {
    if (selectedSecondary.find(d => d.Id === deal.Id)) {
      setSelectedSecondary(prev => prev.filter(d => d.Id !== deal.Id))
    } else {
      setSelectedSecondary(prev => [...prev, deal])
      // Remove from main if it was selected
      if (selectedMain?.Id === deal.Id) {
        setSelectedMain(null)
      }
    }
  }

  const generateEmailHTML = () => {
    if (!selectedMain && selectedSecondary.length === 0) {
      toast.error('Please select at least one deal')
      return
    }

    const mainDeal = selectedMain
    const secondaryDeals = selectedSecondary

    const mainDealHTML = mainDeal ? `
      <tr>
        <td style="padding: 40px 20px; background: linear-gradient(135deg, #5C6AC4 0%, #47C1BF 100%);">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="text-align: center; color: white;">
                <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">🔥 Featured Deal Alert!</h1>
                <p style="margin: 0 0 20px 0; font-size: 16px; opacity: 0.9;">Don't miss this incredible lifetime offer</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding: 30px 20px;">
                <h2 style="margin: 0 0 15px 0; font-size: 24px; color: #1a202c;">${mainDeal.title}</h2>
                <p style="margin: 0 0 20px 0; color: #4a5568; line-height: 1.6;">${mainDeal.description}</p>
                <div style="margin: 0 0 25px 0;">
                  <span style="font-size: 36px; font-weight: bold; color: #5C6AC4;">$${mainDeal.dealPrice}</span>
                  <span style="font-size: 18px; color: #a0aec0; text-decoration: line-through; margin-left: 10px;">$${mainDeal.originalPrice}</span>
                  <span style="background: #F49342; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-left: 10px;">${Math.round((1 - mainDeal.dealPrice / mainDeal.originalPrice) * 100)}% OFF</span>
                </div>
                <a href="${mainDeal.affiliateLink}" style="display: inline-block; background: #F49342; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Get This Deal →</a>
              </td>
              <td width="50%" style="padding: 30px 20px;">
                <img src="${mainDeal.imageUrl}" alt="${mainDeal.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
              </td>
            </tr>
          </table>
        </td>
      </tr>
    ` : ''

    const secondaryDealsHTML = secondaryDeals.length > 0 ? `
      <tr>
        <td style="padding: 40px 20px; background: #f7fafc;">
          <h2 style="margin: 0 0 30px 0; text-align: center; font-size: 24px; color: #1a202c;">More Great Deals</h2>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${secondaryDeals.map(deal => `
              <tr>
                <td style="padding: 0 0 30px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td width="120" style="padding: 20px;">
                        <img src="${deal.imageUrl}" alt="${deal.title}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 6px;">
                      </td>
                      <td style="padding: 20px;">
                        <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #1a202c;">${deal.title}</h3>
                        <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 14px; line-height: 1.5;">${deal.description.substring(0, 120)}...</p>
                        <div style="margin: 0 0 15px 0;">
                          <span style="font-size: 24px; font-weight: bold; color: #5C6AC4;">$${deal.dealPrice}</span>
                          <span style="font-size: 14px; color: #a0aec0; text-decoration: line-through; margin-left: 8px;">$${deal.originalPrice}</span>
                          <span style="background: #47C1BF; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; margin-left: 8px;">${Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)}% OFF</span>
                        </div>
                        <a href="${deal.affiliateLink}" style="display: inline-block; background: #5C6AC4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">View Deal</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            `).join('')}
          </table>
        </td>
      </tr>
    ` : ''

    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DealFlow Hub - Exclusive Deals</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #f7fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7fafc;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
              <h1 style="margin: 0; font-size: 24px; color: #1a202c;">
                <span style="color: #5C6AC4;">⚡</span> DealFlow Hub
              </h1>
              <p style="margin: 5px 0 0 0; color: #4a5568; font-size: 14px;">Lifetime Software Deals</p>
            </td>
          </tr>
          
          ${mainDealHTML}
          ${secondaryDealsHTML}
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 20px; text-align: center; background: #1a202c; color: white;">
              <p style="margin: 0 0 10px 0; font-size: 14px;">Happy deal hunting! 🎯</p>
              <p style="margin: 0; font-size: 12px; opacity: 0.8;">© 2024 DealFlow Hub. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    setEmailHTML(fullHTML)
    setShowPreview(true)
    toast.success('Email HTML generated!')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailHTML)
    toast.success('HTML copied to clipboard!')
  }

  const downloadHTML = () => {
    const blob = new Blob([emailHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dealflow-email.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('HTML file downloaded!')
  }

  if (loading) {
    return (
      <div className="h-screen bg-card">
        <div className="container mx-auto px-6 py-8">
          <SkeletonLoader count={6} type="list" />
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
            <h1 className="text-2xl font-bold text-gray-900">Email Builder</h1>
            <p className="text-gray-600">Create HTML email campaigns from selected deals</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <SearchBar
              placeholder="Search deals..."
              onSearch={setSearchQuery}
              className="w-64"
            />
            
            <Button
              variant="primary"
              icon="Mail"
              onClick={generateEmailHTML}
              disabled={!selectedMain && selectedSecondary.length === 0}
            >
              Generate Email
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Deal Selection */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          <div className="flex-shrink-0 p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Deals</h2>
            
            {/* Selection Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="font-medium text-gray-900">Main Deal (Featured)</span>
                <Badge variant={selectedMain ? 'primary' : 'default'}>
                  {selectedMain ? '1 selected' : 'None selected'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                <span className="font-medium text-gray-900">Secondary Deals</span>
                <Badge variant={selectedSecondary.length > 0 ? 'secondary' : 'default'}>
                  {selectedSecondary.length} selected
                </Badge>
              </div>
            </div>
          </div>

          {/* Deal List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredDeals.map((deal) => (
              <motion.div
                key={deal.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-lg border-2 transition-all duration-200 ${
                  selectedMain?.Id === deal.Id
                    ? 'border-primary bg-primary/5'
                    : selectedSecondary.find(d => d.Id === deal.Id)
                    ? 'border-secondary bg-secondary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={deal.imageUrl}
                      alt={deal.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {deal.title}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2">
                          {deal.featured && (
                            <Badge variant="accent" size="xs">
                              <ApperIcon name="Star" className="w-3 h-3" />
                            </Badge>
                          )}
                          <Badge variant="default" size="xs">
                            {deal.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {deal.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-primary">
                            ${deal.dealPrice}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ${deal.originalPrice}
                          </span>
                          <Badge variant="discount" size="xs">
                            -{Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)}%
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="ChevronUp" className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{deal.votes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selection Controls */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mainDeal"
                          checked={selectedMain?.Id === deal.Id}
                          onChange={() => handleMainSelection(deal)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Main Deal
                        </span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSecondary.find(d => d.Id === deal.Id) !== undefined}
                          onChange={() => handleSecondaryToggle(deal)}
                          className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Secondary
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-shrink-0 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Email Preview</h2>
              
              {emailHTML && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Copy"
                    onClick={copyToClipboard}
                  >
                    Copy HTML
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Download"
                    onClick={downloadHTML}
                  >
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {showPreview && emailHTML ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="bg-gray-50 rounded-lg p-4 h-full">
                    <iframe
                      srcDoc={emailHTML}
                      className="w-full h-full border-0 rounded"
                      title="Email Preview"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <ApperIcon name="Mail" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to Create Your Email?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Select deals and click "Generate Email" to see the preview
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>📧 Professional HTML email template</p>
                    <p>📱 Mobile-responsive design</p>
                    <p>🎨 Branded with your deal selections</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailBuilder