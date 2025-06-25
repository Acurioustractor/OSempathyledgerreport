import { promises as fs } from 'fs'
import path from 'path'
import StorytellerGrid from '@/components/storyteller/StorytellerGrid'
import StorytellerFilters from '@/components/storyteller/StorytellerFilters'
import { Search } from 'lucide-react'

async function getStorytellers() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/storytellers.json')
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading storytellers:', error)
    return []
  }
}

export default async function StorytellersPage() {
  const storytellers = await getStorytellers()
  
  // Get unique roles and locations for filtering
  const roles = Array.from(new Set(storytellers.map((st: any) => st.role).filter(Boolean))) as string[]
  const locations = Array.from(new Set(storytellers.map((st: any) => st.location).filter(Boolean))) as string[]
  
  // Stats
  const stats = {
    total: storytellers.length,
    serviceProviders: storytellers.filter((st: any) => st.role.toLowerCase().includes('service provider')).length,
    volunteers: storytellers.filter((st: any) => st.role.toLowerCase().includes('volunteer')).length,
    friends: storytellers.filter((st: any) => st.role.toLowerCase().includes('friend')).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Storytellers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Behind every story is a person with lived experience, wisdom, and resilience. 
            Meet the friends and volunteers who have shared their journeys with Orange Sky.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-sky">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Storytellers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-sky">{stats.serviceProviders}</div>
              <div className="text-sm text-gray-600">Service Providers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-sky">{stats.volunteers}</div>
              <div className="text-sm text-gray-600">Volunteers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-sky">{stats.friends}</div>
              <div className="text-sm text-gray-600">Friends</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <input
                type="search"
                placeholder="Search storytellers by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-sky focus:border-transparent"
                id="storyteller-search"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Filters and Grid */}
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <StorytellerFilters 
                roles={roles}
                locations={locations}
              />
            </aside>

            {/* Storyteller Grid */}
            <div className="flex-1">
              <StorytellerGrid storytellers={storytellers} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}