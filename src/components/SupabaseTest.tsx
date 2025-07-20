import React from 'react'
import { supabase } from '../integrations/supabase'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'

export function SupabaseTest() {
  const [status, setStatus] = useState<string>('Not tested')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test the connection by getting server time
      const { data, error } = await supabase
        .rpc('get_server_time')

      if (error) throw error
      
      setStatus('Connection successful!')
      setError('')
    } catch (err) {
      setStatus('Connection failed')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
      <div className="bg-blue-100 p-4 rounded-lg">
        <p>Status: <span className="font-bold">{status}</span></p>
        {error && (
          <p className="text-red-500">Error: {error}</p>
        )}
      </div>
      <Button onClick={testConnection}>
        Test Connection Again
      </Button>
    </div>
  )
}
