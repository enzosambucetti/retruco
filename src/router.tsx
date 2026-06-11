import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { SeriePage } from './pages/SeriePage'
import { JornadaPage } from './pages/JornadaPage'
import { GlobalPage } from './pages/GlobalPage'
import { LoginPage } from './pages/admin/LoginPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { SeriesPage } from './pages/admin/SeriesPage'
import { ParejasPage } from './pages/admin/ParejasPage'
import { JornadasPage } from './pages/admin/JornadasPage'
import { AdminJornadaPage } from './pages/admin/AdminJornadaPage'
import { NuevoPartidoPage } from './pages/admin/NuevoPartidoPage'
import { EditarPartidoPage } from './pages/admin/EditarPartidoPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'series/:id', element: <SeriePage /> },
      { path: 'series/:id/jornadas/:jornada_id', element: <JornadaPage /> },
      { path: 'global', element: <GlobalPage /> },
      { path: 'admin/login', element: <LoginPage /> },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/series',
        element: (
          <ProtectedRoute>
            <SeriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/parejas',
        element: (
          <ProtectedRoute>
            <ParejasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/jornadas',
        element: (
          <ProtectedRoute>
            <JornadasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/jornadas/:id',
        element: (
          <ProtectedRoute>
            <AdminJornadaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/partidos/nuevo',
        element: (
          <ProtectedRoute>
            <NuevoPartidoPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/partidos/:id/editar',
        element: (
          <ProtectedRoute>
            <EditarPartidoPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
