'use client'

import { useRealtime } from '@/hooks/useRealtime'
import { useAuth } from '@/hooks/useAuth'
import { Database } from '@/types/database.types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

type Vehicle = Database['public']['Tables']['vehicles']['Row']

export default function VehiclesPage() {
  const { data: vehicles, loading } = useRealtime<Vehicle>('vehicles')
  const { profile, user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [optimisticVehicles, setOptimisticVehicles] = useState<Vehicle[]>([])

  const canManage = profile?.role === 'admin' || profile?.role === 'logistic_manager'

  if (authLoading || loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const handleStatusUpdate = async (vehicleId: string, status: Vehicle['status']) => {
    // Optimistic update
    setOptimisticVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status } : v))
    )

    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status })
        .eq('id', vehicleId)
      if (error) throw error
    } catch (err) {
      console.error('Failed to update vehicle status:', err)
      setOptimisticVehicles([])
    }
  }

  const displayVehicles = optimisticVehicles.length > 0 ? optimisticVehicles : vehicles

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Vehicles</h1>
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
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Make/Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Mileage
                </th>
                {canManage && (
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {displayVehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {vehicle.registration_number}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                        vehicle.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : vehicle.status === 'in_use'
                          ? 'bg-blue-100 text-blue-800'
                          : vehicle.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {vehicle.mileage} km
                  </td>
                  {canManage && (
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <select
                        value={vehicle.status}
                        onChange={(e) =>
                          handleStatusUpdate(vehicle.id, e.target.value as Vehicle['status'])
                        }
                        className="rounded border border-gray-300 px-2 py-1 text-sm"
                      >
                        <option value="available">Available</option>
                        <option value="in_use">In Use</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="out_of_service">Out of Service</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
