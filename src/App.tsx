import { HashRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Library } from './pages/Library'
import { PaperDetail } from './pages/PaperDetail'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/papers/:id" element={<PaperDetail />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
