import type { Metadata } from "next";

import React from "react";
import ContactUsStatsWidget from "@/components/contactUs/ContactUsStatsWidget";


export const metadata: Metadata = {
  title:
    "Troms Dashboard",
  description: "Ai That Transform Your Fitness",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      
      {/* Contact Us Statistics Widget */}
      <div className="col-span-12 lg:col-span-6 xl:col-span-4">
        <ContactUsStatsWidget />
      </div>

      {/* Add more widgets here as needed */}
      <div className="col-span-12 lg:col-span-6 xl:col-span-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to Troms Admin Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage your fitness application from this central dashboard.
            Use the sidebar to navigate to different sections.
          </p>
        </div>
      </div>

      {/* Placeholder for future widgets */}
      {/* <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}
    </div>
  );
}
