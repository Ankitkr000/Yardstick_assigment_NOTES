

import { Route,Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Notes from "./pages/Notes"
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <>
    <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Notes/>}/>
    </Routes>
    </>
  )
}

export default App
