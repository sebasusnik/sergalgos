# Family Stories API Route

This API route (`/api/stories`) provides family testimonial data for the Sergalgos application through Google Sheets integration with CSV export functionality.

## Overview

- **Endpoint**: `GET /api/stories`
- **Response**: JSON object containing an array of family stories
- **Data Source**: Google Sheets (same sheet as products but different tab)
- **Parsing**: CSV data processing with bilingual column support

## API Response Format

```json
{
  "stories": [
    {
      "id": "string",
      "dogName": "string",
      "ownerName": "string", 
      "testimonial": "string",
      "image": "string (URL)"
    }
  ],
  "error": "string (optional - only present when using fallback data)"
}
```

## Google Sheets Setup

### 1. Create Your Stories Sheet Tab

In your existing Google Sheet (the same one used for products), create a new tab/sheet called "Stories" with the following column structure:

| Column | English Header | Spanish Header | Type | Description |
|--------|---------------|----------------|------|-------------|
| A | `id` | `id` | string | Unique story identifier |
| B | `dogName` | `nombre_perro` | string | Name of the adopted galgo |
| C | `ownerName` | `nombre_dueno` | string | Name of the adoptive family |
| D | `testimonial` | `testimonio` | string | Family testimonial text |
| E | `image` | `imagen` | string | Photo URL of the dog |

### 2. Example Sheet Data

```
id | dogName | ownerName | testimonial                                                              | image
1  | Luna    | Malvina   | Luna ha traído tanta alegría a nuestras vidas. Es la perra más dulce... | https://example.com/luna.jpg
2  | Max     | Macarena  | Max se adaptó rápidamente a nuestro hogar y ahora es un miembro...      | https://example.com/max.jpg
3  | Bella   | Carlos    | Bella es tan cariñosa y gentil. No podemos imaginar nuestras vidas...   | https://example.com/bella.jpg
```

### 3. Publish Stories Sheet as CSV

1. Open your Google Sheet
2. Click on the **Stories** tab at the bottom
3. Go to **File** → **Share** → **Publish to web**
4. In the **Link** tab:
   - **Sheet**: Select "Stories" (not the products sheet)
   - **Format**: Choose "Comma-separated values (.csv)"
5. Check **"Automatically republish when changes are made"**
6. Click **Publish**
7. Copy the generated CSV URL

**Important**: The URL should look like:
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=STORIES_SHEET_GID
```

Note the different `gid` parameter - this identifies the specific "Stories" tab, not the products tab.

### 4. Configure Environment Variable

Add the stories CSV URL to your environment configuration:

```bash
# .env.local
GOOGLE_SHEETS_STORIES_CSV_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=STORIES_SHEET_GID
```

## Data Processing Features

### Bilingual Column Support
The API automatically handles both English and Spanish column headers:
- `dogName` / `nombre_perro`
- `ownerName` / `nombre_dueno`
- `testimonial` / `testimonio`
- `image` / `imagen`

### Data Validation
- Stories without testimonials are filtered out
- Empty rows are automatically skipped
- Malformed data is logged but doesn't break the API
- Auto-generated IDs for stories without explicit IDs

## Error Handling & Fallback

The API includes robust error handling:

1. **No CSV URL**: Returns mock stories if `GOOGLE_SHEETS_STORIES_CSV_URL` is not configured
2. **Fetch Error**: Falls back to mock stories if the CSV URL is unreachable
3. **Parse Error**: Logs warnings but continues processing valid rows
4. **Empty Data**: Returns mock stories if no valid stories are found

## Mock Stories

The route includes 3 mock stories as fallback:
- Luna (adopted by Malvina)
- Max (adopted by Macarena)
- Bella (adopted by Carlos)

## Technical Details

### Dependencies
- `papaparse`: CSV parsing library
- Same dependencies as the products API

### Caching
- **Policy**: `cache: 'no-store'`
- **Behavior**: Always fetches fresh data from Google Sheets
- **Rationale**: Ensures testimonial updates are immediately reflected

### Performance Considerations
- CSV parsing happens server-side
- Error handling prevents API failures
- Mock data ensures consistent user experience

## Usage in Components

The API is consumed by server components:

```typescript
// lib/family-stories.ts
import { FamilyStory } from '../contexts/cart-context'

export async function fetchFamilyStories(): Promise<FamilyStory[]> {
  const response = await fetch(`${baseUrl}/api/stories`, {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  const data = await response.json()
  return data.stories || []
}

// components/family-stories.tsx
export async function FamilyStories() {
  const stories = await fetchFamilyStories()
  
  return (
    <div>
      {stories.slice(0, 3).map((story) => (
        <div key={story.id}>
          <img src={story.image} alt={story.dogName} />
          <h3>{story.ownerName}</h3>
          <p>"{story.testimonial}"</p>
        </div>
      ))}
    </div>
  )
}
```

## Troubleshooting

### Common Issues

1. **Empty Stories Array**
   - Check if `GOOGLE_SHEETS_STORIES_CSV_URL` is correctly configured
   - Verify the Stories sheet tab is published and accessible
   - Ensure the GID parameter points to the correct sheet tab

2. **Wrong Sheet Data Loading**
   - Double-check the GID in your CSV URL corresponds to the Stories tab
   - Verify you're not using the same GID as the products sheet

3. **Images Not Loading**
   - Ensure image URLs in the sheet are accessible
   - Check for proper URL formatting

4. **Missing Testimonials**
   - Verify testimonial text is not empty in the sheet
   - Check for proper column naming (testimonial/testimonio)

### Debug Information

The API logs helpful information to the console:
- CSV parsing errors and warnings
- Fallback data usage notifications
- Story filtering statistics

### Getting the Correct GID

To find the GID for your Stories tab:
1. Open your Google Sheet
2. Click on the Stories tab
3. Look at the URL - it will show `#gid=XXXXXXXX`
4. Use that number as the GID in your CSV URL