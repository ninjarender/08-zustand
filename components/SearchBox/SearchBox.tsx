import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  // defaultValue, а не value: стан оновлюється з debounce, тож контрольоване
  // поле «відставало» б від введення
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      defaultValue={value}
      onChange={onChange}
    />
  );
}
