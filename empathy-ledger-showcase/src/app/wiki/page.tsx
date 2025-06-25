import { redirect } from 'next/navigation'

// Redirect to the new documentation system
export default function WikiRedirect() {
  redirect('/docs/introduction')
}