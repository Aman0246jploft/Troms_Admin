"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";
import { fetchContactUsStats } from "@/store/slices/contactUs";
import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import { MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

export default function ContactUsStatsWidget() {
  const dispatch = useAppDispatch();
  const { contactUsStats, statsLoading } = useAppSelector(state => state.contactUs);

  useEffect(() => {
    dispatch(fetchContactUsStats());
  }, [dispatch]);

  if (statsLoading) {
    return (
      <ComponentCard title="Contact Us Overview">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </ComponentCard>
    );
  }

  if (!contactUsStats) {
    return (
      <ComponentCard title="Contact Us Overview">
        <div className="text-center py-8 text-gray-500">
          Unable to load contact statistics
        </div>
      </ComponentCard>
    );
  }

  const stats = [
    {
      label: "Total Messages",
      value: contactUsStats.totalMessages,
      icon: <MessageSquare className="w-6 h-6" />,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Pending",
      value: contactUsStats.statusBreakdown.pending,
      icon: <Clock className="w-6 h-6" />,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      label: "In Progress",
      value: contactUsStats.statusBreakdown.inProgress,
      icon: <MessageSquare className="w-6 h-6" />,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Resolved",
      value: contactUsStats.statusBreakdown.resolved,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  const getStatusPercentage = (value: number) => {
    return contactUsStats.totalMessages > 0 
      ? ((value / contactUsStats.totalMessages) * 100).toFixed(1)
      : "0";
  };

  return (
    <ComponentCard title="Contact Us Overview">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`${stat.bgColor} p-4 rounded-lg border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  {index > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {getStatusPercentage(stat.value)}% of total
                    </p>
                  )}
                </div>
                <div className={`${stat.color} text-white p-2 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Status Distribution
          </h4>
          <div className="space-y-2">
            {[
              { label: "Pending", value: contactUsStats.statusBreakdown.pending, color: "bg-orange-500" },
              { label: "In Progress", value: contactUsStats.statusBreakdown.inProgress, color: "bg-blue-500" },
              { label: "Resolved", value: contactUsStats.statusBreakdown.resolved, color: "bg-green-500" },
              { label: "Closed", value: contactUsStats.statusBreakdown.closed, color: "bg-gray-500" }
            ].map((item, index) => {
              const percentage = contactUsStats.totalMessages > 0 
                ? (item.value / contactUsStats.totalMessages) * 100 
                : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.value}
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <a 
            href="/contactUs"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            View All Messages
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </ComponentCard>
  );
}
