import { ref } from 'vue'
import axios from '@/plugins/axios'
import type { Client } from '@/types'

export function useClients() {
  const clients = ref<Client[]>([])
  const loading = ref(false)

  const fetchClients = async (params = {}) => {
    loading.value = true
    try {
      const response = await axios.get('/api/clients', { params })
      clients.value = response.data.data
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const createClient = async (data: Partial<Client>) => {
    const response = await axios.post('/api/clients', data)
    return response.data
  }

  const updateClient = async (id: number, data: Partial<Client>) => {
    const response = await axios.put(`/api/clients/${id}`, data)
    return response.data
  }

  const deleteClient = async (id: number) => {
    await axios.delete(`/api/clients/${id}`)
  }

  return {
    clients,
    loading,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  }
}
