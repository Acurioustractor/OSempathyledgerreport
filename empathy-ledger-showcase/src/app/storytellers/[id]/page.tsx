import { promises as fs } from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, User, MapPin, Calendar, Tag, Quote, BookOpen, Play, BarChart3, Users, ArrowRight, FileText } from 'lucide-react'
import { Story, Storyteller, Theme } from '@/types'

async function getStorytellerData(id: string) {
  try {
    const [storytellersData, storiesData, themesData, analyticsData] = await Promise.all([
      fs.readFile(path.join(process.cwd(), 'public/data/storytellers.json'), 'utf8').then(data => JSON.parse(data)),
      fs.readFile(path.join(process.cwd(), 'public/data/stories.json'), 'utf8').then(data => JSON.parse(data)),
      fs.readFile(path.join(process.cwd(), 'public/data/themes.json'), 'utf8').then(data => JSON.parse(data)),
      fs.readFile(path.join(process.cwd(), 'public/data/analytics.json'), 'utf8').then(data => JSON.parse(data))
    ])

    const storyteller = storytellersData.find((st: Storyteller) => st.id === id)
    if (!storyteller) return null

    // Get stories by this storyteller
    const relatedStories = storiesData.filter((s: Story) => 
      s.storytellerIds.includes(storyteller.id)
    )

    // Get themes associated with this storyteller
    const relatedThemes = themesData.filter((t: Theme) => 
      storyteller.themeIds?.includes(t.id) || storyteller.themes?.includes(t.name)
    )

    // Get similar storytellers (same role, location, or themes)
    const similarStorytellers = storytellersData
      .filter((st: Storyteller) => 
        st.id !== id && (
          st.role.toLowerCase() === storyteller.role.toLowerCase() ||
          st.location === storyteller.location ||
          (st.themeIds && storyteller.themeIds && st.themeIds.some(themeId => storyteller.themeIds?.includes(themeId)))
        )
      )
      .slice(0, 4)

    // Get theme distribution for this storyteller's role
    const roleAnalytics = analyticsData?.storytellers?.byRole || {}
    const locationAnalytics = analyticsData?.storytellers?.byLocation || []

    return {
      storyteller,
      relatedStories,
      relatedThemes,
      similarStorytellers,
      roleAnalytics,
      locationAnalytics,
      analytics: analyticsData
    }
  } catch (error) {
    console.error('Error loading storyteller data:', error)
    return null
  }
}

