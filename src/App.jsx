import { BrowserRouter, Route, Routes } from "react-router-dom";

import User from "./Pages/User/User";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/:userState/:userHash?" element={<User />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
