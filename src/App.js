import { MoralisProvider } from "react-moralis";
import Home from "./page/home";
import { NotificationProvider } from "web3uikit";
function App() {
  return (
    <div className="App">
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Home />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}

export default App;
