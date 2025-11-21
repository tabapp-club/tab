'use client';

import { useReducer, useCallback, useMemo } from 'react';

// Types
export type HeaderType = 'none' | 'text' | 'image' | 'video' | 'document';

export type Variable = {
  id: string;
  variable: string;
  value: string;
  fallback: string;
};

export type Button = {
  id: string;
  type: 'website' | 'phone' | 'coupon';
  name: string;
  value: string;
  isAdded: boolean;
};

export type HeaderState = {
  type: HeaderType;
  text: string;
  uploadedImage: string | null;
  uploadedVideo: { file: File | null; preview: string | null } | null;
  videoUrl: string;
  uploadedDocument: { file: File | null; preview: string | null } | null;
  documentUrl: string;
  uploadError: string | null;
};

export type SectionVisibility = {
  medium: boolean;
  campaignType: boolean;
  header: boolean;
  body: boolean;
  footer: boolean;
  buttons: boolean;
};

export type AIState = {
  generatedMessages: string[];
  currentMessageIndex: number;
  isGenerating: boolean;
};

export type CampaignMedium = 'whatsapp' | 'sms';
export type CampaignType = 'with-offer' | 'without-offer';

export type CampaignState = {
  language: string;
  medium: CampaignMedium;
  campaignType: CampaignType;
  headerState: HeaderState;
  bodyText: string;
  footerText: string;
  variables: Variable[];
  buttons: Button[];
  aiState: AIState;
  sectionVisibility: SectionVisibility;
};

// Action types
type Action =
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_MEDIUM'; payload: CampaignMedium }
  | { type: 'SET_CAMPAIGN_TYPE'; payload: CampaignType }
  | { type: 'SET_HEADER_TYPE'; payload: HeaderType }
  | { type: 'SET_HEADER_TEXT'; payload: string }
  | { type: 'SET_HEADER_IMAGE'; payload: string | null }
  | { type: 'SET_HEADER_VIDEO'; payload: { file: File | null; preview: string | null } | null }
  | { type: 'SET_HEADER_VIDEO_URL'; payload: string }
  | { type: 'SET_HEADER_DOCUMENT'; payload: { file: File | null; preview: string | null } | null }
  | { type: 'SET_HEADER_DOCUMENT_URL'; payload: string }
  | { type: 'SET_HEADER_ERROR'; payload: string | null }
  | { type: 'RESET_HEADER' }
  | { type: 'RESET_STATE' }
  | { type: 'SET_BODY_TEXT'; payload: string }
  | { type: 'SET_FOOTER_TEXT'; payload: string }
  | { type: 'ADD_VARIABLE'; payload: Variable }
  | { type: 'REMOVE_VARIABLE'; payload: string }
  | { type: 'UPDATE_VARIABLE'; payload: { index: number; field: 'value' | 'fallback'; value: string } }
  | { type: 'UPDATE_BUTTON'; payload: { id: string; field: 'name' | 'value' | 'isAdded'; value: string | boolean } }
  | { type: 'TOGGLE_BUTTON'; payload: string }
  | { type: 'SET_AI_MESSAGES'; payload: string[] }
  | { type: 'SET_AI_INDEX'; payload: number }
  | { type: 'SET_AI_GENERATING'; payload: boolean }
  | { type: 'TOGGLE_SECTION'; payload: keyof SectionVisibility };

// Initial state
const DEFAULT_BUTTONS: Button[] = [
  { id: '1', type: 'website', name: 'Visit us', value: 'https://www.tribly.ai/', isAdded: true },
  { id: '2', type: 'phone', name: 'Call Us', value: '089777719977', isAdded: false },
  { id: '3', type: 'coupon', name: 'Copy offer code', value: 'DWR3355AA', isAdded: false }
];

export const initialState: CampaignState = {
  language: 'english',
  medium: 'whatsapp',
  campaignType: 'with-offer',
  headerState: {
    type: 'image',
    text: '',
    uploadedImage: null,
    uploadedVideo: null,
    videoUrl: '',
    uploadedDocument: null,
    documentUrl: '',
    uploadError: null
  },
  bodyText: 'Hi {{1}}, we miss you! Get 20% off your next purchase. Use code WELCOME20.',
  footerText: 'Reply stop if you want unsubscribe',
  variables: [{ id: '1', variable: '{{1}}', value: 'name', fallback: '' }],
  buttons: DEFAULT_BUTTONS,
  aiState: {
    generatedMessages: [],
    currentMessageIndex: 0,
    isGenerating: false
  },
  sectionVisibility: {
    medium: true,
    campaignType: true,
    header: true,
    body: true,
    footer: true,
    buttons: true
  }
};

