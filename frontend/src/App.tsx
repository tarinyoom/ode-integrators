import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from "@mui/material";
import { useState } from 'react';
import './App.css';
import Graph from './Graph';
import { Box } from '@mui/material';
import { solveAll } from './backendSurface';
import TableView from './views/TableView';
import { getUniqueId } from './utils';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const [data, setData] = useState<IVPSolution[]>();
  let getData: () => IVP[];

  function registerGetData(getter: (() => IVP[])) {
    getData = getter;
  }

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">

      <Box display="flex" justifyContent="center" height={"10vh"}>
        <h3>Numerical Integration Playground</h3>
      </Box>

      <Box display="flex" justifyContent="center" height={"15vh"}>
        <p>What if we shot a marble into space?</p>
      </Box>


      <TableView register={registerGetData} />
      <Box margin={"15px"}>
          <Button variant="contained" onClick={async () => {
            setData(await solveAll(getData()));
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
