import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import FileUpload from "../components/FileUpload";
import StockTable from "../components/StockTable";
import SearchBar from "../components/SearchBar";
import Profile from "../components/Profile";

export default function Home() {
  const router = useRouter();
  const [filteredStock, setFilteredStock] = useState(null);

  useEffect(() => {
    if (!Cookies.get("token")) {
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-6 text-center">
        📦 Stock Management System
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full max-w-5xl bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center">
          <Profile />
        </div>
        <div className="flex items-center">
          <SearchBar onSearchResults={setFilteredStock} />
        </div>
        <div className="flex items-center">
          <FileUpload />
        </div>
      </div>
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6 mb-6">
        <StockTable searchResults={filteredStock} />
      </div>
    </div>
  );
}
