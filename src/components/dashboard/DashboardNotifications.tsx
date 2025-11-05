'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useWalletBalance } from '@/hooks/useWalletData';
import { AlertTriangle, Wallet, XCircle, TrendingDown, Bell, X } from 'lucide-react';
import { CampaignData } from '../campaigns/CampaignsClient';
import { useRouter } from 'next/navigation';

export interface Notification {
  id: string;
  type: 'low_balance' | 'failed_campaign' | 'poor_performance' | 'critical';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  actionUrl?: string;
  actionLabel?: string;
}

export function DashboardNotifications() {
  const { data: walletData, isLoading: walletLoading } = useWalletBalance();
  const router = useRouter();

  // Track dismissed notifications
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());

  // Load dismissed notifications from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dismissedNotifications');
        if (stored) {
          setDismissedNotifications(new Set(JSON.parse(stored)));
        }
      } catch {
        // Ignore errors
      }
    }
  }, []);

  // Save dismissed notifications to localStorage
  const handleDismiss = (notificationId: string) => {
    const newDismissed = new Set(dismissedNotifications);
    newDismissed.add(notificationId);
    setDismissedNotifications(newDismissed);
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dismissedNotifications', JSON.stringify(Array.from(newDismissed)));
      } catch {
        // Ignore errors
      }
    }
  };

  // Get all campaigns from localStorage
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);

  useEffect(() => {
    const loadCampaigns = () => {
      if (typeof window === 'undefined') return;
      
      try {
        const storedCampaigns = JSON.parse(localStorage.getItem('sentCampaigns') || '[]');
        const pendingCampaigns = JSON.parse(localStorage.getItem('pendingCampaigns') || '[]');
        const allCampaigns = [...storedCampaigns, ...pendingCampaigns] as CampaignData[];
        // Deduplicate by ID
        const uniqueCampaigns = allCampaigns.filter((campaign, index, self) =>
          index === self.findIndex((c) => c.id === campaign.id)
        );
        setCampaigns(uniqueCampaigns);
      } catch {
        setCampaigns([]);
      }
    };

    loadCampaigns();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadCampaigns();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('campaignsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('campaignsUpdated', handleStorageChange);
    };
  }, []);

  // Determine if we should show mock data
  const showMockData = useMemo(() => {
    return process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_MOCK_NOTIFICATIONS === 'true';
  }, []);

  // Generate notifications based on data
  const notifications = useMemo<Notification[]>(() => {
    const notifs: Notification[] = [];

    if (showMockData) {
      // Mock low balance notification
      notifs.push({
        id: 'mock-low-balance',
        type: 'low_balance',
        title: 'Low Wallet Balance',
        message: 'Your wallet balance is running low (₹3,500). Consider recharging soon to avoid service interruptions.',
        severity: 'medium',
        actionUrl: '/wallet',
        actionLabel: 'Recharge Now',
      });

      // Mock failed campaign notification
      notifs.push({
        id: 'mock-failed-campaign',
        type: 'failed_campaign',
        title: 'Campaign Issue Detected',
        message: 'A campaign sent to 500 recipients shows no engagement. There may be an issue with message delivery. Review and take action.',
        severity: 'high',
        actionUrl: '/campaigns',
        actionLabel: 'Review Campaign',
      });

      // Mock poor performance notification
      notifs.push({
        id: 'mock-poor-performance',
        type: 'poor_performance',
        title: 'Poor Campaign Performance',
        message: 'Recent campaign "Summer Sale Promo" has low conversion rate (0.8%). Consider optimizing your messaging or targeting.',
        severity: 'medium',
        actionUrl: '/campaigns',
        actionLabel: 'View Campaigns',
      });
    }

    // Check for low wallet balance (real data)
    if (!walletLoading && walletData?.data && !showMockData) {
      const balance = walletData.data.balance;
      const lowBalanceThreshold = 5000; // ₹5000 threshold
      const criticalBalanceThreshold = 1000; // ₹1000 critical threshold

      if (balance <= criticalBalanceThreshold) {
        notifs.push({
          id: 'low-balance-critical',
          type: 'low_balance',
          title: 'Critical: Low Wallet Balance',
          message: `Your wallet balance is critically low (₹${balance.toLocaleString('en-IN')}). Recharge immediately to continue sending campaigns.`,
          severity: 'high',
          actionUrl: '/wallet',
          actionLabel: 'Recharge Now',
        });
      } else if (balance <= lowBalanceThreshold) {
        notifs.push({
          id: 'low-balance-warning',
          type: 'low_balance',
          title: 'Low Wallet Balance',
          message: `Your wallet balance is running low (₹${balance.toLocaleString('en-IN')}). Consider recharging soon.`,
          severity: 'medium',
          actionUrl: '/wallet',
          actionLabel: 'View Wallet',
        });
      }
    }

    // Check for failed or poor performing campaigns (real data - only if not showing mock)
    if (!showMockData) {
      const activeCampaigns = campaigns.filter(
        (c) => c.status === 'active' || c.status === 'pending'
      );

      // Check for campaigns with very low conversion rates (poor performance)
      activeCampaigns.forEach((campaign) => {
        if (campaign.sent > 0) {
          const conversionRate = (campaign.conversion / campaign.sent) * 100;
          const openRate = (campaign.opened / campaign.sent) * 100;
          
          // Alert if conversion rate is very low (< 1%) or open rate is very low (< 5%)
          if (conversionRate < 1 && campaign.sent >= 100) {
            notifs.push({
              id: `poor-performance-${campaign.id}`,
              type: 'poor_performance',
              title: 'Poor Campaign Performance',
              message: `"${campaign.name}" has very low conversion rate (${conversionRate.toFixed(1)}%). Consider reviewing and optimizing.`,
              severity: 'medium',
              actionUrl: `/campaigns`,
              actionLabel: 'View Campaigns',
            });
          } else if (openRate < 5 && campaign.sent >= 100) {
            notifs.push({
              id: `low-engagement-${campaign.id}`,
              type: 'poor_performance',
              title: 'Low Campaign Engagement',
              message: `"${campaign.name}" has low open rate (${openRate.toFixed(1)}%). Consider reviewing your messaging.`,
              severity: 'low',
              actionUrl: `/campaigns`,
              actionLabel: 'View Campaigns',
            });
          }
        }
      });

      // Check for campaigns that might have failed (high sent but zero engagement)
      activeCampaigns.forEach((campaign) => {
        if (campaign.sent >= 50 && campaign.opened === 0 && campaign.clicked === 0) {
          notifs.push({
            id: `potential-failure-${campaign.id}`,
            type: 'failed_campaign',
            title: 'Campaign Issue Detected',
            message: `"${campaign.name}" was sent to ${campaign.sent} recipients but has no engagement. There may be an issue with delivery.`,
            severity: 'high',
            actionUrl: `/campaigns`,
            actionLabel: 'Review Campaign',
          });
        }
      });
    }

    // Filter out dismissed notifications
    const filteredNotifs = notifs.filter(notif => !dismissedNotifications.has(notif.id));

    // Sort by severity (high first, then medium, then low)
    return filteredNotifs.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [walletData, walletLoading, campaigns, showMockData, dismissedNotifications]);

  // Don't render if no notifications (but allow mock data to show)
  if (notifications.length === 0) {
    return null;
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'low_balance':
        return <Wallet className="w-5 h-5" />;
      case 'failed_campaign':
        return <XCircle className="w-5 h-5" />;
      case 'poor_performance':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getNotificationStyles = (severity: Notification['severity']) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          action: 'bg-red-600 hover:bg-red-700',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          action: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'low':
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          action: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  const handleNotificationClick = (notif: Notification) => {
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
  };

  return (
    <div className="mb-6 space-y-3">
      {notifications.map((notif) => {
        const styles = getNotificationStyles(notif.severity);
        const Icon = getNotificationIcon(notif.type);

        return (
          <div
            key={notif.id}
            className={`${styles.bg} ${styles.text} border rounded-lg p-4 flex items-start gap-3 transition-all`}
          >
            <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
              {Icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-semibold text-sm flex-1">{notif.title}</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {notif.actionUrl && notif.actionLabel && (
                    <button
                      onClick={() => handleNotificationClick(notif)}
                      className={`${styles.action} text-white text-xs font-medium px-3 py-1.5 rounded transition-colors`}
                    >
                      {notif.actionLabel}
                    </button>
                  )}
                  <button
                    onClick={() => handleDismiss(notif.id)}
                    className={`${styles.text} opacity-60 hover:opacity-100 transition-opacity p-1`}
                    aria-label="Dismiss notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm opacity-90">{notif.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

