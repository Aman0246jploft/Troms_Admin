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
import UserDetailsModal from "../modals/UserDetailsModal";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  platform: string;
  subStatus: string;
  createdAt: string;
  updatedAt: string;
  totalEarnings: number;
  userInformation: {
    id: string;
    gender: string;
    unit: string;
    age: number;
    trainingDay: number;
    height: number;
    weight: number;
    db: string;
    weightGoal: string;
    desiredWeight: number;
    weeklyWeightLossGoal: number;
    reachingGoals: string;
    accomplish: string[];
    isNotification: boolean;
    dietType: string;
    workoutLocation: string;
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
    healthScore: number;
    feedback: boolean;
    allergic_food_items: string[];
    cheat_meal_food_items: string[];
    disliked_food_items: string[];
    injuries: string[];
    accessible_equipments: string[];
    cooking_level: string;
    userSubscription: any[];
  };
}

interface UserManagementTableProps {
  users: User[];
}

export default function UserManagementTable({ users }: UserManagementTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      case "pending":
        return "warning";
      default:
        return "primary";
    }
  };

  const getSubStatusColor = (subStatus: string) => {
    switch (subStatus.toLowerCase()) {
      case "active":
        return "success";
      case "expired":
        return "error";
      case "notactive":
        return "warning";
      default:
        return "primary";
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (!users || users.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No users found
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
                    User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Platform
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Subscription
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Profile
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Joined
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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    {/* User Info */}
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {user.username}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Platform */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${
                          user.platform === "ios" ? "bg-gray-400" : 
                          user.platform === "android" ? "bg-green-500" : "bg-gray-300"
                        }`}></span>
                        {user.platform}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>

                    {/* Subscription Status */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={getSubStatusColor(user.subStatus)}>
                        {user.subStatus}
                      </Badge>
                    </TableCell>

                    {/* Profile Info */}
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="space-y-1">
                        <div className="text-xs">
                          {user.userInformation?.gender && (
                            <span>{user.userInformation.gender}, {user.userInformation.age}y</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.userInformation?.dietType && (
                            <span>{user.userInformation.dietType}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatDate(user.createdAt)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleViewUser(user)}
                        className="px-3 py-1"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </>
  );
} 