export default async function StorytellerProfilePage({ params }: { params: { id: string } }) {
  const data = await getStorytellerData(params.id)
  
  if (!data) {
    notFound()
  }

  const { storyteller, relatedStories, relatedThemes, similarStorytellers, roleAnalytics, locationAnalytics } = data

  // Find location stats
  const locationStats = locationAnalytics.find((loc: any) => loc.location === storyteller.location)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/storytellers"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Storytellers
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Profile Column */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-8 text-center sticky top-8">
                {/* Profile Image */}
                <div className="mb-6">
                  {storyteller.profileImage ? (
                    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                      <Image
                        src={storyteller.profileImage}
                        alt={storyteller.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-3xl font-semibold text-orange-sky">
                        {storyteller.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {storyteller.name}
                </h1>
                
                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="capitalize font-medium">{storyteller.role}</span>
                  </div>
                  {storyteller.location && (
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{storyteller.location}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-sky">
                      {relatedStories.length}
                    </div>
                    <div className="text-xs text-gray-600">
                      {relatedStories.length === 1 ? 'Story' : 'Stories'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-sky">
                      {storyteller.quotes?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600">
                      {(storyteller.quotes?.length || 0) === 1 ? 'Quote' : 'Quotes'}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {storyteller.summary && (
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {storyteller.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Themes Section */}
              {relatedThemes.length > 0 && (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Tag className="w-6 h-6 mr-3 text-orange-sky" />
                    Key Themes
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedThemes.map((theme) => (
                      <div key={theme.id} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {theme.name}
                        </h3>
                        {theme.description && (
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {theme.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories Section */}
              {relatedStories.length > 0 && (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <BookOpen className="w-6 h-6 mr-3 text-orange-sky" />
                    Stories Shared
                  </h2>
                  
                  <div className="space-y-6">
                    {relatedStories.map((story: Story) => (
                      <article key={story.id} className="border-l-4 border-orange-sky pl-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/stories/${story.id}`}>
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-sky transition-colors mb-2">
                                {story.title}
                              </h3>
                            </Link>
                            
                            <p className="text-gray-700 mb-4 line-clamp-3">
                              {story.excerpt}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={story.createdAt}>
                                  {new Date(story.createdAt).toLocaleDateString('en-AU', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </time>
                              </div>
                              
                              {story.hasVideo && (
                                <div className="flex items-center gap-1 text-orange-sky">
                                  <Play className="w-4 h-4" />
                                  <span>Video Available</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {story.profileImage && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden ml-4 flex-shrink-0">
                              <Image
                                src={story.profileImage}
                                alt={story.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                              {story.hasVideo && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                  <Play className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Quotes Section */}
              {storyteller.quotes && storyteller.quotes.length > 0 && (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Quote className="w-6 h-6 mr-3 text-orange-sky" />
                    Inspiring Quotes
                  </h2>
                  
                  {/* Check if quotes are actual text (strings) or just IDs */}
                  {typeof storyteller.quotes[0] === 'string' && storyteller.quotes[0].length > 10 ? (
                    <div className="space-y-6">
                      {storyteller.quotes.slice(0, 3).map((quote: string, index: number) => (
                        <div key={index} className="border-l-4 border-orange-sky pl-6 py-4">
                          <Quote className="w-5 h-5 text-orange-sky mb-2" />
                          <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                            "{quote}"
                          </blockquote>
                        </div>
                      ))}
                      
                      {storyteller.quotes.length > 3 && (
                        <div className="text-center pt-4">
                          <p className="text-sm text-gray-500">
                            + {storyteller.quotes.length - 3} more {storyteller.quotes.length - 3 === 1 ? 'quote' : 'quotes'} from this storyteller
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Quote className="w-12 h-12 text-orange-sky mx-auto mb-4" />
                      <p className="text-lg text-gray-700 mb-4">
                        {storyteller.name.split(' ')[0]} has shared <span className="font-semibold text-orange-sky">{storyteller.quotes.length}</span> meaningful insights through conversations with Orange Sky.
                      </p>
                      <p className="text-gray-600">
                        These conversations capture authentic perspectives on {storyteller.role.toLowerCase().includes('volunteer') ? 'volunteering, community service, and the impact of giving back' : storyteller.role.toLowerCase().includes('friend') ? 'lived experience, resilience, and the value of human connection' : 'providing services, community support, and making a difference'}.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-sky">{storyteller.quotes.length}</div>
                          <div className="text-sm text-gray-600">Insights Shared</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{relatedThemes.length}</div>
                          <div className="text-sm text-gray-600">Topics Covered</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{relatedStories.length}</div>
                          <div className="text-sm text-gray-600">Stories Documented</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Personal Journey Section */}
              {storyteller.journey && (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-orange-sky" />
                    Personal Journey
                  </h2>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {storyteller.journey}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Connection Impact */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-orange-sky" />
                  Connection Impact
                </h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-sky mb-2">
                      {relatedThemes.length}
                    </div>
                    <div className="text-sm text-gray-600">Themes Explored</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Areas of life discussed
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {relatedStories.length}
                    </div>
                    <div className="text-sm text-gray-600">Stories Shared</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Conversations documented
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {storyteller.role === 'volunteer' ? 'Volunteer' : 'Friend'} Contribution
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {storyteller.role.toLowerCase().includes('volunteer') 
                      ? `As a volunteer, ${storyteller.name.split(' ')[0]} contributes to Orange Sky's mission by providing laundry services and genuine conversations. Their stories help us understand the volunteer experience and the meaningful connections formed through service.`
                      : `As a friend of Orange Sky, ${storyteller.name.split(' ')[0]} shares their lived experience and perspective. Their stories provide valuable insights into the real-world impact of Orange Sky's services and the importance of dignity, respect, and human connection.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Context & Analytics Section */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-orange-sky" />
            Community Context
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Role Distribution */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">By Role</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Volunteers</span>
                  <span className={`font-bold ${storyteller.role.toLowerCase().includes('volunteer') ? 'text-orange-sky' : 'text-gray-900'}`}>
                    {roleAnalytics.volunteers || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Friends</span>
                  <span className={`font-bold ${storyteller.role.toLowerCase().includes('friend') ? 'text-orange-sky' : 'text-gray-900'}`}>
                    {roleAnalytics.friends || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Service Providers</span>
                  <span className={`font-bold ${storyteller.role.toLowerCase().includes('service provider') ? 'text-orange-sky' : 'text-gray-900'}`}>
                    {roleAnalytics.serviceProviders || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Context */}
            {locationStats && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{storyteller.location}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Storytellers</span>
                    <span className="font-bold text-orange-sky">{locationStats.count}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Volunteers</span>
                    <span className="font-bold text-gray-900">{locationStats.roles?.volunteers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Friends</span>
                    <span className="font-bold text-gray-900">{locationStats.roles?.friends || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Contribution */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Themes Explored</span>
                  <span className="font-bold text-orange-sky">{relatedThemes.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Stories Shared</span>
                  <span className="font-bold text-orange-sky">{relatedStories.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Quotes Given</span>
                  <span className="font-bold text-orange-sky">{storyteller.quotes?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Storytellers Section */}
      {similarStorytellers.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
              <Users className="w-6 h-6 mr-3 text-orange-sky" />
              Similar Storytellers
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarStorytellers.map((similar: Storyteller) => (
                <Link key={similar.id} href={`/storytellers/${similar.id}`}>
                  <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full p-6">
                    {/* Profile Image */}
                    <div className="flex items-center gap-4 mb-4">
                      {similar.profileImage ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={similar.profileImage}
                            alt={similar.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-orange-sky">
                            {similar.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {similar.name}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {similar.role}
                        </p>
                      </div>
                    </div>

                    {/* Summary */}
                    {similar.summary && (
                      <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                        {similar.summary}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{similar.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{similar.storyCount || 0} stories</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}