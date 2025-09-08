"use client";
import React, { useState, useCallback, useRef } from "react";
import Input from "../form/input/InputField";
import Select from "../form/Select";

interface ContactUsSearchFilterProps {
  onSearch: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onClearFilters: () => void;
  placeholder?: string;
  defaultValue?: string;
  defaultStatus?: string;
}

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

export default function ContactUsSearchFilter({ 
  onSearch, 
  onStatusFilter,
  onClearFilters,
  placeholder = "Search by name, email, subject, or message...",
  defaultValue = "",
  defaultStatus = ""
}: ContactUsSearchFilterProps) {
  const [searchKeyword, setSearchKeyword] = useState(defaultValue);
  const [selectedStatus, setSelectedStatus] = useState(defaultStatus);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for debouncing
    timeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 500);
  }, [onSearch]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusFilter(status);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onSearch(searchKeyword);
  };

  const handleClearFilters = () => {
    setSearchKeyword("");
    setSelectedStatus("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onClearFilters();
  };

  const hasActiveFilters = searchKeyword.trim() !== "" || selectedStatus !== "";

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Status Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="flex-1 relative max-w-md">
          <div className="relative">
            <Input
              type="text"
              placeholder={placeholder}
              value={searchKeyword}
              onChange={handleSearch}
              className="pl-10 pr-4"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-sm">🔍</span>
            </div>
          </div>
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Status:
          </label>
          <Select
            options={statusOptions}
            onChange={handleStatusChange}
            className="min-w-[160px]"
            defaultValue={selectedStatus}
            placeholder="All Status"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-3 items-center">
          {/* <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active filters:</span> */}
          
          {/* {searchKeyword.trim() && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              Search: "{searchKeyword.trim()}"
              <button
                onClick={() => {
                  setSearchKeyword("");
                  onSearch("");
                }}
                className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
              >
                ×
              </button>
            </span>
          )} */}
          
          {selectedStatus && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
              Status: {statusOptions.find(opt => opt.value === selectedStatus)?.label}
              <button
                onClick={() => {
                  setSelectedStatus("");
                  onStatusFilter("");
                }}
                className="ml-1 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
} 
