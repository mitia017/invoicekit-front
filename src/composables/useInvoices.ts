import { ref } from 'vue'
import axios from '@/plugins/axios'
import type { Invoice, InvoiceFormData } from '@/types'

export function useInvoices() {
  const invoices = ref<Invoice[]>([])
  const loading = ref(false)

  const fetchInvoices = async (params = {}) => {
    loading.value = true
    try {
      const response = await axios.get('/api/invoices', { params })
      invoices.value = response.data.data
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const createInvoice = async (data: InvoiceFormData) => {
    const response = await axios.post('/api/invoices', data)
    return response.data
  }

  const updateInvoice = async (id: number, data: Partial<InvoiceFormData>) => {
    const response = await axios.put(`/api/invoices/${id}`, data)
    return response.data
  }

  const deleteInvoice = async (id: number) => {
    await axios.delete(`/api/invoices/${id}`)
  }

  const downloadPDF = async (id: number) => {
    const response = await axios.get(`/api/invoices/${id}/pdf`, {
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `invoice_${id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return {
    invoices,
    loading,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    downloadPDF
  }
}
