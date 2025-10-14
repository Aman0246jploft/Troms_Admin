"use client";
import React, { useState, useEffect } from "react";

import Button from "../ui/button/Button";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { updateExercise } from "@/store/slices/exercise";
import { toast } from "react-hot-toast";
import { Modal } from "../ui/modal";

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

export default function ExerciseEditModal({ 
  isOpen, 
  onClose, 
  exercise,
  onSuccess 
}: ExerciseEditModalProps) {
  const dispatch = useAppDispatch();
  const { updating } = useAppSelector(state => state.exercise);

  const [formData, setFormData] = useState({
    name: "",
    equipment: "",
    gifUrl: "",
    pngUrl: "",
    status: "ACTIVE"
  });

  const [selectedFiles, setSelectedFiles] = useState({
    gifFile: null as File | null,
    pngFile: null as File | null,
  });

  // Update form data when exercise changes
  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name || "",
        equipment: exercise.equipment || "",
        gifUrl: exercise.gifUrl || "",
        pngUrl: exercise.pngUrl || "",
        status: exercise.status || "ACTIVE"
      });
    }
  }, [exercise]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setSelectedFiles(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exercise) return;

    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('equipment', formData.equipment);
      formDataToSend.append('status', formData.status);
      
      // Add files if selected
      if (selectedFiles.gifFile) {
        formDataToSend.append('gifFile', selectedFiles.gifFile);
      }
      if (selectedFiles.pngFile) {
        formDataToSend.append('pngFile', selectedFiles.pngFile);
      }
      
      // Add existing URLs if no new files are selected
      if (!selectedFiles.gifFile && formData.gifUrl) {
        formDataToSend.append('gifUrl', formData.gifUrl);
      }
      if (!selectedFiles.pngFile && formData.pngUrl) {
        formDataToSend.append('pngUrl', formData.pngUrl);
      }

      await dispatch(updateExercise({
        id: exercise.id,
        formData: formDataToSend
      })).unwrap();
      
      toast.success("Exercise updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update exercise");
    }
  };

  if (!exercise) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exercise Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Exercise Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Equipment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Equipment
          </label>
          <input
            type="text"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* GIF File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GIF File (Optional)
          </label>
          <input
            type="file"
            name="gifFile"
            accept=".gif,image/gif"
            onChange={handleFileChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedFiles.gifFile && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Selected: {selectedFiles.gifFile.name}
            </p>
          )}
          {!selectedFiles.gifFile && formData.gifUrl && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Current: {formData.gifUrl}
            </p>
          )}
        </div>

        {/* PNG File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            PNG File (Optional)
          </label>
          <input
            type="file"
            name="pngFile"
            accept=".png,image/png"
            onChange={handleFileChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedFiles.pngFile && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Selected: {selectedFiles.pngFile.name}
            </p>
          )}
          {!selectedFiles.pngFile && formData.pngUrl && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Current: {formData.pngUrl}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* Exercise Details (Read-only) */}
        {exercise.json && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exercise Details
            </label>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05]">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {exercise.json.bodyPart && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Body Part:</span>{" "}
                    <span className="text-gray-900 dark:text-white">{exercise.json.bodyPart}</span>
                  </div>
                )}
                {exercise.json.target && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Target:</span>{" "}
                    <span className="text-gray-900 dark:text-white">{exercise.json.target}</span>
                  </div>
                )}
                {exercise.json.difficulty && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Difficulty:</span>{" "}
                    <span className="text-gray-900 dark:text-white">{exercise.json.difficulty}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.05]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Exercise"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

