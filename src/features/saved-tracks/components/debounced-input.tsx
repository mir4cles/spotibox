import { useEffect, useState, type FC } from "react";
import { Input } from "../../../components/ui/input";

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounce, value]);

	return (
		<Input
			{...props}
			value={value}
			onChange={(event) => {
				setValue(event.target.value);
			}}
		/>
	);
};

export default DebouncedInput;
