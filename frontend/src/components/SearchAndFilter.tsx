import { Priority } from "../services/api";
import CustomSelect from "./CustomSelect";

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  selectedPriority: Priority | "";
  setSelectedPriority: (value: Priority | "") => void;
  selectedStatus: boolean | null;
  setSelectedStatus: (value: boolean | null) => void;
  isLoading: boolean;
}

const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  sortBy,
  setSortBy,
  selectedPriority,
  setSelectedPriority,
  selectedStatus,
  setSelectedStatus,
  isLoading,
}: SearchAndFilterProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="search">
      <input
        id="search-input"
        className="search__input"
        type="text"
        value={searchQuery}
        onChange={({ target: { value } }) => setSearchQuery(value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a todo"
        disabled={isLoading}
      />
      <button
        className="search__button"
        onClick={handleSearch}
        disabled={!searchQuery.trim() || isLoading}
      >
        Search
      </button>
      <CustomSelect
        value={sortBy}
        onChange={setSortBy}
        options={[
          { value: "date", label: "Sort by Date" },
          { value: "priority", label: "Sort by Priority" },
          { value: "status", label: "Sort by Status" },
        ]}
        disabled={isLoading}
      />

      <CustomSelect
        value={selectedPriority}
        onChange={(value) => setSelectedPriority((value as Priority) || "")}
        options={[
          { value: "", label: "All Priorities" },
          ...Object.values(Priority).map((priority) => ({
            value: priority,
            label: priority,
          })),
        ]}
        disabled={isLoading}
      />

      <CustomSelect
        value={selectedStatus === null ? "" : selectedStatus.toString()}
        onChange={(value) => setSelectedStatus(value === "" ? null : value === "true")}
        options={[
          { value: "", label: "All Status" },
          { value: "true", label: "Completed" },
          { value: "false", label: "Not Completed" },
        ]}
        disabled={isLoading}
      />
    </div>
  );
};

export default SearchAndFilter; 