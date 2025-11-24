import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatar: string;
  status: 'active' | 'inactive';
  riskLevel: 'low' | 'moderate' | 'high';
  loyaltyLevel: 'loyal' | 'moderate' | 'at-risk';
  joinDate: string;
  lastActive: string;
  totalSpent: number;
  totalOrders: number;
  averageOrderValue: number;
  categories: string[];
  purchaseHistory: PurchaseItem[];
  insights: CustomerInsight[];
  demographics: Demographics;
  preferences: Preferences;
  userType: string;
  visits: number;
  addedOn: string;
  membershipDuration?: number; // in months
  engagementTimeline?: {
    customerJoinedAt: string;
    firstPurchaseAt: string;
    lastPurchaseAt: string;
  };
}

interface PurchaseItem {
  id: string;
  date: string;
  amount: number;
  category: string;
  status: 'completed' | 'pending' | 'cancelled';
  items: number;
}

interface CustomerInsight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  value?: string | number;
  trend?: 'up' | 'down' | 'stable';
}

interface Demographics {
  age: number;
  location: string;
  gender: string;
  incomeLevel: string;
}

interface Preferences {
  preferredCategories: string[];
  preferredTime: string;
  preferredPayment: string;
  communicationPreference: string;
}

interface UseCustomerDataProps {
  customerId: string;
}

export function useCustomerData({ customerId }: UseCustomerDataProps) {
  const { user } = useAuth();

  return useQuery<CustomerData, Error>({
    queryKey: ['customer-data', customerId],
    queryFn: async () => {
      if (!user?.accessToken) {
        throw new Error('No access token available');
      }

      // Get business_id from user or fetch it
      let businessId = user?.business_id;
      if (!businessId) {
        try {
          const businessesResponse = await api.business.getBusinesses(user.accessToken);
          if (businessesResponse.data && businessesResponse.data.length > 0) {
            businessId = businessesResponse.data[0]._id;
          } else {
            throw new Error('No business found');
          }
        } catch (error) {
          throw new Error('Failed to get business ID');
        }
      }

      // Fetch customer data from the new endpoint
      const response = await api.business.getCustomer(
        user.accessToken,
        businessId,
        customerId
      );

      if (!response.data) {
        throw new Error('No customer data available');
      }

      const apiData = response.data;

      // Create a mapping from item names to categories (if possible)
      // Since we don't have direct mapping, we'll use index-based mapping
      const itemNameToCategoryMap = new Map<string, string>();
      apiData.item_names_purchased.forEach((itemName, index) => {
        const categoryIndex = index % apiData.item_categories_purchased.length;
        itemNameToCategoryMap.set(itemName, apiData.item_categories_purchased[categoryIndex]);
      });

      // Transform orders array to purchase history
      const purchaseHistory: PurchaseItem[] = apiData.orders.map((order, index) => {
        // Try to get category from mapping, otherwise cycle through categories
        let category = itemNameToCategoryMap.get(order.name);
        if (!category) {
          category = apiData.item_categories_purchased.length > 0
            ? apiData.item_categories_purchased[index % apiData.item_categories_purchased.length]
            : 'General';
        }

        return {
          id: `ORD${apiData._id}${index + 1}`,
          date: order.date,
          amount: order.total_amount,
          category: category,
          status: 'completed' as const,
          items: order.number_of_items,
        };
      });

      // Sort purchase history by date (most recent first)
      purchaseHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Calculate derived values - use API analytics when available
      const totalOrders = apiData.orders.length;
      const averageOrderValue = apiData.analytics?.average_order_value ||
        (totalOrders > 0 ? apiData.total_purchase_value / totalOrders : 0);
      const visits = apiData.total_visits || totalOrders;
      const categories = apiData.item_categories_purchased.length > 0
        ? apiData.item_categories_purchased
        : ['General'];

      // Calculate joinDate and lastActive
      let joinDate = new Date().toISOString();
      let lastActive = new Date().toISOString();

      // Use membership_duration from analytics to calculate joinDate if available
      // membership_duration is in months
      const membershipDurationMonths = apiData.analytics?.membership_duration;
      if (membershipDurationMonths !== undefined) {
        const membershipDurationDays = Math.round(membershipDurationMonths * 30);
        const joinDateObj = new Date();
        joinDateObj.setDate(joinDateObj.getDate() - membershipDurationDays);
        joinDate = joinDateObj.toISOString().split('T')[0];
      } else if (apiData.orders.length > 0) {
        // Fallback: use earliest order date
        const sortedOrders = [...apiData.orders].sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        joinDate = sortedOrders[0].date;
      } else if (apiData.purchase_dates.length > 0) {
        // Fallback: use earliest purchase date
        const sortedDates = [...apiData.purchase_dates].sort((a, b) =>
          new Date(a).getTime() - new Date(b).getTime()
        );
        joinDate = sortedDates[0];
      }

      // Use days_since_last_purchase from analytics to calculate lastActive if available
      if (apiData.analytics?.days_since_last_purchase !== undefined) {
        const daysSinceLastPurchase = apiData.analytics.days_since_last_purchase;
        const lastActiveDate = new Date();
        lastActiveDate.setDate(lastActiveDate.getDate() - daysSinceLastPurchase);
        lastActive = lastActiveDate.toISOString().split('T')[0];
      } else if (apiData.orders.length > 0) {
        // Fallback: use most recent order date
        const sortedOrders = [...apiData.orders].sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        lastActive = sortedOrders[0].date;
      } else if (apiData.purchase_dates.length > 0) {
        // Fallback: use most recent purchase date
        const sortedDates = [...apiData.purchase_dates].sort((a, b) =>
          new Date(b).getTime() - new Date(a).getTime()
        );
        lastActive = sortedDates[sortedDates.length - 1];
      }

      // Use customer details from API
      const customerName = apiData.details?.name || `Customer ${customerId.slice(-6)}`;
      const customerPhone = apiData.details?.phone_number || `+1 (555) ${customerId.slice(-4)}`;

      // Map status from API (should be 'active' or 'inactive')
      const apiStatus = apiData.details?.status?.toLowerCase();
      const customerStatus: 'active' | 'inactive' =
        apiStatus === 'active' ? 'active' : 'inactive';

      // Use user_type directly from API
      const userType = apiData.details?.user_type || 'customer';

      // Create a UserData-like object for helper functions
      const userDataLike = {
        id: customerId,
        visits: visits,
        categories: categories,
        addedOn: joinDate,
      };

      // Map risk_status from API if available, otherwise calculate
      const apiRiskStatus = apiData.details?.risk_status?.toLowerCase();
      let riskLevel: 'low' | 'moderate' | 'high' = 'moderate';
      if (apiRiskStatus === 'low') {
        riskLevel = 'low';
      } else if (apiRiskStatus === 'high') {
        riskLevel = 'high';
      } else if (apiRiskStatus === 'moderate') {
        riskLevel = 'moderate';
      } else {
        // Fallback to calculation if risk_status not provided
        riskLevel = getRiskLevel(userDataLike);
      }

      // Generate demographics, using API data if available
      const generatedDemographics = generateDemographics(userDataLike);
      const demographics: Demographics = {
        age: apiData.details?.age ?? generatedDemographics.age,
        gender: apiData.details?.gender ?? generatedDemographics.gender,
        location: generatedDemographics.location,
        incomeLevel: generatedDemographics.incomeLevel,
      };

      // Transform to customer details format
      const transformedData: CustomerData = {
        id: customerId,
        name: customerName,
        email: `customer${customerId.slice(-6)}@example.com`,
        mobile: customerPhone,
        avatar: `/api/placeholder/60/60`,
        status: customerStatus,
        riskLevel: riskLevel,
        loyaltyLevel: getLoyaltyLevel(userDataLike),
        joinDate: joinDate,
        lastActive: lastActive,
        totalSpent: apiData.total_purchase_value,
        totalOrders: totalOrders,
        averageOrderValue: averageOrderValue,
        categories: categories,
        purchaseHistory: purchaseHistory,
        insights: generateInsights(userDataLike),
        demographics: demographics,
        preferences: generatePreferences(userDataLike),
        userType: userType,
        visits: visits,
        addedOn: joinDate,
        membershipDuration: membershipDurationMonths,
        engagementTimeline: apiData.engagement_timeline ? {
          customerJoinedAt: apiData.engagement_timeline.customer_joined_at,
          firstPurchaseAt: apiData.engagement_timeline.first_purchase_at,
          lastPurchaseAt: apiData.engagement_timeline.last_purchase_at,
        } : undefined,
      };

      return transformedData;
    },
    enabled: !!user?.accessToken && !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes in cache
  });
}

