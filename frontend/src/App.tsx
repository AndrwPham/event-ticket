import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SpecialEventsCarousel from './components/SpecialEventsCarousel';
import CreateEvent from './pages/CreateEvent'; 
import Step2TimeAndTickets from './components/event-creation/Step2TimeAndTickets';

function App() {

    return (
        <Router>
            <Navbar  />
            <Routes>
                <Route path="/create-event" element={<CreateEvent />} /> 
            </Routes>

        </Router>
    );
}

export default App;
