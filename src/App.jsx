import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Service from "./components/Service";
import Appointment from "./components/Appointment";
import Footer from "./components/Footer";
import Doctors from "./components/Doctors";
import ChatBot from "./components/ChatBot";
const App = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <Service />
      <ChatBot />
      <Appointment />
      <Doctors />
      <Footer />
    </div>
  );
};

export default App;
