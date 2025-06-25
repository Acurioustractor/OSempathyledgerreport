'use client'

import { useState, useEffect } from 'react'
import StorytellerCard from './StorytellerCard'
import { Storyteller } from '@/types'

interface StorytellerGridProps {
  storytellers: Storyteller[]
}

export default function StorytellerGrid({ storytellers }: StorytellerGridProps) {
  const [filteredStorytellers, setFilteredStorytellers] = useState(storytellers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  useEffect(() => {
    // Get search input value
    const searchInput = document.getElementById('storyteller-search') as HTMLInputElement
    if (searchInput) {
      const handleSearch = (e: Event) => {
        setSearchTerm((e.target as HTMLInputElement).value)
      }
      searchInput.addEventListener('input', handleSearch)
      return () => searchInput.removeEventListener('input', handleSearch)
    }
  }, [])

  useEffect(() => {
    // Filter storytellers based on search and filters
    let filtered = storytellers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(st => 
        st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Role filter
    if (selectedRole) {
      filtered = filtered.filter(st => st.role === selectedRole)
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(st => st.location === selectedLocation)
    }

    setFilteredStorytellers(filtered)
  }, [searchTerm, selectedRole, selectedLocation, storytellers])

  // Listen for filter events
  useEffect(() => {
    const handleFilterChange = (e: CustomEvent) => {
      const { filterType, value } = e.detail
      if (filterType === 'role') {
        setSelectedRole(value)
      } else if (filterType === 'location') {
        setSelectedLocation(value)
      }
    }

    window.addEventListener('filterChange' as any, handleFilterChange)
    return () => window.removeEventListener('filterChange' as any, handleFilterChange)
  }, [])

  return (
    <div>
      {/* Results count */}
      <div className="mb-6 text-sm text-gray-600">
        Showing {filteredStorytellers.length} of {storytellers.length} storytellers
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStorytellers.map((storyteller) => (
          <StorytellerCard key={storyteller.id} storyteller={storyteller} />
        ))}
      </div>

      {/* No results */}
      {filteredStorytellers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No storytellers found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}