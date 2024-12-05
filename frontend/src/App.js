// import logo from './logo.svg';
// import './App.css';
import './assets/styles/universal.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header/header.js';
import Homepage from './components/pages/homepage.js'

function App() {
  return (
    <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/ddd" element={<div>Home Page Content</div>} />
          <Route path="/tv-shows" element={<div>TV Shows Content</div>} />
          <Route path="/movies" element={<div>Movies Content</div>} />
          <Route path="/latest" element={<div>Latest Content</div>} />
          <Route path="/my-list" element={<div>My List Content</div>} />
        </Routes>
    </Router>
  );
}

export default App;
