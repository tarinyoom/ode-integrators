import { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

function FieldSelector({register}:
	{register: (f: () => string) => void}) {

	const [ field, setField ] = useState<string>("single_attractor");

	function getField(): string {
		return field;
	}

	register(getField);

	return <FormControl>
	<RadioGroup
	  defaultValue="single_attractor" row
	  onChange={(e) => setField(e.target.value)}
	>
	  <FormControlLabel value="single_attractor" control={<Radio />} label="Single Attractor" />
	  <FormControlLabel value="single_repulsor" control={<Radio />} label="Single Repulsor" />
	</RadioGroup>
  </FormControl>;
}

export default FieldSelector;