import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import Login from './pages/Login';
import FormBuilder from './pages/FormBuilder';
import MediaManager from './pages/MediaManager';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }>
          <Route index element={<div className="p-6">Welcome — use the left nav.</div>} />
          <Route path="builder" element={<FormBuilder />} />
          <Route path="media" element={<MediaManager />} />
        </Route>

        <Route path="*" element={<div className="p-6">404 — Not Found. <Link to="/">Home</Link></div>} />
      </Routes>
    </>
  )
}

export default App
