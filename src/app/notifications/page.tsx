'use client'

import { useRealtime } from '@/hooks/useRealtime'
import { useAuth } from '@/hooks/useAuth'
import { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Notification = Database['public']['Tables']['notifications']['Row']

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth()
  const { data: notifications, loading } = useRealtime<Notification>(
    'notifications',
    user ? `user_id=${user.id}` : undefined
  )
  const router = useRouter()
  const supabase = createClient()

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <button
            onClick={() => router.back()}
            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Back
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg bg-white p-6 shadow ${
                notification.read ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{notification.message}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                  {notification.type && (
                    <span
                      className={`mt-2 inline-flex rounded-full px-2 text-xs font-semibold ${
                        notification.type === 'alert'
                          ? 'bg-red-100 text-red-800'
                          : notification.type === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : notification.type === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {notification.type}
                    </span>
                  )}
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="rounded-lg bg-white p-6 text-center shadow">
              <p className="text-gray-500">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
