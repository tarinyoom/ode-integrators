import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField, Button } from "@mui/material";
import { useState } from 'react';
import './App.css';
import Graph from './Graph';
import { Box } from '@mui/material';
import { calculateAll } from './backendSurface';
import { parsePoints4D, stringifyPoints, parseN, parseH } from './serdeInputs';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const defaultPs = "(1, 0, 0, 1);(3, 0, 0, 1);(5, 0, 0, 1)";
  const defaultH = ".1";
  const defaultN = "5000";

  const [ps, setPs] = useState<PointState[] | null>(parsePoints4D(defaultPs));
  const [h, setH] = useState<number | null>(parseH(defaultH));
  const [n, setN] = useState<number | null>(parseN(defaultN));

  const [data, setData] = useState<IVPResult[]>();

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">
    <Box display="flex" justifyContent="center" height={"10vh"}>
      <h3>Numerical Integration Playground</h3>
    </Box>
    <Box display="flex" justifyContent="center" height={"10vh"}>
      <p>Plot the trajectory of massless points through a force field!</p>
    </Box>
      <Box margin="auto" display="flex" height={"70vh"} width={"90vw"}>
        <Box width={"20vw"}>
        <TextField
            label="Initial Points"
            error={ps===null}
            autoComplete="off"
            defaultValue={stringifyPoints(ps)}
            onChange={(e) => {
              setPs(parsePoints4D(e.target.value));
            }} />
          <TextField
            label="Time Step"
            error={h===null}
            autoComplete="off"
            defaultValue={h}
            onChange={(e) => {
              setH(parseH(e.target.value));
            }} />
          <TextField
            label="Number of Steps"
            error={n===null}
            autoComplete="off"
            defaultValue={n}
            onChange={(e) => {
              setN(parseN(e.target.value));
            }} />
          <Button variant="contained" onClick={async () => {
            if (ps != null && h !== null && n !== null) {
              setData(await calculateAll(ps, h, n));
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
