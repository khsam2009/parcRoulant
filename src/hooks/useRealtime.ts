'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function useRealtime<T>(
  table: string,
  filter?: string,
  callback?: (payload: unknown) => void
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase.from(table).select('*')
        if (filter) {
          const [field, value] = filter.split('=')
          query = query.eq(field, value)
        }
        const { data: result, error } = await query
        if (error) throw error
        setData(result as T[])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        (payload: unknown) => {
          callback?.(payload)
          fetchData() // Refetch on change
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter, callback, supabase])

  return { data, loading, error }
}
