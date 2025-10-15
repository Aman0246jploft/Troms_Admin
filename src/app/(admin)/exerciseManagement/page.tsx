"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import GlobalLoader from "@/components/GlobalLoader";
import ExerciseManagementTable from "@/components/tables/ExerciseManagementTable";
import ExerciseSearchFilter from "@/components/tables/ExerciseSearchFilter";
import Pagination from "@/components/tables/Pagination";
import ExerciseEditModal from "@/components/modals/ExerciseEditModal";
import ExerciseCreateModal from "@/components/modals/ExerciseCreateModal";
import ExerciseViewModal from "@/components/modals/ExerciseViewModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { getExerciseList, updateExercise, getExerciseById } from "@/store/slices/exercise";
import React, { useEffect, useState, useCallback } from "react";

export default function ExerciseManagement() {
  const dispatch = useAppDispatch();
  const { loading, exerciseList, updating, selectedExercise } = useAppSelector(state => state.exercise);
  
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [targetFilter, setTargetFilter] = useState("");
  const [bodyPartFilter, setBodyPartFilter] = useState("");
  const [itemsPerPage] = useState(10);
  
  // Edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<any>(null);
  
  // View state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [exerciseToView, setExerciseToView] = useState<any>(null);
  
  // Create state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Extract data from API response
  const result = exerciseList?.result || {};
  const { limit = itemsPerPage, page = 1, total = 0, exercises = [] } = result;
  
  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Fetch exercises with current parameters
  const fetchExercises = useCallback((pageNum: number, keyword: string, status: string, target: string, bodyPart: string) => {
    const params: any = {
      page: pageNum,
      limit: itemsPerPage,
      search: keyword.trim()
    };
    
    if (status) {
      params.status = status;
    }
    
    if (target) {
      params.target = target;
    }
    
    if (bodyPart) {
      params.bodyPart = bodyPart;
    }
    
    dispatch(getExerciseList(params));
  }, [dispatch, itemsPerPage]);

  // Initial load
  useEffect(() => {
    fetchExercises(currentPage, searchKeyword, statusFilter, targetFilter, bodyPartFilter);
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchExercises(page, searchKeyword, statusFilter, targetFilter, bodyPartFilter);
  };

  // Handle search
  const handleSearch = (search: string) => {
    setSearchKeyword(search);
    setCurrentPage(1); // Reset to first page when searching
    fetchExercises(1, search, statusFilter, targetFilter, bodyPartFilter);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
    fetchExercises(1, searchKeyword, status, targetFilter, bodyPartFilter);
  };

  // Handle target filter
  const handleTargetFilter = (target: string) => {
    setTargetFilter(target);
    setCurrentPage(1); // Reset to first page when filtering
    fetchExercises(1, searchKeyword, statusFilter, target, bodyPartFilter);
  };

  // Handle body part filter
  const handleBodyPartFilter = (bodyPart: string) => {
    setBodyPartFilter(bodyPart);
    setCurrentPage(1); // Reset to first page when filtering
    fetchExercises(1, searchKeyword, statusFilter, targetFilter, bodyPart);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchExercises(currentPage, searchKeyword, statusFilter, targetFilter, bodyPartFilter);
  };

  // Handle edit exercise
  const handleEditExercise = useCallback(async (exerciseId: string) => {
    try {
      // Fetch the full exercise details
      const result = await dispatch(getExerciseById(exerciseId)).unwrap();
      setExerciseToEdit(result.result || result);
      setIsEditModalOpen(true);
    } catch (error: any) {
      console.error("Failed to fetch exercise details:", error);
      // Fallback: use the exercise from the list if available
      const exerciseFromList = exercises.find((ex: { id: string; }) => ex.id === exerciseId);
      if (exerciseFromList) {
        setExerciseToEdit(exerciseFromList);
        setIsEditModalOpen(true);
      }
    }
  }, [dispatch, exercises]);

  // Handle edit modal close
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setExerciseToEdit(null);
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

  // Handle view exercise
  const handleViewExercise = useCallback(async (exerciseId: string) => {
    try {
      // Fetch the full exercise details
      const result = await dispatch(getExerciseById(exerciseId)).unwrap();
      setExerciseToView(result.result || result);
      setIsViewModalOpen(true);
    } catch (error: any) {
      console.error("Failed to fetch exercise details:", error);
      // Fallback: use the exercise from the list if available
      const exerciseFromList = exercises.find((ex: { id: string; }) => ex.id === exerciseId);
      if (exerciseFromList) {
        setExerciseToView(exerciseFromList);
        setIsViewModalOpen(true);
      }
    }
  }, [dispatch, exercises]);

  // Handle view modal close
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setExerciseToView(null);
  };

  return (
    <div>
      <GlobalLoader loading={loading} />
      <PageBreadcrumb pageTitle="Exercise Management" />
      
      <div className="space-y-6">
        <ComponentCard title="Exercise Management">
          {/* Search Filter with Create Button */}
          <ExerciseSearchFilter 
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onTargetFilter={handleTargetFilter}
            onBodyPartFilter={handleBodyPartFilter}
            onCreateExercise={handleOpenCreateModal}
            defaultValue={searchKeyword}
            defaultStatus={statusFilter}
            defaultTarget={targetFilter}
            defaultBodyPart={bodyPartFilter}
          />

          {/* Exercises Table */}
          <ExerciseManagementTable 
            exercises={exercises} 
            onRefresh={handleRefresh}
            onEditExercise={handleEditExercise}
            onViewExercise={handleViewExercise}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min((currentPage - 1) * limit + 1, total)} to {Math.min(currentPage * limit, total)} of {total} exercises
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* No results message */}
          {!loading && exercises.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchKeyword ? `No exercises found for "${searchKeyword}"` : "No exercises found"}
            </div>
          )}
        </ComponentCard>
      </div>

      {/* Exercise Edit Modal */}
      <ExerciseEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        exercise={exerciseToEdit}
        onSuccess={handleEditSuccess}
      />

      {/* Exercise Create Modal */}
      <ExerciseCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
      />

      {/* Exercise View Modal */}
      <ExerciseViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        exercise={exerciseToView}
      />
    </div>
  );
}