// Reducer
function campaignReducer(state: CampaignState, action: Action): CampaignState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'SET_MEDIUM':
      // When switching to SMS, disable header and buttons (not supported in SMS)
      if (action.payload === 'sms') {
        return {
          ...state,
          medium: action.payload,
          headerState: { ...initialState.headerState, type: 'none' },
          buttons: state.buttons.map(btn => ({ ...btn, isAdded: false })),
          sectionVisibility: {
            ...state.sectionVisibility,
            header: false,
            buttons: false
          }
        };
      }
      // When switching to WhatsApp, restore default visibility
      return {
        ...state,
        medium: action.payload,
        sectionVisibility: {
          ...state.sectionVisibility,
          header: true,
          body: true,
          footer: true,
          buttons: true
        }
      };

    case 'SET_CAMPAIGN_TYPE':
      return {
        ...state,
        campaignType: action.payload
      };

    case 'SET_HEADER_TYPE':
      return {
        ...state,
        headerState: { ...state.headerState, type: action.payload }
      };

    case 'SET_HEADER_TEXT':
      return {
        ...state,
        headerState: { ...state.headerState, text: action.payload }
      };

    case 'SET_HEADER_IMAGE':
      return {
        ...state,
        headerState: { 
          ...state.headerState, 
          uploadedImage: action.payload,
          uploadError: null 
        }
      };

    case 'SET_HEADER_VIDEO':
      return {
        ...state,
        headerState: { 
          ...state.headerState, 
          uploadedVideo: action.payload,
          uploadError: null 
        }
      };

    case 'SET_HEADER_VIDEO_URL':
      return {
        ...state,
        headerState: { 
          ...state.headerState, 
          videoUrl: action.payload,
          uploadError: action.payload && !action.payload.match(/^https?:\/\/.+/) 
            ? 'Please enter a valid URL starting with http:// or https://'
            : null
        }
      };

    case 'SET_HEADER_DOCUMENT':
      return {
        ...state,
        headerState: { 
          ...state.headerState, 
          uploadedDocument: action.payload,
          uploadError: null 
        }
      };

    case 'SET_HEADER_DOCUMENT_URL':
      return {
        ...state,
        headerState: { 
          ...state.headerState, 
          documentUrl: action.payload,
          uploadError: action.payload && !action.payload.match(/^https?:\/\/.+/) 
            ? 'Please enter a valid URL starting with http:// or https://'
            : null
        }
      };

    case 'SET_HEADER_ERROR':
      return {
        ...state,
        headerState: { ...state.headerState, uploadError: action.payload }
      };

    case 'RESET_HEADER':
      return {
        ...state,
        headerState: {
          ...state.headerState,
          text: '',
          uploadedImage: null,
          uploadedVideo: null,
          videoUrl: '',
          uploadedDocument: null,
          documentUrl: '',
          uploadError: null
        }
      };

    case 'RESET_STATE':
      return initialState;

    case 'SET_BODY_TEXT':
      return { ...state, bodyText: action.payload };

    case 'SET_FOOTER_TEXT':
      return { ...state, footerText: action.payload };

    case 'ADD_VARIABLE':
      return { ...state, variables: [...state.variables, action.payload] };

    case 'REMOVE_VARIABLE':
      return { 
        ...state, 
        variables: state.variables.filter(v => v.id !== action.payload) 
      };

    case 'UPDATE_VARIABLE':
      return {
        ...state,
        variables: state.variables.map((v, idx) =>
          idx === action.payload.index
            ? { ...v, [action.payload.field]: action.payload.value }
            : v
        )
      };

    case 'UPDATE_BUTTON':
      return {
        ...state,
        buttons: state.buttons.map(btn =>
          btn.id === action.payload.id
            ? { ...btn, [action.payload.field]: action.payload.value }
            : btn
        )
      };

    case 'TOGGLE_BUTTON':
      return {
        ...state,
        buttons: state.buttons.map(btn =>
          btn.id === action.payload ? { ...btn, isAdded: !btn.isAdded } : btn
        )
      };

    case 'SET_AI_MESSAGES':
      return {
        ...state,
        aiState: { ...state.aiState, generatedMessages: action.payload }
      };

    case 'SET_AI_INDEX':
      return {
        ...state,
        aiState: { ...state.aiState, currentMessageIndex: action.payload }
      };

    case 'SET_AI_GENERATING':
      return {
        ...state,
        aiState: { ...state.aiState, isGenerating: action.payload }
      };

    case 'TOGGLE_SECTION':
      return {
        ...state,
        sectionVisibility: {
          ...state.sectionVisibility,
          [action.payload]: !state.sectionVisibility[action.payload]
        }
      };

    default:
      return state;
  }
}

