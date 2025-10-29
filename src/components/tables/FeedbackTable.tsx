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
import { Modal } from "../ui/modal";

interface Feedback {
  id: string;
  userId: string;
  rating: string;
  workoutrating: string;
  mealrating: string;
  review: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    status: string;
  } | null;
}

interface FeedbackTableProps {
  feedbacks: Feedback[];
  onRefresh?: () => void;
}

export default function FeedbackTable({ feedbacks, onRefresh }: FeedbackTableProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const getBadgeColor = (value: string) => {
    const val = value.toLowerCase();
    if (["excellent", "good", "great", "awesome"].some(v => val.includes(v))) return "success";
    if (["average", "ok", "fine"].some(v => val.includes(v))) return "warning";
    if (["poor", "bad"].some(v => val.includes(v))) return "error";
    return "info";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateReview = (review: string, maxLength: number = 100) =>
    review.length > maxLength ? review.substring(0, maxLength) + "..." : review;

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-semibold px-4 py-3">User</TableCell>
              {/* <TableCell className="font-semibold px-4 py-3">Ratings</TableCell> */}
              <TableCell className="font-semibold px-4 py-3">Review</TableCell>
              {/* <TableCell className="font-semibold px-4 py-3">Images</TableCell> */}
              <TableCell className="font-semibold px-4 py-3">Date</TableCell>
              <TableCell className="font-semibold px-4 py-3 text-center">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback.id} className="border-b border-gray-200 dark:border-gray-700">
                {/* User Info */}
                <TableCell className="px-4 py-4">
                  {feedback.user ? (
                    <div>
                      <div className="font-medium">{feedback.user.username}</div>
                      <div className="text-sm text-blue-600">{feedback.user.email}</div>
                      <div className="text-xs text-gray-500">ID: {feedback.userId}</div>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <div>User not found</div>
                      <div className="text-xs">ID: {feedback.userId}</div>
                    </div>
                  )}
                </TableCell>

                {/* Ratings */}
                {/* <TableCell className="px-4 py-4 space-y-1">
                  <div>
                    <span className="font-medium text-sm">Overall: </span>
                    <Badge color={getBadgeColor(feedback.rating)} variant="light">
                      {feedback.rating || "N/A"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Workout: </span>
                    <Badge color={getBadgeColor(feedback.workoutrating)} variant="light">
                      {feedback.workoutrating || "N/A"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Meal: </span>
                    <Badge color={getBadgeColor(feedback.mealrating)} variant="light">
                      {feedback.mealrating || "N/A"}
                    </Badge>
                  </div>
                </TableCell> */}

                {/* Review */}
                <TableCell className="px-4 py-4">
                  <div
                    className="max-w-[300px] cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedFeedback(feedback)}
                  >
                    {truncateReview(feedback.review)}
                  </div>
                </TableCell>

                {/* Images */}
                {/* <TableCell className="px-4 py-4">
                  {feedback.image?.length > 0 ? (
                    <div className="flex gap-2">
                      {feedback.image.slice(0, 3).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Feedback"
                          className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80"
                          onClick={() => setSelectedFeedback(feedback)}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No images</span>
                  )}
                </TableCell> */}

                {/* Date */}
                <TableCell className="px-4 py-4 text-sm text-gray-500">
                  {formatDate(feedback.createdAt)}
                </TableCell>

                {/* Actions */}
                <TableCell className="px-4 py-4 text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedFeedback(feedback)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <Modal isOpen={!!selectedFeedback} onClose={() => setSelectedFeedback(null)}>
        {selectedFeedback && (
          <div className="p-6 border rounded-lg space-y-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">Feedback Details</h3>
              <button onClick={() => setSelectedFeedback(null)} className="text-gray-400 hover:text-gray-600 text-xl">
                ×
              </button>
            </div>

            {/* User Info */}
            <div>
              <h4 className="text-sm font-medium text-gray-600">User Info</h4>
              {selectedFeedback.user ? (
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {selectedFeedback.user.username}</p>
                  <p><strong>Email:</strong> {selectedFeedback.user.email}</p>
                  <p><strong>User ID:</strong> {selectedFeedback.userId}</p>
                </div>
              ) : (
                <p className="text-gray-400">User info unavailable</p>
              )}
            </div>

            {/* Ratings */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">Ratings</h4>
              <div className="space-y-1">
                <div>
                  <strong>Overall:</strong>{" "}
                  <Badge color={getBadgeColor(selectedFeedback.rating)} variant="light">
                    {selectedFeedback.rating}
                  </Badge>
                </div>
                <div>
                  <strong>Workout:</strong>{" "}
                  <Badge color={getBadgeColor(selectedFeedback.workoutrating)} variant="light">
                    {selectedFeedback.workoutrating}
                  </Badge>
                </div>
                <div>
                  <strong>Meal:</strong>{" "}
                  <Badge color={getBadgeColor(selectedFeedback.mealrating)} variant="light">
                    {selectedFeedback.mealrating}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Review */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">Review</h4>
              <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                {selectedFeedback.review}
              </p>
            </div>

            {/* Images */}
            {selectedFeedback.image?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedFeedback.image.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Feedback ${i + 1}`}
                      className="rounded-lg border object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="flex gap-6 pt-2">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Created</h4>
                <p className="text-sm text-gray-500">{formatDate(selectedFeedback.createdAt)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Updated</h4>
                <p className="text-sm text-gray-500">{formatDate(selectedFeedback.updatedAt)}</p>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
