import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from "@mui/material";
import { useState } from 'react';
import './App.css';
import Graph from './Graph';
import { Box } from '@mui/material';
import { solveAll } from './backendSurface';
import Table from './Table';
import CircularProgress from '@mui/material/CircularProgress';
import RefIcon from './RefIcon';
import logoD3 from './img/d3.png';
import logoReact from './img/react.png';
import logoRust from './img/rust.png';
import logoLambda from './img/lambda.png';
import FieldSelector from './FieldSelector';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const [data, setData] = useState<IVPSolution[]>();
  const [field, setField] = useState<string>("none");

  let getInitialConditions: () => IVP[];
  let getField: () => string;

  const [loading, setLoading] = useState<boolean>(false);
  const [init, setInit] = useState<boolean>(false);

  function registerGetInitialConditions(getter: (() => IVP[])) {
    getInitialConditions = getter;
  }

  function registerGetField(getter: (() => string)) {
    getField = getter;
  }

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">

      <Box display="flex" justifyContent="center" height={"10vh"}>
        <h3>Parallel Integration</h3>
      </Box>

      <Box display="flex" justifyContent="center" height={"10vh"}>
        <p>Specify a list of initial conditions and integrate in parallel:</p>
      </Box>

      <Table register={registerGetInitialConditions} />

      <FieldSelector register={registerGetField}/>

      <Box margin={"15px"}>
          <Button variant="contained" onClick={async () => {
            setLoading(true);
            setInit(true);
            solveAll(getInitialConditions(), getField()).then((data) => {
              setLoading(false);
              setData(data);
              setField(getField());
            })
          }}>Integrate!</Button>
      </Box>

      <Box hidden={!init} margin="auto" display="flex" height={"90vh"} width={"90vw"}>
        <Box hidden={loading} width={"100%"} height={"100%"}>
          <Graph data={data} field={field} />
        </Box>
        
        <Box hidden={!loading} padding={"35vh"} width={"100%"} height={"100%"} >
          <CircularProgress size={"20vh"}/>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" height={"8vh"}>
        <p style={{"fontSize": "12px"}}>
          By Adam Reynolds <a href="https://github.com/tarinyoom/ode-integrators">(source)</a>
          <br/>

          <span style={{"fontSize": "16px"}}>
            <RefIcon href={"https://d3js.org"} src={logoD3} name={"D3.js"} /><sup> &times; </sup>
            <RefIcon href={"https://reactjs.org/"} src={logoReact} name={"React"} /><sup> + </sup>
            <RefIcon href={"https://www.rust-lang.org/"} src={logoRust} name={"Rust"} /><sup> &times; </sup>
            <RefIcon href={"https://aws.amazon.com/lambda/"} src={logoLambda} name={"AWS Lambda"} />
          </span>
          </p>
      </Box>

    </div>
  </ThemeProvider>
  );
}

export default App;
