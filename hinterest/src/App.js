import logo from './logo.svg';
import './App.css';
import Flashcards from './components/Flashcards'; /* import from flash cards.js or css */

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> sxdcfghjk save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      {/* add the flash card componet here */}
      <main>
        <Flashcards />
      </main>
    </div>
  );
}

export default App;
