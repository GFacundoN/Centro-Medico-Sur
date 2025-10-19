import { useState, useEffect } from 'react';
import { Clock, Plus } from 'lucide-react';
import { listaEsperaService } from '../services/listaEsperaService';
import { pacienteService } from '../services/pacienteService';
import { useAuth } from '../context/AuthContext';

function ListaEspera() {
  const { user } = useAuth();
  const [lista, setLista] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [listaData, pacientesData] = await Promise.all([
        listaEsperaService.getAll(),
        pacienteService.getAll()
      ]);
      setLista(listaData);
      setPacientes(pacientesData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await listaEsperaService.create(selectedPaciente);
      setShowModal(false);
      setSelectedPaciente('');
      loadData();
    } catch (error) {
      alert('Error al agregar');
    }
  };

  const handleEstadoChange = async (id, estado) => {
    try {
      await listaEsperaService.updateEstado(id, estado);
      loadData();
    } catch (error) {
      alert('Error');
    }
  };

  const canEdit = user?.rol === 'recepcion' || user?.rol === 'admin';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <h2 className="text-2xl font-bold">Lista de Espera</h2>
          </div>
          {canEdit && (
            <button onClick={() => setShowModal(true)} className="bg-yellow-600 text-white px-4 py-2 rounded-lg">
              <Plus className="h-5 w-5 inline mr-2" />Agregar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center">Cargando...</td></tr>
            ) : lista.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center">Sin registros</td></tr>
            ) : (
              lista.map((item) => (
                <tr key={item.id_lista}>
                  <td className="px-6 py-4 text-sm">{new Date(item.fecha_solicitud).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">{item.nombre} {item.apellido}</td>
                  <td className="px-6 py-4 text-sm">{item.dni}</td>
                  <td className="px-6 py-4 text-sm">{item.telefono || '-'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-yellow-100">{item.estado}</span></td>
                  <td className="px-6 py-4">
                    {canEdit && (
                      <select value={item.estado} onChange={(e) => handleEstadoChange(item.id_lista, e.target.value)} className="text-sm border rounded px-2 py-1">
                        <option value="activa">Activa</option>
                        <option value="asignada">Asignada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Agregar a Lista de Espera</h3>
            <form onSubmit={handleSubmit}>
              <select value={selectedPaciente} onChange={(e) => setSelectedPaciente(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-4" required>
                <option value="">Seleccionar paciente</option>
                {pacientes.map((p) => (
                  <option key={p.id_paciente} value={p.id_paciente}>{p.nombre} {p.apellido} - {p.dni}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg">Agregar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaEspera;
