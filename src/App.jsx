import { BrowserRouter, Route, Routes } from "react-router-dom";

import User from "./Pages/User/User";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`${import.meta.env.VITE_BASE_URL}/user`} element={<User />} />
        <Route path={`${import.meta.env.VITE_BASE_URL}/user/:userState/:userHash?`} element={<User />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
