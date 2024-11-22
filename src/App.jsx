
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './Pages/Login/LoginForm'
import Employeedashboard from './Pages/Dashboard/Employeedashboard'

function App() {

  return (
    <>
    <div>
    <BrowserRouter>
      <Routes>

        <Route path = "/" element ={<LoginForm/>}/>
        <Route path = '/Employeedashboard' element= {<Employeedashboard/>}/>

      </Routes>
      </BrowserRouter>
    </div>
    </>
  )
}

export default App
