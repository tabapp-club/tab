"use client";

interface CustomerValidationProps {
  validation: {
    isValidating: boolean;
    customerFound: boolean;
    customerData: any;
  };
}

export function CustomerValidation({ validation }: CustomerValidationProps) {
  if (validation.isValidating) {
    return (
      <div className="mt-2 flex items-center text-sm text-blue-600">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Checking customer...
      </div>
    );
  }

  if (validation.customerFound && validation.customerData) {
    return (
      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-800">
              Existing customer found: {validation.customerData.name}
            </p>
            {validation.customerData.email && (
              <p className="text-xs text-green-600">{validation.customerData.email}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!validation.isValidating && validation.customerData === null) {
    return (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-blue-800">
            New customer - please fill in the customer details
          </p>
        </div>
      </div>
    );
  }

  return null;
}
