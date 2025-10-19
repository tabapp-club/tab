# Invoice Templates Feature

This feature allows businesses to customize their invoice templates and business details for professional invoice generation.

## Features

### Business Details Customization
- **Business Information**: Name, logo, address, city, state, PIN code
- **Contact Details**: Phone number and email address
- **Tax Information**: GSTIN (required), PAN (optional), CIN (optional)
- **Place of Supply**: Required for GST calculations
- **Signature/Seal**: Optional signature or seal image

### Template Selection
Three professional templates available:

1. **Basic Template**
   - Clean, single-column layout
   - Minimal borders
   - System fonts
   - Mobile-friendly

2. **Modern Template**
   - Bold headings
   - Card layout with rounded corners
   - Soft separators
   - Gradient accents

3. **Elegant Template**
   - Serif headings
   - Thin dividers
   - Light spacing
   - Signature emphasis

### Invoice Preview
- **Mobile-first design**: 360-414px width frame
- **Live updates**: Changes reflect immediately
- **Sample data**: Pre-populated with realistic invoice data
- **GST calculations**: Automatic CGST/SGST vs IGST based on state comparison
- **Indian formatting**: INR currency and amount in words

## Technical Implementation

### File Structure
```
src/app/settings/invoices/templates/
├── page.tsx                           # Main page component
├── InvoiceTemplatesContent.tsx        # Main content component
├── utils.ts                          # Utility functions
└── components/
    ├── BusinessDetailsForm.tsx        # Business details form
    ├── TemplatePicker.tsx             # Template selection
    └── InvoicePreview.tsx             # Invoice preview
```

### Key Components

#### BusinessDetailsForm
- Form validation for all required fields
- File upload for logo and signature
- Real-time validation feedback
- Save and reset functionality

#### TemplatePicker
- Radio card selection interface
- Template preview thumbnails
- Feature descriptions
- Accessibility support

#### InvoicePreview
- Mobile frame simulation
- Dynamic template styling
- Sample invoice data
- GST tax calculations
- Action buttons (public link, download)

### Utility Functions

#### Currency & Formatting
- `formatINR(amount)`: Format numbers as Indian Rupees
- `amountInWordsINR(amount)`: Convert numbers to Indian words

#### Tax Calculations
- `computeGSTSplit(businessState, placeOfSupply, amount, rate)`: Calculate CGST/SGST vs IGST

#### Validation
- `validateGSTIN(gstin)`: Validate 15-character GSTIN format
- `validatePAN(pan)`: Validate 10-character PAN format
- `validatePIN(pin)`: Validate 6-digit PIN code
- `validateEmail(email)`: Validate email format
- `validatePhone(phone)`: Validate Indian mobile number

## Usage

1. Navigate to Settings → Invoice Templates
2. Fill in business details in the "Business Details" tab
3. Select a template in the "Template & Preview" tab
4. Preview changes in real-time in the mobile frame
5. Save settings or reset to defaults

## Sample Invoice Data

The preview uses realistic sample data:
- **Customer**: Rahul Verma, Hyderabad, Telangana
- **Items**: Dental consultation, X-ray, teeth cleaning
- **GST Rate**: 18%
- **Invoice Number**: INV-2025-00123

## Mobile-First Design

The invoice preview is optimized for mobile devices since invoices are typically viewed via SMS links on smartphones. The 360-414px frame simulates common mobile screen sizes.

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Focus indicators

## Future Enhancements

- PDF generation
- Email integration
- Custom field addition
- Multiple signature support
- Template customization options
- Bulk invoice generation
