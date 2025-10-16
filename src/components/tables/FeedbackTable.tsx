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
  review: string;
  image: string;
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

  const getRatingBadgeColor = (rating: string): 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark' => {
    const ratingNum = parseInt(rating);
    switch (ratingNum) {
      case 5:
        return 'success';
      case 4:
        return 'info';
      case 3:
        return 'warning';
      case 2:
      case 1:
        return 'error';
      default:
        return 'light';
    }
  };

  const renderStars = (rating: string) => {
    const ratingNum = parseInt(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${i <= ratingNum ? 'text-yellow-400' : 'text-gray-300'
            }`}
        >
          ⭐
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateReview = (review: string, maxLength: number = 100) => {
    return review.length > maxLength ? review.substring(0, maxLength) + '...' : review;
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-semibold px-4 py-3">User</TableCell>
              <TableCell className="font-semibold px-4 py-3">Rating</TableCell>
              <TableCell className="font-semibold px-4 py-3">Review</TableCell>
              <TableCell className="font-semibold px-4 py-3">Image</TableCell>
              <TableCell className="font-semibold px-4 py-3">Date</TableCell>
              <TableCell className="font-semibold px-4 py-3 text-center">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={feedback.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="font-medium px-4 py-4">
                  <div className="max-w-[200px]">
                    {feedback.user ? (
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {feedback.user.username || 'N/A'}
                        </div>
                        <div className="text-sm text-blue-600 truncate">
                          {feedback.user.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {feedback.userId}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400">
                        <div className="text-sm">User not found</div>
                        <div className="text-xs">ID: {feedback.userId}</div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {renderStars(feedback.rating)}
                    <Badge color={getRatingBadgeColor(feedback.rating)} variant="light">
                      {feedback.rating} Star{feedback.rating !== '1' ? 's' : ''}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div
                    className="max-w-[300px] cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedFeedback(feedback)}
                    title="Click to view full review"
                  >
                    {truncateReview(feedback.review)}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  {feedback.image ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={feedback.image}
                        alt="Feedback"
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                        onClick={() => setSelectedFeedback(feedback)}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400 px-4 py-4">
                  <div className="max-w-[120px]">
                    {formatDate(feedback.createdAt)}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedFeedback(feedback)}
                      className="text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300"
                    >
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {feedback.user ? (
                    <div>
                      <div>{feedback.user.username || 'N/A'}</div>
                      <div className="text-sm text-blue-600 truncate">{feedback.user.email}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-500">User not found</div>
                      <div className="text-sm text-gray-400">ID: {feedback.userId}</div>
                    </div>
                  )}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {renderStars(feedback.rating)}
                  <Badge color={getRatingBadgeColor(feedback.rating)} variant="light">
                    {feedback.rating} Star{feedback.rating !== '1' ? 's' : ''}
                  </Badge>
                </div>
              </div>
              <div className="ml-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(feedback.createdAt)}
                </p>
              </div>
            </div>

            {/* Review Preview */}
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">Review:</p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600"
                onClick={() => setSelectedFeedback(feedback)}
              >
                {truncateReview(feedback.review, 80)}
              </p>
            </div>

            {/* Image */}
            {feedback.image && (
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">Image:</p>
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img
                    src={feedback.image}
                    alt="Feedback"
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedFeedback(feedback)}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedFeedback(feedback)}
                className="flex-1 text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300"
              >
                View Full Review
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Details Modal */}

      <Modal isOpen={!!selectedFeedback} onClose={() => setSelectedFeedback(null)}>
        <div className="p-6 border rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Feedback Details</h3>
            <button
              onClick={() => setSelectedFeedback(null)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                User Information
              </label>
              {selectedFeedback?.user ? (
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedFeedback?.user.username || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email: </span>
                    <span className="text-blue-600">{selectedFeedback?.user.email}</span>
                  </div>
                  {/* <div>
                    <span className="text-sm font-medium text-gray-600">Role: </span>
                    <Badge color="info" variant="light">{selectedFeedback?.user.role}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status: </span>
                    <Badge color={selectedFeedback?.user.status === 'ACTIVE' ? 'success' : 'warning'} variant="light">
                      {selectedFeedback?.user.status}
                    </Badge>
                  </div> */}
                  <div>
                    <span className="text-sm font-medium text-gray-600">User ID: </span>
                    <span className="text-gray-500 font-mono text-sm">{selectedFeedback?.userId}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  <p>User information not available</p>
                  <p className="text-sm font-mono">ID: {selectedFeedback?.userId}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rating
              </label>
              <div className="flex items-center gap-3">
                {renderStars(selectedFeedback?.rating)}
                <Badge color={getRatingBadgeColor(selectedFeedback?.rating)} variant="light">
                  {selectedFeedback?.rating} Star{selectedFeedback?.rating !== '1' ? 's' : ''}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Review
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                  {selectedFeedback?.review}
                </p>
              </div>
            </div>

            {selectedFeedback?.image && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image
                </label>
                <div className="max-w-md">
                  <img
                    src={selectedFeedback?.image}
                    alt="Feedback"
                    className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Created
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(selectedFeedback?.createdAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Updated
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(selectedFeedback?.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setSelectedFeedback(null)}
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>


    </>
  );
}
