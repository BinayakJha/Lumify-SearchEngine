import './App.css';
import MainPage from './MainPage';

import SearchPage from './SearchPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImagePage from './ImagePage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/search" element={<SearchPage/>}/>
          <Route path="/image" element={<ImagePage/>}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;