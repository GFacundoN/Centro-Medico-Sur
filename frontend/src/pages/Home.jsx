import { useState, useEffect } from 'react'
import { Activity, Users, Calendar, FileText } from 'lucide-react'
import api from '../services/api'

function Home() {
  const [apiStatus, setApiStatus] = useState(null)

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const response = await api.get('/health')
      setApiStatus(response.data)
    } catch (error) {
      console.error('Error connecting to API:', error)
      setApiStatus({ status: 'ERROR', message: 'No se pudo conectar con el servidor' })
    }
  }

  const features = [
    {
      icon: Users,
      title: 'Gestión de Pacientes',
      description: 'Administra la información de los pacientes de manera eficiente'
    },
    {
      icon: Calendar,
      title: 'Citas Médicas',
      description: 'Programa y gestiona las citas de los pacientes'
    },
    {
      icon: FileText,
      title: 'Historias Clínicas',
      description: 'Accede y actualiza las historias clínicas digitales'
    },
    {
      icon: Activity,
      title: 'Reportes',
      description: 'Genera reportes y estadísticas del centro médico'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido al Sistema de Gestión
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Centro Médico Sur - Plataforma de Administración
          </p>
          
          {/* API Status */}
          {apiStatus && (
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${
              apiStatus.status === 'OK' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                apiStatus.status === 'OK' ? 'bg-green-600' : 'bg-red-600'
              }`}></div>
              <span className="text-sm font-medium">
                {apiStatus.status === 'OK' ? 'Conectado al servidor' : 'Error de conexión'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-primary-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sistema en Desarrollo
        </h3>
        <p className="text-gray-700">
          Esta es la estructura base del proyecto. Las funcionalidades específicas 
          se implementarán según los requerimientos del sistema.
        </p>
      </div>
    </div>
  )
}

export default Home
