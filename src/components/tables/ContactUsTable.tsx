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
import { useAppDispatch } from "@/store/hooks/redux";
import { updateContactUsStatus, deleteContactUsMessage } from "@/store/slices/contactUs";

interface ContactUsMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

interface ContactUsTableProps {
  messages: ContactUsMessage[];
  onRefresh?: () => void;
}

export default function ContactUsTable({ messages, onRefresh }: ContactUsTableProps) {
  const dispatch = useAppDispatch();
  const [selectedMessage, setSelectedMessage] = useState<ContactUsMessage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'warning' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'info' },
    { value: 'RESOLVED', label: 'Resolved', color: 'success' },
    { value: 'CLOSED', label: 'Closed', color: 'light' },
  ];

  const getStatusBadgeColor = (status: string): 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark' => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'RESOLVED':
        return 'success';
      case 'CLOSED':
        return 'light';
      default:
        return 'light';
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (newStatus === messages.find(m => m.id === id)?.status) return;
    
    setUpdatingStatus(id);
    try {
      await dispatch(updateContactUsStatus({ id, status: newStatus })).unwrap();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await dispatch(deleteContactUsMessage(id)).unwrap();
      setShowDeleteConfirm(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setDeleting(null);
    }
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

  const truncateMessage = (message: string, maxLength: number = 100) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-semibold px-4 py-3">Name</TableCell>
              <TableCell className="font-semibold px-4 py-3">Email</TableCell>
              <TableCell className="font-semibold px-4 py-3">Subject</TableCell>
              <TableCell className="font-semibold px-4 py-3">Message</TableCell>
              <TableCell className="font-semibold px-4 py-3">Status</TableCell>
              <TableCell className="font-semibold px-4 py-3">Date</TableCell>
              <TableCell className="font-semibold px-4 py-3 text-center">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id} className="border-b border-gray-200 dark:border-gray-700">
                <TableCell className="font-medium px-4 py-4">
                  <div className="max-w-[120px] truncate">{message.name}</div>
                </TableCell>
                <TableCell className="text-blue-600 px-4 py-4">
                  <div className="max-w-[160px] truncate">{message.email}</div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="max-w-[150px] truncate" title={message.subject}>
                    {message.subject}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div 
                    className="max-w-[200px] cursor-pointer hover:text-blue-600 truncate"
                    onClick={() => setSelectedMessage(message)}
                    title="Click to view full message"
                  >
                    {truncateMessage(message.message)}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <select
                    value={message.status}
                    onChange={(e) => handleStatusUpdate(message.id, e.target.value)}
                    disabled={updatingStatus === message.id}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {updatingStatus === message.id && (
                    <div className="mt-1 text-xs text-blue-600">Updating...</div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400 px-4 py-4">
                  <div className="max-w-[100px]">
                    {formatDate(message.createdAt)}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedMessage(message)}
                      className="text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowDeleteConfirm(message.id)}
                      disabled={deleting === message.id}
                      className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300 bg-transparent hover:bg-red-50"
                    >
                      {deleting === message.id ? 'Deleting...' : 'Delete'}
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
        {messages.map((message) => (
          <div key={message.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {message.name}
                </h3>
                <p className="text-sm text-blue-600 truncate">{message.email}</p>
              </div>
              <div className="ml-2">
                <Badge color={getStatusBadgeColor(message.status)} variant="light">
                  {message.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            {/* Subject */}
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">Subject:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{message.subject}</p>
            </div>

            {/* Message Preview */}
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">Message:</p>
              <p 
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600"
                onClick={() => setSelectedMessage(message)}
              >
                {truncateMessage(message.message, 80)}
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(message.createdAt)}
              </p>
            </div>

            {/* Status Update */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update Status:
              </label>
              <select
                value={message.status}
                onChange={(e) => handleStatusUpdate(message.id, e.target.value)}
                disabled={updatingStatus === message.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {updatingStatus === message.id && (
                <div className="mt-1 text-xs text-blue-600">Updating...</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedMessage(message)}
                className="flex-1 text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300"
              >
                View Full Message
              </Button>
              <Button
                size="sm"
                onClick={() => setShowDeleteConfirm(message.id)}
                disabled={deleting === message.id}
                className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300 bg-transparent hover:bg-red-50"
              >
                {deleting === message.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0    bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Contact Message Details</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedMessage.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-blue-600">{selectedMessage.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedMessage.subject}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <Badge color={getStatusBadgeColor(selectedMessage.status)} variant="light">
                      {selectedMessage.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Received
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setSelectedMessage(null)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0    bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this contact message? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={deleting === showDeleteConfirm}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deleting === showDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting === showDeleteConfirm ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
