"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateTemplate, useUpdateTemplate, useTemplates } from "@/hooks/useWorkflowData";
import { CustomDropdown } from "./CustomDropdown";
import { MessageCircle, MessageSquare } from "lucide-react";

interface Template {
  id: string;
  name: string;
  channel: "whatsapp" | "sms";
  category: string;
  content: string;
  variables: string[];
  isActive: boolean;
  usage: number;
  createdAt: string;
  updatedAt: string;
}

export function TemplateManager() {
  const router = useRouter();
  const { data: templatesData, isLoading } = useTemplates();
  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<Partial<Template>>({});

  // Load templates from API
  useEffect(() => {
    if (templatesData) {
      setTemplates(templatesData);
      if (templatesData.length > 0 && !selectedTemplate) {
        setSelectedTemplate(templatesData[0]);
      }
    }
  }, [templatesData, selectedTemplate]);

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
    const matchesChannel = filterChannel === "all" || template.channel === filterChannel;
    const matchesCategory = filterCategory === "all" || template.category === filterCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesCategory && matchesSearch;
  });

  const toggleTemplateStatus = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      try {
        await updateTemplateMutation.mutateAsync({
          id: templateId,
          updates: { isActive: !template.isActive }
        });
      } catch (error) {
      }
    }
  };


  const handleCreateTemplate = async () => {
    if (editingTemplate.name && editingTemplate.content) {
      try {
        await createTemplateMutation.mutateAsync({
          name: editingTemplate.name,
          channel: editingTemplate.channel || "whatsapp",
          category: editingTemplate.category || "General",
          content: editingTemplate.content,
          variables: editingTemplate.variables || [],
          isActive: true,
          usage: 0
        });
        setEditingTemplate({});
        setIsCreating(false);
      } catch (error) {
      }
    }
  };

  const handleUpdateTemplate = async () => {
    if (selectedTemplate && editingTemplate.name && editingTemplate.content) {
      try {
        await updateTemplateMutation.mutateAsync({
          id: selectedTemplate.id,
          updates: editingTemplate
        });
        setEditingTemplate({});
        setIsEditing(false);
      } catch (error) {
      }
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "whatsapp": return "bg-[#25d366]";
      case "sms": return "bg-[#3b82f6]";
      default: return "bg-[#6b7280]";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp": return <MessageCircle className="w-4 h-4" />;
      case "sms": return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#2a2a2f]">Template Manager</h2>
          <p className="text-sm text-[#6b7280]">Create and manage message templates for all channels</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-[#6E4EFF] text-white px-4 py-2 rounded hover:bg-[#5a3fd9] transition-colors"
        >
          + New Template
        </button>
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
        {/* Template List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-[#e5e7eb] p-4">
            <h3 className="font-semibold text-[#2a2a2f] mb-4">Templates ({filteredTemplates.length})</h3>
            <div className="space-y-2">
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
                      <span className="text-lg">{getChannelIcon(template.channel)}</span>
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
                    <span className="text-2xl">{getChannelIcon(selectedTemplate.channel)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-[#2a2a2f]">{selectedTemplate.name}</h3>
                      <p className="text-sm text-[#6b7280]">{selectedTemplate.category} • {selectedTemplate.usage} uses</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditingTemplate(selectedTemplate);
                      }}
                      className="border border-[#d1d5db] text-[#6b7280] px-4 py-2 rounded hover:bg-[#f9fafb] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleTemplateStatus(selectedTemplate.id)}
                      disabled={updateTemplateMutation.isPending}
                      className={`px-4 py-2 rounded transition-colors disabled:opacity-50 ${
                        selectedTemplate.isActive
                          ? "bg-[#f59e0b] text-white hover:bg-[#d97706]"
                          : "bg-[#10b981] text-white hover:bg-[#059669]"
                      }`}
                    >
                      {selectedTemplate.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Template Content */}
              <div className="bg-white rounded-lg border border-[#e5e7eb] p-6">
                <h4 className="font-semibold text-[#2a2a2f] mb-4">Template Content</h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">Message Content</label>
                  <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-md whitespace-pre-wrap">
                    {selectedTemplate.content}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-2">Variables</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <span
                        key={variable}
                        className="bg-[#6E4EFF]/10 text-[#6E4EFF] px-2 py-1 rounded-md text-sm font-medium"
                      >
                        {`{{${variable}}}`}
                      </span>
                    ))}
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
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-[#2a2a2f] mb-2">No Template Selected</h3>
              <p className="text-[#6b7280] mb-4">Select a template from the list to view details and edit</p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-[#6E4EFF] text-white px-4 py-2 rounded-lg hover:bg-[#5a3fd9] transition-colors"
              >
                Create New Template
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Template Modal */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {isCreating ? "Create New Template" : "Edit Template"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Template Name</label>
                  <input
                    type="text"
                    value={editingTemplate.name || ""}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="w-full border border-[#d1d5db] rounded px-3 py-2"
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Channel</label>
                  <CustomDropdown
                    options={[
                      { value: "whatsapp", label: "WhatsApp" },
                      { value: "sms", label: "SMS" }
                    ]}
                    value={editingTemplate.channel || "whatsapp"}
                    onChange={(value) => setEditingTemplate({ ...editingTemplate, channel: value as any })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Category</label>
                <CustomDropdown
                  options={categories.filter(c => c.value !== "all")}
                  value={editingTemplate.category || "General"}
                  onChange={(value) => setEditingTemplate({ ...editingTemplate, category: value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Message Content</label>
                <textarea
                  value={editingTemplate.content || ""}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                  className="w-full border border-[#d1d5db] rounded px-3 py-2"
                  rows={6}
                  placeholder="Enter your message content. Use {{variable_name}} for dynamic content."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2a2a2f] mb-1">Variables (comma-separated)</label>
                <input
                  type="text"
                  value={editingTemplate.variables?.join(", ") || ""}
                  onChange={(e) => setEditingTemplate({ 
                    ...editingTemplate, 
                    variables: e.target.value.split(",").map(v => v.trim()).filter(v => v) 
                  })}
                  className="w-full border border-[#d1d5db] rounded px-3 py-2"
                  placeholder="customer_name, order_id, company_name"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={isCreating ? handleCreateTemplate : handleUpdateTemplate}
                disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}
                className="bg-[#6E4EFF] text-white px-4 py-2 rounded hover:bg-[#5a3fd9] transition-colors disabled:opacity-50"
              >
                {createTemplateMutation.isPending || updateTemplateMutation.isPending 
                  ? (isCreating ? "Creating..." : "Saving...") 
                  : (isCreating ? "Create" : "Save Changes")
                }
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setEditingTemplate({});
                }}
                className="border border-[#d1d5db] text-[#6b7280] px-4 py-2 rounded hover:bg-[#f9fafb] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
