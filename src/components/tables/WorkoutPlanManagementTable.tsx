"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import WorkoutPlanEditModal from "../modals/WorkoutPlanEditModal";
import { useAppDispatch } from "@/store/hooks/redux";
import { deleteWorkoutPlanAdmin, toggleWorkoutPlanAdminStatus } from "@/store/slices/workoutPlanAdmin";
import { toast } from "react-hot-toast";

interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  duration: number;
  rest: number;
}

interface WorkoutsData {
  [key: string]: WorkoutExercise[];
}

interface WorkoutPlan {
  id: string;
  totalDays: number;
  location: string;
  workouts: WorkoutsData;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkoutPlanManagementTableProps {
  workoutPlans: WorkoutPlan[];
  onRefresh: () => void;
  onEditWorkoutPlan?: (workoutPlanId: string) => void;
}

export default function WorkoutPlanManagementTable({ 
  workoutPlans, 
  onRefresh, 
  onEditWorkoutPlan 
}: WorkoutPlanManagementTableProps) {
  const dispatch = useAppDispatch();
  const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      default:
        return "primary";
    }
  };

  const getLocationColor = (location: string) => {
    switch (location.toLowerCase()) {
      case "home":
        return "primary";
      case "gym":
        return "success";
      case "outdoor":
        return "warning";
      default:
        return "primary";
    }
  };

  const getTotalExercises = (workouts: WorkoutsData) => {
    return Object.values(workouts).reduce((total, dayExercises) => total + dayExercises.length, 0);
  };

  const handleEditWorkoutPlan = (workoutPlan: WorkoutPlan) => {
    if (onEditWorkoutPlan) {
      onEditWorkoutPlan(workoutPlan.id);
    } else {
      // Fallback to local modal if no prop is provided
      setSelectedWorkoutPlan(workoutPlan);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWorkoutPlan(null);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await dispatch(toggleWorkoutPlanAdminStatus(id)).unwrap();
      toast.success("Workout plan status toggled successfully");
      onRefresh();
    } catch (error: any) {
      toast.error(error?.message || "Failed to toggle workout plan status");
    }
  };

  const handleDelete = async (id: string, totalDays: number, location: string) => {
    if (window.confirm(`Are you sure you want to delete the ${totalDays}-day ${location} workout plan?`)) {
      try {
        await dispatch(deleteWorkoutPlanAdmin(id)).unwrap();
        toast.success("Workout plan deleted successfully");
        onRefresh();
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete workout plan");
      }
    }
  };

  const handleUpdateSuccess = () => {
    handleCloseModal();
    onRefresh();
  };

  if (!workoutPlans || workoutPlans.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No workout plans found
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Plan Details
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Location
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Exercises
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Created
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {workoutPlans.map((workoutPlan) => (
                  <TableRow key={workoutPlan.id}>
                    {/* Plan Details */}
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {workoutPlan.totalDays} Day Plan
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            ID: {workoutPlan.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Location */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={getLocationColor(workoutPlan.location)}>
                        {workoutPlan.location}
                      </Badge>
                    </TableCell>

                    {/* Exercises */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">
                          {getTotalExercises(workoutPlan.workouts)} total
                        </span>
                        <span className="text-xs text-gray-400">
                          {Object.keys(workoutPlan.workouts).length} days
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={getStatusColor(workoutPlan.status)}>
                        {workoutPlan.status}
                      </Badge>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatDate(workoutPlan.createdAt)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEditWorkoutPlan(workoutPlan)}
                          className="px-3 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant={workoutPlan.status === "ACTIVE" ? "outline" : "primary"}
                          onClick={() => handleToggleStatus(workoutPlan.id)}
                          className="px-3 py-1"
                        >
                          {workoutPlan.status === "ACTIVE" ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(workoutPlan.id, workoutPlan.totalDays, workoutPlan.location)}
                          className="px-3 py-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Workout Plan Edit Modal */}
      <WorkoutPlanEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        workoutPlan={selectedWorkoutPlan}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
}
