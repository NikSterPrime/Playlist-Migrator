import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Landing from './pages/Landing'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </Navbar>
    </Router>  )
}

export default App
