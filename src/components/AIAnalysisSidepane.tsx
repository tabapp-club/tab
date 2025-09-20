'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle
} from "@/components/ui/sheet";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useAuth } from "@/contexts/AuthContext";
import { format } from 'date-fns';
import { useAIAnalysis } from "@/hooks/useAIAnalysis";

interface AnalysisData {
  business_summary: {
    current_value: string;
    previous_value: string;
    percentage_change: string;
    key_factors: string[];
    related_metrics_impact: string;
  };
  reason_identified: {
    primary_cause: string;
    secondary_factors: string[];
    customer_behavior_patterns: string;
    data_evidence: string;
  };
  suggestions: Array<{
    recommendation: string;
    priority: string;
    expected_impact: string;
    timeline: string;
    effort_level: string;
  }>;
  smart_actions: Array<{
    action: string;
    priority: string;
    implementation: string[];
    expected_result: string;
  }>;
}

interface AIAnalysisSidepaneProps {
  isOpen: boolean;
  onClose: () => void;
  cardType: string;
  cardData?: any;
  filterDays?: number;
  dateRange?: { from: Date | null; to: Date | null };
}

// Icon components
const Languages = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
  </svg>
);

const BarChart3 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <div className={className}>
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
  </div>
);

const Lightbulb = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const Target = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" strokeWidth={2} />
    <circle cx="12" cy="12" r="3" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </svg>
);

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
    <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const translations = {
  English: {
    analyzing: 'Analyzing your data...',
    businessSummary: 'Business Summary',
    rootCause: 'Identified Reasons',
    suggestions: 'Strategic Suggestions',
    actions: 'Recommended Actions',
    smartActions: 'Smart Actions',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    timeline: 'Timeline',
    effort: 'Effort',
    impact: 'Expected Impact',
    implementation: 'Implementation',
    expectedResult: 'Expected Result',
  },
  Hindi: {
    analyzing: 'आपका डेटा विश्लेषण कर रहा है...',
    businessSummary: 'व्यवसाय सारांश',
    rootCause: 'पहचाने गए कारण',
    suggestions: 'रणनीतिक सुझाव',
    actions: 'अनुशंसित कार्य',
    smartActions: 'स्मार्ट कार्य',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कम',
    timeline: 'समय सीमा',
    effort: 'प्रयास',
    impact: 'अपेक्षित प्रभाव',
    implementation: 'कार्यान्वयन',
    expectedResult: 'अपेक्षित परिणाम',
  },
  Telugu: {
    analyzing: 'మీ డేటాను విశ్లేషిస్తోంది...',
    businessSummary: 'వ్యాపార సారాంశం',
    rootCause: 'గుర్తించబడిన కారణాలు',
    suggestions: 'వ్యూహాత్మక సూచనలు',
    actions: 'అనుశంసించిన చర్యలు',
    smartActions: 'స్మార్ట్ చర్యలు',
    high: 'అధికం',
    medium: 'మధ్యస్థం',
    low: 'తక్కువ',
    timeline: 'కాలపరిమితి',
    effort: 'ప్రయత్నం',
    impact: 'అంచనా ప్రభావం',
    implementation: 'అమలు',
    expectedResult: 'అంచనా ఫలితం',
  },
};

const languages = ['English', 'Hindi', 'Telugu'];

