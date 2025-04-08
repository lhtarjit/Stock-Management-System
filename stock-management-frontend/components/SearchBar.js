import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { searchStock } from "../api/stockApi";

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await searchStock(query);
        if (data.length === 0) {
          toast.warning("🔍 No matching items found.");
        }
        onSearchResults(data);
      } catch (error) {
        toast.error(error.message || "Search failed. Please try again.");
        onSearchResults([]);
      }
    };

    const delayDebounceFn = setTimeout(fetchResults, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearchResults]);

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Search items..."
        className="border p-2 rounded-l-lg w-60 md:w-96  focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={() => setQuery(query)}
        className="bg-gray-700 text-white px-4 py-2 rounded-r-lg border border-gray-700 hover:bg-gray-800"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
