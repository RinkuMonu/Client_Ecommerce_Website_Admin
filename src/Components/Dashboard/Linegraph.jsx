import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { axiosInstance } from '../../api/axiosInstance';

const SubscriberChart = () => {
  const [salesData, setSalesData] = useState({});
  const [chartData, setChartData] = useState([]);

  const fetchSalesData = async () => {
    try {
      const response = await axiosInstance.get('/api/salesOverview');
      console.log('Sales Overview Data:', response.data);
      if (response.data.success) {
        setSalesData(response.data);

        // Transform data for chart
        const transformedData = [
          { name: 'Daily', value: response.data.daily.total || 0 },
          { name: 'Weekly', value: response.data.weekly.total || 0 },
          { name: 'Monthly', value: response.data.monthly.total || 0 },
          { name: 'Yearly', value: response.data.yearly.total || 0 },
        ];
        setChartData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, p: 3 }}>
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="600" color="#681853">
          Total Subscribers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Weekly
        </Typography>
      </Grid>

      {/* Numbers Block */}
      <Stack direction="row" spacing={3} alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight="bold" mt={0} color="#681853">
          {salesData.weekly?.total || 0}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" color="#681853">
          <Typography variant="body2" fontWeight="bold">
            {salesData.weekly?.count || 0}%
          </Typography>
          <Typography variant="body2">increased</Typography>
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Last Week: {salesData.daily?.total || 0}
      </Typography>

      {/* Chart */}
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#999' }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999' }} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#DD82A8"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SubscriberChart;
