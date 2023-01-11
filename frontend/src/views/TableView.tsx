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
import { parseH, parseMethod, parseN, parsePoint2D, parseColor } from '../utils';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getUniqueId } from '../utils';

const DEFAULT_IVPS: PartialIVP[] = [
    {id: getUniqueId(), x0: [2, 0], v0: [0, 2], h: 0.01, n: 7566, method: "Forward Euler", color: "#FFFF00"},
    {id: getUniqueId(), x0: [2, 0], v0: [0, 2], h: 0.01, n: 7566, method: "RK4", color: "#00FFFF"}
];

function getNewIVP(): PartialIVP {
	return {
		id: getUniqueId(), x0: null, v0: null, h: null, n: null, method: "", color: "#FFFFFF"
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
		const validated = partials.map(partial => {
			if (partial.color !== null &&
				partial.h !== null &&
				partial.method !== null &&
				partial.n !== null &&
				partial.v0 !== null &&
				partial.x0 !== null) {
					return partial;
				} else {
					return undefined;
				}
		}) as (IVP | undefined)[];

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
						error={ivp.x0===null}
						onChange={(e) => {
							modifyIvp(ivp.id, ivp => {ivp.x0 = parsePoint2D(e.target.value)});
					}}/>	
				</TableCell>

				<TableCell align="center">
				<Input 
						value={ivp.v0}
						error={ivp.v0===null}
						onChange={(e) => {
							modifyIvp(ivp.id, ivp => {ivp.v0 = parsePoint2D(e.target.value)});
					}}/>
				</TableCell>

				<TableCell align="center">
				<Input 
						value={ivp.h}
						error={ivp.h===null}
						onChange={(e) => {
							modifyIvp(ivp.id, ivp => {ivp.h = parseH(e.target.value)});
					}}/>
				</TableCell>

				<TableCell align="center">
				<Input 
						value={ivp.n}
						error={ivp.n===null}
						onChange={(e) => {
							modifyIvp(ivp.id, ivp => {ivp.n = parseN(e.target.value)});
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

				<TableCell align="center">{ivp.color}</TableCell>
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
  