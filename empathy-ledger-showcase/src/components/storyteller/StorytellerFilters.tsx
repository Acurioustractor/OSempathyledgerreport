'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'

interface StorytellerFiltersProps {
  roles: string[]
  locations: string[]
}

export default function StorytellerFilters({ roles, locations }: StorytellerFiltersProps) {
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    window.dispatchEvent(new CustomEvent('filterChange', {
      detail: { filterType: 'role', value: role }
    }))
  }

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location)
    window.dispatchEvent(new CustomEvent('filterChange', {
      detail: { filterType: 'location', value: location }
    }))
  }

  const clearFilters = () => {
    setSelectedRole('')
    setSelectedLocation('')
    window.dispatchEvent(new CustomEvent('filterChange', {
      detail: { filterType: 'role', value: '' }
    }))
    window.dispatchEvent(new CustomEvent('filterChange', {
      detail: { filterType: 'location', value: '' }
    }))
  }

  const hasActiveFilters = selectedRole || selectedLocation

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Role Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Role</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value=""
              checked={selectedRole === ''}
              onChange={() => handleRoleChange('')}
              className="mr-2 text-orange-sky focus:ring-orange-sky"
            />
            <span className="text-sm text-gray-600">All Roles</span>
          </label>
          {roles.map(role => (
            <label key={role} className="flex items-center">
              <input
                type="radio"
                name="role"
                value={role}
                checked={selectedRole === role}
                onChange={() => handleRoleChange(role)}
                className="mr-2 text-orange-sky focus:ring-orange-sky"
              />
              <span className="text-sm text-gray-600">{role}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Location</h4>
        <select
          value={selectedLocation}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-sky focus:border-transparent"
        >
          <option value="">All Locations</option>
          {locations.sort().map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Story Status Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Story Status</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2 text-orange-sky focus:ring-orange-sky rounded"
            />
            <span className="text-sm text-gray-600">Has shared stories</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2 text-orange-sky focus:ring-orange-sky rounded"
            />
            <span className="text-sm text-gray-600">Has video stories</span>
          </label>
        </div>
      </div>
    </div>
  )
}