# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 frontend application that displays real-time air quality monitoring data from a sensor located near Nettelhorst Elementary School in Chicago. The app fetches 24-hour historical data and presents it in interactive charts with multiple environmental metrics.

## Development Commands

- **Start development server**: `npm run dev`
- **Build application**: `npm run build` (uses turbopack)
- **Start production server**: `npm start`
- **Run linting**: `npm run lint` or `eslint`

## Environment Configuration

The application requires an environment variable:
- `NEXT_PUBLIC_NH_AQI_API_URL` - Base URL for the AQI API (e.g., `http://localhost:8000`)

## Architecture

### Data Flow
- **API Endpoint**: `${NEXT_PUBLIC_NH_AQI_API_URL}/api/v1/history/80146/hours?hours=24`
- **Data Fetching**: Uses SWR with axios for automatic revalidation (60-second intervals)
- **State Management**: React useState for metric selection and chart rendering

### Key Components Architecture
- **Single Page App**: All functionality contained in `app/page.js`
- **Client Component**: Uses 'use client' directive for React hooks and state
- **Dynamic Charts**: Recharts LineChart with conditional Y-axis domains based on selected metric

### Data Transformations
- **Temperature**: Celsius values from API are converted to Fahrenheit for display (`(celsius * 9/5) + 32`)
- **Time Format**: API timestamps converted to Unix timestamps for chart rendering, formatted as HH:mm for display
- **CO2 Chart**: Y-axis starts at 375 ppm instead of data minimum

### Available Metrics
- `rco2_corrected`: CO2 reading (ppm) - default selection
- `atmp`: Ambient temperature (converted to Fahrenheit)
- `tvoc`: Total Volatile Organic Compounds (raw)
- `tvocIndex`: TVOC Index
- `noxIndex`: NOx Index  
- `rhum_corrected`: Relative Humidity
- `pm02_corrected`: PM2.5 Particulate Matter

### Styling
- **Framework**: Tailwind CSS with dark mode support
- **Typography**: Geist Sans and Geist Mono fonts
- **Responsive**: Mobile-first design with responsive breakpoints
- **Chart Styling**: Blue color scheme (#3b82f6) with custom tooltips

## API Data Format

The API returns an array of objects with this structure:
```javascript
{
  "measure_time": "2025-09-06T16:35:00-05:00",
  "measure_data": {
    "atmp": 23,
    "rco2_corrected": 411.2,
    "tvoc": 114.05757,
    "tvocIndex": 120.066,
    "noxIndex": 1,
    "rhum_corrected": 45,
    "pm02_corrected": 0
  }
}
```