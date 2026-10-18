'use client'

import { useRealtime } from '@/hooks/useRealtime'
import { useAuth } from '@/hooks/useAuth'
import { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'

type Shipment = Database['public']['Tables']['shipments']['Row']

export default function ShipmentsPage() {
  const { data: shipments, loading } = useRealtime<Shipment>('shipments')
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  // Filter shipments based on role
  const filteredShipments = shipments.filter((shipment) => {
    if (profile?.role === 'admin' || profile?.role === 'logistic_manager') return true
    if (profile?.role === 'driver') return shipment.assigned_driver_id === user.id
    if (profile?.role === 'forklift_driver') return shipment.assigned_forklift_driver_id === user.id
    return false
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shipments</h1>
          <button
            onClick={() => router.back()}
            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Back
          </button>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Weight (kg)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {shipment.tracking_number}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {shipment.customer_name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {shipment.destination_city}, {shipment.destination_country}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                        shipment.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : shipment.status === 'in_transit'
                          ? 'bg-blue-100 text-blue-800'
                          : shipment.status === 'pending'
                          ? 'bg-gray-100 text-gray-800'
                          : shipment.status === 'assigned'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {shipment.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {shipment.priority}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {shipment.weight_kg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
