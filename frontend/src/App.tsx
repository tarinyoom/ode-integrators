import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from "@mui/material";
import { useState } from 'react';
import './App.css';
import Graph from './Graph';
import { Box } from '@mui/material';
import { solveAll } from './backendSurface';
import TableView from './TableView';
import { getUniqueId } from './utils';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const DEFAULT_IVPS: IVP[] = [{id: getUniqueId(), x0: [1, 0], v0: [0, 1], h: 0.1, n: 1000, method: "Forward Euler", color: "#FFFFFF"}];

  const [IVPs, setIVPs] = useState<IVP[]>(DEFAULT_IVPS);
  const [data, setData] = useState<IVPSolution[]>();

  function recordIVP(x0: number[], v0: number[], h: number, n: number, method: string, color: string) {
    
    const ivp = {
      id: getUniqueId(), x0, v0, h, n, method, color
    };

    setIVPs(IVPs.concat(ivp));
  }

  function forgetIVP(id: string) {
    const ivpClone = [...IVPs];
    const arrIdx = ivpClone.findIndex((ivp) => ivp.id === id);
    ivpClone.splice(arrIdx, 1);
    setIVPs(ivpClone);
  }

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


      <TableView ivps={IVPs} record={recordIVP} forget={forgetIVP} />
      <Box margin={"15px"}>
          <Button variant="contained" onClick={async () => {
            setData(await solveAll(IVPs));
          }}>Integrate!</Button>
      </Box>

      <Box margin="auto" display="flex" height={"70vh"} width={"90vw"}>
        <Graph data={data}/>
        
      </Box>

    </div>
  </ThemeProvider>
  );
}

export default App;
