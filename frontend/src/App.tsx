import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/navbar';
import SpecialEventsCarousel from './components/special-events-carousel';
import SignUp from './components/sign-up';

function App() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <Router>
      <Navbar onSignUpClick={() => setIsSignUpOpen(true)} />
      <Routes>
        <Route path="/" element={<SpecialEventsCarousel />} />
        {/* Keep route version too if needed */}
        {/* <Route path="/signup" element={<SignUp onClose={() => setIsSignUpOpen(false)} />} /> */}
      </Routes>

      {isSignUpOpen && <SignUp onClose={() => setIsSignUpOpen(false)} />}
    </Router>
  );
}

export default App;
