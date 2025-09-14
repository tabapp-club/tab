import { useState, useEffect } from 'react';

interface WorkflowAnalyticsData {
  whatsapp: {
    messages: number;
    deliveryRate: number;
    readRate: number;
    responseRate: number;
  };
  sms: {
    messages: number;
    deliveryRate: number;
    readRate: number;
    responseRate: number;
  };
  peakHours: Array<{
    hour: string;
    engagement: number;
  }>;
  bestDays: Array<{
    day: string;
    performance: number;
  }>;
  messageTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  workflows: Array<{
    name: string;
    performance: number;
    conversions: number;
  }>;
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
  }>;
}

export function useWorkflowAnalytics(timeRange: string = '7d') {
  const [data, setData] = useState<WorkflowAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - in real implementation, this would be an API call
        const mockData: WorkflowAnalyticsData = {
          whatsapp: {
            messages: Math.floor(Math.random() * 2000) + 1000,
            deliveryRate: 95 + Math.random() * 5,
            readRate: 85 + Math.random() * 10,
            responseRate: 20 + Math.random() * 10
          },
          sms: {
            messages: Math.floor(Math.random() * 1500) + 500,
            deliveryRate: 98 + Math.random() * 2,
            readRate: 90 + Math.random() * 8,
            responseRate: 15 + Math.random() * 10
          },
          peakHours: [
            { hour: "9:00 AM", engagement: Math.min(90 + Math.random() * 10, 100) },
            { hour: "2:00 PM", engagement: Math.min(80 + Math.random() * 15, 100) },
            { hour: "7:00 PM", engagement: Math.min(85 + Math.random() * 12, 100) }
          ],
          bestDays: [
            { day: "Tuesday", performance: Math.min(90 + Math.random() * 8, 100) },
            { day: "Thursday", performance: Math.min(85 + Math.random() * 10, 100) },
            { day: "Monday", performance: Math.min(80 + Math.random() * 12, 100) }
          ],
          messageTypes: [
            { type: "Text", count: Math.floor(Math.random() * 1500) + 1000, percentage: 40 + Math.random() * 10 },
            { type: "Media", count: Math.floor(Math.random() * 1000) + 500, percentage: 30 + Math.random() * 10 },
            { type: "Template", count: Math.floor(Math.random() * 800) + 300, percentage: 20 + Math.random() * 10 }
          ],
          workflows: [
            { name: "Welcome Series", performance: Math.min(90 + Math.random() * 8, 100), conversions: Math.floor(Math.random() * 300) + 200 },
            { name: "Abandoned Cart", performance: Math.min(85 + Math.random() * 10, 100), conversions: Math.floor(Math.random() * 200) + 100 },
            { name: "Follow-up", performance: Math.min(88 + Math.random() * 8, 100), conversions: Math.floor(Math.random() * 250) + 150 }
          ],
          insights: [
            {
              type: "success",
              title: "High Engagement Peak",
              description: "Your messages perform 23% better during 9:00 AM - 10:00 AM. Consider scheduling more campaigns during this window."
            },
            {
              type: "warning",
              title: "SMS Response Rate",
              description: "SMS response rate is 18.9%, below industry average of 25%. Consider A/B testing different message formats."
            },
            {
              type: "info",
              title: "Template Performance",
              description: "Template messages show 15% higher engagement than regular text messages. Expand your template library."
            }
          ]
        };

        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  return { data, loading, error };
}
