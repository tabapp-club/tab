'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle
} from "@/components/ui/sheet";
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
  Spanish: {
    analyzing: 'Analizando tus datos...',
    businessSummary: 'Resumen del Negocio',
    rootCause: 'Causas Identificadas',
    suggestions: 'Sugerencias Estratégicas',
    actions: 'Acciones Recomendadas',
    smartActions: 'Acciones Inteligentes',
    high: 'Alto',
    medium: 'Medio',
    low: 'Bajo',
    timeline: 'Cronograma',
    effort: 'Esfuerzo',
    impact: 'Impacto Esperado',
    implementation: 'Implementación',
    expectedResult: 'Resultado Esperado',
  },
  French: {
    analyzing: 'Analyse de vos données...',
    businessSummary: 'Résumé de l\'Entreprise',
    rootCause: 'Causes Identifiées',
    suggestions: 'Suggestions Stratégiques',
    actions: 'Actions Recommandées',
    smartActions: 'Actions Intelligentes',
    high: 'Élevé',
    medium: 'Moyen',
    low: 'Faible',
    timeline: 'Calendrier',
    effort: 'Effort',
    impact: 'Impact Attendu',
    implementation: 'Implémentation',
    expectedResult: 'Résultat Attendu',
  },
};

const languages = ['English', 'Spanish', 'French'];

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
const TaskLoader = ({
  isComplete = false,
  apiResponseReceived = false,
  onStep3MinTimeReached,
  onStep3Completed
}: {
  isComplete?: boolean;
  apiResponseReceived?: boolean;
  onStep3MinTimeReached?: (reached: boolean) => void;
  onStep3Completed?: (completed: boolean) => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTimes, setElapsedTimes] = useState([0, 0, 0]);
  const [startTime] = useState(Date.now());
  const [stepDurations] = useState(() => [
    Math.floor(Math.random() * 3) + 3, // Random 3-5 seconds for step 1
    Math.floor(Math.random() * 3) + 3  // Random 3-5 seconds for step 2
  ]);
  const [stepStartTimes, setStepStartTimes] = useState<number[]>([0, 0, 0]);
  const [step3Started, setStep3Started] = useState(false);
  const [step3MinTimeReached, setStep3MinTimeReached] = useState(false);
  const [step3Completed, setStep3Completed] = useState(false);
  const step3MinTimeReachedRef = useRef(false);
  const shouldTriggerCallbackRef = useRef(false);
  const shouldTriggerCompletionRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    step3MinTimeReachedRef.current = false;
    shouldTriggerCallbackRef.current = false;
    shouldTriggerCompletionRef.current = false;
    setStep3Completed(false);

    // Step 1 timer
    const step1Timer = setTimeout(() => {
      setCurrentStep(1);
    }, stepDurations[0] * 1000);

    // Step 2 timer (with delay)
    const step2Timer = setTimeout(() => {
      setCurrentStep(2);
      setStep3Started(true);
    }, (stepDurations[0] * 1000) + 1000 + (stepDurations[1] * 1000));

    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
    };
  }, [stepDurations]);

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

        // Step 3: Continue counting dynamically until API response (minimum 2s)
        if (currentStep >= 2) {
          const step3Elapsed = Math.floor((now - stepStartTimes[2]) / 1000);
          newTimes[2] = Math.max(0, step3Elapsed);

          if (step3Elapsed >= 3 && !step3MinTimeReachedRef.current) {
            setStep3MinTimeReached(true);
            step3MinTimeReachedRef.current = true;
            shouldTriggerCallbackRef.current = true;
          }

          if (apiResponseReceived && step3MinTimeReachedRef.current) {
            shouldTriggerCompletionRef.current = true;
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return prev;
          }
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
  }, [currentStep, stepStartTimes, stepDurations, apiResponseReceived]);

  // Handle step 3 minimum time reached callback
  useEffect(() => {
    if (shouldTriggerCallbackRef.current) {
      onStep3MinTimeReached?.(true);
      shouldTriggerCallbackRef.current = false;
    }
  }, [step3MinTimeReached, onStep3MinTimeReached]);

  // Additional effect to ensure callback is triggered
  useEffect(() => {
    if (step3MinTimeReached && shouldTriggerCallbackRef.current) {
      onStep3MinTimeReached?.(true);
      shouldTriggerCallbackRef.current = false;
    }
  }, [step3MinTimeReached, onStep3MinTimeReached]);

  // Handle step 3 completion trigger
  useEffect(() => {
    if (shouldTriggerCompletionRef.current) {
      setStep3Completed(true);
      onStep3Completed?.(true);
      shouldTriggerCompletionRef.current = false;
    }
  }, [onStep3Completed]);

  const ClockIcon = () => (
    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
      <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-lg p-8 transition-all duration-500 ${
        isComplete && step3Started ? 'scale-105 shadow-xl' : 'scale-100'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
          <p className="text-sm text-gray-600">Processing your customer data with advanced analytics</p>
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
                    (currentStep > index) || (index === 2 && step3Completed)
                      ? 'bg-green-500 border-green-500 shadow-sm'
                      : currentStep === index
                        ? 'bg-blue-500 border-blue-500 animate-pulse shadow-md'
                        : 'bg-gray-100 border-gray-200'
                  }`} />
                </div>

                {/* Task content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold transition-all duration-500 ${
                        currentStep >= index ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {task.title}
                      </h4>
                      <p className={`text-xs leading-relaxed mt-1 transition-all duration-500 ${
                        currentStep >= index ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        {task.description}
                      </p>
                    </div>

                    {/* Time indicator */}
                    <div className="flex items-center space-x-2 ml-6">
                      <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                        currentStep >= index ? 'bg-gray-50' : 'bg-transparent'
                      }`}>
                        <ClockIcon />
                      </div>
                      <span className={`text-xs font-mono font-medium transition-all duration-300 ${
                        currentStep >= index ? 'text-gray-700' : 'text-gray-300'
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
                    (currentStep > index) || (index === 1 && step3Completed) ? 'opacity-100' : 'opacity-0'
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [apiResponseReceived, setApiResponseReceived] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [step3MinTimeReached, setStep3MinTimeReached] = useState(false);
  const [step3Completed, setStep3Completed] = useState(false);

  // Use React Query for AI analysis
  const { data: aiResponse, isLoading, error, refetch } = useAIAnalysis({
    cardType,
    filterDays,
    dateRange,
    enabled: isOpen && !isAnalyzing // Only fetch when sidepane is open and not already analyzing
  });

  const analysis = aiResponse?.data || null;



  // Handle completion when step 3 is completed
  useEffect(() => {
    if (step3Completed && isAnalyzing) {
      setIsComplete(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setTimeout(() => {
          setIsComplete(false);
          setApiResponseReceived(false);
          setStep3MinTimeReached(false);
          setStep3Completed(false);
        }, 500);
      }, 1000);
    }
  }, [step3Completed, isAnalyzing]);

  // Handle starting analysis when sidepane opens and data is available
  useEffect(() => {
    if (isOpen && aiResponse && !isAnalyzing) {
      setIsAnalyzing(true);
      setStartTime(Date.now());
      setApiResponseReceived(true);
    }
  }, [isOpen, aiResponse, isAnalyzing]);

  // Reset state when sidepane closes
  useEffect(() => {
    if (!isOpen) {
      setIsAnalyzing(false);
      setIsComplete(false);
      setApiResponseReceived(false);
      setStartTime(0);
      setStep3MinTimeReached(false);
      setStep3Completed(false);
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full max-w-full sm:w-[480px] sm:max-w-xl md:w-[600px] md:max-w-2xl lg:w-1/2 lg:max-w-none p-0 overflow-y-auto"
      >
        <SheetTitle className="sr-only">Tab AI Analysis</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Tab AI Analysis</h2>
            <div className="flex items-center">
              {/* Language Selector */}
              <div className="relative mr-6">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  aria-label="Select language for analysis results"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <Languages className="absolute right-2 top-1.5 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-12">
                                <TaskLoader
                  isComplete={isComplete}
                  apiResponseReceived={apiResponseReceived}
                  onStep3MinTimeReached={(reached) => {
                    setStep3MinTimeReached(reached);
                  }}
                  onStep3Completed={(completed) => {
                    setStep3Completed(completed);
                  }}
                />
            </div>
          ) : error ? (
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
          ) : analysis && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
            <div className="space-y-5">
              {/* Business Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-800">{translations[selectedLanguage as keyof typeof translations].businessSummary}</h3>
                </div>

                {/* Compact Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-sm font-semibold text-[#2a2a2f] mb-1">Current Value</p>
                    <p className="text-sm font-semibold text-[#2a2a2f]">
                      {analysis.business_summary.current_value}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <p className="text-sm font-semibold text-[#2a2a2f] mb-1">Previous Value</p>
                    <p className="text-sm font-semibold text-[#2a2a2f]">
                      {analysis.business_summary.previous_value}
                    </p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <p className="text-sm font-semibold text-[#2a2a2f] mb-1">Change</p>
                    <p className="text-sm font-semibold text-[#2a2a2f]">
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
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
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
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-50 rounded-xl">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-[#2a2a2f] text-[16px]">{translations[selectedLanguage as keyof typeof translations].smartActions}</h3>
                </div>
                <div className="space-y-4">
                  {analysis.smart_actions.map((action: any, index: number) => (
                    <div key={index} className="border border-gray-100 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-6">
                        <span className="font-semibold text-[#2a2a2f] pr-2 text-[14px]">
                          {action.action}
                        </span>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
                          action.priority.toLowerCase() === 'high' ?
                          'bg-red-100 text-red-500 border border-red-200' :
                          action.priority.toLowerCase() === 'medium' ?
                          'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-green-100 text-green-500 border border-green-200'
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
  );
}
