import { SearchBox } from "./SearchBox";

type SearchBarProps = {
  initialQuery?: string;
  helperText?: string;
  placeholder?: string;
};

export function SearchBar({ initialQuery, helperText, placeholder }: SearchBarProps) {
  return <SearchBox initialQuery={initialQuery} helperText={helperText} placeholder={placeholder} variant="page" />;
}
