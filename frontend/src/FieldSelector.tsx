function FieldSelector({register}:
	{register: (f: () => string) => void}) {

	function getField(): string {
		return "single_attractor";
	}

	register(getField);

	return <></>;
}

export default FieldSelector;