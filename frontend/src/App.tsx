import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField, Button } from "@mui/material";
import { useState } from 'react';
import { parse, MathNode } from 'mathjs';
import './App.css';
import Graph from './Graph';
import { Box } from '@mui/material';
import { calculate } from './backendSurface';

function App() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const defaultGrad = "x + y";
  const defaultInit = "(0, 0)";
  const defaultH = ".1";
  const defaultN = "20";

  function parseGrad(s: string) : MathNode | null {
    try {
      return parse(s);
    } catch (_) {
      return null;
    }
  }

  function parseInit(s: string) : Point | null {
    return {x: 0, y: 0};
  }

  function parseH(s: string) : number | null {
    const val = parseFloat(s);
    return val ? val : null;
  }

  function parseN(s: string) : number | null {
    const val = parseInt(s);
    return val ? val : null;
  }

  const [grad, setGrad] = useState<MathNode | null>(parseGrad(defaultGrad));
  const [init, setInit] = useState<Point | null>(parseInit(defaultInit));
  const [h, setH] = useState<number | null>(parseH(defaultH));
  const [n, setN] = useState<number | null>(parseN(defaultN));

  const [data, setData] = useState<Point[]>();

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">
    <Box display="flex" justifyContent="center" height={"10vh"}>
      <h3>Numerical Integration Playground</h3>
    </Box>
    <Box display="flex" justifyContent="center" height={"10vh"}>
      <p>(WIP; can only change h and number of iterations)</p>
    </Box>
      <Box margin="auto" display="flex" height={"70vh"} width={"90vw"}>
        <Box width={"20vw"}>
          <TextField
            label="Gradient"
            error={grad === null}
            autoComplete="off"
            defaultValue={"x + y"}
            onChange={(e) => {
              setGrad(parseGrad(e.target.value))
            }} />
          <TextField
            label="Initial Condition"
            error={init===null}
            autoComplete="off"
            defaultValue={"(0, 0)"}
            onChange={(e) => {
              setInit(parseInit(e.target.value));
            }} />
          <TextField
            label="Δh"
            error={h===null}
            autoComplete="off"
            defaultValue={h}
            onChange={(e) => {
              setH(parseH(e.target.value));
            }} />
          <TextField
            label="Number of Iterations"
            error={n===null}
            autoComplete="off"
            defaultValue={n}
            onChange={(e) => {
              setN(parseN(e.target.value));
            }} />
          <Button variant="contained" onClick={async () => {
            if (grad !== null && init !== null && h !== null && n !== null) {
              setData(await calculate({
                gradient: grad,
                initialCondition: init,
                timeStep: h,
                numSteps: n}));
            }
          }}>Integrate!</Button>
        </Box>
        <Box width={"70vw"}>
          <Graph data={data}/>
        </Box>
      </Box>
    </div>
  </ThemeProvider>
  );
}

export default App;
