import logo from './logo.svg';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

function App() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">
      <h1>Numerical Integration Playground</h1>
      <img src={logo} width="800px" className="App-logo" alt="logo" />
    </div>
  </ThemeProvider>
  );
}

export default App;
