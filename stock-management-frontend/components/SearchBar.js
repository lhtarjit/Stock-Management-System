import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { searchStock } from "../api/stockApi";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../store/loaderSlice";
import debounce from "lodash.debounce";

const SearchBar = ({ onSearchResults }) => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const debouncedSearch = useMemo(() => {
    return debounce(async (text) => {
      dispatch(showLoader());
      try {
        const data = await searchStock(text);
        if (data.length === 0) {
          toast.warning("🔍 No matching items found.");
        }
        onSearchResults(data);
      } catch (error) {
        toast.error(error.message || "Search failed. Please try again.");
        onSearchResults([]);
      } finally {
        dispatch(hideLoader());
      }
    }, 500);
  }, [dispatch, onSearchResults]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="🔍 Search items..."
        className="border p-2 rounded-l-lg w-60 md:w-96 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={() => debouncedSearch(query)}
        className="bg-gray-700 text-white px-4 py-2 rounded-r-lg border border-gray-700 hover:bg-gray-800"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
