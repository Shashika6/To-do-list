interface EmptyStateProps {
  searchQuery: string;
}

const EmptyState = ({ searchQuery }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state__title">
        {searchQuery
          ? "No todos found matching your search"
          : "No todos available"}
      </div>
      <div className="empty-state__subtitle">
        {searchQuery
          ? "Try searching with different keywords"
          : "Add a new todo to get started"}
      </div>
    </div>
  );
}

export default EmptyState; 