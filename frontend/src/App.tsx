import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField, Button } from "@mui/material";
import { useState, useEffect } from 'react';
import './App.css';
import Graph from './Graph';
import { Box } from '@mui/material';

function App() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const [ivp, setIvp] = useState<IVP>();

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">
      <Box display="flex" justifyContent="center" height={"10vh"}>
        <h3>Numerical Integration Playground</h3>
      </Box>
      <Box margin="auto" display="flex" height={"80vh"} width={"90vw"}>
        <Box width={"20vw"}>
          <TextField
            label="Gradient"
            autoComplete="off"
            defaultValue={"x + y"}
            onChange={(e) => {}} />
          <TextField
            label="Initial Condition"
            autoComplete="off"
            defaultValue={"(0, 0)"}
            onChange={(e) => {}} />
          <TextField
            label="Δh"
            autoComplete="off"
            defaultValue={"0.1"}
            onChange={(e) => {}} />
          <TextField
            label="Number of Iterations"
            autoComplete="off"
            defaultValue={"100"}
            onChange={(e) => {}} />
          <Button variant="contained">Integrate!</Button>
        </Box>
        <Box width={"70vw"}>
          <Graph />
        </Box>
      </Box>
    </div>
  </ThemeProvider>
  );
}

export default App;
