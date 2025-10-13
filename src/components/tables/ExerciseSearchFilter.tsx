"use client";
import React, { useState } from "react";
import Button from "../ui/button/Button";

interface ExerciseSearchFilterProps {
  onSearch: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onTargetFilter: (target: string) => void;
  onBodyPartFilter: (bodyPart: string) => void;
  defaultValue?: string;
  defaultStatus?: string;
  defaultTarget?: string;
  defaultBodyPart?: string;
}

// Target muscles list
const TARGET_LIST = [
  "abductors",
  "abs",
  "adductors",
  "biceps",
  "calves",
  "cardiovascular system",
  "delts",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "levator scapulae",
  "pectorals",
  "quads",
  "serratus anterior",
  "spine",
  "traps",
  "triceps",
  "upper back"
];

// Body parts list
const BODY_PART_LIST = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist"
];

export default function ExerciseSearchFilter({ 
  onSearch, 
  onStatusFilter,
  onTargetFilter,
  onBodyPartFilter,
  defaultValue = "",
  defaultStatus = "",
  defaultTarget = "",
  defaultBodyPart = ""
}: ExerciseSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [status, setStatus] = useState(defaultStatus);
  const [target, setTarget] = useState(defaultTarget);
  const [bodyPart, setBodyPart] = useState(defaultBodyPart);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onStatusFilter(newStatus);
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTarget = e.target.value;
    setTarget(newTarget);
    onTargetFilter(newTarget);
  };

  const handleBodyPartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBodyPart = e.target.value;
    setBodyPart(newBodyPart);
    onBodyPartFilter(newBodyPart);
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatus("");
    setTarget("");
    setBodyPart("");
    onSearch("");
    onStatusFilter("");
    onTargetFilter("");
    onBodyPartFilter("");
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search Input */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Exercises
            </label>
            <input
              type="text"
              placeholder="Search by name or equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="md">
              Search
            </Button>
            <Button type="button" variant="outline" size="md" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* Second row for body filters */}
        <div className="flex flex-wrap gap-3 items-end">
          {/* Target Muscle Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Muscle
            </label>
            <select
              value={target}
              onChange={handleTargetChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Targets</option>
              {TARGET_LIST.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Body Part Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Body Part
            </label>
            <select
              value={bodyPart}
              onChange={handleBodyPartChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Body Parts</option>
              {BODY_PART_LIST.map((bp) => (
                <option key={bp} value={bp}>
                  {bp.charAt(0).toUpperCase() + bp.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

