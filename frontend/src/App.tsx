import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField, Button } from "@mui/material";
import { useState } from 'react';
import './App.css';
import Graph from './Graph';
import { Box } from '@mui/material';
import { calculate } from './backendSurface';
import { parsePoint2D, stringifyPoint, parseN, parseH } from './serdeInputs';

function App() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const defaultX = "(1, 0)";
  const defaultV = "(0, 1)";
  const defaultH = ".1";
  const defaultN = "1000";

  const [x, setX] = useState<Point | null>(parsePoint2D(defaultX));
  const [v, setV] = useState<Point | null>(parsePoint2D(defaultV));
  const [h, setH] = useState<number | null>(parseH(defaultH));
  const [n, setN] = useState<number | null>(parseN(defaultN));

  const [data, setData] = useState<PointState[]>();

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
            label="Initial Position"
            error={x===null}
            autoComplete="off"
            defaultValue={stringifyPoint(x)}
            onChange={(e) => {
              setX(parsePoint2D(e.target.value));
            }} />
          <TextField
            label="Initial Velocity"
            error={v===null}
            autoComplete="off"
            defaultValue={stringifyPoint(v)}
            onChange={(e) => {
              setV(parsePoint2D(e.target.value));
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
            if (x != null && v != null && h !== null && n !== null) {
              setData(await calculate({
                init: {
                  x: x,
                  v: v,  
                },
                h: h,
                n: n}));
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
