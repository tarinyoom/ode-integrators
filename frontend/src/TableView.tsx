import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import { Input, Button } from "@mui/material";
import { useState } from 'react';
import { parseH, parseMethod, parseN, parsePoint2D } from './utils';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function TableView(
		{ivps, record}:
		{ivps: IVP[], 
		record: (x0: number[], v0: number[], h: number, n: number, method: string, color: string) => void}
	) {

	const [x0, setX0] = useState<string>("");
	const [v0, setV0] = useState<string>("");
	const [h, setH] = useState<string>("");
	const [n, setN] = useState<string>("");
	const [method, setMethod] = useState<string>("");
  
	return (
		<TableContainer component={Paper}>
		<Table sx={{ minWidth: 650 }} aria-label="simple table">

		  <TableHead>
			<TableRow>
			  <TableCell align="center">x<sub>0</sub></TableCell>
			  <TableCell align="center">v<sub>0</sub></TableCell>
			  <TableCell align="center">&#916;t</TableCell>
			  <TableCell align="center">n<sub>iters</sub></TableCell>
			  <TableCell align="center">Method</TableCell>
			  <TableCell align="center">Color</TableCell>
			</TableRow>
		  </TableHead>

		  <TableBody>
			{ivps.map((ivp) => (
			  <TableRow
				key={ivp.id}
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			  >
				<TableCell align="center">{`(${ivp.x0})`}</TableCell>
				<TableCell align="center">{`(${ivp.v0})`}</TableCell>
				<TableCell align="center">{ivp.h}</TableCell>
				<TableCell align="center">{ivp.n}</TableCell>
				<TableCell align="center">{ivp.method}</TableCell>
				<TableCell align="center">{ivp.color}</TableCell>
			  </TableRow>
			))}
		  </TableBody>

		  <TableFooter>
		  	<TableRow>
			  <TableCell align="center">
			  <Input 
					value={x0}
					error={parsePoint2D(x0)===null}
					onChange={(e) => {
						setX0(e.target.value);
				}}/>	
			  </TableCell>
			  <TableCell align="center">
			  <Input 
					value={v0}
					error={parsePoint2D(v0)===null}
					onChange={(e) => {
						setV0(e.target.value);
				}}/>
			  </TableCell>
			  <TableCell align="center">
			  <Input 
					value={h}
					error={parseH(h)===null}
					onChange={(e) => {
						setH(e.target.value);
				}}/>
			  </TableCell>
			  <TableCell align="center">
			  <Input 
			  		value={n}
					error={parseN(n)===null}
					onChange={(e) => {
						setN(e.target.value);
				}}/>
			  </TableCell>
			  <TableCell align="center">
				<FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">Select Method</InputLabel>
					<Select
					    value={method}
						onChange={(e) => {
							setMethod(e.target.value as string);
						}}
					>
						<MenuItem value={"Forward Euler"}>Forward Euler</MenuItem>
						<MenuItem value={"Backward Euler"}>Backward Euler</MenuItem>
						<MenuItem value={"RK4"}>RK4</MenuItem>
					</Select>
				</FormControl>
			  </TableCell>

			  <TableCell align="center">
			  <Button onClick={() => {
				const x0_ = parsePoint2D(x0);
				const v0_ = parsePoint2D(v0);
				const h_ = parseH(h);
				const n_ = parseN(n);
				const method_ = parseMethod(method);
				if (x0_ !== null && v0_ !== null && h_ !== null && n_ !== null && method_ !== null) {
					record(x0_, v0_, h_, n_, method_, "#FFFFFF");
					console.log(`data is now ${JSON.stringify(ivps)}`);
				} else {
					console.log(`method was just ${method} ${method_}`)
				}
			  }}>
				<AddCircleIcon />
			  </Button>

			  </TableCell>
			</TableRow>
		  </TableFooter>

		</Table>
	  </TableContainer>
	);
  }
  
  export default TableView;
  