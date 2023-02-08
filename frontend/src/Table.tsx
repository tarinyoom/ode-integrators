import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import { Input, Button } from "@mui/material";
import { SketchPicker } from 'react-color';
import InfoIcon from '@mui/icons-material/Info';
import Popover from '@mui/material/Popover';
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
		id: getUniqueId(), 
		x0: getRandomStartPosition(0.5, 1), 
		v0: getRandomDirection(10, 170), 
		h: "0.01", 
		n: "10000", 
		method: "RK4", 
		color: getRandomColor()
	}
}

function TableView(
		{register}:
		{register: (f: () => IVP[]) => void}
	) {
	
	const [ivps, setIvps] = useState<PartialIVP[]>([
		{
			id: getUniqueId(),
			x0: "(1, 0)",
			v0: "(0, 1)",
			h: "0.01",
			n: "10000",
			method: "RK4",
			color: "#FF0000"
		},
		{
			id: getUniqueId(),
			x0: "(1, 0)",
			v0: "(0, 1)",
			h: "0.01",
			n: "10000",
			method: "Backward Euler",
			color: "#0000FF"
		},
		{
			id: getUniqueId(),
			x0: "(1, 0)",
			v0: "(0, 1)",
			h: "0.01",
			n: "10000",
			method: "Forward Euler",
			color: "#00FF00"
		}
	]);
	const [colorAnchor, setColorAnchor] = useState<HTMLButtonElement | null>(null);
	const [colorOpen, setColorOpen] = useState<string | null>(null);

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

	const hTooltip = "How often the trajectory is recalculated. As this value gets smaller, the results will increase in accuracy.";
	const nTooltip = "How many iterations the simulation should run for. The total simulated time will be the time step times the number of steps.";
	const methodTooltip = "The integration method to be used. For the two fields provided here, RK4 yields the most stable solutions. Forward Euler causing particles to gain energy over time, while Backward Euler causes particles to lose energy over time. Backward Euler uses Newton's method to converge, with each step converging for 100 iterations, so it will take longer to calculate than the other methods.";
  
	return (
		<TableContainer component={Paper}>
		<Table sx={{ minWidth: 650 }} aria-label="simple table">

		  <TableHead>
			<TableRow>
			  <TableCell align="center"></TableCell>
			  <TableCell align="center">Initial Position</TableCell>
			  <TableCell align="center">Initial Velocity</TableCell>
			  <TableCell align="center">
				Time Step&nbsp;
				<Tooltip title={hTooltip} placement="top"><InfoIcon fontSize="small" /></Tooltip>
				</TableCell>
			  <TableCell align="center">
				Number of Iterations&nbsp;
				<Tooltip title={nTooltip} placement="top"><InfoIcon /></Tooltip>
				</TableCell>
			  <TableCell align="center">
				Integration Method&nbsp;
				<Tooltip title={methodTooltip} placement="top"><InfoIcon /></Tooltip>
			  </TableCell>
			  <TableCell align="center">Color</TableCell>
			</TableRow>
		  </TableHead>

		  <TableBody>
			{ivps.map((ivp, i) => (
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
							<MenuItem value={"Backward Euler"}>Backward Euler</MenuItem>
							<MenuItem value={"RK4"}>RK4</MenuItem>
						</Select>
					</FormControl>
				</TableCell>

				<TableCell align="center">
					<Button
						variant="contained"
						style={{backgroundColor: ivp.color}}
						onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
							setColorAnchor(event.currentTarget);
							setColorOpen(ivp.id);
					}}>
						 &nbsp;
					</Button>
					<Popover
						open={colorOpen === ivp.id}
						anchorEl={colorAnchor}
						onClose={() => {
							setColorAnchor(null);
							setColorOpen(null);
						}}
						anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
						}}
					>
					<SketchPicker
						color={ivp.color}
						onChangeComplete={(color) => {
							modifyIvp(ivp.id, (ivp) => {ivp.color = color.hex});
						}}/>
					</Popover>
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
  