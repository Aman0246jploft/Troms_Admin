"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GlobalLoader from "@/components/GlobalLoader";
import WorkoutPlanManagementTable from "@/components/tables/WorkoutPlanManagementTable";
import WorkoutPlanSearchFilter from "@/components/tables/WorkoutPlanSearchFilter";
import Pagination from "@/components/tables/Pagination";
import WorkoutPlanEditModal from "@/components/modals/WorkoutPlanEditModal";
import WorkoutPlanCreateModal from "@/components/modals/WorkoutPlanCreateModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { getWorkoutPlanAdminList, updateWorkoutPlanAdmin, getWorkoutPlanAdminById } from "@/store/slices/workoutPlanAdmin";
import { getExerciseList } from "@/store/slices/exercise";
import React, { useEffect, useState, useCallback } from "react";

export default function WorkoutPlanManagement() {
  const dispatch = useAppDispatch();
  const { loading, workoutPlanAdminList, updating, selectedWorkoutPlanAdmin } = useAppSelector(state => state.workoutPlanAdmin);
  const { exerciseList } = useAppSelector(state => state.exercise);
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [itemsPerPage] = useState(10);
  
  // Edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [workoutPlanToEdit, setWorkoutPlanToEdit] = useState<any>(null);
  
  // Create state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Extract data from API response
  const result = workoutPlanAdminList?.result || {};
  const { limit = itemsPerPage, page = 1, total = 0, workoutPlanAdmins = [] } = result;
  
  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Fetch workout plan admins with current parameters
  const fetchWorkoutPlanAdmins = useCallback((pageNum: number, keyword: string, status: string, location: string) => {
    const params: any = {
      page: pageNum,
      limit: itemsPerPage,
      search: keyword.trim()
    };
    
    if (status) {
      params.status = status;
    }
    
    if (location) {
      params.location = location;
    }
    
    dispatch(getWorkoutPlanAdminList(params));
  }, [dispatch, itemsPerPage]);

  // Initial load
  useEffect(() => {
    fetchWorkoutPlanAdmins(currentPage, searchKeyword, statusFilter, locationFilter);
    // Fetch exercises for the modals
    dispatch(getExerciseList({ limit: 2000, status: "ACTIVE" }));
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchWorkoutPlanAdmins(page, searchKeyword, statusFilter, locationFilter);
  };

  // Handle search
  const handleSearch = (search: string) => {
    setSearchKeyword(search);
    setCurrentPage(1); // Reset to first page when searching
    fetchWorkoutPlanAdmins(1, search, statusFilter, locationFilter);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
    fetchWorkoutPlanAdmins(1, searchKeyword, status, locationFilter);
  };

  // Handle location filter
  const handleLocationFilter = (location: string) => {
    setLocationFilter(location);
    setCurrentPage(1); // Reset to first page when filtering
    fetchWorkoutPlanAdmins(1, searchKeyword, statusFilter, location);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchWorkoutPlanAdmins(currentPage, searchKeyword, statusFilter, locationFilter);
  };

  // Handle edit workout plan
  const handleEditWorkoutPlan = useCallback(async (workoutPlanId: string) => {
    try {
      // Fetch the full workout plan details
      const result = await dispatch(getWorkoutPlanAdminById(workoutPlanId)).unwrap();
      setWorkoutPlanToEdit(result.data || result);
      setIsEditModalOpen(true);
    } catch (error: any) {
      console.error("Failed to fetch workout plan details:", error);
      // Fallback: use the workout plan from the list if available
      const workoutPlanFromList = workoutPlanAdmins.find((wp: { id: string; }) => wp.id === workoutPlanId);
      if (workoutPlanFromList) {
        setWorkoutPlanToEdit(workoutPlanFromList);
        setIsEditModalOpen(true);
      }
    }
  }, [dispatch, workoutPlanAdmins]);

  // Handle edit modal close
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setWorkoutPlanToEdit(null);
  };

  // Handle edit success
  const handleEditSuccess = () => {
    handleCloseEditModal();
    handleRefresh(); // Refresh the list to show updated data
  };

  // Handle create modal
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Handle create success
  const handleCreateSuccess = () => {
    handleCloseCreateModal();
    handleRefresh(); // Refresh the list to show new data
  };

  return (
    <div>
      <GlobalLoader loading={loading} />
      <PageBreadcrumb pageTitle="Workout Plan Management" />
      
      <div className="space-y-6">
        <ComponentCard title="Workout Plan Management">
          {/* Search Filter with Create Button */}
          <WorkoutPlanSearchFilter 
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onLocationFilter={handleLocationFilter}
            onCreateWorkoutPlan={handleOpenCreateModal}
            defaultValue={searchKeyword}
            defaultStatus={statusFilter}
            defaultLocation={locationFilter}
          />

          {/* Workout Plans Table */}
          <WorkoutPlanManagementTable 
            workoutPlans={workoutPlanAdmins} 
            onRefresh={handleRefresh}
            onEditWorkoutPlan={handleEditWorkoutPlan}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min((currentPage - 1) * limit + 1, total)} to {Math.min(currentPage * limit, total)} of {total} workout plans
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* No results message */}
          {!loading && workoutPlanAdmins.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchKeyword ? `No workout plans found for "${searchKeyword}"` : "No workout plans found"}
            </div>
          )}
        </ComponentCard>
      </div>

      {/* Workout Plan Edit Modal */}
      <WorkoutPlanEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        workoutPlan={workoutPlanToEdit}
        onSuccess={handleEditSuccess}
        exercises={exerciseList?.result?.exercises || []}
      />

      {/* Workout Plan Create Modal */}
      <WorkoutPlanCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        exercises={exerciseList?.result?.exercises || []}
      />
    </div>
  );
}
