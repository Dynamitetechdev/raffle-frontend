import { MoralisProvider } from "react-moralis";
import Home from "./page/home";

function App() {
  return (
    <div className="App">
      <MoralisProvider>
        <Home />
      </MoralisProvider>
    </div>
  );
}

export default App;
