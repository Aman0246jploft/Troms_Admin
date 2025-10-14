"use client";

import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { createExercise } from "@/store/slices/exercise";
import { toast } from "react-hot-toast";
import { Modal } from "../ui/modal";
import Multiselect from "../ui/multiselect";

const BODY_PART_LIST = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist"
];

const TARGET_LIST = [
  "abductors",
  "abs",
  "adductors",
  "biceps",
  "calves",
  "cardiovascular system",
  "delts",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "levator scapulae",
  "pectorals",
  "quads",
  "serratus anterior",
  "spine",
  "traps",
  "triceps",
  "upper back"
];

// Validation schema matching backend
const createExerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  equipment: z.string().optional(),
  json: z.object({
    bodyPart: z.string().min(1, "Body part is required"),
    equipment: z.string().min(1, "Equipment is required"),
    name: z.string().min(1, "Exercise name is required"),
    target: z.string().min(1, "Target muscle is required"),
    secondaryMuscles: z.array(z.string()).optional(),
    instructions: z.array(z.string()).optional(),
    description: z.string().optional(),
    difficulty: z.string().optional(),
    category: z.string().optional(),
  }),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

type CreateExerciseFormData = z.infer<typeof createExerciseSchema>;

interface ExerciseCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ExerciseCreateModal: React.FC<ExerciseCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { creating } = useAppSelector((state) => state.exercise);

  const [gifFile, setGifFile] = useState<File | null>(null);
  const [pngFile, setPngFile] = useState<File | null>(null);
  const gifInputRef = useRef<HTMLInputElement>(null);
  const pngInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateExerciseFormData>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      name: "",
      equipment: "",
      json: {
        bodyPart: "",
        equipment: "",
        name: "",
        target: "",
        secondaryMuscles: [],
        instructions: [],
        description: "",
        difficulty: "",
        category: "",
      },
      status: "ACTIVE",
    },
  });

  const watchedName = watch("name");
  const watchedJsonName = watch("json.name");

  // Auto-sync names
  React.useEffect(() => {
    if (watchedName && !watchedJsonName) {
      setValue("json.name", watchedName);
    }
  }, [watchedName, watchedJsonName, setValue]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "gif" | "png"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === "gif") {
        setGifFile(file);
      } else {
        setPngFile(file);
      }
    }
  };

  const removeFile = (type: "gif" | "png") => {
    if (type === "gif") {
      setGifFile(null);
      if (gifInputRef.current) {
        gifInputRef.current.value = "";
      }
    } else {
      setPngFile(null);
      if (pngInputRef.current) {
        pngInputRef.current.value = "";
      }
    }
  };

  const onSubmit = async (data: CreateExerciseFormData) => {
    try {
      const formData = new FormData();

      // Generate unique ID using current timestamp
      const uniqueId = `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Add text fields
      formData.append("name", data.name);
      if (data.equipment) {
        formData.append("equipment", data.equipment);
      }

      // Add unique ID to JSON data
      const jsonWithId = {
        ...data.json,
        id: uniqueId
      };

      formData.append("json", JSON.stringify(jsonWithId));
      if (data.status) {
        formData.append("status", data.status);
      }

      // Add files
      if (gifFile) {
        formData.append("gifFile", gifFile);
      }
      if (pngFile) {
        formData.append("pngFile", pngFile);
      }

      await dispatch(createExercise({ formData })).unwrap();

      toast.success("Exercise created successfully!");
      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error("Error creating exercise:", error);
      toast.error(error?.message || "Failed to create exercise");
    }
  };

  const handleClose = () => {
    reset();
    setGifFile(null);
    setPngFile(null);
    if (gifInputRef.current) {
      gifInputRef.current.value = "";
    }
    if (pngInputRef.current) {
      pngInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} >


      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Exercise
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exercise Name *
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter exercise name"
                  />
                )}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Equipment
              </label>
              <Controller
                name="equipment"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter equipment"
                  />
                )}
              />
              {errors.equipment && (
                <p className="mt-1 text-sm text-red-600">{errors.equipment.message}</p>
              )}
            </div>
          </div>

          {/* JSON Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Exercise Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Body Part *
                </label>
                <Controller
                  name="json.bodyPart"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select body part</option>
                      {BODY_PART_LIST.map((part) => (
                        <option key={part} value={part} className="capitalize">
                          {part}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.json?.bodyPart && (
                  <p className="mt-1 text-sm text-red-600">{errors.json.bodyPart.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Muscle *
                </label>
                <Controller
                  name="json.target"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select target muscle</option>
                      {TARGET_LIST.map((muscle) => (
                        <option key={muscle} value={muscle} className="capitalize">
                          {muscle}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.json?.target && (
                  <p className="mt-1 text-sm text-red-600">{errors.json.target.message}</p>
                )}
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  JSON Equipment *
                </label>
                <Controller
                  name="json.equipment"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., dumbbell, barbell, bodyweight"
                    />
                  )}
                />
                {errors.json?.equipment && (
                  <p className="mt-1 text-sm text-red-600">{errors.json.equipment.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <Controller
                  name="json.difficulty"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select difficulty</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <Controller
                  name="json.category"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., strength, cardio, flexibility"
                    />
                  )}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <Controller
                name="json.description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter exercise description"
                  />
                )}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Muscles
                </label>
                <Controller
                  name="json.secondaryMuscles"
                  control={control}
                  render={({ field }) => (
                    <Multiselect
                      options={TARGET_LIST}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select secondary muscles..."
                    />
                  )}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Select multiple secondary muscles that are also engaged
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instructions
                </label>
                <Controller
                  name="json.instructions"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {/* Display existing instructions */}
                      {field.value && field.value.length > 0 && (
                        <div className="space-y-2">
                          {field.value.map((instruction, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                              <span className="flex-1 text-sm text-gray-900 dark:text-white">
                                {index + 1}. {instruction}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newInstructions = field.value.filter((_, i) => i !== index);
                                  field.onChange(newInstructions);
                                }}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add new instruction */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter new instruction..."
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const newInstruction = input.value.trim();
                              if (newInstruction) {
                                const currentInstructions = field.value || [];
                                field.onChange([...currentInstructions, newInstruction]);
                                input.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            const newInstruction = input.value.trim();
                            if (newInstruction) {
                              const currentInstructions = field.value || [];
                              field.onChange([...currentInstructions, newInstruction]);
                              input.value = '';
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Click "Add" or press Enter to add each instruction
                </p>
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Exercise Images
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GIF Animation
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    ref={gifInputRef}
                    type="file"
                    accept=".gif"
                    onChange={(e) => handleFileChange(e, "gif")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => gifInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Choose GIF
                  </button>
                  {gifFile && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {gifFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile("gif")}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PNG Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    ref={pngInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, "png")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => pngInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Choose Image
                  </button>
                  {pngFile && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {pngFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile("png")}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
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
              {creating ? "Creating..." : "Create Exercise"}
            </button>
          </div>
        </form>
      </div>


    </Modal>

  );
};

export default ExerciseCreateModal;
