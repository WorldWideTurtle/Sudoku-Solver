import logo from './logo.svg';
import './App.css';
import { useTheme } from './components/contexts/theme-context';

function App() {
  const {theme} = useTheme();

  return (
    <main className={theme.type} id={theme.sub}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </main>
  );
}

export default App;
