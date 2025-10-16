"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GlobalLoader from "@/components/GlobalLoader";
import FeedbackTable from "@/components/tables/FeedbackTable";
import FeedbackSearchFilter from "@/components/tables/FeedbackSearchFilter";
import Pagination from "@/components/tables/Pagination";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { 
  fetchFeedbackList, 
  fetchFeedbackStats,
  clearError 
} from "@/store/slices/feedback";
import React, { useEffect, useState, useCallback } from "react";

export default function FeedbackManagement() {
  const dispatch = useAppDispatch();
  const { 
    feedbackList, 
    feedbackStats, 
    loading, 
    statsLoading, 
    error 
  } = useAppSelector(state => state.feedback);
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [itemsPerPage] = useState(10);

  // Extract data from API response
  const response = feedbackList || {};

  const { result: feedbacks = [], meta = {} } = response;
  const { limit = itemsPerPage, page = 1, total = 0, totalPages = 0 } = meta;

  // Fetch feedback with current parameters
  const fetchFeedbacks = useCallback((pageNum: number, keyword: string, rating: string, sort: string, sortOrder: "asc" | "desc") => {
    const params: any = {
      page: pageNum,
      limit: itemsPerPage,
      sortBy: sort,
      order: sortOrder
    };
    
    if (keyword.trim()) {   
      params.search = keyword.trim();
    }
    
    if (rating) {
      params.rating = rating;
    }

    dispatch(fetchFeedbackList(params));
  }, [dispatch, itemsPerPage]);

  // Initial load
  useEffect(() => {
    fetchFeedbacks(currentPage, searchKeyword, ratingFilter, sortBy, order);
    dispatch(fetchFeedbackStats());
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchFeedbacks(page, searchKeyword, ratingFilter, sortBy, order);
  };

  // Handle search
  const handleSearch = (search: string) => {
    setSearchKeyword(search);
    setCurrentPage(1); // Reset to first page when searching
    fetchFeedbacks(1, search, ratingFilter, sortBy, order);
  };

  // Handle rating filter
  const handleRatingFilter = (rating: string) => {
    setRatingFilter(rating);
    setCurrentPage(1); // Reset to first page when filtering
    fetchFeedbacks(1, searchKeyword, rating, sortBy, order);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string, newOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setOrder(newOrder);
    setCurrentPage(1); // Reset to first page when sorting
    fetchFeedbacks(1, searchKeyword, ratingFilter, newSortBy, newOrder);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchKeyword("");
    setRatingFilter("");
    setSortBy("createdAt");
    setOrder("desc");
    setCurrentPage(1);
    fetchFeedbacks(1, "", "", "createdAt", "desc");
  };

  // Handle refresh after actions
  const handleRefresh = () => {
    fetchFeedbacks(currentPage, searchKeyword, ratingFilter, sortBy, order);
    dispatch(fetchFeedbackStats());
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
      <PageBreadcrumb pageTitle="Feedback Management" />
      
      <div className="space-y-6">
        {/* Statistics Cards */}
        {feedbackStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Feedback</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {feedbackStats.totalFeedbacks}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {feedbackStats.averageRating} ⭐
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">5 Stars</h3>
              <p className="text-2xl font-bold text-green-600">
                {feedbackStats.ratingBreakdown.rating5}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">4 Stars</h3>
              <p className="text-2xl font-bold text-blue-600">
                {feedbackStats.ratingBreakdown.rating4}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">3 Stars</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {feedbackStats.ratingBreakdown.rating3}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">1-2 Stars</h3>
              <p className="text-2xl font-bold text-red-600">
                {feedbackStats.ratingBreakdown.rating1 + feedbackStats.ratingBreakdown.rating2}
              </p>
            </div>
          </div>
        )}

        <ComponentCard title="User Feedback">
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
          <FeedbackSearchFilter 
            onSearch={handleSearch}
            onRatingFilter={handleRatingFilter}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            defaultValue={searchKeyword}
            defaultRating={ratingFilter}
            defaultSortBy={sortBy}
            defaultOrder={order}
          />

          {/* Feedback Table */}
          <FeedbackTable 
            feedbacks={feedbacks} 
            onRefresh={handleRefresh}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min((currentPage - 1) * limit + 1, total)} to {Math.min(currentPage * limit, total)} of {total} feedback
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* No results message */}
          {!loading && feedbacks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 dark:text-gray-600 mb-4">⭐</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No feedback found
              </h3>
              {/* <p className="text-gray-500 dark:text-gray-400">
                {searchKeyword || ratingFilter 
                  ? "No feedback matches your current filters. Try adjusting your search criteria."
                  : "No user feedback has been received yet."
                }
              </p> */}
              {(searchKeyword || ratingFilter) && (
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
