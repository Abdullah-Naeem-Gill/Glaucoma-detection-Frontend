import React from 'react'
import Header from './components/Header'
import NavBar from './components/NavBar'
import HeroSection from './components/HeroSection'
import Service from './components/Service'
import Appointment from './components/Appointment'
import Footer from './components/Footer'
const App = () => {
  return (
    <div>
      
      <Header/>
    <HeroSection/>
    <Service/>
    <Appointment /> 
    <Footer />
    </div>
  )
}

export default App
