import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from "@mui/material";
import { useState } from 'react';
import './App.css';
import Graph from './Graph';
import { Box } from '@mui/material';
import { solveAll } from './backendSurface';
import TableView from './Table';
import CircularProgress from '@mui/material/CircularProgress';
import RefIcon from './RefIcon';
import logoD3 from './img/d3.png';
import logoReact from './img/react.png';
import logoRust from './img/rust.png';
import logoLambda from './img/lambda.png';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const [data, setData] = useState<IVPSolution[]>();
  let getData: () => IVP[];

  const [loading, setLoading] = useState<boolean>(false);
  const [init, setInit] = useState<boolean>(false);

  function registerGetData(getter: (() => IVP[])) {
    getData = getter;
  }

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">

      <Box display="flex" justifyContent="center" height={"10vh"}>
        <h3>Parallel Integration</h3>
      </Box>

      <TableView register={registerGetData} />
      <Box margin={"15px"}>
          <Button variant="contained" onClick={async () => {
            setLoading(true);
            setInit(true);
            solveAll(getData()).then((data) => {
              setLoading(false);
              setData(data);
            })
          }}>Integrate!</Button>
      </Box>

      <Box hidden={!init} margin="auto" display="flex" height={"70vh"} width={"90vw"}>
        <Box hidden={loading} width={"100%"} height={"100%"}>
          <Graph data={data} />
        </Box>
        
        <Box hidden={!loading} padding={"30vh"} width={"100%"} height={"100%"} >
          <CircularProgress size={"10vh"}/>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" height={"15vh"}>
        <p>
          By Adam Reynolds <a href="https://github.com/tarinyoom/ode-integrators">(source)</a>
          <br/>

          <span style={{"fontSize": "16px"}}>
            <RefIcon href={"https://d3js.org"} src={logoD3} /><sup> &times; </sup>
            <RefIcon href={"https://reactjs.org/"} src={logoReact} /><sup> + </sup>
            <RefIcon href={"https://www.rust-lang.org/"} src={logoRust} /><sup> &times; </sup>
            <RefIcon href={"https://aws.amazon.com/lambda/"} src={logoLambda} />
          </span>
          </p>
      </Box>

    </div>
  </ThemeProvider>
  );
}

export default App;
