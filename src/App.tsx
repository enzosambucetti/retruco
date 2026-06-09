import { Outlet } from 'react-router-dom'
import { TopAppBar } from './components/TopAppBar'
import { BottomNav } from './components/BottomNav'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <TopAppBar />
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
