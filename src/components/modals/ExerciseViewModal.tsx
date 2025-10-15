"use client";

import React from "react";
import { Modal } from "../ui/modal";
import { X, Eye } from "lucide-react";
import Badge from "../ui/badge/Badge";

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

interface ExerciseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
}

const ExerciseViewModal: React.FC<ExerciseViewModalProps> = ({
  isOpen,
  onClose,
  exercise,
}) => {
  if (!isOpen || !exercise) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Exercise Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exercise Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{exercise.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Equipment
                </label>
                <p className="text-gray-900 dark:text-white">{exercise.equipment}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <Badge size="sm" color={getStatusColor(exercise.status)}>
                  {exercise.status}
                </Badge>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exercise ID
                </label>
                <p className="text-gray-900 dark:text-white font-mono text-sm">{exercise.id}</p>
              </div>
            </div>
          </div>

          {/* Exercise Details */}
          {exercise.json && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Exercise Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Body Part
                  </label>
                  <p className="text-gray-900 dark:text-white capitalize">{exercise.json.bodyPart || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Muscle
                  </label>
                  <p className="text-gray-900 dark:text-white capitalize">{exercise.json.target || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <p className="text-gray-900 dark:text-white capitalize">{exercise.json.difficulty || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <p className="text-gray-900 dark:text-white capitalize">{exercise.json.category || "N/A"}</p>
                </div>
              </div>
              
              {exercise.json.description && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900 dark:text-white">{exercise.json.description}</p>
                </div>
              )}

              {exercise.json.secondaryMuscles && exercise.json.secondaryMuscles.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Secondary Muscles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {exercise.json.secondaryMuscles.map((muscle: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md text-xs capitalize"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {exercise.json.instructions && exercise.json.instructions.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Instructions
                  </label>
                  <ol className="list-decimal list-inside space-y-2">
                    {exercise.json.instructions.map((instruction: string, index: number) => (
                      <li key={index} className="text-gray-900 dark:text-white">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Media Files */}
          {(exercise.gifUrl || exercise.pngUrl) && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Media Files
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exercise.gifUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GIF Animation
                    </label>
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                      <div className="aspect-square">
                        <img
                          src={
                            exercise.gifUrl.startsWith("http")
                              ? exercise.gifUrl
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, "") || process.env.NEXT_PUBLIC_API_URL || ""}${exercise.gifUrl}`
                          }
                          alt="Exercise GIF"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-600">
                                  <div class="text-center">
                                    <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">GIF not available</p>
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-md text-xs">
                        GIF Animation
                      </span>
                      <a
                        href={
                          exercise.gifUrl.startsWith("http")
                            ? exercise.gifUrl
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, "") || process.env.NEXT_PUBLIC_API_URL || ""}${exercise.gifUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        Open in new tab
                      </a>
                    </div>
                  </div>
                )}
                {exercise.pngUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      PNG Image
                    </label>
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                      <div className="aspect-square">
                        <img
                          src={
                            exercise.pngUrl.startsWith("http")
                              ? exercise.pngUrl
                              : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, "") || process.env.NEXT_PUBLIC_API_URL || ""}${exercise.pngUrl}`
                          }
                          alt="Exercise Image"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-600">
                                  <div class="text-center">
                                    <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Image not available</p>
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md text-xs">
                        PNG Image
                      </span>
                      <a
                        href={
                          exercise.pngUrl.startsWith("http")
                            ? exercise.pngUrl
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1$/, "") || process.env.NEXT_PUBLIC_API_URL || ""}${exercise.pngUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        Open in new tab
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created At
                </label>
                <p className="text-gray-900 dark:text-white">{formatDate(exercise.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Updated At
                </label>
                <p className="text-gray-900 dark:text-white">{formatDate(exercise.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExerciseViewModal;
