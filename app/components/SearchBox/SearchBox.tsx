"use client";

import {
  useId,
  useState,
  type ChangeEvent,
  type SubmitEvent
} from "react";
import clsx from "clsx";

type SearchBoxProps = {
  className?: string;
  inputLabel?: string;
  placeholder?: string;
  buttonText?: string;
  onSearchCallback: (searchTerm: string) => void;
};

export function SearchBox({
  className,
  inputLabel = "Search",
  placeholder = "Search...",
  buttonText = "Search",
  onSearchCallback = () => {},
}: SearchBoxProps) {
  const inputId = useId();
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = searchTerm.trim();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextSearchTerm = event.target.value;

    setSearchTerm(nextSearchTerm);

    if (nextSearchTerm.trim().length === 0) {
      onSearchCallback("");
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (normalizedSearchTerm) {
      onSearchCallback(normalizedSearchTerm);
    }
  };

  return (
    <form
      role="search"
      className={clsx(
        "flex w-full max-w-md overflow-hidden rounded-lg border border-blue-400/60 bg-black shadow-sm focus-within:ring-2 focus-within:ring-blue-300",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor={inputId}>
        {inputLabel}
      </label>
      <input
        id={inputId}
        type="search"
        className="min-w-0 flex-1 bg-black px-4 py-2.5 text-white placeholder:text-gray-400 focus:outline-none"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button
        type="submit"
        disabled={!normalizedSearchTerm}
        className="bg-blue-700 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
      >
        {buttonText}
      </button>
    </form>
  );
}

export default SearchBox;
