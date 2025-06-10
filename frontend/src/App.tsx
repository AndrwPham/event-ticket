import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SpecialEventsCarousel from './components/SpecialEventsCarousel';
import CreateEvent from './components/CreateEvent'; 

function App() {

  return (
    <Router>
      <Navbar  />
      <Routes>
        <Route path="/" element={<SpecialEventsCarousel />} />
        <Route path="/create-event" element={<CreateEvent />} /> 
        {/* Keep route version too if needed */}
        {/* <Route path="/signup" element={<SignUp onClose={() => setIsSignUpOpen(false)} />} /> */}
      </Routes>

    </Router>
  );
}

export default App;