import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Landing from './routes/Landing/Landing';
import Home from './routes/Home/Home';
import Dashboard from './routes/Dashboard/Dashboard';
import Matches from './routes/Matches/Matches';
import Analytics from './routes/Analytics/Analytics';
import Profile from './routes/Profile/Profile';

import supabase from './connnections';

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <div className="App bg-gray-800 h-screen font-raleway font-semibold">
        <Routes>
          <Route path='/login' element={session ? <Navigate to="/dashboard" /> : <Landing />}></Route>
          <Route path='/' element={session ? <Home /> : <Navigate to="/login" />}>
            <Route path='dashboard' element={session ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path='matches' element={session ? <Matches /> : <Navigate to="/login" />} />
            <Route path='analytics' element={session ? <Analytics /> : <Navigate to="/login" />} />
            <Route path='profile' element={session ? <Profile /> : <Navigate to="/login" />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
