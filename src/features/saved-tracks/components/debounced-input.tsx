import { useState, type FC, useEffect } from "react";

type DebouncedInputProps = {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

const DebouncedInput: FC<DebouncedInputProps> = ({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => {
			clearTimeout(timeout);
		};
	}, [debounce, onChange, value]);

	return (
		<input
			{...props}
			value={value}
			onChange={(event) => {
				setValue(event.target.value);
			}}
		/>
	);
};

export default DebouncedInput;
