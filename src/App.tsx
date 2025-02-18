// // import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Landing from './pages/Landing';
// import Home from './pages/Home';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Landing />} />
//         <Route path="/home" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


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
