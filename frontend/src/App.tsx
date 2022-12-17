import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import Graph from './Graph';
import { Box } from '@mui/material';

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
      <Box display="flex" justifyContent="center" height={"10vh"}>
        <h3>Numerical Integration Playground</h3>
      </Box>
      <Box margin="auto" display="flex" height={"70vh"} width={"70vw"}>
        <Graph />
      </Box>
      <Box display="flex" padding="20px" justifyContent="center" height={"20vh"}>
        Input goes here
      </Box>
    </div>
  </ThemeProvider>
  );
}

export default App;
