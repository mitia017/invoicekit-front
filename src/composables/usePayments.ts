import { ref } from 'vue'
import axios from '@/plugins/axios'
import type { Payment } from '@/types'

export function usePayments() {
  const payments = ref<Payment[]>([])
  const loading = ref(false)

  const fetchPayments = async () => {
    loading.value = true
    try {
      const response = await axios.get('/api/payments')
      payments.value = response.data.data
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const createPayment = async (data: Partial<Payment>) => {
    const response = await axios.post('/api/payments', data)
    return response.data
  }

  const deletePayment = async (id: number) => {
    await axios.delete(`/api/payments/${id}`)
  }

  return {
    payments,
    loading,
    fetchPayments,
    createPayment,
    deletePayment
  }
}
