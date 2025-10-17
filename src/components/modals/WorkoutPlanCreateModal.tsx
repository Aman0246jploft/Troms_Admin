"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { createWorkoutPlanAdmin } from "@/store/slices/workoutPlanAdmin";
import { toast } from "react-hot-toast";
import { Modal } from "../ui/modal";
import { Plus, Trash2, X, Search, ChevronDown, ChevronUp, ChevronDown as ChevronDownIcon } from "lucide-react";

// Validation schema matching backend
const createWorkoutPlanSchema = z.object({
  totalDays: z.number().min(1, "Total days must be at least 1").max(30, "Total days cannot exceed 30"),
  location: z.enum(["HOME", "GYM", "OUTDOORS"], {
    message: "Location is required"
  }),
  workouts: z.record(z.string(), z.array(z.object({
    exerciseId: z.string().min(1, "Exercise ID is required"),
    sets: z.number().min(1, "Sets must be at least 1"),
    reps: z.number().min(1, "Reps must be at least 1"),
    duration: z.number().min(0, "Duration must be 0 or positive"),
    rest: z.number().min(0, "Rest time must be 0 or positive"),
    order: z.number().min(1, "Order must be at least 1").optional(),
    replacement: z.number().min(0, "Replacement must be 0 or positive").optional(),
  }))),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

type CreateWorkoutPlanFormData = z.infer<typeof createWorkoutPlanSchema>;

interface WorkoutPlanCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  exercises: any[];
}

// Helper function to render exercise row
const renderExerciseRow = (
  day: string,
  exerciseIndex: number,
  exercise: any,
  fieldErrors: {[key: string]: string[]},
  openDropdowns: {[key: string]: boolean},
  dropdownRefs: React.MutableRefObject<{[key: string]: HTMLDivElement | null}>,
  exerciseSearchTerm: string,
  setExerciseSearchTerm: (term: string) => void,
  toggleDropdown: (fieldKey: string) => void,
  closeDropdown: (fieldKey: string) => void,
  updateExerciseInDay: (day: string, exerciseIndex: number, field: string, value: any) => void,
  removeExerciseFromDay: (day: string, exerciseIndex: number) => void,
  moveExerciseUp: (day: string, exerciseIndex: number) => void,
  moveExerciseDown: (day: string, exerciseIndex: number) => void,
  dayExercises: any[],
  addReplacementExercise: (day: string, baseExerciseIndex: number) => void,
  exercises: any[],
  isReplacement: boolean = false
) => {
  const fieldKey = `${day}-${exerciseIndex}`;
  const exerciseErrors = fieldErrors[fieldKey] || [];
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-7 gap-3 p-3 rounded-md ${
      isReplacement 
        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
        : "bg-gray-50 dark:bg-gray-700"
    }`}>
      {/* Exercise Selection */}
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-1">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Exercise
          </label>
          {isReplacement && (
            <span className="px-1 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded">
              Replacement {exercise.replacement}
            </span>
          )}
        </div>
        <div className="relative" ref={(el) => { dropdownRefs.current[fieldKey] = el; }}>
          <button
            type="button"
            onClick={() => toggleDropdown(fieldKey)}
            className={`w-full flex items-center justify-between px-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white ${
              exerciseErrors.some(error => error.includes("exercise")) 
                ? "border-red-500 dark:border-red-500" 
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <span className="truncate">
              {exercise.exerciseId 
                ? exercises.find(ex => ex.id === exercise.exerciseId)?.name || "Select exercise"
                : "Select exercise"
              }
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${openDropdowns[fieldKey] ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown */}
          {openDropdowns[fieldKey] && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-b-md shadow-lg z-20">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={exerciseSearchTerm}
                    onChange={(e) => setExerciseSearchTerm(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Options */}
              <div className="max-h-40 overflow-y-auto">
                {exercises.filter(exercise =>
                  exercise.name?.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
                ).length > 0 ? (
                  exercises.filter(exercise =>
                    exercise.name?.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
                  ).map((ex) => (
                    <div
                      key={ex.id}
                      onClick={() => {
                        updateExerciseInDay(day, exerciseIndex, "exerciseId", ex.id);
                        closeDropdown(fieldKey);
                        setExerciseSearchTerm("");
                      }}
                      className={`px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${
                        exercise.exerciseId === ex.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      {ex.name}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    {exerciseSearchTerm ? `No exercises found matching "${exerciseSearchTerm}"` : "No exercises available"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {exerciseErrors.some(error => error.includes("exercise")) && (
          <p className="text-xs text-red-500 mt-1">Please select an exercise</p>
        )}
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
          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white ${
            exerciseErrors.some(error => error.includes("sets")) 
              ? "border-red-500 dark:border-red-500" 
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {exerciseErrors.some(error => error.includes("sets")) && (
          <p className="text-xs text-red-500 mt-1">Please enter valid sets (minimum 1)</p>
        )}
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
          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white ${
            exerciseErrors.some(error => error.includes("reps")) 
              ? "border-red-500 dark:border-red-500" 
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {exerciseErrors.some(error => error.includes("reps")) && (
          <p className="text-xs text-red-500 mt-1">Please enter valid reps (minimum 1)</p>
        )}
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
          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white ${
            exerciseErrors.some(error => error.includes("duration")) 
              ? "border-red-500 dark:border-red-500" 
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {exerciseErrors.some(error => error.includes("duration")) && (
          <p className="text-xs text-red-500 mt-1">Please enter valid duration (minimum 0)</p>
        )}
      </div>

      {/* Rest */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rest (sec)
        </label>
        <input
          type="number"
          min="0"
          value={exercise.rest || ""}
          onChange={(e) => updateExerciseInDay(day, exerciseIndex, "rest", parseInt(e.target.value) || 0)}
          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white ${
            exerciseErrors.some(error => error.includes("rest")) 
              ? "border-red-500 dark:border-red-500" 
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {exerciseErrors.some(error => error.includes("rest")) && (
          <p className="text-xs text-red-500 mt-1">Please enter valid rest time (minimum 0)</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Actions
        </label>
        
        {/* Add Replacement Button - only for main exercises */}
        {!isReplacement && (
          <button
            type="button"
            onClick={() => addReplacementExercise(day, exerciseIndex)}
            className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
            title="Add replacement exercise"
          >
            <Plus className="w-3 h-3" />
            Replacement
          </button>
        )}
        
        {/* Reorder Controls - only for main exercises */}
        {!isReplacement && (
          <div className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => moveExerciseUp(day, exerciseIndex)}
              disabled={exerciseIndex === 0}
              className={`p-1 rounded ${
                exerciseIndex === 0
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
              title="Move up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => moveExerciseDown(day, exerciseIndex)}
              disabled={exerciseIndex === dayExercises.length - 1}
              className={`p-1 rounded ${
                exerciseIndex === dayExercises.length - 1
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
              title="Move down"
            >
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Remove Button */}
        <button
          type="button"
          onClick={() => removeExerciseFromDay(day, exerciseIndex)}
          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          title="Remove exercise"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const WorkoutPlanCreateModal: React.FC<WorkoutPlanCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  exercises,
}) => {
  const dispatch = useAppDispatch();
  const { creating } = useAppSelector((state) => state.workoutPlanAdmin);

  const [totalDays, setTotalDays] = useState(3);
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string[]}>({});
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  const [validationError, setValidationError] = useState<string>("");
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateWorkoutPlanFormData>({
    resolver: zodResolver(createWorkoutPlanSchema),
    defaultValues: {
      totalDays: 3,
      location: "HOME",
      workouts: {},
      status: "ACTIVE",
    },
  });

  const watchedTotalDays = watch("totalDays");
  const watchedLocation = watch("location");

  // Filter exercises based on search term
  const filteredExercises = exercises.filter(exercise =>
    exercise.name?.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
  );

  // Update totalDays when form value changes
  useEffect(() => {
    setTotalDays(watchedTotalDays);
    // Reset workouts when totalDays changes
    const newWorkouts: any = {};
    for (let i = 1; i <= watchedTotalDays; i++) {
      newWorkouts[`day-${i}`] = [];
    }
    setValue("workouts", newWorkouts);
  }, [watchedTotalDays, setValue]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(openDropdowns).forEach(fieldKey => {
        const dropdown = dropdownRefs.current[fieldKey];
        if (dropdown && !dropdown.contains(event.target as Node)) {
          closeDropdown(fieldKey);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdowns]);

  const addExerciseToDay = (day: string) => {
    const currentWorkouts = watch("workouts");
    const dayExercises = currentWorkouts[day] || [];
    
    // Find the highest order number to ensure we don't duplicate orders
    const maxOrder = dayExercises.length > 0 
      ? Math.max(...dayExercises.map(ex => ex.order || 0))
      : 0;
    
    const newExercise = {
      exerciseId: "",
      sets: 3,
      reps: 12,
      duration: 0,
      rest: 60,
      order: maxOrder + 1, // Use the next available order number
      replacement: 0,
    };

    setValue("workouts", {
      ...currentWorkouts,
      [day]: [...dayExercises, newExercise],
    });
  };

  const addReplacementExercise = (day: string, baseExerciseIndex: number) => {
    const currentWorkouts = watch("workouts");
    const dayExercises = currentWorkouts[day] || [];
    const baseExercise = dayExercises[baseExerciseIndex];
    
    // Find the highest replacement number for this order
    const sameOrderExercises = dayExercises.filter(ex => ex.order === baseExercise.order);
    const maxReplacement = sameOrderExercises.length > 0 
      ? Math.max(...sameOrderExercises.map(ex => ex.replacement || 0))
      : 0;
    
    const newReplacementExercise = {
      exerciseId: "",
      sets: baseExercise.sets,
      reps: baseExercise.reps,
      duration: baseExercise.duration,
      rest: baseExercise.rest,
      order: baseExercise.order, // Keep the same order as the base exercise
      replacement: maxReplacement + 1,
    };

    setValue("workouts", {
      ...currentWorkouts,
      [day]: [...dayExercises, newReplacementExercise],
    });
  };

  const removeExerciseFromDay = (day: string, exerciseIndex: number) => {
    const currentWorkouts = watch("workouts");
    const dayExercises = currentWorkouts[day] || [];
    const exerciseToRemove = dayExercises[exerciseIndex];
    
    // If removing a main exercise, also remove all its replacements
    let updatedExercises;
    if (exerciseToRemove.replacement === 0) {
      // Remove main exercise and all its replacements
      updatedExercises = dayExercises.filter((_, index) => {
        const exercise = dayExercises[index];
        return exercise.order !== exerciseToRemove.order;
      });
    } else {
      // Just remove the replacement exercise
      updatedExercises = dayExercises.filter((_, index) => index !== exerciseIndex);
    }
    
    // Reorder exercises after removal to maintain sequential order numbers
    const reorderedExercises = updatedExercises.map((exercise, index) => ({
      ...exercise,
      order: index + 1,
    }));
    
    setValue("workouts", {
      ...currentWorkouts,
      [day]: reorderedExercises,
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

  const moveExerciseUp = (day: string, exerciseIndex: number) => {
    if (exerciseIndex === 0) return; // Already at the top
    
    const currentWorkouts = watch("workouts");
    const dayExercises = currentWorkouts[day] || [];
    const currentExercise = dayExercises[exerciseIndex];
    
    // Only allow moving main exercises (not replacements)
    if (currentExercise.replacement && currentExercise.replacement > 0) return;
    
    // Find the previous main exercise
    let prevMainExerciseIndex = -1;
    for (let i = exerciseIndex - 1; i >= 0; i--) {
      const exercise = dayExercises[i];
      if (!exercise.replacement || exercise.replacement === 0) {
        prevMainExerciseIndex = i;
        break;
      }
    }
    
    if (prevMainExerciseIndex === -1) return; // No previous main exercise found
    
    // Swap the order values of the two main exercises
    const updatedExercises = dayExercises.map((exercise, index) => {
      if (index === exerciseIndex) {
        return { ...exercise, order: dayExercises[prevMainExerciseIndex].order };
      } else if (index === prevMainExerciseIndex) {
        return { ...exercise, order: currentExercise.order };
      }
      return exercise;
    });
    
    setValue("workouts", {
      ...currentWorkouts,
      [day]: updatedExercises,
    });
  };

  const moveExerciseDown = (day: string, exerciseIndex: number) => {
    const currentWorkouts = watch("workouts");
    const dayExercises = currentWorkouts[day] || [];
    const currentExercise = dayExercises[exerciseIndex];
    
    // Only allow moving main exercises (not replacements)
    if (currentExercise.replacement && currentExercise.replacement > 0) return;
    
    // Find the next main exercise
    let nextMainExerciseIndex = -1;
    for (let i = exerciseIndex + 1; i < dayExercises.length; i++) {
      const exercise = dayExercises[i];
      if (!exercise.replacement || exercise.replacement === 0) {
        nextMainExerciseIndex = i;
        break;
      }
    }
    
    if (nextMainExerciseIndex === -1) return; // No next main exercise found
    
    // Swap the order values of the two main exercises
    const updatedExercises = dayExercises.map((exercise, index) => {
      if (index === exerciseIndex) {
        return { ...exercise, order: dayExercises[nextMainExerciseIndex].order };
      } else if (index === nextMainExerciseIndex) {
        return { ...exercise, order: currentExercise.order };
      }
      return exercise;
    });
    
    setValue("workouts", {
      ...currentWorkouts,
      [day]: updatedExercises,
    });
  };

  const onSubmit = async (data: CreateWorkoutPlanFormData) => {
    try {
      // Clear previous errors
      setFieldErrors({});
      setValidationError("");
      
      // Validate that all days have at least one exercise
      const workoutDays = Object.keys(data.workouts);
      const emptyDays = workoutDays.filter(day => !data.workouts[day] || data.workouts[day].length === 0);
      
      if (emptyDays.length > 0) {
        setValidationError(`Please add at least one exercise to: ${emptyDays.join(", ")}`);
        return;
      }

      // Validate that all exercises have complete data
      const newFieldErrors: {[key: string]: string[]} = {};
      let hasErrors = false;

      for (const day of workoutDays) {
        for (let i = 0; i < data.workouts[day].length; i++) {
          const exercise = data.workouts[day][i];
          const fieldKey = `${day}-${i}`;
          const errors: string[] = [];

          if (!exercise.exerciseId) {
            errors.push("Please select an exercise");
            hasErrors = true;
          }
          if (!exercise.sets || exercise.sets < 1) {
            errors.push("Please enter valid sets (minimum 1)");
            hasErrors = true;
          }
          if (!exercise.reps || exercise.reps < 1) {
            errors.push("Please enter valid reps (minimum 1)");
            hasErrors = true;
          }
          if (exercise.duration < 0) {
            errors.push("Please enter valid duration (minimum 0)");
            hasErrors = true;
          }
          if (exercise.rest < 0) {
            errors.push("Please enter valid rest time (minimum 0)");
            hasErrors = true;
          }

          if (errors.length > 0) {
            newFieldErrors[fieldKey] = errors;
          }
        }
      }

      if (hasErrors) {
        setFieldErrors(newFieldErrors);
        setValidationError("Please fix the errors in the form");
        return;
      }

      await dispatch(createWorkoutPlanAdmin(data)).unwrap();
      toast.success("Workout plan created successfully!");
      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error("Error creating workout plan:", error);
      toast.error(error?.message || "Failed to create workout plan");
    }
  };

  const handleClose = () => {
    reset();
    setTotalDays(3);
    setExerciseSearchTerm("");
    setFieldErrors({});
    setOpenDropdowns({});
    setValidationError("");
    onClose();
  };

  const toggleDropdown = (fieldKey: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
  };

  const closeDropdown = (fieldKey: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [fieldKey]: false
    }));
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Workout Plan
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Validation Error */}
          {validationError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">{validationError}</p>
                </div>
              </div>
            </div>
          )}

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
                    <option value="OUTDOORS">OUTDOORS</option>
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
                      <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => addExerciseToDay(day)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Exercise
                      </button>
                      </div>
                    </div>

                    {dayExercises.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No exercises added yet. Click "Add Exercise" to get started.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(() => {
                          // Group exercises by order
                          const groupedExercises = dayExercises.reduce((groups, exercise, index) => {
                            const order = exercise.order || index + 1;
                            if (!groups[order]) {
                              groups[order] = [];
                            }
                            groups[order].push({ ...exercise, originalIndex: index });
                            return groups;
                          }, {} as { [key: number]: any[] });

                          return Object.keys(groupedExercises)
                            .sort((a, b) => parseInt(a) - parseInt(b))
                            .map(order => {
                              const orderExercises = groupedExercises[parseInt(order)];
                              const mainExercise = orderExercises.find(ex => !ex.replacement || ex.replacement === 0);
                              const replacementExercises = orderExercises.filter(ex => ex.replacement && ex.replacement > 0);
                          
                          return (
                                <div key={order} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                                  {/* Order Header */}
                                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
                                    <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                      Exercise Order {order}
                                    </h5>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {replacementExercises.length} replacement{replacementExercises.length !== 1 ? 's' : ''}
                                  </span>
                                  </div>

                                  {/* Main Exercise */}
                                  {mainExercise && (
                                    <div className="mb-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded font-medium">
                                          Main Exercise
                                        </span>
                                      </div>
                                      {renderExerciseRow(day, mainExercise.originalIndex, mainExercise, fieldErrors, openDropdowns, dropdownRefs, exerciseSearchTerm, setExerciseSearchTerm, toggleDropdown, closeDropdown, updateExerciseInDay, removeExerciseFromDay, moveExerciseUp, moveExerciseDown, dayExercises, addReplacementExercise, exercises, false)}
                                    </div>
                                  )}

                                  {/* Replacement Exercises */}
                                  {replacementExercises.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded font-medium">
                                          Replacements
                                        </span>
                                          </div>
                                      {replacementExercises.map((replacementExercise) => (
                                        <div key={replacementExercise.originalIndex} className="ml-4 border-l-2 border-green-300 dark:border-green-600 pl-3">
                                          {renderExerciseRow(day, replacementExercise.originalIndex, replacementExercise, fieldErrors, openDropdowns, dropdownRefs, exerciseSearchTerm, setExerciseSearchTerm, toggleDropdown, closeDropdown, updateExerciseInDay, removeExerciseFromDay, moveExerciseUp, moveExerciseDown, dayExercises, addReplacementExercise, exercises, true)}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                          </div>
                          );
                            });
                        })()}
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
              disabled={creating}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : "Create Workout Plan"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default WorkoutPlanCreateModal;
