import React from 'react'
import Header from './components/Header'
import NavBar from './components/NavBar'
import HeroSection from './components/HeroSection'
import Service from './components/Service'
import Appointment from './components/Appointment'
import Footer from './components/Footer'
import Doctors from './components/Doctors'
const App = () => {
  return (
    <div>
      
      <Header/>
    <HeroSection/>
    <Service/>
    <Appointment /> 
    <Doctors />
    <Footer />
    </div>
  )
}

export default App
