/** Toggle switch. Controlled via `checked` + `onChange(next: boolean)`. */
export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}
export function Switch(props: SwitchProps): JSX.Element;
