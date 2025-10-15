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
import ExerciseEditModal from "../modals/ExerciseEditModal";
import ExerciseViewModal from "../modals/ExerciseViewModal";
import { useAppDispatch } from "@/store/hooks/redux";
import { deleteExercise, toggleExerciseStatus } from "@/store/slices/exercise";
import { toast } from "react-hot-toast";

interface Exercise {
  id: string;
  name: string;
  equipment: string;
  gifUrl?: string;
  pngUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  json?: any;
}

interface ExerciseManagementTableProps {
  exercises: Exercise[];
  onRefresh: () => void;
  onEditExercise?: (exerciseId: string) => void;
  onViewExercise?: (exerciseId: string) => void;
}

export default function ExerciseManagementTable({ exercises, onRefresh, onEditExercise, onViewExercise }: ExerciseManagementTableProps) {
  const dispatch = useAppDispatch();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

  const handleEditExercise = (exercise: Exercise) => {
    if (onEditExercise) {
      onEditExercise(exercise.id);
    } else {
      // Fallback to local modal if no prop is provided
      setSelectedExercise(exercise);
      setIsEditModalOpen(true);
    }
  };

  const handleViewExercise = (exercise: Exercise) => {
    if (onViewExercise) {
      onViewExercise(exercise.id);
    } else {
      // Fallback to local modal if no prop is provided
      setSelectedExercise(exercise);
      setIsViewModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedExercise(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedExercise(null);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await dispatch(toggleExerciseStatus(id)).unwrap();
      toast.success("Exercise status toggled successfully");
      onRefresh();
    } catch (error: any) {
      toast.error(error?.message || "Failed to toggle exercise status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await dispatch(deleteExercise(id)).unwrap();
        toast.success("Exercise deleted successfully");
        onRefresh();
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete exercise");
      }
    }
  };

  const handleUpdateSuccess = () => {
    handleCloseEditModal();
    onRefresh();
  };

  if (!exercises || exercises.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No exercises found
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
                    Exercise Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Equipment
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  {/* <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Media
                  </TableCell> */}
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
                {exercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    {/* Exercise Name */}
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {exercise.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {/* ID: {exercise.id.slice(0, 8)}... */}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Equipment */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/[0.05] text-xs">
                        {exercise.equipment}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={getStatusColor(exercise.status)}>
                        {exercise.status}
                      </Badge>
                    </TableCell>

                    {/* Media */}
                    {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex gap-2">
                        {exercise.gifUrl && (
                          <span className="px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs">
                            GIF
                          </span>
                        )}
                        {exercise.pngUrl && (
                          <span className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs">
                            PNG
                          </span>
                        )}
                        {!exercise.gifUrl && !exercise.pngUrl && (
                          <span className="text-gray-400 text-xs">No media</span>
                        )}
                      </div>
                    </TableCell> */}

                    {/* Created Date */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatDate(exercise.createdAt)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewExercise(exercise)}
                          className="px-3 py-1"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEditExercise(exercise)}
                          className="px-3 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant={exercise.status === "ACTIVE" ? "outline" : "primary"}
                          onClick={() => handleToggleStatus(exercise.id)}
                          className="px-3 py-1"
                        >
                          {exercise.status === "ACTIVE" ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(exercise.id, exercise.name)}
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

      {/* Exercise Edit Modal */}
      <ExerciseEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        exercise={selectedExercise}
        onSuccess={handleUpdateSuccess}
      />

      {/* Exercise View Modal */}
      <ExerciseViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        exercise={selectedExercise}
      />
    </>
  );
}

