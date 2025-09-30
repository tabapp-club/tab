"use client";

import React, { useState } from 'react';
import { useSidebar } from "@/components/SidebarContext";
import { Shield, Eye, Lock, Database, Users, Globe, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export function PrivacyContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const privacySections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            At tribly, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
            business analytics platform and related services.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🔒 Your Data Stays Private. Always.</h4>
            <p className="text-blue-800 text-sm">
              We implement industry-standard security measures and never sell your personal data to third parties.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'data-collection',
      title: 'Information We Collect',
      icon: Database,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Phone Number:</strong> For authentication via OTP verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Name:</strong> Business name or personal name for account identification</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Business Data:</strong> Customer analytics, sales metrics, and business insights</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Usage Information</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Analytics Data:</strong> Customer metrics, sales performance, retention rates</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Campaign Data:</strong> Marketing campaign performance and customer engagement</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Workflow Data:</strong> Automation rules, communication templates, and channel integrations</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Technical Information</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Device Information:</strong> Browser type, operating system, device identifiers</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Usage Patterns:</strong> Pages visited, features used, session duration</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Authentication Tokens:</strong> Secure access tokens for API authentication</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Information',
      icon: Eye,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Service Provision</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Provide real-time business analytics and customer insights</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Enable campaign management and marketing automation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Support multi-channel communication workflows (WhatsApp, SMS, Email)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Deliver AI-powered business analysis and recommendations</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Account Management</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Authenticate users and maintain account security</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Provide customer support and technical assistance</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Send important service updates and notifications</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Service Improvement</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Analyze usage patterns to improve platform performance</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Develop new features based on user needs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Ensure platform security and prevent fraud</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'data-sharing',
      title: 'Information Sharing',
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">🚫 We Never Sell Your Data</h4>
            <p className="text-red-800 text-sm">
              tribly does not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Limited Sharing Scenarios</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Service Providers:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    We may share data with trusted third-party service providers who assist in platform operations, 
                    such as cloud hosting, analytics, and communication services (WhatsApp Business API, SMS gateways, Email services).
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Legal Requirements:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    We may disclose information when required by law, court order, or to protect our rights and safety.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Business Transfers:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    In case of merger, acquisition, or sale of assets, user data may be transferred as part of the business transaction.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">🛡️ Enterprise-Grade Security</h4>
            <p className="text-green-800 text-sm">
              We implement industry-standard security measures to protect your data from unauthorized access, 
              alteration, disclosure, or destruction.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Security Measures</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Access Controls:</strong> Role-based access controls and multi-factor authentication</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Secure APIs:</strong> JWT-based authentication with token expiration and refresh mechanisms</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Regular Audits:</strong> Security assessments and penetration testing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Data Backup:</strong> Regular backups with disaster recovery procedures</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Your Role in Security</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Keep your login credentials secure and confidential</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Log out from shared or public devices</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Report any suspicious activity immediately</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: Database,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Retention Periods</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Account Data:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Retained for the duration of your account plus 30 days after account closure for recovery purposes.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Business Analytics:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Customer metrics and sales data retained for up to 7 years for business analysis and compliance.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Communication Logs:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Campaign and workflow communication logs retained for 2 years for audit and support purposes.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Technical Logs:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    System logs and security events retained for 1 year for monitoring and troubleshooting.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Data Deletion</h4>
            <p className="text-gray-700 leading-relaxed">
              When data reaches the end of its retention period, it is securely deleted using industry-standard 
              data destruction methods. You can also request immediate deletion of your data by contacting our 
              support team.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Data Subject Rights</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Access:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Request a copy of all personal data we hold about you.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Correction:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Update or correct inaccurate personal information.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Deletion:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Request deletion of your personal data (right to be forgotten).
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Portability:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Export your data in a machine-readable format.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Restriction:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Limit how we process your personal data.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Objection:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Object to processing of your data for certain purposes.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📞 How to Exercise Your Rights</h4>
            <p className="text-blue-800 text-sm mb-2">
              To exercise any of these rights, please contact us at:
            </p>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Email: privacy@tribly.com</li>
              <li>• Support Portal: Available in your dashboard settings</li>
              <li>• Response Time: We will respond within 30 days</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies & Tracking',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Types of Cookies We Use</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Essential Cookies:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Required for platform functionality, authentication, and security. These cannot be disabled.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Performance Cookies:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Help us understand how you use the platform to improve performance and user experience.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-amber-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Functional Cookies:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Remember your preferences and settings for a personalized experience.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Local Storage</h4>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use browser local storage to securely store your authentication tokens and user preferences. 
              This data is encrypted and only accessible by our platform.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Authentication tokens for secure API access</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>User preferences and dashboard settings</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Session data for seamless user experience</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Cookie Management</h4>
            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings. However, disabling essential cookies 
              may affect platform functionality. You can also manage your cookie preferences through our 
              platform settings.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Global Operations</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              tribly operates globally and may transfer your data to countries outside your residence. 
              We ensure that all international transfers comply with applicable data protection laws.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Safeguards for International Transfers</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Standard Contractual Clauses (SCCs) for EU data transfers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Adequacy decisions by relevant data protection authorities</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Certification schemes and codes of conduct</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Binding corporate rules for intra-group transfers</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">🌍 Data Residency</h4>
            <p className="text-yellow-800 text-sm">
              We offer data residency options for customers who require data to remain within specific 
              geographic regions. Contact our support team for more information.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'children-privacy',
      title: 'Children\'s Privacy',
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-2">👶 Age Restrictions</h4>
            <p className="text-orange-800 text-sm">
              tribly is designed for business use and is not intended for children under 16 years of age.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Our Commitment</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>We do not knowingly collect personal information from children under 16</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>If we discover we have collected data from a child, we will delete it immediately</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Parents can contact us to review or delete their child's information</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'policy-updates',
      title: 'Policy Updates',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Changes to This Policy</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, 
              technology, legal requirements, or other factors. We will notify you of any material changes 
              through the platform or via email.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Notification Methods</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>In-app notifications for significant changes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Email notifications to registered users</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Updated policy posted on our website</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Version history available in platform settings</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">📅 Last Updated</h4>
            <p className="text-gray-700 text-sm">
              This Privacy Policy was last updated on January 15, 2025. We recommend reviewing this policy 
              periodically to stay informed about how we protect your information.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Privacy Questions & Concerns</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, our data practices, or wish to exercise 
              your privacy rights, please contact us using the information below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold text-blue-900 mb-3">📧 Email Support</h5>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li><strong>General Privacy:</strong> privacy@tribly.com</li>
                <li><strong>Data Requests:</strong> data@tribly.com</li>
                <li><strong>Security Issues:</strong> security@tribly.com</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-900 mb-3">🏢 Business Address</h5>
              <div className="text-green-800 text-sm">
                <p className="font-medium">tribly Technologies</p>
                <p>Privacy Department</p>
                <p>123 Business Street</p>
                <p>Tech City, TC 12345</p>
                <p>United States</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">⚡ Response Times</h4>
            <ul className="text-purple-800 text-sm space-y-1">
              <li>• General inquiries: Within 48 hours</li>
              <li>• Data subject requests: Within 30 days</li>
              <li>• Security incidents: Within 24 hours</li>
              <li>• Emergency contact: Available 24/7 for critical issues</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 transition-all duration-300 ease-in-out flex-1 flex items-center justify-center ml-[200px]">
      <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy is our priority. Learn how we protect and handle your data 
            with transparency and care.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {privacySections.map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className="text-left p-3 rounded-lg text-sm text-gray-700"
              >
                <div className="flex items-center">
                  <section.icon className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">{section.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {privacySections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-visible">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 text-left focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 text-blue-600 mr-3" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        {section.title}
                      </h2>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100 overflow-visible">
                    <div className="pt-4">
                      {section.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <a 
                href="/dashboard" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center"
              >
                ← Back to Dashboard
              </a>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm text-gray-500">
                This Privacy Policy is effective as of January 15, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
