import { SearchBox } from "./SearchBox";

type SearchBarProps = {
  initialQuery?: string;
  helperText?: string;
};

export function SearchBar({ initialQuery, helperText }: SearchBarProps) {
  return <SearchBox initialQuery={initialQuery} helperText={helperText} variant="page" />;
}

