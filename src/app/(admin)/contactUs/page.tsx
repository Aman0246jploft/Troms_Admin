"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GlobalLoader from "@/components/GlobalLoader";
import ContactUsTable from "@/components/tables/ContactUsTable";
import ContactUsSearchFilter from "@/components/tables/ContactUsSearchFilter";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { 
  fetchContactUsList, 
  fetchContactUsStats,
  clearError 
} from "@/store/slices/contactUs";
import React, { useEffect, useState, useCallback } from "react";

export default function ContactUsManagement() {
  const dispatch = useAppDispatch();
  const { 
    contactUsList, 
    contactUsStats, 
    loading, 
    statsLoading, 
    error 
  } = useAppSelector(state => state.contactUs);
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [itemsPerPage] = useState(10);

  // Extract data from API response
  const response = contactUsList || {};
  const { result: messages = [], meta = {} } = response;
  const { limit = itemsPerPage, page = 1, total = 0, totalPages = 0 } = meta;

  // Fetch contact us messages with current parameters
  const fetchMessages = useCallback((pageNum: number, keyword: string, status: string) => {
    const params: any = {
      page: pageNum,
      limit: itemsPerPage
    };
    
    if (keyword.trim()) {
      params.search = keyword.trim();
    }
    
    if (status) {
      params.status = status;
    }

    dispatch(fetchContactUsList(params));
  }, [dispatch, itemsPerPage]);

  // Initial load
  useEffect(() => {
    fetchMessages(currentPage, searchKeyword, statusFilter);
    dispatch(fetchContactUsStats());
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMessages(page, searchKeyword, statusFilter);
  };

  // Handle search
  const handleSearch = (search: string) => {
    setSearchKeyword(search);
    setCurrentPage(1); // Reset to first page when searching
    fetchMessages(1, search, statusFilter);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
    fetchMessages(1, searchKeyword, status);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchKeyword("");
    setStatusFilter("");
    setCurrentPage(1);
    fetchMessages(1, "", "");
  };

  // Handle refresh after actions
  const handleRefresh = () => {
    fetchMessages(currentPage, searchKeyword, statusFilter);
    dispatch(fetchContactUsStats());
  };

  // Clear error when component unmounts or error changes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div>
      <GlobalLoader loading={loading} />
      <PageBreadcrumb pageTitle="Contact Us Management" />
      
      <div className="space-y-6">
        {/* Statistics Cards */}
        {contactUsStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {contactUsStats.totalMessages}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</h3>
              <p className="text-2xl font-bold text-orange-600">
                {contactUsStats.statusBreakdown.pending}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</h3>
              <p className="text-2xl font-bold text-blue-600">
                {contactUsStats.statusBreakdown.inProgress}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</h3>
              <p className="text-2xl font-bold text-green-600">
                {contactUsStats.statusBreakdown.resolved}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Closed</h3>
              <p className="text-2xl font-bold text-gray-600">
                {contactUsStats.statusBreakdown.closed}
              </p>
            </div>
          </div>
        )}

        <ComponentCard title="Contact Us Messages">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {typeof error === 'string' ? error : 'An error occurred while fetching data.'}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Search and Filter */}
          <ContactUsSearchFilter 
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onClearFilters={handleClearFilters}
            defaultValue={searchKeyword}
            defaultStatus={statusFilter}
          />

          {/* Messages Table */}
          <ContactUsTable 
            messages={messages} 
            onRefresh={handleRefresh}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min((currentPage - 1) * limit + 1, total)} to {Math.min(currentPage * limit, total)} of {total} messages
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* No results message */}
          {!loading && messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">📧</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No messages found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchKeyword || statusFilter 
                  ? "No messages match your current filters. Try adjusting your search criteria."
                  : "No contact messages have been received yet."
                }
              </p>
              {(searchKeyword || statusFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
