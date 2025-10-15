"use client";

import React, { useState, useEffect } from "react";
import Button from "../ui/button/Button";
import { Search, Plus, RefreshCw } from "lucide-react";

interface WorkoutPlanSearchFilterProps {
  onSearch: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onLocationFilter: (location: string) => void;
  onCreateWorkoutPlan: () => void;
  defaultValue?: string;
  defaultStatus?: string;
  defaultLocation?: string;
}

export default function WorkoutPlanSearchFilter({
  onSearch,
  onStatusFilter,
  onLocationFilter,
  onCreateWorkoutPlan,
  defaultValue = "",
  defaultStatus = "",
  defaultLocation = "",
}: WorkoutPlanSearchFilterProps) {
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [statusValue, setStatusValue] = useState(defaultStatus);
  const [locationValue, setLocationValue] = useState(defaultLocation);

  // Update local state when props change
  useEffect(() => {
    setSearchValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setStatusValue(defaultStatus);
  }, [defaultStatus]);

  useEffect(() => {
    setLocationValue(defaultLocation);
  }, [defaultLocation]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusValue(value);
    onStatusFilter(value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocationValue(value);
    onLocationFilter(value);
  };

  const handleRefresh = () => {
    setSearchValue("");
    setStatusValue("");
    setLocationValue("");
    onSearch("");
    onStatusFilter("");
    onLocationFilter("");
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search Input */}
          {/* <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search workout plans..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div> */}

          {/* Status Filter */}
          <div className="min-w-[120px]">
            <select
              value={statusValue}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="min-w-[120px]">
            <select
              value={locationValue}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-white/[0.05] rounded-lg bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              <option value="HOME">Home</option>
              <option value="GYM">Gym</option>
              <option value="OUTDOOR">Outdoor</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateWorkoutPlan}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Workout Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