// Custom hook with memoized dispatchers
export function useCampaignState() {
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  // Memoized action functions
  const setLanguage = useCallback((language: string) => 
    dispatch({ type: 'SET_LANGUAGE', payload: language }), []);
  
  const setMedium = useCallback((medium: CampaignMedium) => 
    dispatch({ type: 'SET_MEDIUM', payload: medium }), []);
  
  const setCampaignType = useCallback((type: CampaignType) => 
    dispatch({ type: 'SET_CAMPAIGN_TYPE', payload: type }), []);
  
  const setHeaderType = useCallback((type: HeaderType) => 
    dispatch({ type: 'SET_HEADER_TYPE', payload: type }), []);
  
  const setHeaderText = useCallback((text: string) => 
    dispatch({ type: 'SET_HEADER_TEXT', payload: text }), []);
  
  const setHeaderImage = useCallback((image: string | null) => 
    dispatch({ type: 'SET_HEADER_IMAGE', payload: image }), []);
  
  const setHeaderVideo = useCallback((video: { file: File | null; preview: string | null } | null) => 
    dispatch({ type: 'SET_HEADER_VIDEO', payload: video }), []);
  
  const setHeaderVideoUrl = useCallback((url: string) => 
    dispatch({ type: 'SET_HEADER_VIDEO_URL', payload: url }), []);
  
  const setHeaderDocument = useCallback((doc: { file: File | null; preview: string | null } | null) => 
    dispatch({ type: 'SET_HEADER_DOCUMENT', payload: doc }), []);
  
  const setHeaderDocumentUrl = useCallback((url: string) => 
    dispatch({ type: 'SET_HEADER_DOCUMENT_URL', payload: url }), []);
  
  const setHeaderError = useCallback((error: string | null) => 
    dispatch({ type: 'SET_HEADER_ERROR', payload: error }), []);
  
  const resetHeader = useCallback(() => 
    dispatch({ type: 'RESET_HEADER' }), []);
  
  const resetState = useCallback(() => 
    dispatch({ type: 'RESET_STATE' }), []);
  
  const setBodyText = useCallback((text: string) => 
    dispatch({ type: 'SET_BODY_TEXT', payload: text }), []);
  
  const setFooterText = useCallback((text: string) => 
    dispatch({ type: 'SET_FOOTER_TEXT', payload: text }), []);
  
  const addVariable = useCallback((variable: Variable) => 
    dispatch({ type: 'ADD_VARIABLE', payload: variable }), []);
  
  const removeVariable = useCallback((id: string) => 
    dispatch({ type: 'REMOVE_VARIABLE', payload: id }), []);
  
  const updateVariable = useCallback((index: number, field: 'value' | 'fallback', value: string) => 
    dispatch({ type: 'UPDATE_VARIABLE', payload: { index, field, value } }), []);
  
  const updateButton = useCallback((id: string, field: 'name' | 'value' | 'isAdded', value: string | boolean) => 
    dispatch({ type: 'UPDATE_BUTTON', payload: { id, field, value } }), []);
  
  const toggleButton = useCallback((id: string) => 
    dispatch({ type: 'TOGGLE_BUTTON', payload: id }), []);
  
  const setAIMessages = useCallback((messages: string[]) => 
    dispatch({ type: 'SET_AI_MESSAGES', payload: messages }), []);
  
  const setAIIndex = useCallback((index: number) => 
    dispatch({ type: 'SET_AI_INDEX', payload: index }), []);
  
  const setAIGenerating = useCallback((isGenerating: boolean) => 
    dispatch({ type: 'SET_AI_GENERATING', payload: isGenerating }), []);
  
  const toggleSection = useCallback((section: keyof SectionVisibility) => 
    dispatch({ type: 'TOGGLE_SECTION', payload: section }), []);

  // Memoize the actions object to prevent recreation on every render
  const actions = useMemo(() => ({
    setLanguage,
    setMedium,
    setCampaignType,
    setHeaderType,
    setHeaderText,
    setHeaderImage,
    setHeaderVideo,
    setHeaderVideoUrl,
    setHeaderDocument,
    setHeaderDocumentUrl,
    setHeaderError,
    resetHeader,
    resetState,
    setBodyText,
    setFooterText,
    addVariable,
    removeVariable,
    updateVariable,
    updateButton,
    toggleButton,
    setAIMessages,
    setAIIndex,
    setAIGenerating,
    toggleSection
  }), [
    setLanguage,
    setMedium,
    setCampaignType,
    setHeaderType,
    setHeaderText,
    setHeaderImage,
    setHeaderVideo,
    setHeaderVideoUrl,
    setHeaderDocument,
    setHeaderDocumentUrl,
    setHeaderError,
    resetHeader,
    resetState,
    setBodyText,
    setFooterText,
    addVariable,
    removeVariable,
    updateVariable,
    updateButton,
    toggleButton,
    setAIMessages,
    setAIIndex,
    setAIGenerating,
    toggleSection
  ]);

  return { state, actions };
}

