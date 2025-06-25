import { Shield } from 'lucide-react'

export default function PrivacyNotice() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">Privacy Notice</h3>
          <p className="text-sm text-blue-800">
            All stories and information displayed on this showcase have been shared with 
            full consent from the storytellers. In a production environment, additional 
            privacy controls would allow for anonymous and partial sharing options.
          </p>
        </div>
      </div>
    </div>
  )
}