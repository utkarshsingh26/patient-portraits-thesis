import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Avatar from './pages/Avatar';
import Timeline from './pages/Timeline';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<Home/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/avatar/:id" element={<Avatar/>} />
      <Route path="/timeline/:id" element={<Timeline/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
