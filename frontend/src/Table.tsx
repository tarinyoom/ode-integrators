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
import { parseH, parseMethod, parseN, parsePoint2D, parseColor } from './utils';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getUniqueId, getRandomColor, getRandomDirection, getRandomStartPosition } from './utils';
import Tooltip from '@mui/material/Tooltip';

function getNewIVP(): PartialIVP {
	return {
		id: getUniqueId(), x0: getRandomStartPosition(1, 2), v0: getRandomDirection(10, 170), h: "0.01", n: "7500", method: "RK4", color: getRandomColor()
	}
}

function TableView(
		{register}:
		{register: (f: () => IVP[]) => void}
	) {
	
	const [ivps, setIvps] = useState<PartialIVP[]>([getNewIVP(), getNewIVP()]);

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
			  <TableCell align="center"><Tooltip title="Initial Position" placement="top"><p>x<sub>0</sub></p></Tooltip></TableCell>
			  <TableCell align="center"><Tooltip title="Initial Velocity" placement="top"><p>v<sub>0</sub></p></Tooltip></TableCell>
			  <TableCell align="center"><Tooltip title="Time Step" placement="top"><p>&#916;t</p></Tooltip></TableCell>
			  <TableCell align="center"><Tooltip title="Number of Iterations" placement="top"><p>n<sub>iters</sub></p></Tooltip></TableCell>
			  <TableCell align="center"><Tooltip title="Integration Method" placement="top"><p>Method</p></Tooltip></TableCell>
			  <TableCell align="center"><Tooltip title="Trace Color" placement="top"><p>Color</p></Tooltip></TableCell>
			</TableRow>
		  </TableHead>

		  <TableBody>
			{ivps.map((ivp) => (
			  <TableRow
				key={ivp.id}
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			  >
				<TableCell align="center">
				  <Tooltip title="Remove this IVP" placement="top">
					<Button onClick={() => {removeIvp(ivp.id)}}>
						<RemoveCircleIcon />
					</Button>
				  </Tooltip>
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
			  <Tooltip title="Add new IVP!" placement="top">
				<Button onClick={addIvp}>
					<AddCircleIcon />
				</Button>
			  </Tooltip>
			  </TableCell>
			</TableRow>
		  </TableFooter>
		</Table>
	  </TableContainer>
	);
  }
  
  export default TableView;
  