import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/navbar';
import SpecialEventsCarousel from './components/special-events-carousel';
import LogIn from './components/log-in';

function App() {
  const [isLogInOpen, setIsLogInOpen] = useState(false);

  return (
    <Router>
      <Navbar onLogInClick={() => setIsLogInOpen(true)} />
      <Routes>
        <Route path="/" element={<SpecialEventsCarousel />} />
        {/* Keep route version too if needed */}
        {/* <Route path="/signup" element={<SignUp onClose={() => setIsSignUpOpen(false)} />} /> */}
      </Routes>

      {isLogInOpen && <LogIn onClose={() => setIsLogInOpen(false)} />}
    </Router>
  );
}

export default App;
