# Adoption Form API Route

This API route (`/api/adoptar`) handles pre-adoption form submissions for the Sergalgos rescue organization. It processes form data, generates a PDF document, and sends it via email with attached photos.

## Overview

- **Endpoint**: `POST /api/adoptar`
- **Content-Type**: `multipart/form-data`
- **Purpose**: Process adoption application forms with file uploads
- **Response**: JSON with success/error status

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Formulario enviado correctamente"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error stack (in development)"
}
```

## Form Data Structure

### Required Personal Information Fields
- `fullName`: Applicant's full name
- `dni`: National ID number
- `address`: Home address
- `neighborhood`: Neighborhood name
- `city`: City name
- `phone`: Phone number(s)
- `email`: Email address
- `socialMedia`: Social media username (Facebook/Instagram)

### Questionnaire Fields (q1-q25)
The form includes 25 detailed questions covering:

1. **Household Information** (q1-q4)
   - Family size and ages
   - Family agreement on adoption
   - Occupations and professions

2. **Pet Experience** (q5-q8)
   - Current pets and their status
   - Previous pet ownership experience
   - Pet temperament and housing arrangements

3. **Motivation and Commitment** (q9-q10, q22)
   - Reasons for adoption
   - Long-term commitment understanding

4. **Living Situation** (q11-q15)
   - Home type and security
   - Property ownership/rental status
   - Contingency planning

5. **Daily Care** (q16-q21)
   - Sleeping arrangements
   - Exercise schedule and responsibility
   - Time alone and vacation plans

6. **Process Agreement** (q23-q25)
   - Interview and follow-up acceptance
   - Photo documentation requirement
   - Transportation cost agreement ($20,000)

### File Attachments
- **Field Pattern**: `file_*` (e.g., `file_1`, `file_2`)
- **Purpose**: Photos of the living space and yard
- **Limit**: 50MB total size across all files
- **Formats**: Standard image formats (JPG, PNG, etc.)

## Features

### Form Data Processing
- **Multipart Parsing**: Handles form data with file uploads
- **File Type Detection**: Supports various file object types (browser compatibility)
- **Size Validation**: Enforces 50MB total file size limit
- **Field Extraction**: Separates form fields from file uploads

### PDF Generation
- **Library**: jsPDF for client-side PDF creation
- **Format**: A4 portrait orientation
- **Layout**: Two-column design for personal information
- **Sections**:
  - Header with form title
  - Personal data (8 fields in 2 columns)
  - Questionnaire (25 questions with answers)
- **Pagination**: Automatic page breaks when content exceeds page height
- **Styling**: Bold headers, normal text, gray color for answers

### Email System
- **Transport**: Nodemailer with SMTP configuration
- **PDF Attachment**: Generated form as PDF
- **Photo Attachments**: All uploaded images
- **HTML Email**: Formatted summary with key applicant details
- **Connection Verification**: SMTP server validation before sending

## Environment Configuration

### Required Environment Variables

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com          # SMTP server hostname
SMTP_PORT=587                     # SMTP port (587 for TLS, 465 for SSL)
SMTP_USER=your-email@gmail.com    # SMTP username/email
SMTP_PASS=your-app-password       # SMTP password or app password

# Email Recipients
ADOPTION_EMAIL=adopciones@refugio.com  # Destination email for forms
```

### SMTP Configuration Options
- **Host**: Default `smtp.gmail.com`
- **Port**: Default `587` (TLS)
- **Security**: TLS enabled, certificate validation disabled
- **Connection Pool**: Single connection with pooling enabled
- **Authentication**: Username/password based

## File Handling

### File Processing Features
- **Multi-format Support**: Handles various browser file object implementations
- **Size Validation**: Individual and total file size checking
- **Error Recovery**: Continues processing even if individual files fail
- **Base64 Encoding**: Converts files to base64 for email attachment
- **Filename Generation**: Creates descriptive filenames with applicant name

### File Size Limits
- **Total Limit**: 50MB across all uploaded files
- **Individual Files**: No specific limit per file
- **Error Handling**: Returns error if total size exceeds limit

## Security Features

### Input Validation
- **Required Fields**: Validates presence of SMTP credentials
- **File Size**: Prevents memory exhaustion with size limits
- **Error Sanitization**: Prevents sensitive information exposure

### Email Security
- **TLS Encryption**: Secure email transmission
- **Connection Verification**: Validates SMTP before sending
- **Authentication**: Required SMTP credentials

## Error Handling

### Common Error Scenarios

1. **Missing Environment Variables**
   ```
   SMTP_USER environment variable is not set
   SMTP_PASS environment variable is not set
   ```

2. **File Size Exceeded**
   ```
   Total file size too large: XXX.XXmb > 50MB
   ```

3. **SMTP Connection Issues**
   ```
   SMTP server connection failed: [error details]
   ```

4. **Email Sending Failures**
   - Network connectivity issues
   - Authentication problems
   - Invalid recipient addresses

### Error Recovery
- **Graceful Degradation**: Continues processing valid files even if some fail
- **Detailed Logging**: Comprehensive error information for debugging
- **User-Friendly Messages**: Clear error messages for end users

## Usage Example

### Frontend Form Submission
```typescript
const formData = new FormData()

// Add personal information
formData.append('fullName', 'Juan Pérez')
formData.append('email', 'juan@email.com')
formData.append('phone', '123-456-7890')

// Add questionnaire responses
formData.append('q1', '4 personas')
formData.append('q2', '35, 32, 8, 5 años')

// Add files
formData.append('file_1', photoFile1)
formData.append('file_2', photoFile2)

// Submit form
const response = await fetch('/api/adoptar', {
  method: 'POST',
  body: formData
})

const result = await response.json()
```

### Generated PDF Structure
```
Formulario de Preadopción
========================

Datos del Adoptante
------------------
Nombres y Apellidos: Juan Pérez        DNI: 12345678
Domicilio: Calle 123                   Barrio: Centro
Ciudad: Buenos Aires                   Teléfonos: 123-456-7890
E-Mail: juan@email.com                 Usuario en redes: @juanperez

Cuestionario
-----------
1. ¿Cuántas personas viven en la casa?
   4 personas

2. ¿De qué edades?
   35, 32, 8, 5 años

[... continues with all 25 questions]
```

## Troubleshooting

### Common Issues

1. **Form Not Sending**
   - Verify SMTP environment variables are set
   - Check SMTP server connectivity
   - Validate email credentials

2. **Files Not Attaching**
   - Ensure total file size under 50MB
   - Check file format compatibility
   - Verify files are properly uploaded

3. **PDF Generation Issues**
   - Check for special characters in form responses
   - Verify all required fields are present

4. **Email Delivery Problems**
   - Check spam/junk folders
   - Verify recipient email address
   - Ensure SMTP server allows the sender domain

### Debug Tips
- Enable SMTP debug mode in development
- Check server logs for detailed error information
- Test with smaller file sizes first
- Verify environment variables in deployment

## Dependencies

### Core Libraries
- **nodemailer**: Email sending functionality
- **jsPDF**: PDF generation and formatting
- **Next.js**: Request/response handling and FormData parsing

### File Processing
- Native FormData API for multipart handling
- Buffer API for file encoding
- Built-in file validation and processing