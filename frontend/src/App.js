import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Landing from './routes/Landing/Landing';
import Home from './routes/Home/Home';
import Dashboard from './routes/Dashboard/Dashboard';
import Matches from './routes/Matches/Matches';
import Analytics from './routes/Analytics/Analytics';
import Profile from './routes/Profile/Profile';

function App() {
  return (
    <BrowserRouter>
        <div className="App bg-gray-800 h-screen font-raleway font-semibold">
          <Routes>
            <Route path='/login' element={<Landing />}></Route>
            <Route path='/' element={<Home />}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='matches' element={<Matches />} />
              <Route path='analytics' element={<Analytics />} />
              <Route path='profile' element={<Profile />} />
            </Route>
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