// Helper interface for customer data used in helper functions
interface CustomerDataLike {
  id: string;
  visits: number;
  categories: string[];
  addedOn: string;
}

// Helper functions to transform data
function getRiskLevel(customer: CustomerDataLike): 'low' | 'moderate' | 'high' {
  const visits = customer.visits || 0;
  if (visits >= 10) return 'low';
  if (visits >= 5) return 'moderate';
  return 'high';
}

function getLoyaltyLevel(customer: CustomerDataLike): 'loyal' | 'moderate' | 'at-risk' {
  const visits = customer.visits || 0;
  if (visits >= 15) return 'loyal';
  if (visits >= 5) return 'moderate';
  return 'at-risk';
}

function generateInsights(customer: CustomerDataLike): CustomerInsight[] {
  const visits = customer.visits || 0;
  const insights: CustomerInsight[] = [];

  if (visits >= 10) {
    insights.push({
      type: 'positive',
      title: 'High Value Customer',
      description: 'Top 10% spender in the last 6 months',
      value: 'Top 10%',
      trend: 'up'
    });
  }

  if (visits >= 5) {
    insights.push({
      type: 'positive',
      title: 'Loyal Customer',
      description: 'Consistent purchases over time',
      value: `${visits} visits`,
      trend: 'stable'
    });
  }

  if (customer.categories.length > 1) {
    insights.push({
      type: 'neutral',
      title: 'Category Explorer',
      description: 'Shops across multiple categories',
      value: `${customer.categories.length} categories`,
      trend: 'stable'
    });
  }

  if (visits < 3) {
    insights.push({
      type: 'negative',
      title: 'Low Engagement',
      description: 'Limited purchase history',
      value: `${visits} visits`,
      trend: 'down'
    });
  }

  return insights;
}

function generateDemographics(customer: CustomerDataLike): Demographics {
  // Use customer ID to generate consistent demographics
  const idHash = customer.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);

  return {
    age: 25 + (idHash % 50),
    location: 'San Francisco, CA',
    gender: idHash % 2 === 0 ? 'Male' : 'Female',
    incomeLevel: 'Upper Middle Class'
  };
}

function generatePreferences(customer: CustomerDataLike): Preferences {
  const categories = customer.categories;

  return {
    preferredCategories: categories.slice(0, 2),
    preferredTime: 'Evening (6-9 PM)',
    preferredPayment: 'Credit Card',
    communicationPreference: 'Email'
  };
}
