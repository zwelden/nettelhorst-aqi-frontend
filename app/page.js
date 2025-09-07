'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(res => res.data);

const metrics = {
  rco2_corrected: { display: "CO2 reading", description: "CO2 in parts per million" },
  atmp: { display: "Ambient Temp. F", description: "The ambient temperature in Fahrenheit" },
  tvoc: { display: "TVOC (raw)", description: "Total Volatile Organic Compounds in ppm (raw reading)" },
  tvocIndex: { display: "TVOC Index", description: "Total Volatile Organic Compounds Index" },
  rhum_corrected: { display: "Relative Humidity", description: "Relative Humidity" },
  pm02_corrected: { display: "PM2.5", description: "Particulate Matter 2.5 ug / m3" }
};

export default function Home() {
  const [selectedMetric, setSelectedMetric] = useState('rco2_corrected');
  
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_NH_AQI_API_URL}/api/v1/history/80146/hours?hours=24`,
    fetcher,
    {
      refreshInterval: 300000,
      revalidateOnFocus: false
    }
  );

  const { data: data7Days, error: error7Days, isLoading: isLoading7Days } = useSWR(
    `${process.env.NEXT_PUBLIC_NH_AQI_API_URL}/api/v1/history/80146/days?days=7`,
    fetcher,
    {
      refreshInterval: 300000,
      revalidateOnFocus: false
    }
  );

  const chartData = data?.map(item => ({
    time: parseISO(item.measure_time).getTime(),
    fullTime: item.measure_time,
    value: selectedMetric === 'atmp' 
      ? (item.measure_data[selectedMetric] * 9/5) + 32 
      : item.measure_data[selectedMetric],
    ...item.measure_data
  })) || [];

  const chartData7Days = data7Days?.map(item => ({
    time: parseISO(item.measure_time).getTime(),
    fullTime: item.measure_time,
    value: selectedMetric === 'atmp' 
      ? (item.measure_data[selectedMetric] * 9/5) + 32 
      : item.measure_data[selectedMetric],
    ...item.measure_data
  })) || [];

  if (error || error7Days) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error loading data</h2>
          <p>{error?.message || error7Days?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Nettelhorst AQI Monitor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Nettelhorst, Chicago IL
          </p>
        </header>

        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {metrics[selectedMetric].display}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {metrics[selectedMetric].description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(metrics).map(([key, metric]) => (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {metric.display}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 pl-0 shadow-lg">
            <div className="text-xl font-bold mb-4 text-center">24 Hour History</div>
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      scale="time"
                      interval="preserveStartEnd"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(timestamp) => format(new Date(timestamp), 'HH:mm')}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={selectedMetric === 'rco2_corrected' ? [375, 'dataMax'] : ['dataMin', 'dataMax']}
                    />
                    <Tooltip 
                      labelFormatter={(label, payload) => {
                        if (payload && payload.length > 0) {
                          return format(parseISO(payload[0].payload.fullTime), 'MMM dd, HH:mm');
                        }
                        return label;
                      }}
                      formatter={(value) => [value, metrics[selectedMetric].display]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 pl-0 shadow-lg mt-8">
            <div className="text-xl font-bold mb-4 text-center">7 Day History</div>
            {isLoading7Days ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData7Days}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time"
                      type="number"
                      domain={['dataMin', 'dataMax']}
                      scale="time"
                      interval="preserveStartEnd"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(timestamp) => format(new Date(timestamp), 'dd HH:mm')}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={selectedMetric === 'rco2_corrected' ? [375, 'dataMax'] : ['dataMin', 'dataMax']}
                    />
                    <Tooltip 
                      labelFormatter={(label, payload) => {
                        if (payload && payload.length > 0) {
                          return format(parseISO(payload[0].payload.fullTime), 'MMM dd, yyyy HH:mm');
                        }
                        return label;
                      }}
                      formatter={(value) => [value, metrics[selectedMetric].display]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {(data && data.length > 0) || (data7Days && data7Days.length > 0) ? (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Last updated: {format(parseISO(
                (data && data.length > 0 ? data[data.length - 1].measure_time : 
                 data7Days && data7Days.length > 0 ? data7Days[data7Days.length - 1].measure_time : 
                 new Date().toISOString())
              ), 'MMM dd, yyyy HH:mm')}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
