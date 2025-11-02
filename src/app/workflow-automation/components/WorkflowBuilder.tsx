"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Clock, CheckCircle, AlertCircle, MessageSquare, Users, Calendar, Zap, ChevronDown } from "lucide-react";

interface AutomationRequest {
  id: string;
  title: string;
  description: string;
  trigger: string;
  message: string;
  channel: string;
  targetAudience: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_review" | "approved" | "rejected" | "completed";
  submittedAt: string;
  estimatedCompletion: string;
}

// Custom Dropdown Component
interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomDropdown = ({ options, value, onChange, placeholder = "Select option", className = "" }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent bg-white text-left flex items-center justify-between ${
          isOpen ? 'border-[#9747FF]' : ''
        }`}
      >
        <span className={selectedOption ? 'text-[#2a2a2f]' : 'text-[#6b7280]'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#6b7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e9e9e9] rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                value === option.value ? 'bg-[#9747FF]/5 text-[#9747FF]' : 'text-[#2a2a2f]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export function WorkflowBuilder() {
  const [request, setRequest] = useState({
    title: "",
    description: "",
    trigger: "",
    message: "",
    channel: "",
    targetAudience: "",
    priority: "medium" as "low" | "medium" | "high"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dropdown options
  const channelOptions: DropdownOption[] = [
    { value: "", label: "Select channel" },
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "SMS", label: "SMS" },
    { value: "All", label: "All Channels" }
  ];

  const priorityOptions: DropdownOption[] = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  // Sample existing requests
  const existingRequests: AutomationRequest[] = [
    {
      id: "1",
      title: "Welcome Message for New Customers",
      description: "Send a personalized welcome message to all new customers who sign up",
      trigger: "New customer registration",
      message: "Welcome to our platform! We're excited to have you on board.",
      channel: "WhatsApp",
      targetAudience: "New customers",
      priority: "high",
      status: "completed",
      submittedAt: "2024-01-15",
      estimatedCompletion: "2024-01-17"
    },
    {
      id: "2",
      title: "Cart Abandonment Reminder",
      description: "Send reminder messages to customers who abandoned their cart",
      trigger: "Cart abandoned for 2 hours",
      message: "Don't forget about your items! Complete your purchase now.",
      channel: "WhatsApp",
      targetAudience: "Cart abandoners",
      priority: "medium",
      status: "in_review",
      submittedAt: "2024-01-20",
      estimatedCompletion: "2024-01-22"
    },
    {
      id: "3",
      title: "Birthday Wishes",
      description: "Send birthday wishes to customers on their special day",
      trigger: "Customer birthday",
      message: "Happy Birthday! Enjoy 20% off on your special day.",
      channel: "SMS",
      targetAudience: "All customers",
      priority: "low",
      status: "pending",
      submittedAt: "2024-01-25",
      estimatedCompletion: "2024-01-27"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setRequest({
        title: "",
        description: "",
        trigger: "",
        message: "",
        channel: "",
        targetAudience: "",
        priority: "medium"
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_review":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_review":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">

      {/* Success Message */}
      {isSubmitted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
        <div>
              <h3 className="text-green-800 font-medium">Request Submitted Successfully!</h3>
              <p className="text-green-700 text-sm">We&apos;ve received your automation request and will review it within 48 hours.</p>
            </div>
          </div>
        </div>
      )}

      {/* Process Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">1</span>
            </div>
            <h4 className="font-medium text-blue-900 mb-2">Submit Request</h4>
            <p className="text-sm text-blue-700">Describe your automation needs in detail</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">2</span>
            </div>
            <h4 className="font-medium text-blue-900 mb-2">Review & Create</h4>
            <p className="text-sm text-blue-700">Our team reviews and creates your automation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">3</span>
            </div>
            <h4 className="font-medium text-blue-900 mb-2">Deploy & Test</h4>
            <p className="text-sm text-blue-700">We deploy and test your automation workflow</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Request Form */}
        <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
          <h3 className="text-lg font-semibold text-[#2a2a2f] mb-4">Submit New Request</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
              <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Request Title</label>
                <input
                  type="text"
                value={request.title}
                onChange={(e) => setRequest({ ...request, title: e.target.value })}
                className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                placeholder="e.g., Send welcome message for all new customers"
                required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Description</label>
                <textarea
                value={request.description}
                onChange={(e) => setRequest({ ...request, description: e.target.value })}
                className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                  rows={3}
                placeholder="Describe your automation requirement in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Trigger Event</label>
              <input
                type="text"
                value={request.trigger}
                onChange={(e) => setRequest({ ...request, trigger: e.target.value })}
                className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                placeholder="e.g., New customer registration, Order placed, Cart abandoned"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Message Content</label>
              <textarea
                value={request.message}
                onChange={(e) => setRequest({ ...request, message: e.target.value })}
                className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                rows={2}
                placeholder="What message should be sent?"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Channel</label>
                <CustomDropdown
                  options={channelOptions}
                  value={request.channel}
                  onChange={(value) => setRequest({ ...request, channel: value })}
                  placeholder="Select channel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Priority</label>
                <CustomDropdown
                  options={priorityOptions}
                  value={request.priority}
                  onChange={(value) => setRequest({ ...request, priority: value as "low" | "medium" | "high" })}
                  placeholder="Select priority"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Target Audience</label>
              <input
                type="text"
                value={request.targetAudience}
                onChange={(e) => setRequest({ ...request, targetAudience: e.target.value })}
                className="w-full border border-[#d1d5db] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
                placeholder="e.g., New customers, VIP customers, All users"
                required
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#9747FF] text-white py-3 rounded hover:bg-[#6E4EFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </button>

              <p className="text-sm text-[#6b7280] text-center">
                Your request will be reviewed and approved within 48 hours. We&apos;ll notify you once it&apos;s ready.
              </p>
            </div>
          </form>
        </div>

        {/* Existing Requests */}
        <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
          <h3 className="text-lg font-semibold text-[#2a2a2f] mb-4">Your Requests</h3>

          <div className="space-y-4">
            {existingRequests.map((req) => (
              <div key={req.id} className="border border-[#e5e7eb] rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-[#2a2a2f]">{req.title}</h4>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(req.status)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(req.status)}`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#6b7280] mb-3">{req.description}</p>

                <div className="grid grid-cols-2 gap-4 text-xs text-[#6b7280]">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{req.trigger}</span>
            </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{req.channel}</span>
          </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{req.targetAudience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {req.estimatedCompletion}</span>
                  </div>
                      </div>
                    </div>
                  ))}
                </div>
        </div>
      </div>
    </div>
  );
}
