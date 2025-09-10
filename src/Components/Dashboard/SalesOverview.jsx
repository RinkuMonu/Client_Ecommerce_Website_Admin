import {
  Box,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
} from '@mui/material';
import CountUp from 'react-countup';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import { axiosInstance } from '../../api/axiosInstance';
import React, { useEffect, useState } from 'react';

const getRandomTrend = () => {
  const trends = ['up', 'down'];
  const randomTrend = trends[Math.floor(Math.random() * trends.length)];
  const randomPercent = (Math.random() * 10).toFixed(2);
  return {
    direction: randomTrend,
    percent: randomPercent,
    icon:
      randomTrend === 'up' ? (
        <TrendingUpIcon fontSize="small" />
      ) : (
        <TrendingDownIcon fontSize="small" />
      ),
  };
};

const iconMap = {
  daily: <TodayIcon sx={{ fontSize: 16 }} />,
  weekly: <DateRangeIcon sx={{ fontSize: 16 }} />,
  monthly: <CalendarMonthIcon sx={{ fontSize: 16 }} />,
  yearly: <EventIcon sx={{ fontSize: 16 }} />,
};

const SalesOverview = () => {
  const [salesData, setSalesData] = useState({}); // Use object instead of array

  const overviewItems = [
    { key: 'daily', label: 'Daily Sales' },
    { key: 'weekly', label: 'Weekly Sales' },
    { key: 'monthly', label: 'Monthly Sales' },
    { key: 'yearly', label: 'Yearly Sales' },
  ];

  const fetchSalesData = async () => {
    try {
      const response = await axiosInstance.get('/api/salesOverview');
      console.log('Sales Overview Data:', response.data);
      if (response.data.success) {
        setSalesData(response.data);
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          borderRadius: '12px',
          background: 'transparent',
          boxShadow: 'none',
          mb: 3,
          p: 0,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            p: 0,
            fontSize: '14px',
            color: '#000',
            minHeight: '10px !important',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              color: '#2a4172',
              fontWeight: '500',
              p: 0,
              fontSize: '16px',
            }}
          >
            Sales Overview
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3}>
        {overviewItems.map((item) => {
          // const trend = getRandomTrend();
          const value = salesData[item.key]?.total || 0; // Safely read total
          return (
            <Grid key={item.key} item xs={12} md={6} lg={3}>
              <Paper
                sx={{
                  padding: 2,
                  borderRadius: '0.5rem',
                  backgroundColor: '#f1f8fe',
                  boxShadow: 'rgba(143, 155, 166, 0.08) 0px 12px 24px -4px',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  textAlign: 'left',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  color: '#000',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: '#f1f3ff',
                      color: '#4f46e5',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {iconMap[item.key]}
                  </Avatar>

                  {/* <Chip
                    icon={trend.icon}
                    label={`${trend.percent}%`}
                    size="small"
                    sx={{
                      backgroundColor:
                        trend.direction === 'up' ? '#e8f5e9' : '#ffebee',
                      color:
                        trend.direction === 'up' ? '#388e3c' : '#d32f2f',
                      fontWeight: 'bold',
                    }}
                  /> */}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 500, color: '#666' }}
                  >
                    {item.label}
                  </Typography>

                  <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                    <CountUp end={value} duration={2} separator="," />
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default SalesOverview;
