"use client";

import React, { useState } from 'react';
import { useSidebar } from "@/components/SidebarContext";
import { FileText, Scale, UserCheck, CreditCard, Shield, AlertTriangle, Globe, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export function TermsContent() {
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

  const termsSections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Welcome to tribly, a comprehensive business analytics platform that provides real-time insights, 
            customer analytics, campaign management, and multi-channel communication automation. These Terms 
            and Conditions ("Terms") govern your use of our services and platform.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Agreement to Terms</h4>
            <p className="text-blue-800 text-sm">
              By accessing or using tribly's services, you agree to be bound by these Terms. 
              If you disagree with any part of these terms, you may not access the service.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'definitions',
      title: 'Definitions',
      icon: Scale,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Key Terms</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">"Service" or "Platform":</span>
                  <p className="text-sm text-gray-600 mt-1">
                    The tribly business analytics platform, including all features, tools, APIs, and related services.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">"User" or "Customer":</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Any individual or entity that accesses or uses the Service, including business owners, analysts, and administrators.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">"Content":</span>
                  <p className="text-sm text-gray-600 mt-1">
                    All data, information, analytics, reports, campaigns, and materials uploaded or generated through the Service.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">"Account":</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Your registered account with tribly, including authentication credentials and associated data.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: UserCheck,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Agreement to Terms</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>You must be at least 18 years old to use this Service</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>You represent that you have the legal capacity to enter into this agreement</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>You agree to comply with all applicable laws and regulations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>You acknowledge that you have read and understood these Terms</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Account Registration</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>You must provide accurate and complete information during registration</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>You are responsible for maintaining the confidentiality of your account credentials</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>You must notify us immediately of any unauthorized use of your account</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>One account per person or business entity</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'service-description',
      title: 'Service Description',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Platform Features</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Business Analytics:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Real-time customer metrics, sales analytics, retention tracking, and business performance insights.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Campaign Management:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Create, manage, and track marketing campaigns across multiple channels with performance analytics.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Multi-Channel Communication:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Automated workflows for WhatsApp Business API, SMS, and Email communications.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">AI-Powered Analysis:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Intelligent business insights, customer behavior analysis, and automated recommendations.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Data Management:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Secure data storage, processing, and export capabilities for business intelligence.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Service Availability</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>We strive for 99.9% uptime but cannot guarantee uninterrupted service</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Scheduled maintenance will be announced in advance when possible</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Service features may be updated or modified to improve functionality</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'user-obligations',
      title: 'User Obligations',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Permitted Uses</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Use the Service for legitimate business purposes only</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Comply with all applicable laws and regulations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Respect intellectual property rights of others</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Maintain accurate and up-to-date account information</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Prohibited Activities</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Violate any applicable laws or regulations</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Attempt to gain unauthorized access to the Service or other accounts</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Use the Service for illegal, harmful, or fraudulent activities</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Interfere with or disrupt the Service or servers</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Reverse engineer, decompile, or disassemble the Service</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Send spam, unsolicited communications, or malicious content</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Upload content that infringes on intellectual property rights</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">⚠️ Violation Consequences</h4>
            <p className="text-red-800 text-sm">
              Violation of these obligations may result in immediate account suspension or termination 
              without notice or refund.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'payment-terms',
      title: 'Payment Terms',
      icon: CreditCard,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Subscription Plans</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Free Trial:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    New users may access a limited free trial period with restricted features.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Paid Subscriptions:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Various subscription tiers with different feature access and usage limits.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Enterprise Plans:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Custom pricing and features for large organizations with specific requirements.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Billing and Payment</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Subscriptions are billed in advance on a monthly or annual basis</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>All fees are non-refundable unless otherwise specified</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Payment methods accepted include credit cards, debit cards, and bank transfers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Failed payments may result in service suspension</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Prices may change with 30 days' notice to existing subscribers</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Refund Policy</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Refunds are generally not provided for subscription fees</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Refunds may be considered for technical issues preventing service use</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Refund requests must be submitted within 7 days of the billing date</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Refunds are processed within 5-10 business days</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: Scale,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">tribly's Intellectual Property</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>The Service, including all software, algorithms, and technology, is owned by tribly</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>All trademarks, logos, and brand elements are proprietary to tribly</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Users are granted a limited, non-exclusive license to use the Service</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>No ownership rights are transferred to users</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">User Content</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Users retain ownership of their uploaded data and content</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Users grant tribly a license to process and store their content for service provision</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Users are responsible for ensuring they have rights to upload their content</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>tribly may use anonymized, aggregated data to improve the Service</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">⚖️ DMCA Compliance</h4>
            <p className="text-yellow-800 text-sm">
              tribly respects intellectual property rights and will respond to valid DMCA takedown notices. 
              Contact us at legal@tribly.com for copyright concerns.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'privacy-data',
      title: 'Privacy and Data Protection',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Data Handling</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>tribly processes personal data in accordance with our Privacy Policy</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>We implement appropriate security measures to protect user data</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Users are responsible for compliance with applicable data protection laws</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Data may be processed in various jurisdictions for service provision</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Data Retention</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>User data is retained for the duration of the account plus applicable retention periods</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Data may be retained longer for legal compliance or business purposes</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Users may request data deletion subject to legal and technical constraints</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🔒 Security Commitment</h4>
            <p className="text-blue-800 text-sm">
              We implement industry-standard security measures including encryption, access controls, 
              and regular security audits to protect your data.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'limitations',
      title: 'Limitations and Disclaimers',
      icon: AlertTriangle,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Service Limitations</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>The Service is provided "as is" without warranties of any kind</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>We do not guarantee uninterrupted or error-free service</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Service availability may be affected by factors beyond our control</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Features and functionality may change without notice</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Limitation of Liability</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>tribly's liability is limited to the amount paid for the Service in the 12 months preceding the claim</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>We are not liable for indirect, incidental, or consequential damages</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>We are not responsible for data loss due to user error or third-party actions</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Some jurisdictions may not allow limitation of liability</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Indemnification</h4>
            <p className="text-gray-700 leading-relaxed mb-3">
              Users agree to indemnify and hold harmless tribly from any claims, damages, or expenses 
              arising from their use of the Service or violation of these Terms.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Claims related to user content or data</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Violation of these Terms or applicable laws</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Infringement of third-party rights</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: Clock,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Termination by User</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Users may terminate their account at any time through account settings</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Termination requests are processed within 24-48 hours</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Data export options are available before account closure</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>No refunds are provided for unused subscription time</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Termination by tribly</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>We may terminate accounts for violation of these Terms</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Non-payment of fees may result in immediate suspension</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>Fraudulent or illegal activity will result in immediate termination</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                <span>We may discontinue the Service with 30 days' notice</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Effect of Termination</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Access to the Service will be immediately revoked</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>User data will be retained according to our data retention policy</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Outstanding fees remain due and payable</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Provisions that should survive termination will remain in effect</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: Scale,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Applicable Law</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>These Terms are governed by the laws of the State of Delaware, United States</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Any disputes will be resolved in the courts of Delaware</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Users consent to the jurisdiction of Delaware courts</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Dispute Resolution</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>We encourage users to contact us first to resolve disputes amicably</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Mediation may be required before formal legal proceedings</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Class action waivers may apply to certain disputes</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">⚖️ Legal Contact</h4>
            <p className="text-gray-700 text-sm mb-2">
              For legal matters, please contact:
            </p>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Email: legal@tribly.com</li>
              <li>• Address: tribly Legal Department, Delaware, USA</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'modifications',
      title: 'Modifications',
      icon: Clock,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Changes to Terms</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>We may modify these Terms at any time</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Material changes will be communicated via email or platform notification</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Continued use of the Service constitutes acceptance of modified Terms</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Users may terminate their account if they disagree with changes</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Service Updates</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>We continuously improve and update the Service</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>New features may be added without notice</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Deprecated features may be removed with reasonable notice</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>API changes will be communicated to developers in advance</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📅 Version History</h4>
            <p className="text-blue-800 text-sm">
              We maintain a version history of these Terms. Users can access previous versions 
              through their account settings or by contacting support.
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
            <h4 className="font-semibold text-gray-900 mb-3">General Support</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms, technical support, or general inquiries, 
              please contact us using the information below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold text-blue-900 mb-3">📧 Contact Methods</h5>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li><strong>General Support:</strong> support@tribly.com</li>
                <li><strong>Legal Matters:</strong> legal@tribly.com</li>
                <li><strong>Billing Issues:</strong> billing@tribly.com</li>
                <li><strong>Technical Support:</strong> Available 24/7 in dashboard</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-900 mb-3">🏢 Business Address</h5>
              <div className="text-green-800 text-sm">
                <p className="font-medium">tribly Technologies Inc.</p>
                <p>Legal Department</p>
                <p>123 Business Street</p>
                <p>Tech City, TC 12345</p>
                <p>United States</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">⚡ Response Times</h4>
            <ul className="text-purple-800 text-sm space-y-1">
              <li>• General inquiries: Within 24 hours</li>
              <li>• Technical support: Within 4 hours</li>
              <li>• Legal matters: Within 48 hours</li>
              <li>• Emergency support: Available 24/7</li>
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
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using tribly's business analytics platform 
            and related services.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {termsSections.map((section) => (
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

        {/* Terms Sections */}
        <div className="space-y-6">
          {termsSections.map((section) => {
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
                These Terms and Conditions are effective as of January 15, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
