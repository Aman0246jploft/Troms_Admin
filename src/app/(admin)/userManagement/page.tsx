"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GlobalLoader from "@/components/GlobalLoader";
import UserManagementTable from "@/components/tables/UserManagementTable";
import UserSearchFilter from "@/components/tables/UserSearchFilter";
import Pagination from "@/components/tables/Pagination";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { userList } from "@/store/slices/user";
import React, { useEffect, useState, useCallback } from "react";

export default function UserManagement() {
  const dispatch = useAppDispatch();
  const { loading, userListInfo } = useAppSelector(state => state.user);
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage] = useState(10);

  // Extract data from API response
  const result = userListInfo?.result || {};
  const { limit = itemsPerPage, page = 1, total = 0, users = [] } = result;
  
  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Fetch users with current parameters
  const fetchUsers = useCallback((pageNum: number, keyword: string) => {
    dispatch(userList({
      page: pageNum,
      limit: itemsPerPage,
      search: keyword.trim()
    }));
  }, [dispatch, itemsPerPage]);

  // Initial load
  useEffect(() => {
    fetchUsers(currentPage, searchKeyword);
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, searchKeyword);
  };

  // Handle search
  const handleSearch = (search: string) => {
    setSearchKeyword(search);
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers(1, search);
  };

  return (
    <div>
      <GlobalLoader loading={loading} />
      <PageBreadcrumb pageTitle="User Management" />
      
      <div className="space-y-6">
        <ComponentCard title="User Management">
          {/* Search Filter */}
          <UserSearchFilter 
            onSearch={handleSearch}
            defaultValue={searchKeyword}
          />

          {/* Users Table */}
          <UserManagementTable users={users} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min((currentPage - 1) * limit + 1, total)} to {Math.min(currentPage * limit, total)} of {total} users
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* No results message */}
          {!loading && users.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {/* {searchKeyword ? `No users found for "${searchKeyword}"` : "No users found"} */}
            </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
