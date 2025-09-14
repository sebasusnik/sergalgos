# Products API Route

This API route (`/api/products`) provides product data for the Sergalgos e-commerce application through Google Sheets integration with CSV export functionality.

## Overview

- **Endpoint**: `GET /api/products`
- **Response**: JSON object containing an array of products
- **Data Source**: Google Sheets (with mock data fallback)
- **Parsing**: CSV data processing with bilingual column support

## API Response Format

```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "price": number,
      "image": "string (URL)",
      "images": ["string (URL)"] | undefined,
      "description": "string",
      "category": "string",
      "colors": [{"name": "string", "hex": "string"}] | undefined
    }
  ],
  "error": "string (optional - only present when using fallback data)"
}
```

## Google Sheets Setup

### 1. Create Your Product Sheet

Create a Google Sheet with the following column structure:

| Column | English Header | Spanish Header | Type | Description |
|--------|---------------|----------------|------|-------------|
| A | `id` | `id` | string | Unique product identifier |
| B | `name` | `nombre` | string | Product name |
| C | `price` | `precio` | number | Product price (numeric value) |
| D | `image` | `imagen` | string | Primary product image URL |
| E | `images` | `imagenes` | string | Comma-separated image URLs (optional) |
| F | `description` | `descripcion` | string | Product description |
| G | `category` | `categoria` | string | Product category |
| H | `colors` | `colores` | string | Comma-separated color names (optional) |

### 2. Example Sheet Data

```
id | name              | price | image                           | description                    | category    | colors
1  | Collar para Galgo | 2500  | https://example.com/collar.jpg  | Collar diseñado para galgos    | accesorios  | Rojo,Azul,Negro
2  | Cama Ortopédica   | 8900  | https://example.com/cama.jpg    | Cama ortopédica extra suave    | comodidad   | Gris,Beige
3  | Abrigo Térmico    | 4200  | https://example.com/abrigo.jpg  | Abrigo térmico para el frío    | ropa        | Verde,Negro,Rosa
```

### 3. Publish Sheet as CSV

1. Open your Google Sheet
2. Go to **File** → **Share** → **Publish to web**
3. In the **Link** tab:
   - **Sheet**: Select your products sheet
   - **Format**: Choose "Comma-separated values (.csv)"
4. Check **"Automatically republish when changes are made"**
5. Click **Publish**
6. Copy the generated CSV URL

### 4. Configure Environment Variable

Add the CSV URL to your environment configuration:

```bash
# .env.local
GOOGLE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0
```

## Data Processing Features

### Bilingual Column Support
The API automatically handles both English and Spanish column headers:
- `name` / `nombre`
- `price` / `precio`
- `image` / `imagen`
- `images` / `imagenes`
- `description` / `descripcion`
- `category` / `categoria`
- `colors` / `colores`

### Color Processing
Color names are automatically converted to hex values using the `mapColorsToHex` utility:
```
Input: "Rojo,Azul,Negro"
Output: [
  {"name": "Rojo", "hex": "#dc2626"},
  {"name": "Azul", "hex": "#2563eb"},
  {"name": "Negro", "hex": "#000000"}
]
```

### Multiple Images
Multiple product images can be provided as comma-separated URLs:
```
Input: "image1.jpg,image2.jpg,image3.jpg"
Output: ["image1.jpg", "image2.jpg", "image3.jpg"]
```

### Data Validation
- Products without names are filtered out
- Products with zero or invalid prices are filtered out
- Empty rows are automatically skipped
- Malformed data is logged but doesn't break the API

## Error Handling & Fallback

The API includes robust error handling:

1. **No CSV URL**: Returns mock products if `GOOGLE_SHEETS_CSV_URL` is not configured
2. **Fetch Error**: Falls back to mock products if the CSV URL is unreachable
3. **Parse Error**: Logs warnings but continues processing valid rows
4. **Empty Data**: Returns mock products if no valid products are found

## Mock Products

The route includes 6 mock products covering different categories:
- Collar para Galgo (accesorios)
- Cama Ortopédica (comodidad)
- Abrigo de Invierno (ropa)
- Juguete Interactivo (juguetes)
- Correa Extensible (accesorios)
- Suplemento Nutricional (salud)

## Technical Details

### Dependencies
- `papaparse`: CSV parsing library
- `mapColorsToHex`: Custom utility for color name to hex conversion

### Caching
- **Policy**: `cache: 'no-store'`
- **Behavior**: Always fetches fresh data from Google Sheets
- **Rationale**: Ensures product updates are immediately reflected

### Performance Considerations
- CSV parsing happens server-side
- Error handling prevents API failures
- Mock data ensures consistent user experience

## Usage Example

```typescript
// Fetch products
const response = await fetch('/api/products');
const data = await response.json();

// Use products
const products = data.products;
products.forEach(product => {
  console.log(`${product.name}: $${product.price}`);
});
```

## Troubleshooting

### Common Issues

1. **Empty Products Array**
   - Check if CSV URL is correctly configured
   - Verify Google Sheet is published and accessible
   - Ensure sheet has valid product data

2. **Colors Not Displaying**
   - Check color names are supported by `mapColorsToHex`
   - Verify colors are comma-separated without extra spaces

3. **Images Not Loading**
   - Ensure image URLs are accessible
   - Check for proper comma separation in images column

### Debug Information

The API logs helpful information to the console:
- CSV parsing errors and warnings
- Fallback data usage notifications
- Product filtering statistics