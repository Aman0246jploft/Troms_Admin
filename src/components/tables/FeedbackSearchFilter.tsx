"use client";
import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";

interface FeedbackSearchFilterProps {
  onSearch: (search: string) => void;
  onRatingFilter: (rating: string) => void;
  onSortChange: (sortBy: string, order: "asc" | "desc") => void;
  onClearFilters: () => void;
  defaultValue?: string;
  defaultRating?: string;
  defaultSortBy?: string;
  defaultOrder?: "asc" | "desc";
}

export default function FeedbackSearchFilter({
  onSearch,
  onRatingFilter,
  onSortChange,
  onClearFilters,
  defaultValue = "",
  defaultRating = "",
  defaultSortBy = "createdAt",
  defaultOrder = "desc"
}: FeedbackSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [selectedRating, setSelectedRating] = useState(defaultRating);
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [order, setOrder] = useState<"asc" | "desc">(defaultOrder);

  // Update local state when props change
  useEffect(() => {
    setSearchTerm(defaultValue);
    setSelectedRating(defaultRating);
    setSortBy(defaultSortBy);
    setOrder(defaultOrder);
  }, [defaultValue, defaultRating, defaultSortBy, defaultOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rating = e.target.value;
    setSelectedRating(rating);
    onRatingFilter(rating);
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    onSortChange(newSortBy, order);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = e.target.value as "asc" | "desc";
    setOrder(newOrder);
    onSortChange(sortBy, newOrder);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRating("");
    setSortBy("createdAt");
    setOrder("desc");
    onClearFilters();
  };

  const hasActiveFilters = searchTerm || selectedRating || sortBy !== "createdAt" || order !== "desc";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        {/* <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Reviews
          </label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search in reviews..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button
              type="submit"
              size="sm"
              className="px-4 py-2"
            >
              Search
            </Button>
          </form>
        </div> */}

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Rating
          </label>
          <select
            value={selectedRating}
            onChange={handleRatingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
            <option value="4">⭐⭐⭐⭐ 4 Stars</option>
            <option value="3">⭐⭐⭐ 3 Stars</option>
            <option value="2">⭐⭐ 2 Stars</option>
            <option value="1">⭐ 1 Star</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={handleSortByChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="createdAt">Date Created</option>
            <option value="rating">Rating</option>
            <option value="updatedAt">Last Updated</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order
          </label>
          <select
            value={order}
            onChange={handleOrderChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleClearFilters}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Active Filters Display */}
      {/* {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Search: "{searchTerm}"
              <button
                onClick={() => {
                  setSearchTerm("");
                  onSearch("");
                }}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedRating && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Rating: {selectedRating} Star{selectedRating !== '1' ? 's' : ''}
              <button
                onClick={() => {
                  setSelectedRating("");
                  onRatingFilter("");
                }}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {sortBy !== "createdAt" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Sort: {sortBy === "rating" ? "Rating" : "Updated"}
              <button
                onClick={() => {
                  setSortBy("createdAt");
                  onSortChange("createdAt", order);
                }}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
          {order !== "desc" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              Order: Oldest First
              <button
                onClick={() => {
                  setOrder("desc");
                  onSortChange(sortBy, "desc");
                }}
                className="ml-1 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )} */}
    </div>
  );
}
