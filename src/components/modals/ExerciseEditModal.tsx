"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { updateExercise } from "@/store/slices/exercise";
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
const editExerciseSchema = z.object({
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

type EditExerciseFormData = z.infer<typeof editExerciseSchema>;

interface Exercise {
  id: string;
  name: string;
  equipment: string;
  gifUrl?: string;
  pngUrl?: string;
  status: string;
  json?: any;
}

interface ExerciseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  onSuccess: () => void;
}

const ExerciseEditModal: React.FC<ExerciseEditModalProps> = ({
  isOpen,
  onClose,
  exercise,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { updating } = useAppSelector((state) => state.exercise);

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
  } = useForm<EditExerciseFormData>({
    resolver: zodResolver(editExerciseSchema),
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

  // Update form data when exercise changes
  useEffect(() => {
    if (exercise) {
      const jsonData = exercise.json || {};
      reset({
        name: exercise.name || "",
        equipment: exercise.equipment || "",
        json: {
          bodyPart: jsonData.bodyPart || "",
          equipment: jsonData.equipment || exercise.equipment || "",
          name: jsonData.name || exercise.name || "",
          target: jsonData.target || "",
          secondaryMuscles: jsonData.secondaryMuscles || [],
          instructions: jsonData.instructions || [],
          description: jsonData.description || "",
          difficulty: jsonData.difficulty || "",
          category: jsonData.category || "",
        },
        status: exercise.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      });
    }
  }, [exercise, reset]);

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

  const onSubmit = async (data: EditExerciseFormData) => {
    if (!exercise) return;

    try {
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("name", data.name);
      if (data.equipment) {
        formDataToSend.append("equipment", data.equipment);
      }

      // Add JSON data
      formDataToSend.append("json", JSON.stringify(data.json));
      if (data.status) {
        formDataToSend.append("status", data.status);
      }

      // Add files if selected
      if (gifFile) {
        formDataToSend.append("gifFile", gifFile);
      }
      if (pngFile) {
        formDataToSend.append("pngFile", pngFile);
      }

      // Add existing URLs if no new files are selected
      if (!gifFile && exercise.gifUrl) {
        formDataToSend.append("gifUrl", exercise.gifUrl);
      }
      if (!pngFile && exercise.pngUrl) {
        formDataToSend.append("pngUrl", exercise.pngUrl);
      }

      await dispatch(updateExercise({
        id: exercise.id,
        formData: formDataToSend
      })).unwrap();

      toast.success("Exercise updated successfully!");
      handleClose();
      onSuccess();
    } catch (error: any) {
      console.error("Error updating exercise:", error);
      toast.error(error?.message || "Failed to update exercise");
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

  if (!isOpen || !exercise) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} >

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Exercise
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
              {/* GIF Animation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  GIF Animation
                </label>

                {/* Current GIF Display */}
                {!gifFile && exercise.gifUrl && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current GIF:</p>
                    <div className="relative group">
                      <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                        {/* {JSON.stringify(exercise.gifUrl)} */}

                        <img
                          src={
                            exercise.gifUrl.startsWith("http")
                              ? exercise.gifUrl
                              : `${process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1$/, "")}${exercise.gifUrl}`
                          }
                          alt="Current GIF"
                          className="w-full h-full object-cover"
                        />


                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          Current
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* New GIF Upload */}
                <div className="space-y-3">
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
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {gifFile ? "Change GIF" : "Choose New GIF"}
                  </button>

                  {gifFile && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                              {gifFile.name}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {(gifFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("gif")}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PNG Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  PNG Image
                </label>

                {/* Current PNG Display */}
                {!pngFile && exercise.pngUrl && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Image:</p>
                    <div className="relative group">
                      <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">


                        <img
                          src={
                            exercise.pngUrl.startsWith("http")
                              ? exercise.pngUrl
                              : `${process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1$/, "")}${exercise.pngUrl}`
                          }
                          alt="Current pngUrl"
                          className="w-full h-full object-cover"
                        />


                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          Current
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* New PNG Upload */}
                <div className="space-y-3">
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
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {pngFile ? "Change Image" : "Choose New Image"}
                  </button>

                  {pngFile && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                              {pngFile.name}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                              {(pngFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("png")}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Help Text */}
            {/* <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Image Upload Guidelines:</p>
                  <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• GIF files should be optimized for web (max 5MB recommended)</li>
                    <li>• PNG/JPG images should be high quality but web-optimized</li>
                    <li>• Current images will be replaced when you upload new ones</li>
                    <li>• Leave empty to keep existing images</li>
                  </ul>
                </div>
              </div>
            </div> */}
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
              disabled={updating}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Exercise"}
            </button>
          </div>
        </form>
      </div>

    </Modal>
  );
};

export default ExerciseEditModal;

