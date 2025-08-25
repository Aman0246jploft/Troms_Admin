"use client";
import React from "react";
import {Modal} from "../ui/modal";
import Badge from "../ui/badge/Badge";
import { CloseIcon } from "../../icons";

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

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  if (!user) return null;

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
      case "active": return "success";
      case "inactive": return "error";
      case "pending": return "warning";
      default: return "primary";
    }
  };

  const getSubStatusColor = (subStatus: string) => {
    switch (subStatus.toLowerCase()) {
      case "active": return "success";
      case "expired": return "error";
      case "notactive": return "warning";
      default: return "primary";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative  rounded-lg shadow-xl  w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</label>
                  <p className="text-gray-900 dark:text-white">{user.username}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
                  <div className="mt-1">
                    <Badge size="sm" color={user.role === "SUPER_ADMIN" ? "success" : "primary"}>
                      {user.role.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                    <div className="mt-1">
                      <Badge size="sm" color={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription</label>
                    <div className="mt-1">
                      <Badge size="sm" color={getSubStatusColor(user.subStatus)}>
                        {user.subStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Platform</label>
                    <p className="text-gray-900 dark:text-white capitalize">{user.platform}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</label>
                    <p className="text-gray-900 dark:text-white">${user.totalEarnings}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Profile Information
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</label>
                    <p className="text-gray-900 dark:text-white">{user.userInformation?.gender || "N/A"}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</label>
                    <p className="text-gray-900 dark:text-white">{user.userInformation?.age || "N/A"} years</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Height</label>
                    <p className="text-gray-900 dark:text-white">
                      {user.userInformation?.height ? `${user.userInformation.height.toFixed(1)} cm` : "N/A"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight</label>
                    <p className="text-gray-900 dark:text-white">
                      {user.userInformation?.weight ? `${user.userInformation.weight.toFixed(1)} ${user.userInformation.unit}` : "N/A"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Weight Goal</label>
                  <p className="text-gray-900 dark:text-white">
                    {user.userInformation?.weightGoal?.replace("_", " ") || "N/A"}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Diet Type</label>
                  <p className="text-gray-900 dark:text-white">{user.userInformation?.dietType || "N/A"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Workout Location</label>
                  <p className="text-gray-900 dark:text-white">{user.userInformation?.workoutLocation || "N/A"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Training Days</label>
                  <p className="text-gray-900 dark:text-white">{user.userInformation?.trainingDay || 0} days/week</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Health Score</label>
                  <p className="text-gray-900 dark:text-white">{user.userInformation?.healthScore || 0}/10</p>
                </div>
              </div>
            </div>

            {/* Nutrition Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Nutrition Information
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories</label>
                    <p className="text-gray-900 dark:text-white">{user.userInformation?.calories || 0} kcal</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Protein</label>
                    <p className="text-gray-900 dark:text-white">{user.userInformation?.protein?.toFixed(1) || 0}g</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Carbs</label>
                    <p className="text-gray-900 dark:text-white">{user.userInformation?.carbs?.toFixed(1) || 0}g</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Fat</label>
                    <p className="text-gray-900 dark:text-white">{user.userInformation?.fat?.toFixed(1) || 0}g</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences & Restrictions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preferences & Restrictions
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Allergic Foods</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.userInformation?.allergic_food_items?.length > 0 ? (
                      user.userInformation.allergic_food_items.map((item, index) => (
                        <Badge key={index} size="sm" color="error">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">None</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Disliked Foods</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.userInformation?.disliked_food_items?.length > 0 ? (
                      user.userInformation.disliked_food_items.map((item, index) => (
                        <Badge key={index} size="sm" color="warning">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">None</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Cheat Meals</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.userInformation?.cheat_meal_food_items?.length > 0 ? (
                      user.userInformation.cheat_meal_food_items.map((item, index) => (
                        <Badge key={index} size="sm" color="success">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">None</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Injuries</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.userInformation?.injuries?.length > 0 ? (
                      user.userInformation.injuries.map((injury, index) => (
                        <Badge key={index} size="sm" color="error">
                          {injury}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">None</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Cooking Level</label>
                  <p className="text-gray-900 dark:text-white">{user.userInformation?.cooking_level || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Subscription History
              </h3>
              
              {user.userInformation?.userSubscription?.length > 0 ? (
                <div className="space-y-3">
                  {user.userInformation.userSubscription.slice(0, 3).map((subscription, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                          <p className="text-gray-900 dark:text-white">{subscription.type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                          <Badge size="sm" color={subscription.status === "ACTIVE" ? "success" : "error"}>
                            {subscription.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Platform</label>
                          <p className="text-gray-900 dark:text-white capitalize">{subscription.platform}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry</label>
                          <p className="text-gray-900 dark:text-white">
                            {new Date(subscription.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {user.userInformation.userSubscription.length > 3 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      +{user.userInformation.userSubscription.length - 3} more subscriptions
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No subscription history</p>
              )}
            </div>

            {/* Timestamps */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">

        </div>
      </div>
    </Modal>
  );
} 