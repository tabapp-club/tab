"use client";

import React, { useState } from 'react';
import { useSidebar } from "@/components/SidebarContext";
import { Cookie, Settings, Shield, Database, Globe, Eye, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export function CookiesContent() {
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

  const cookiesSections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Cookie,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            This Cookie Policy explains how tribly uses cookies and similar technologies when you visit 
            our business analytics platform. It describes what these technologies are, why we use them, 
            and your rights to control our use of them.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🍪 What Are Cookies?</h4>
            <p className="text-blue-800 text-sm">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience and understand how you use our platform.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'types-of-cookies',
      title: 'Types of Cookies We Use',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Essential Cookies</h4>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 text-sm font-medium mb-2">✅ Always Active - Required for Platform Functionality</p>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Authentication Cookies:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Store your login session and authentication tokens to keep you logged in securely.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Security Cookies:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Protect against cross-site request forgery (CSRF) and other security threats.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Session Management:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Maintain your session state and remember your preferences during your visit.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Load Balancing:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Ensure optimal performance by directing you to the best server.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Performance Cookies</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm font-medium mb-2">📊 Optional - Help Us Improve Performance</p>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Analytics Cookies:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Track how you use our platform to identify areas for improvement and optimization.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Performance Monitoring:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Monitor page load times, error rates, and user experience metrics.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Feature Usage:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Understand which features are most popular to guide development priorities.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Functional Cookies</h4>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-purple-800 text-sm font-medium mb-2">⚙️ Optional - Enhance Your Experience</p>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Preference Storage:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Remember your dashboard layout, theme preferences, and custom settings.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Language Settings:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Remember your language preference for the platform interface.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Dashboard Customization:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Save your custom dashboard configurations and widget arrangements.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'local-storage',
      title: 'Local Storage & Browser Data',
      icon: Database,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Local Storage Usage</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition to cookies, we use browser local storage to enhance your experience 
              and maintain your session data securely.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Authentication Tokens:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Securely store JWT tokens and session data for seamless authentication.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">User Preferences:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Save your dashboard settings, filter preferences, and custom configurations.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Cache Data:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Store frequently accessed data locally to improve loading speeds.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Offline Capabilities:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Enable basic functionality when you&apos;re temporarily offline.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Data Security</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>All local storage data is encrypted using industry-standard methods</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Authentication tokens have automatic expiration for security</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Data is automatically cleared when you log out</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>No sensitive business data is stored locally</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'third-party-cookies',
      title: 'Third-Party Cookies',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Service Providers</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              We work with trusted third-party service providers who may set cookies on our platform 
              to deliver essential services and improve your experience.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Cloud Infrastructure:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    AWS, Google Cloud, or similar providers for hosting and content delivery.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Communication Services:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    WhatsApp Business API, Twilio, SendGrid for multi-channel communication features.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Analytics Services:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Google Analytics, Mixpanel, or similar for platform usage analytics.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Security Services:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Cloudflare, Auth0, or similar for security and authentication services.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Third-Party Cookie Management</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>We carefully vet all third-party service providers for privacy compliance</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Third-party cookies are only used for essential service functionality</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>We do not allow third parties to use cookies for advertising purposes</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>You can manage third-party cookies through your browser settings</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'cookie-duration',
      title: 'Cookie Duration',
      icon: Clock,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Session Cookies</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Duration:</strong> Deleted when you close your browser</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Purpose:</strong> Maintain your session and temporary preferences</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Examples:</strong> Login session, shopping cart, form data</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Persistent Cookies</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Duration:</strong> Remain on your device for a set period</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Authentication:</strong> 30 days (with automatic refresh)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Preferences:</strong> 1 year (until manually cleared)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span><strong>Analytics:</strong> 2 years (for trend analysis)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Automatic Expiration</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Authentication tokens automatically expire for security</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Analytics cookies are refreshed periodically</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Preference cookies persist until manually changed</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>All cookies are cleared when you delete your account</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'cookie-management',
      title: 'Managing Your Cookie Preferences',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Browser Settings</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can control cookies through your browser settings. However, disabling certain cookies 
              may affect the functionality of our platform.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Chrome:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Settings → Privacy and Security → Cookies and other site data
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Firefox:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Options → Privacy & Security → Cookies and Site Data
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Safari:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Preferences → Privacy → Manage Website Data
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <div>
                  <span className="font-medium">Edge:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Settings → Cookies and site permissions → Cookies and site data
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Platform Cookie Settings</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold text-blue-900 mb-2">⚙️ Cookie Preferences Center</h5>
              <p className="text-blue-800 text-sm mb-3">
                You can manage your cookie preferences directly within our platform:
              </p>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Access through your account settings</li>
                <li>• Granular control over cookie categories</li>
                <li>• Real-time updates to your preferences</li>
                <li>• Clear explanation of each cookie type</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Impact of Disabling Cookies</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Essential cookies cannot be disabled without breaking platform functionality</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Disabling performance cookies may affect our ability to improve the platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>Functional cookies help remember your preferences and settings</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                <span>You may need to re-enter information more frequently</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'mobile-apps',
      title: 'Mobile Apps & PWA',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Progressive Web App (PWA)</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform is available as a Progressive Web App, which uses similar technologies 
              to cookies for enhanced functionality and offline capabilities.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Service Workers:</strong> Enable offline functionality and background sync</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>App Cache:</strong> Store app resources for faster loading</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Push Notifications:</strong> Deliver important updates and alerts</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Local Storage:</strong> Enhanced data storage for better performance</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Mobile Browser Considerations</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Mobile browsers handle cookies similarly to desktop browsers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>iOS Safari has additional privacy features that may affect cookie behavior</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Android Chrome provides granular cookie controls</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>PWA installation may change how cookies are managed</span>
              </li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">📱 Mobile Optimization</h4>
            <p className="text-purple-800 text-sm">
              Our platform is optimized for mobile devices and respects mobile browser privacy settings. 
              The PWA provides a native app-like experience while maintaining web-based cookie controls.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Privacy',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Privacy Compliance</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>We comply with GDPR, CCPA, and other applicable privacy regulations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Cookie usage is transparent and clearly explained</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>You have the right to control your cookie preferences</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>We do not use cookies for tracking across other websites</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Data Minimization</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>We only collect data necessary for platform functionality</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>No personal data is stored in cookies without encryption</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Analytics data is anonymized and aggregated</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Cookies are automatically cleaned up when no longer needed</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Your Rights</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Right to know what cookies we use and why</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Right to control your cookie preferences</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Right to delete cookies from your device</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Right to withdraw consent at any time</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'updates',
      title: 'Policy Updates',
      icon: Clock,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Changes to This Policy</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>We may update this Cookie Policy from time to time</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Significant changes will be communicated via email or platform notification</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Continued use of our platform constitutes acceptance of updated policies</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>We maintain a version history of all policy changes</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Technology Changes</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>New technologies may be introduced to improve platform functionality</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>We will update this policy to reflect any new cookie usage</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Legacy cookies may be phased out with appropriate notice</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Enhanced privacy controls may be added to the platform</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">📅 Last Updated</h4>
            <p className="text-gray-700 text-sm">
              This Cookie Policy was last updated on January 15, 2025. We recommend reviewing 
              this policy periodically to stay informed about our cookie practices.
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
            <h4 className="font-semibold text-gray-900 mb-3">Cookie Questions & Support</h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our cookie practices, need help managing your preferences, 
              or want to report any issues, please contact us using the information below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold text-blue-900 mb-3">📧 Contact Methods</h5>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li><strong>Cookie Questions:</strong> cookies@tribly.com</li>
                <li><strong>Privacy Concerns:</strong> privacy@tribly.com</li>
                <li><strong>Technical Support:</strong> Available 24/7 in dashboard</li>
                <li><strong>General Inquiries:</strong> support@tribly.com</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-900 mb-3">🏢 Business Address</h5>
              <div className="text-green-800 text-sm">
                <p className="font-medium">tribly Technologies Inc.</p>
                <p>Privacy & Cookie Policy Team</p>
                <p>123 Business Street</p>
                <p>Tech City, TC 12345</p>
                <p>United States</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">⚡ Response Times</h4>
            <ul className="text-purple-800 text-sm space-y-1">
              <li>• Cookie-related questions: Within 24 hours</li>
              <li>• Privacy concerns: Within 48 hours</li>
              <li>• Technical support: Within 4 hours</li>
              <li>• Emergency issues: Available 24/7</li>
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
            <Cookie className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn about how tribly uses cookies and similar technologies to enhance your 
            experience on our business analytics platform.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {cookiesSections.map((section) => (
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

        {/* Cookies Sections */}
        <div className="space-y-6">
          {cookiesSections.map((section) => {
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
                This Cookie Policy is effective as of January 15, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
