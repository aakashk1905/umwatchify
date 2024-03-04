import "./App.css";
import Mentor from "./Video/Mentor";
import Watchit from "./Video/Watchit";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/lecture">
            <Route path=":slug" element={<Watchit />} />
            <Route path="mentor/view" element={<Mentor />}></Route>
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