// Typing effect component
const TypingText = ({ text, speed = 30 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      // Hide cursor when typing is complete
      const timer = setTimeout(() => setShowCursor(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setShowCursor(true);
  }, [text]);

  return (
    <span>
      {displayedText}
      {showCursor && <span className="animate-pulse">|</span>}
    </span>
  );
};

// Modern cascading task loader component
const TaskLoader = ({ onComplete }: { onComplete?: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTimes, setElapsedTimes] = useState([0, 0, 0]);
  const [startTime] = useState(Date.now());
  const [stepDurations] = useState(() => [
    Math.floor(Math.random() * 3) + 3, // Random 3-5 seconds for step 1
    Math.floor(Math.random() * 3) + 3  // Random 3-5 seconds for step 2
  ]);
  const [stepStartTimes, setStepStartTimes] = useState<number[]>([0, 0, 0]);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update the ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const tasks = [
    {
      id: 1,
      title: "Analyzing customer data patterns",
      description: "Examining behavioral trends, purchase history, and engagement metrics across segments"
    },
    {
      id: 2,
      title: "Identifying root causes",
      description: "Correlating factors, detecting anomalies, and mapping customer journey touchpoints"
    },
    {
      id: 3,
      title: "Generating strategic insights",
      description: "Synthesizing findings into actionable recommendations and business strategies"
    }
  ];

  useEffect(() => {
    // Initialize step start times
    const now = Date.now();
    const step1Start = now;
    const step2Start = now + (stepDurations[0] * 1000); // step1 duration + 1s delay
    const step3Start = step2Start + (stepDurations[1] * 1000); // step2 duration + 1s delay

    setStepStartTimes([step1Start, step2Start, step3Start]);
    setCurrentStep(0);
    setIsComplete(false); // Reset completion state

    // Step 1 timer
    const step1Timer = setTimeout(() => {
      setCurrentStep(1);
    }, stepDurations[0] * 1000);

    // Step 2 timer (with delay)
    const step2Timer = setTimeout(() => {
      setCurrentStep(2);
    }, (stepDurations[0] * 1000) + 1000 + (stepDurations[1] * 1000));

    // Step 3 completion timer - ensure minimum time for step 3
    const step3Timer = setTimeout(() => {
      setIsComplete(true);
      // Call the completion callback after a short delay for smooth transition
      setTimeout(() => {
        onCompleteRef.current?.();
      }, 500);
    }, (stepDurations[0] * 1000) + 1000 + (stepDurations[1] * 1000) + 2000); // Add 2 seconds for step 3

    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
    };
  }, [stepDurations]); // Removed onComplete dependency

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();

      setElapsedTimes(prev => {
        const newTimes = [...prev];

        // Step 1: Count from 0s to duration
        if (currentStep >= 0 && currentStep < 1) {
          const step1Elapsed = Math.floor((now - stepStartTimes[0]) / 1000);
          newTimes[0] = Math.min(Math.max(0, step1Elapsed), stepDurations[0]);
        }

        // Step 2: Count from 0s to duration (only when step 2 is active)
        if (currentStep >= 1 && currentStep < 2) {
          const step2Elapsed = Math.floor((now - stepStartTimes[1]) / 1000);
          newTimes[1] = Math.min(Math.max(0, step2Elapsed), stepDurations[1]);
        }

        // Step 3: Continue counting dynamically
        if (currentStep >= 2) {
          const step3Elapsed = Math.floor((now - stepStartTimes[2]) / 1000);
          newTimes[2] = Math.max(0, step3Elapsed);
        }

        return newTimes;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [currentStep, stepStartTimes, stepDurations]);

  return (
    <div className="w-full max-w-md mx-auto">
        <div className={`bg-white rounded-2xl border border-gray-100 p-8 transition-all duration-500 ${
        isComplete ? 'scale-105' : 'scale-100'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#6E4EFF] to-[#8B6AFF] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#2a2a2f] mb-2">AI Analysis in Progress</h3>
          <p className="text-sm text-[#626266]">Processing your customer data with advanced analytics</p>
        </div>

        {/* Task Steps */}
        <div className="space-y-6">
          {tasks.map((task, index) => (
            <div key={task.id} className="relative">
              {/* Step indicator and content */}
              <div className="flex items-start space-x-5">
                {/* Circular dot indicator */}
                <div className="flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                    (currentStep > index) || (index === 2 && isComplete)
                      ? 'bg-gradient-to-br from-[#6E4EFF] to-[#8B6AFF] border-[#6E4EFF] shadow-sm'
                      : currentStep === index
                        ? 'bg-gradient-to-br from-[#6E4EFF] to-[#8B6AFF] border-[#6E4EFF] animate-pulse shadow-md'
                        : 'bg-gray-100 border-gray-200'
                  }`} />
                </div>

                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold transition-all duration-500 ${
                        currentStep >= index ? 'text-[#2a2a2f]' : 'text-gray-400'
                      }`}>
                        {task.title}
                      </h4>
                      <p className={`text-xs leading-relaxed mt-1 transition-all duration-500 ${
                        currentStep >= index ? 'text-[#626266]' : 'text-gray-300'
                      }`}>
                        {task.description}
                      </p>
                    </div>

                    {/* Time indicator */}
                    <div className="flex items-center space-x-2 ml-6">
                      <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                        currentStep >= index ? 'bg-gradient-to-r from-[#6E4EFF]/10 to-[#8B6AFF]/10' : 'bg-transparent'
                      }`}>
                        <ClockIcon />
                      </div>
                      <span className={`text-xs font-mono font-medium transition-all duration-300 ${
                        currentStep >= index ? 'text-[#2a2a2f]' : 'text-gray-300'
                      }`}>
                        {elapsedTimes[index]}s
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting line with animation */}
              {index < tasks.length - 1 && (
                <div className="absolute left-2 top-4 w-px h-12 bg-gray-200 transform -translate-x-1/2">
                  <div className={`w-full h-full bg-gradient-to-b from-blue-500 to-transparent transition-all duration-1000 ${
                    (currentStep > index) || (index === 1 && isComplete) ? 'opacity-100' : 'opacity-0'
                  }`} />
                </div>
              )}
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export function AIAnalysisSidepane({ isOpen, onClose, cardType, cardData, filterDays, dateRange }: AIAnalysisSidepaneProps) {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLoader, setShowLoader] = useState(false);
  const [loaderCompleted, setLoaderCompleted] = useState(false);
  const [isLanguageBottomSheetOpen, setIsLanguageBottomSheetOpen] = useState(false);

  // Use React Query for AI analysis
  const { data: aiResponse, isLoading, error, refetch } = useAIAnalysis({
    cardType,
    filterDays,
    dateRange,
    enabled: isOpen && !!cardType // Only fetch when sidepane is open and we have a valid cardType
  });

  const analysis = aiResponse?.data || null;

  // Show loader immediately when sidepane opens
  useEffect(() => {
    if (isOpen) {
      setShowLoader(true);
      setLoaderCompleted(false);
    } else {
      setShowLoader(false);
      setLoaderCompleted(false);
    }
  }, [isOpen]);

  // Hide loader when it completes
  useEffect(() => {
    if (loaderCompleted) {
      setShowLoader(false);
    }
  }, [loaderCompleted]);

  // Stable callback for TaskLoader completion
  const handleLoaderComplete = useCallback(() => {
    setLoaderCompleted(true);
  }, []);

  // Determine when to show results - only after both API responds AND loader completes
  const shouldShowResults = (aiResponse || error) && loaderCompleted;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full max-w-full sm:w-[480px] sm:max-w-xl md:w-[600px] md:max-w-2xl lg:w-1/2 lg:max-w-none p-0 overflow-y-auto [&>button]:hidden bg-[#f6f6f6]"
      >
        <SheetTitle className="sr-only">Tribly AI Analysis</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Tribly AI Analysis</h2>
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <button
                onClick={() => setIsLanguageBottomSheetOpen(true)}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground rounded px-3 py-1.5 text-sm font-medium hover:bg-secondary/80 transition-colors"
                aria-label="Select language for analysis results"
              >
                <span>{selectedLanguage}</span>
                <Languages className="w-4 h-4 text-gray-500" />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close analysis sidepane"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

            {showLoader ? (
              <div className="flex flex-col items-center justify-center py-12 -mt-16">
                <TaskLoader onComplete={handleLoaderComplete} />
              </div>
          ) : shouldShowResults && error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Analysis Failed</p>
                <p className="text-sm text-gray-600">{error.message}</p>
                                <button
                  onClick={() => refetch()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  aria-label="Retry AI analysis"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : shouldShowResults && analysis && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out -mt-6">
            <div className="space-y-5">
              {/* Business Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-[#6E4EFF]/10 to-[#8B6AFF]/10 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-[#6E4EFF]" />
                  </div>
                  <h3 className="font-bold text-[#2a2a2f]">{translations[selectedLanguage as keyof typeof translations].businessSummary}</h3>
                </div>

                {/* Compact Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#6E4EFF]/10 to-[#8B6AFF]/10 border border-[#6E4EFF]/20 rounded-lg p-3">
                    <p className="text-sm font-semibold text-[#2a2a2f] mb-1">Current Value</p>
                    <p className="text-sm font-semibold text-[#6E4EFF]">
                      {analysis.business_summary.current_value}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#6E4EFF]/10 to-[#8B6AFF]/10 border border-[#6E4EFF]/20 rounded-lg p-3">
                    <p className="text-sm font-semibold text-[#2a2a2f] mb-1">Previous Value</p>
                    <p className="text-sm font-semibold text-[#6E4EFF]">
                      {analysis.business_summary.previous_value}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#6E4EFF]/10 to-[#8B6AFF]/10 border border-[#6E4EFF]/20 rounded-lg p-3">
                    <p className="text-sm font-semibold text-[#2a2a2f] mb-1">Change</p>
                    <p className="text-sm font-semibold text-[#6E4EFF]">
                      {analysis.business_summary.percentage_change}
                    </p>
                  </div>
                </div>

                {/* Key Factors - Compact List */}
                <div className="mb-4">
                  <p className="font-semibold text-[#2a2a2f]">Key Factors:</p>
                  <div>
                    {analysis.business_summary.key_factors.map((factor: string, index: number) => (
                      <div key={index} className="p-2 rounded-lg">
                        <span className="text-sm text-[#2a2a2f] leading-relaxed">
                          {factor}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Metrics Impact - Compact */}
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                  <p className="text-sm font-semibold text-[#2a2a2f] mb-1">Related Metrics Impact:</p>
                  <p className="text-sm text-[#2a2a2f] leading-relaxed">
                    {analysis.business_summary.related_metrics_impact}
                    </p>
                </div>
              </div>

              {/* Reason Analysis */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-[#2a2a2f]">{translations[selectedLanguage as keyof typeof translations].rootCause}</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                    <p className="font-semibold text-[#2a2a2f] mb-2">Primary Cause:</p>
                    <p className="text-sm text-[#2a2a2f] leading-relaxed">
                      {analysis.reason_identified.primary_cause}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-[#2a2a2f]">Secondary Factors:</p>
                    {analysis.reason_identified.secondary_factors.map((factor: string, index: number) => (
                      <div key={index} className="p-2 rounded-xl">
                        <span className="text-sm text-[#2a2a2f] leading-relaxed">
                          {factor}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border border-green-200 rounded-xl p-4">
                    <p className="font-semibold text-[#2a2a2f] mb-2">Customer Behavior Patterns:</p>
                    <p className="text-sm text-[#2a2a2f] leading-relaxed">
                      {analysis.reason_identified.customer_behavior_patterns}
                    </p>
                  </div>
                  <div className="border border-blue-200 rounded-xl p-4">
                    <p className="font-semibold text-[#2a2a2f] mb-2">Data Evidence:</p>
                    <p className="text-sm text-[#2a2a2f] leading-relaxed">
                      {analysis.reason_identified.data_evidence}
                    </p>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {/* <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <Lightbulb className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-[#2a2a2f]">{translations[selectedLanguage as keyof typeof translations].suggestions}</h3>
                </div>
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="border border-gray-100 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <span className="font-semibold text-[#2a2a2f] pr-2 text-[14px]">
                          {suggestion.recommendation}
                        </span>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
                          suggestion.priority.toLowerCase() === 'high' ?
                          'bg-red-100 text-red-500 border border-red-200' :
                          suggestion.priority.toLowerCase() === 'medium' ?
                          'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-green-100 text-green-500 border border-green-200'
                        }`}>
                          {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-[#2a2a2f]">
                          <span className="font-semibold">⏳{translations[selectedLanguage as keyof typeof translations].timeline}:</span> {suggestion.timeline}
                          </p>
                        <p className="text-sm text-[#2a2a2f]">
                          <span className="font-semibold">⚡{translations[selectedLanguage as keyof typeof translations].effort}:</span> {suggestion.effort_level}
                          </p>
                        <p className="text-sm text-[#2a2a2f]">
                          {suggestion.expected_impact}
                          </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Smart Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-[#6E4EFF]/10 to-[#8B6AFF]/10 rounded-xl">
                    <Target className="w-5 h-5 text-[#6E4EFF]" />
                  </div>
                  <h3 className="font-bold text-[#2a2a2f] text-[16px]">{translations[selectedLanguage as keyof typeof translations].smartActions}</h3>
                </div>
                <div className="space-y-4">
                  {analysis.smart_actions.map((action: any, index: number) => (
                    <div key={index} className="border border-gray-100 rounded-xl p-4 bg-white hover:bg-gradient-to-r hover:from-[#6E4EFF]/5 hover:to-[#8B6AFF]/5 transition-colors">
                      <div className="flex items-start justify-between mb-6">
                        <span className="font-semibold text-[#2a2a2f] pr-2 text-[14px]">
                          {action.action}
                        </span>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
                          action.priority.toLowerCase() === 'high' ?
                          'bg-red-100 text-red-600 border border-red-200' :
                          action.priority.toLowerCase() === 'medium' ?
                          'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-green-100 text-green-600 border border-green-200'
                        }`}>
                          {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-[#2a2a2f]">
                            <span className="font-semibold">{translations[selectedLanguage as keyof typeof translations].implementation}:</span>
                          </p>
                        </div>
                        <p className="text-sm text-[#2a2a2f] leading-relaxed mb-4">
                          {action.implementation.map((item: string, index: number) => (
                            <span key={index} className="text-[14px] block p-2">
                              {item}
                            </span>
                          ))}
                        </p>
                        <div className="flex items-center space-x-2">

                          <p className="text-sm text-[#2a2a2f] font-semibold">
                            {action.expected_result}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Privacy Footer */}
          <div className="flex-shrink-0 p-6 pt-6 border-t border-gray-100 flex justify-center">
            <div className="flex justify-center space-x-3">
              <div className="text-xs text-gray-500 leading-relaxed text-center">
                <p className="font-medium text-gray-600 mb-1">🔒 Your data stays private. Always.</p>
                <p>At Tab, we never share your personal information. Your data is encrypted and secure.</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>

    {/* Language Selection Bottom Sheet */}
    <BottomSheet
      isOpen={isLanguageBottomSheetOpen}
      onClose={() => setIsLanguageBottomSheetOpen(false)}
      title="Select Language"
    >
      <div className="py-2">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => {
              setSelectedLanguage(lang);
              setIsLanguageBottomSheetOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors ${
              selectedLanguage === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
            }`}
          >
            <span className="font-medium">{lang}</span>
            {selectedLanguage === lang && (
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </BottomSheet>
    </>
  );
}
