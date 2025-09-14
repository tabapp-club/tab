"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import { CustomDropdown } from "./CustomDropdown";

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: "welcome" | "reminder" | "followup";
  channels: ("whatsapp" | "sms")[];
  trigger: string;
  message: string;
  isActive: boolean;
  usage: number;
  lastUsed: string;
}

export function AutomationRules() {
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<AutomationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize templates data
  const initialTemplates: AutomationTemplate[] = [
    {
      id: "1",
      name: "Welcome Message Automation",
      description: "Automatically send welcome messages to new customers",
      category: "welcome",
      channels: ["whatsapp", "sms"],
      trigger: "New customer registration",
      message: "Welcome to our platform! We're excited to have you on board. Get started with 20% off your first order.",
      isActive: true,
      usage: 1250,
      lastUsed: "2 hours ago"
    },
    {
      id: "2",
      name: "Reminder Message Automation",
      description: "Send reminder messages for appointments, payments, and deadlines",
      category: "reminder",
      channels: ["whatsapp", "sms"],
      trigger: "24 hours before appointment",
      message: "Reminder: You have an appointment tomorrow at 2:00 PM. Please confirm your attendance.",
      isActive: true,
      usage: 890,
      lastUsed: "1 hour ago"
    },
    {
      id: "3",
      name: "Follow-up Message Automation",
      description: "Follow up with customers after purchases or interactions",
      category: "followup",
      channels: ["whatsapp", "sms"],
      trigger: "3 days after purchase",
      message: "How was your experience with us? We'd love to hear your feedback and help with any questions.",
      isActive: false,
      usage: 567,
      lastUsed: "1 day ago"
    }
  ];

  // Initialize templates on component mount
  React.useEffect(() => {
    setTemplates(initialTemplates);
  }, []);

  const channels = [
    { value: "all", label: "All Channels" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "sms", label: "SMS" }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "welcome", label: "Welcome" },
    { value: "reminder", label: "Reminder" },
    { value: "followup", label: "Follow-up" }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesChannel = filterChannel === "all" || template.channels.includes(filterChannel as "whatsapp" | "sms");
    const matchesCategory = filterCategory === "all" || template.category === filterCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesCategory && matchesSearch;
  });

  const toggleTemplateStatus = async (templateId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTemplates(prevTemplates => 
        prevTemplates.map(template => 
          template.id === templateId 
            ? { 
                ...template, 
                isActive: !template.isActive,
                lastUsed: "Just now"
              }
            : template
        )
      );
    } catch (error) {
      console.error("Failed to toggle template status:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const getCategoryColor = (category: string) => {
    switch (category) {
      case "welcome":
        return "bg-green-100 text-green-800";
      case "reminder":
        return "bg-blue-100 text-blue-800";
      case "followup":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2a2a2f]">Automation Templates</h2>
          <p className="text-sm text-[#6b7280]">Create and manage automation templates for customer communications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#e5e7eb] p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#2a2a2f]">Channel:</span>
            <CustomDropdown
              options={channels}
              value={filterChannel}
              onChange={setFilterChannel}
              className="w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#2a2a2f]">Category:</span>
            <CustomDropdown
              options={categories}
              value={filterCategory}
              onChange={setFilterCategory}
              className="w-36"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#2a2a2f]">Search:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="text-sm border border-[#d1d5db] rounded px-3 py-1 w-48"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-[#e5e7eb] p-4">
            <h3 className="font-semibold text-[#2a2a2f] mb-4">Templates ({filteredTemplates.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedTemplate?.id === template.id
                      ? "bg-[#6E4EFF]/10 border-[#6E4EFF]/20"
                      : "hover:bg-[#f9fafb] border-[#e5e7eb]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-[#2a2a2f] text-sm">{template.name}</h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        template.isActive ? "bg-[#10b981]" : "bg-[#6b7280]"
                      }`}></span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        template.isActive ? "bg-[#10b981]/10 text-[#10b981]" : "bg-[#6b7280]/10 text-[#6b7280]"
                      }`}>
                        {template.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#6b7280] mb-1">{template.category}</p>
                  <p className="text-xs text-[#9ca3af]">{template.usage} uses</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Template Details */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <div className="space-y-6">
              {/* Template Header */}
              <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[#2a2a2f]">{selectedTemplate.name}</h3>
                      <p className="text-sm text-[#6b7280]">{selectedTemplate.category} • {selectedTemplate.usage} uses</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleTemplateStatus(selectedTemplate.id)}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded transition-colors disabled:opacity-50 ${
                        selectedTemplate.isActive
                          ? "bg-[#f59e0b] text-white hover:bg-[#d97706]"
                          : "bg-[#10b981] text-white hover:bg-[#059669]"
                      }`}
                    >
                      {selectedTemplate.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => console.log('Configure template')}
                      className="border border-[#d1d5db] text-[#6b7280] px-4 py-2 rounded hover:bg-[#f9fafb] transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                  </div>
                </div>
              </div>

              {/* Template Content */}
              <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
                <h4 className="font-semibold text-[#2a2a2f] mb-4">Template Configuration</h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">Description</label>
                  <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-md">
                    {selectedTemplate.description}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">Trigger</label>
                  <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-md">
                    {selectedTemplate.trigger}
              </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">Message Content</label>
                  <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-md whitespace-pre-wrap">
                    {selectedTemplate.message}
                    </div>
                </div>
              </div>

              {/* Template Stats */}
              <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
                <h4 className="font-semibold text-[#2a2a2f] mb-4">Template Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#2a2a2f]">{selectedTemplate.usage}</div>
                    <div className="text-sm text-[#6b7280]">Total Uses</div>
                </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#2a2a2f]">78.5%</div>
                    <div className="text-sm text-[#6b7280]">Open Rate</div>
                      </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#2a2a2f]">23.2%</div>
                    <div className="text-sm text-[#6b7280]">Click Rate</div>
                        </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#2a2a2f]">12.8%</div>
                    <div className="text-sm text-[#6b7280]">Response Rate</div>
                    </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#e5e7eb] p-12 text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-[#2a2a2f] mb-2">No Template Selected</h3>
              <p className="text-[#6b7280] mb-4">Select a template from the list to view details</p>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
