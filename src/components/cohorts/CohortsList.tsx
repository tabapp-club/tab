"use client";

import { useState, useEffect } from "react";
import { CohortCard } from "./CohortCard";

// Sample data matching the Figma design
const cohortsData = [
  {
    id: "mobile-buyers",
    name: "All mobile phone buyers",
    count: 6958,
    category: "Mobile phone buyers",
    createdBy: "tab AI",
    createdDate: "05-07-2025",
    description: "This cohort consists data of all the users who bought mobiles phones. this has the data of both iOS and Android with all ticket sizes"
  },
  {
    id: "android-buyers",
    name: "Android buyers",
    count: 4958,
    category: "Mobile phone buyers",
    createdBy: "tab AI",
    createdDate: "05-07-2025",
    description: "This cohort consists data of all the users who bought mobiles phones. this has the data of both iOS and Android with all ticket sizes"
  },
  {
    id: "ios-buyers",
    name: "iOS buyers",
    count: 1958,
    category: "Mobile phone buyers",
    createdBy: "tab AI",
    createdDate: "05-07-2025",
    description: "This cohort consists data of all the users who bought mobiles phones. this has the data of both iOS and Android with all ticket sizes"
  },
  {
    id: "appliances-buyers",
    name: "Home appliances buyers",
    count: 9556,
    category: "Home appliances buyers",
    createdBy: "tab AI",
    createdDate: "05-07-2025",
    description: "This cohort consists data of all the users who bought home appliances. This includes kitchen appliances, washing machines, and other household items"
  },
  {
    id: "laptop-buyers",
    name: "Laptop buyers",
    count: 2556,
    category: "Electronics buyers",
    createdBy: "tab AI",
    createdDate: "05-07-2025",
    description: "This cohort consists data of all the users who bought laptops. This includes both gaming laptops and business laptops across different price ranges"
  }
];

export interface CohortData {
  id: string;
  name: string;
  count: number;
  category: string;
  createdBy: string;
  createdDate: string;
  description: string;
}

interface CohortsListProps {
  cohorts?: CohortData[];
  searchTerm?: string;
  onCohortsUpdate?: (cohorts: CohortData[]) => void;
}

export function CohortsList({
  cohorts = cohortsData,
  searchTerm = '',
  onCohortsUpdate
}: CohortsListProps) {
  const [filteredCohorts, setFilteredCohorts] = useState<CohortData[]>([]);

    useEffect(() => {
    const filtered = cohorts.filter(cohort => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        cohort.name.toLowerCase().includes(searchLower) ||
        cohort.category.toLowerCase().includes(searchLower) ||
        cohort.createdBy.toLowerCase().includes(searchLower) ||
        cohort.description.toLowerCase().includes(searchLower)
      );
    });

    setFilteredCohorts(filtered);
    if (onCohortsUpdate) {
      onCohortsUpdate(filtered);
    }
  }, [searchTerm, cohorts, onCohortsUpdate]);

  return (
    <div className="space-y-4 mt-6">
      {filteredCohorts.length > 0 ? (
        filteredCohorts.map((cohort) => (
          <CohortCard key={cohort.id} cohort={cohort} />
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-base">
            No cohorts found matching &quot;{searchTerm}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
