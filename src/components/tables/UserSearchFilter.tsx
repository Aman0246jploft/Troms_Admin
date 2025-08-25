"use client";
import React, { useState, useCallback, useRef } from "react";
import Input from "../form/input/InputField";

interface UserSearchFilterProps {
  onSearch: (search: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export default function UserSearchFilter({ 
  onSearch, 
  placeholder = "Search users by name, email...",
  defaultValue = ""
}: UserSearchFilterProps) {
  const [searchKeyword, setSearchKeyword] = useState(defaultValue);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onSearch(searchKeyword);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="relative max-w-md">
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
    </div>
  );
} 