import { useState, useEffect } from 'react';
import { useDataCenterData } from './useDataCenterData';
import { DataCenterFilters } from '@/lib/api';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: 'sales' | 'customers' | 'engagement' | 'retention';
  status: 'active' | 'completed' | 'overdue';
  deadline: string;
  progress: number;
  icon: string;
  color: string;
}

export interface AISuggestedTarget {
  id: string;
  title: string;
  description: string;
  rationale: string;
  target: number;
  unit: string;
  category: 'sales' | 'customers' | 'engagement' | 'retention';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  dataPoints: string[];
}

export interface AIMetric {
  id: string;
  title: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  insight: string;
  recommendation: string;
}

export function useAchievementsData() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [aiTargets, setAiTargets] = useState<AISuggestedTarget[]>([]);
  const [aiMetrics, setAiMetrics] = useState<AIMetric[]>([]);
  const [loading, setLoading] = useState(true);

  // Get data center data for AI analysis
  const { data: dataCenterData } = useDataCenterData({
    page: 1,
    pageSize: 100,
    filters: {
      category: undefined,
      user_type: undefined,
      no_of_visits_from: undefined,
      no_of_visits_to: undefined,
      status: undefined,
      search: undefined,
    } as any // Type assertion since the hook expects different interface
  });

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Mock data - in real app, this would come from API
    const mockMilestones: Milestone[] = [
      {
        id: '1',
        title: 'Reach 10K Active Users',
        description: 'Increase active user base to 10,000 users',
        target: 10000,
        current: 8200,
        unit: 'users',
        category: 'customers',
        status: 'active',
        deadline: '2024-12-31',
        progress: 82,
        icon: '👥',
        color: 'bg-blue-500'
      },
      {
        id: '2',
        title: 'Achieve ₹50L Monthly Revenue',
        description: 'Hit monthly revenue target of ₹50 lakhs',
        target: 5000000,
        current: 4200000,
        unit: '₹',
        category: 'sales',
        status: 'active',
        deadline: '2024-11-30',
        progress: 84,
        icon: '💰',
        color: 'bg-green-500'
      },
      {
        id: '3',
        title: 'Improve Customer Retention to 85%',
        description: 'Increase customer retention rate to 85%',
        target: 85,
        current: 78,
        unit: '%',
        category: 'retention',
        status: 'active',
        deadline: '2024-12-15',
        progress: 92,
        icon: '🔄',
        color: 'bg-purple-500'
      },
      {
        id: '4',
        title: 'Boost Engagement Rate to 65%',
        description: 'Increase user engagement rate to 65%',
        target: 65,
        current: 58,
        unit: '%',
        category: 'engagement',
        status: 'active',
        deadline: '2024-11-15',
        progress: 89,
        icon: '📈',
        color: 'bg-orange-500'
      }
    ];

    setMilestones(mockMilestones);

    // Generate AI suggestions based on data center data
    const generateAISuggestions = () => {
      const suggestions: AISuggestedTarget[] = [];
      
      if (dataCenterData?.data) {
        const userData = dataCenterData.data;
        const totalUsers = userData.length;
        const activeUsers = userData.filter((user: any) => user.status === 'Active').length;
        const activeRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
        
        // Analyze user categories
        const categoryCounts: { [key: string]: number } = {};
        userData.forEach((user: any) => {
          const categories = Array.isArray(user.category) ? user.category : [user.category];
          categories.forEach((cat: string) => {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          });
        });

        // Analyze visit patterns
        const visitCounts = userData.map((user: any) => user.no_of_visits || 0);
        const avgVisits = visitCounts.reduce((a: number, b: number) => a + b, 0) / visitCounts.length;
        const lowEngagementUsers = visitCounts.filter((visits: number) => visits < 3).length;

        // Generate suggestions based on data analysis
        if (activeRate < 80) {
          suggestions.push({
            id: 'ai1',
            title: `Increase Active Users by ${Math.round((80 - activeRate) * 1.2)}%`,
            description: 'Focus on re-engaging inactive users and improving user experience',
            rationale: `Current active rate is ${activeRate.toFixed(1)}%, below the target 80%. Analysis shows ${totalUsers - activeUsers} inactive users.`,
            target: Math.round((80 - activeRate) * 1.2),
            unit: '%',
            category: 'engagement',
            confidence: 85,
            impact: 'high',
            timeframe: '3 months',
            dataPoints: [
              `Active rate: ${activeRate.toFixed(1)}%`,
              `Inactive users: ${totalUsers - activeUsers}`,
              `Total users: ${totalUsers}`
            ]
          });
        }

        if (avgVisits < 5) {
          suggestions.push({
            id: 'ai2',
            title: `Increase Average Visits to ${Math.round(avgVisits * 1.5)}`,
            description: 'Improve user engagement through better content and features',
            rationale: `Average visits per user is ${avgVisits.toFixed(1)}, with ${lowEngagementUsers} users having less than 3 visits.`,
            target: Math.round(avgVisits * 1.5),
            unit: 'visits',
            category: 'engagement',
            confidence: 78,
            impact: 'medium',
            timeframe: '4 months',
            dataPoints: [
              `Avg visits: ${avgVisits.toFixed(1)}`,
              `Low engagement users: ${lowEngagementUsers}`,
              `Total users: ${totalUsers}`
            ]
          });
        }

        // Category-based suggestions
        const topCategory = Object.entries(categoryCounts).sort(([,a], [,b]) => b - a)[0];
        if (topCategory) {
          suggestions.push({
            id: 'ai3',
            title: `Expand ${topCategory[0]} Category by 30%`,
            description: `Leverage success in ${topCategory[0]} category to drive growth`,
            rationale: `${topCategory[0]} is your top performing category with ${topCategory[1]} users. Expanding this category could drive significant growth.`,
            target: 30,
            unit: '%',
            category: 'customers',
            confidence: 82,
            impact: 'high',
            timeframe: '6 months',
            dataPoints: [
              `Top category: ${topCategory[0]}`,
              `Users in category: ${topCategory[1]}`,
              `Category share: ${((topCategory[1] / totalUsers) * 100).toFixed(1)}%`
            ]
          });
        }
      }

      // Fallback suggestions if no data center data
      if (suggestions.length === 0) {
        suggestions.push(
          {
            id: 'ai1',
            title: 'Increase Mobile App Downloads by 40%',
            description: 'Focus on mobile app adoption to improve user engagement',
            rationale: 'Based on industry data showing 65% of users prefer mobile access',
            target: 40,
            unit: '%',
            category: 'engagement',
            confidence: 87,
            impact: 'high',
            timeframe: '3 months',
            dataPoints: ['Mobile usage: 65%', 'Industry trend: +40%', 'App store rating: 4.2/5']
          },
          {
            id: 'ai2',
            title: 'Reduce Customer Churn by 15%',
            description: 'Implement retention strategies to reduce customer churn',
            rationale: 'Industry analysis shows 22% average churn rate, with proper onboarding reducing it by 15%',
            target: 15,
            unit: '%',
            category: 'retention',
            confidence: 92,
            impact: 'high',
            timeframe: '6 months',
            dataPoints: ['Industry churn: 22%', 'Target churn: 18.7%', 'Onboarding impact: -15%']
          }
        );
      }

      setAiTargets(suggestions);
    };

    // Generate AI metrics
    const generateAIMetrics = () => {
      const metrics: AIMetric[] = [
        {
          id: 'metric1',
          title: 'Customer Lifetime Value',
          value: '₹8,450',
          trend: 'up',
          trendValue: '+12.3%',
          insight: 'CLV increased due to improved retention and higher purchase frequency',
          recommendation: 'Focus on premium tier customers to further increase CLV'
        },
        {
          id: 'metric2',
          title: 'Customer Acquisition Cost',
          value: '₹1,200',
          trend: 'down',
          trendValue: '-8.7%',
          insight: 'CAC reduced through optimized marketing channels and better targeting',
          recommendation: 'Scale successful channels while maintaining quality'
        },
        {
          id: 'metric3',
          title: 'Net Promoter Score',
          value: '7.8',
          trend: 'up',
          trendValue: '+0.4',
          insight: 'NPS improved due to enhanced customer support and product features',
          recommendation: 'Address pain points from detractors to reach 8.0+'
        }
      ];

      setAiMetrics(metrics);
    };

    // Simulate API call delay
    setTimeout(() => {
      generateAISuggestions();
      generateAIMetrics();
      setLoading(false);
    }, 1000);
  }, [dataCenterData]);

  const createMilestone = (milestone: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: Date.now().toString()
    };
    setMilestones(prev => [...prev, newMilestone]);
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  return {
    milestones,
    aiTargets,
    aiMetrics,
    loading,
    createMilestone,
    updateMilestone,
    deleteMilestone
  };
}
