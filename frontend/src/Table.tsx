import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import { Input, Button } from "@mui/material";
import React, { useState } from 'react';
import { parseH, parseMethod, parseN, parsePoint2D, parseColor, parsePoint } from './utils';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getUniqueId } from './utils';

const DEFAULT_IVPS: PartialIVP[] = [
    {id: getUniqueId(), x0: "(2, 0)", v0: "(0, 2)", h: "0.01", n: "7566", method: "RK4", color: "#FF00FF"},
    {id: getUniqueId(), x0: "(-2, 0)", v0: "(0, -2)", h: "0.01", n: "7566", method: "RK4", color: "#00FFFF"}
];

function getNewIVP(): PartialIVP {
	return {
		id: getUniqueId(), x0: "(3, 0)", v0: "(0, 3)", h: "0.01", n: "10000", method: "Forward Euler", color: "#FFFFFF"
	}
}

function TableView(
		{register}:
		{register: (f: () => IVP[]) => void}
	) {
	
	const [ivps, setIvps] = useState<PartialIVP[]>(DEFAULT_IVPS);

	function getIVPs(): IVP[] {
		return validate(ivps);
	}

	function addIvp() {
		const ivpClone = [...ivps];
		ivpClone.push(getNewIVP());
		setIvps(ivpClone);
	}

	function removeIvp(id: string) {		
		const ivpClone = [...ivps];
		const arrIdx = ivpClone.findIndex(ivp => ivp.id === id);
		ivpClone.splice(arrIdx, 1);
		setIvps(ivpClone);
	}

	function modifyIvp(id: string, action: (ivp: PartialIVP) => void) {
		const ivpClone = [...ivps];
		const arrIdx = ivpClone.findIndex(ivp => ivp.id === id);
		action(ivpClone[arrIdx]);
		setIvps(ivpClone);
	}

	function validate(partials: PartialIVP[]): IVP[] {
		const validated: (IVP | undefined)[] = partials.map(partial => {
			const color = parseColor(partial.color);
			const h = parseH(partial.h);
			const method = parseMethod(partial.method);
			const n = parseN(partial.n);
			const v0 = parsePoint2D(partial.v0);
			const x0 = parsePoint2D(partial.x0);

			if (color !== null && h !== null && method !== null && n !== null && n !== null && v0 !== null && x0 !== null) {
				return {
					id: partial.id,
					color, h, method, n, v0, x0
				}
			} else {
				return undefined;
			}
		});

		if (validated.includes(undefined)) {
			console.log("could not validate all rows. proceeding with just some");
		}

		return validated.filter(ivp => ivp !== undefined) as IVP[];
	}

	register(getIVPs);
  
	return (
		<TableContainer component={Paper}>
		<Table sx={{ minWidth: 650 }} aria-label="simple table">

		  <TableHead>
			<TableRow>
			  <TableCell align="center"></TableCell>
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
				<TableCell align="center">
					<Button onClick={() => {removeIvp(ivp.id)}}>
						<RemoveCircleIcon />
					</Button>
				</TableCell>

				<TableCell align="center">
				<Input 
						value={ivp.x0}
						error={parsePoint2D(ivp.x0) === null}
						onChange={(e) => {
							modifyIvp(ivp.id, ivp => {ivp.x0 = e.target.value});
					}}/>	
				</TableCell>

				<TableCell align="center">
				<Input 
						value={ivp.v0}
						error={parsePoint2D(ivp.v0) === null}
						onChange={(e) => {
							modifyIvp(ivp.id, ivp => {ivp.v0 = e.target.value});
					}}/>
				</TableCell>

				<TableCell align="center">
				<Input 
						value={ivp.h}
						error={parseH(ivp.h) === null}
						onChange={(e) => {
							modifyIvp(ivp.id, ivp => {ivp.h = e.target.value});
					}}/>
				</TableCell>

				<TableCell align="center">
				<Input 
						value={ivp.n}
						error={parseN(ivp.n) === null}
						onChange={(e) => {
							modifyIvp(ivp.id, ivp => {ivp.n = e.target.value});
					}}/>
				</TableCell>

				<TableCell align="center">
					<FormControl fullWidth>
						<InputLabel error={ivp.method===""}>Select Method</InputLabel>
						<Select
							value={ivp.method}
							onChange={(e) => {
								modifyIvp(ivp.id, ivp => {ivp.method = parseMethod(e.target.value)});
							}}
						>
							<MenuItem value={"Forward Euler"}>Forward Euler</MenuItem>
							<MenuItem value={"RK4"}>RK4</MenuItem>
						</Select>
					</FormControl>
				</TableCell>

				<TableCell align="center">
				<Input 
						value={ivp.color}
						error={parseColor(ivp.color) === null}
						onChange={(e) => {
							modifyIvp(ivp.id, ivp => {ivp.color = e.target.value});
					}}/>
				</TableCell>
			  </TableRow>
			))}
		  </TableBody>

		  <TableFooter>
		  	<TableRow>
			  <TableCell colSpan={Number.MAX_SAFE_INTEGER} align="center">
			  <Button onClick={addIvp}>
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
  