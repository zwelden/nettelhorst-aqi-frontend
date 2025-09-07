# Nettelhorst AQI Frontend

This is a [Next.js](https://nextjs.org) project that displays real-time air quality monitoring data from a sensor located near Nettelhorst Elementary School in Chicago.

## Features

- **Real-time Data Visualization**: Interactive charts displaying 24-hour history of air quality metrics
- **Multiple Sensor Readings**: Switch between different environmental measurements:
  - CO2 levels (parts per million)
  - Ambient temperature (Fahrenheit)
  - Total Volatile Organic Compounds (TVOC) - raw and index values
  - Nitrogen Oxides (NOx) Index
  - Relative Humidity
  - PM2.5 Particulate Matter
- **Automatic Updates**: Data refreshes every minute
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic light/dark theme switching 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Configuration

Create a `.env` file in the root directory with:

```
NEXT_PUBLIC_NH_AQI_API_URL=http://localhost:8000
```

This should point to your AQI API backend server.

## API Integration

The app fetches data from the following endpoint:
- **Endpoint**: `${NEXT_PUBLIC_NH_AQI_API_URL}/api/v1/history/80146/hours?hours=24`
- **Method**: GET
- **Data Format**: Returns an array of measurement objects with timestamps and sensor readings

## Technical Details

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Data Fetching**: SWR with automatic revalidation
- **HTTP Client**: Axios
- **Date Handling**: date-fns for timestamp formatting

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
