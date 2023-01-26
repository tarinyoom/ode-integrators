import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from "@mui/material";
import { useState, useRef } from 'react';
import './App.css';
import Graph from './Graph';
import { Box } from '@mui/material';
import { solveAll } from './backendSurface';
import Table from './Table';
import CircularProgress from '@mui/material/CircularProgress';
import RefIcon from './RefIcon';
import logoTone from './img/tone.png';
import logoD3 from './img/d3.png';
import logoReact from './img/react.png';
import logoRust from './img/rust.png';
import logoLambda from './img/lambda.png';
import logoTypescript from './img/typeScript.png';
import FieldSelector from './FieldSelector';
import * as Tone from 'tone';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const footer = useRef<any>();
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

  function integrate() {
    setData([]);
    footer.current.scrollIntoView({ behavior: "smooth" });
    solveAll(getInitialConditions(), getField()).then((data) => {
      setLoading(false);
      setData(data);
      setField(getField());
    }) 
  }

  return (
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <div className="App">

      <Box display="flex" justifyContent="center" height={"10vh"}>
        <h3>ODE Visualization and Sonification</h3>
      </Box>

      <Box display="flex" justifyContent="center" paddingBottom={"5vh"} paddingLeft={"10vw"} paddingRight={"10vw"}>
        <p>Solve 2nd-order ordinary differential equations (ODEs) based on initial conditions of your choice.
          Provide some initial conditions and integration specifications in the table below, or just use randomly generated ones.
          You can use the "+" button to add a new IVP-- all IVPs will be solved in parallel.
          Then use the "integrate" button to see and hear the resulting solutions.</p>
      </Box>

      <Table register={registerGetInitialConditions} />

      <Box marginTop={"5vh"} marginBottom={"3vh"}>
        <FieldSelector register={registerGetField}/>
      </Box>

      <Box margin={"15px"}>
          <Button variant="contained" onClick={async () => {
            setLoading(true);
            setInit(true);
            if (!init) {
              await Tone.start().then(() => {
                integrate();
              })  
            } else {
              integrate();
            }
          }}>Integrate</Button>
      </Box>

      <Box hidden={!init} margin="auto" display="flex" height={"90vh"} width={"90vw"}>
        <Box hidden={loading} width={"100%"} height={"100%"}>
          <Graph data={data} field={field} />
        </Box>
        
        <Box hidden={!loading} paddingTop={"35vh"} width={"100%"} height={"100%"} >
          <CircularProgress size={"20vh"}/>
        </Box>
      </Box>

      <Box display="flex" ref={footer} justifyContent="center" height={"8vh"}>
        <p style={{"fontSize": "12px"}}>
          By Adam Reynolds <a href="https://github.com/tarinyoom/ode-integrators">(source)</a>
          <br/>

          <span style={{"fontSize": "16px"}}>
            <RefIcon href={"https://www.typescriptlang.org/"} src={logoTypescript} name={"typeScript"} />
            <sup> &times; </sup>
            <span style={{"fontSize": "20px"}}><sup>( </sup></span>
            <RefIcon href={"https://d3js.org"} src={logoD3} name={"D3.js"} />
            <sup> + </sup>
            <RefIcon href={"https://tonejs.github.io/"} src={logoTone} name={"Tone.js"} />
            <span style={{"fontSize": "20px"}}><sup> )</sup></span>
            <sup> &times; </sup>
            <RefIcon href={"https://reactjs.org/"} src={logoReact} name={"React"} />
            <sup> + </sup>
            <RefIcon href={"https://www.rust-lang.org/"} src={logoRust} name={"Rust"} />
            <sup> &times; </sup>
            <RefIcon href={"https://aws.amazon.com/lambda/"} src={logoLambda} name={"AWS Lambda"} />
          </span>
          </p>
      </Box>

    </div>
  </ThemeProvider>
  );
}

export default App;
