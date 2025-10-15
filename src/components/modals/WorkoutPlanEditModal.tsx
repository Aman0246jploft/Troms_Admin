"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { updateWorkoutPlanAdmin } from "@/store/slices/workoutPlanAdmin";
import { toast } from "react-hot-toast";
import { Modal } from "../ui/modal";
import { Plus, Trash2, X } from "lucide-react";

// Validation schema matching backend
const updateWorkoutPlanSchema = z.object({
  totalDays: z.number().min(1, "Total days must be at least 1").max(30, "Total days cannot exceed 30"),
  location: z.enum(["HOME", "GYM", "OUTDOOR"], {
    message: "Location is required"
  }),
  workouts: z.record(z.string(), z.array(z.object({
    exerciseId: z.string().min(1, "Exercise ID is required"),
    sets: z.number().min(1, "Sets must be at least 1"),
    reps: z.number().min(1, "Reps must be at least 1"),
    duration: z.number().min(0, "Duration must be 0 or positive"),
    rest: z.number().min(0, "Rest time must be 0 or positive"),
  }))),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

type UpdateWorkoutPlanFormData = z.infer<typeof updateWorkoutPlanSchema>;

interface WorkoutPlanEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutPlan: any;
  onSuccess: () => void;
  exercises: any[];
}

const WorkoutPlanEditModal: React.FC<WorkoutPlanEditModalProps> = ({
  isOpen,
  onClose,
  workoutPlan,
  onSuccess,
  exercises,
}) => {
  const dispatch = useAppDispatch();
  // workoutPlanAdmin
  const { updating,
selectedWorkoutPlanAdmin } = useAppSelector((state) => state?.workoutPlanAdmin);
  console.log("updating1122",selectedWorkoutPlanAdmin)

  const [totalDays, setTotalDays] = useState(3);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateWorkoutPlanFormData>({
    resolver: zodResolver(updateWorkoutPlanSchema),
    defaultValues: {
      totalDays: 3,
      location: "HOME",
      workouts: {},
      status: "ACTIVE",
    },
  });

  const watchedTotalDays = watch("totalDays");
  const watchedLocation = watch("location");

  // Initialize form with workout plan data
  useEffect(() => {
    if (workoutPlan && isOpen) {
      // Handle both direct workoutPlan and nested result structure
      const planData = workoutPlan.result || workoutPlan;
      setTotalDays(planData.totalDays);
      reset({
        totalDays: planData.totalDays,
        location: planData.location,
        workouts: planData.workouts || {},
        status: planData.status || "ACTIVE",
      });
    }
  }, [workoutPlan, isOpen, reset]);

  // Update totalDays when form value changes
  useEffect(() => {
    setTotalDays(watchedTotalDays);
  }, [watchedTotalDays]);

  const addExerciseToDay = (day: string) => {
    const currentWorkouts = watch("workouts");
    const dayExercises = currentWorkouts[day] || [];
    
    const newExercise = {
      exerciseId: "",
      sets: 3,
      reps: 12,
      duration: 0,
      rest: 60,
    };

    setValue("workouts", {
      ...currentWorkouts,
      [day]: [...dayExercises, newExercise],
    });
  };

  const removeExerciseFromDay = (day: string, exerciseIndex: number) => {
    const currentWorkouts = watch("workouts");
    const dayExercises = currentWorkouts[day] || [];
    const updatedExercises = dayExercises.filter((_, index) => index !== exerciseIndex);
    
    setValue("workouts", {
      ...currentWorkouts,
      [day]: updatedExercises,
    });
  };

  const updateExerciseInDay = (day: string, exerciseIndex: number, field: string, value: any) => {
    const currentWorkouts = watch("workouts");
    const dayExercises = currentWorkouts[day] || [];
    const updatedExercises = dayExercises.map((exercise, index) => {
      if (index === exerciseIndex) {
        return { ...exercise, [field]: value };
      }
      return exercise;
    });
    
    setValue("workouts", {
      ...currentWorkouts,
      [day]: updatedExercises,
    });
  };

  const onSubmit = async (data: UpdateWorkoutPlanFormData) => {
    // Handle both direct workoutPlan and nested result structure
    const planData = workoutPlan?.result || workoutPlan;
    if (!planData?.id) {
      toast.error("Workout plan ID is missing");
      return;
    }

    try {
      // Validate that all days have at least one exercise
      const workoutDays = Object.keys(data.workouts);
      const emptyDays = workoutDays.filter(day => !data.workouts[day] || data.workouts[day].length === 0);
      
      if (emptyDays.length > 0) {
        toast.error(`Please add at least one exercise to: ${emptyDays.join(", ")}`);
        return;
      }

      // Validate that all exercises have exerciseId
      for (const day of workoutDays) {
        for (const exercise of data.workouts[day]) {
          if (!exercise.exerciseId) {
            toast.error(`Please select an exercise for ${day}`);
            return;
          }
        }
      }

      await dispatch(updateWorkoutPlanAdmin({
        id: planData.id,
        ...data
      })).unwrap();
      
      toast.success("Workout plan updated successfully!");
      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error("Error updating workout plan:", error);
      toast.error(error?.message || "Failed to update workout plan");
    }
  };

  const handleClose = () => {
    reset();
    setTotalDays(3);
    onClose();
  };

  if (!isOpen || !workoutPlan) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Workout Plan
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Days *
              </label>
              <Controller
                name="totalDays"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    max="30"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter total days"
                  />
                )}
              />
              {errors.totalDays && (
                <p className="mt-1 text-sm text-red-600">{errors.totalDays.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select location</option>
                    <option value="HOME">Home</option>
                    <option value="GYM">Gym</option>
                    <option value="OUTDOOR">Outdoor</option>
                  </select>
                )}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                )}
              />
            </div>
          </div>

          {/* Workout Days */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Workout Days ({totalDays} days)
            </h3>

            <div className="space-y-6">
              {Array.from({ length: totalDays }, (_, index) => {
                const day = `day-${index + 1}`;
                const dayExercises = watch(`workouts.${day}`) || [];

                return (
                  <div key={day} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white capitalize">
                        {day.replace('-', ' ')}
                      </h4>
                      <button
                        type="button"
                        onClick={() => addExerciseToDay(day)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Exercise
                      </button>
                    </div>

                    {dayExercises.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No exercises added yet. Click "Add Exercise" to get started.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dayExercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            {/* Exercise Selection */}
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Exercise *
                              </label>
                              <select
                                value={exercise.exerciseId || ""}
                                onChange={(e) => updateExerciseInDay(day, exerciseIndex, "exerciseId", e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                              >
                                <option value="">Select exercise</option>
                                {exercises.map((ex) => (
                                  <option key={ex.id} value={ex.id}>
                                    {ex.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Sets */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sets
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={exercise.sets || ""}
                                onChange={(e) => updateExerciseInDay(day, exerciseIndex, "sets", parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                              />
                            </div>

                            {/* Reps */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Reps
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={exercise.reps || ""}
                                onChange={(e) => updateExerciseInDay(day, exerciseIndex, "reps", parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                              />
                            </div>

                            {/* Duration */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Duration (sec)
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={exercise.duration || ""}
                                onChange={(e) => updateExerciseInDay(day, exerciseIndex, "duration", parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                              />
                            </div>

                            {/* Rest */}
                            <div className="flex items-end">
                              <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Rest (sec)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={exercise.rest || ""}
                                  onChange={(e) => updateExerciseInDay(day, exerciseIndex, "rest", parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExerciseFromDay(day, exerciseIndex)}
                                className="ml-2 p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Workout Plan"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default WorkoutPlanEditModal;
