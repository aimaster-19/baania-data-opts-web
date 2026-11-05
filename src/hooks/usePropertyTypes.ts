import { useState, useEffect } from 'react'
import api from '../lib/axios'
import type { BaaniaDocument } from '../types/common'
import type { IPropertyType } from '../types/propertyType'

// Simple in-memory cache to prevent multiple API calls across components
let cachedPropertyTypes: IPropertyType[] | null = null
let fetchPromise: Promise<IPropertyType[]> | null = null

export function usePropertyTypes() {
  const [propertyTypes, setPropertyTypes] = useState<IPropertyType[]>(
    cachedPropertyTypes || []
  )
  const [isLoading, setIsLoading] = useState(!cachedPropertyTypes)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cachedPropertyTypes) {
      setPropertyTypes(cachedPropertyTypes)
      setIsLoading(false)
      return
    }

    if (!fetchPromise) {
      fetchPromise = api
        .get('/property-types')
        .then((res) => {
          const rawData = res.data?.data || []
          const mapped = rawData.map((item: BaaniaDocument<IPropertyType>) => ({
            id: item.data?.id || '',
            name_th: item.data?.name_th || '',
            name_en: item.data?.name_en || ''
          }))
          cachedPropertyTypes = mapped
          return mapped
        })
        .catch((err) => {
          fetchPromise = null // Clear promise on error so we can retry later
          throw err
        })
    }

    let isMounted = true
    fetchPromise
      .then((data) => {
        if (isMounted) {
          setPropertyTypes(data)
          setIsLoading(false)
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          console.error('Failed to fetch property types:', err)
          setError(
            err?.response?.data?.message ||
              err.message ||
              'Failed to fetch property types'
          )
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { propertyTypes, isLoading, error }
}
