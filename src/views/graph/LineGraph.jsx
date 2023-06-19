import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import axiosClient from '../../axios-client';
import { Col, Form, Row } from 'react-bootstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineGraph() {
  const [yearly, setYearly] = useState([]);
  const [filter, setFilter] = useState('');
  const [data, setData] = useState(null); // Define data state variable

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Services',
      },
    },
    scales: {
      y: {
        type: 'linear',
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            if (value % 1 === 0) {
              return value;
            }
          },
        },
      },
    },
  };

  const getReportYearly = async () => {
    try {
      const response = await axiosClient.get('/reports_yearly');
      const { data } = response;
      setYearly(data);
    } catch (error) {
      // Handle error appropriately
    }
  };

  useEffect(() => {
    getReportYearly();
  }, []);

  useEffect(() => {
    if (filter === 'monthly') {
      // Handle monthly filter
      setData(null); // Reset data
    } else if (filter === 'yearly') {
      const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const newData = {
        labels,
        datasets: yearly.map((item, index) => ({
          label: item.services,
          data: labels.map((month) => item[month]),
          borderColor: ['brown', 'violet', 'green', 'red', 'blue'][index],
          backgroundColor: ['brown', 'violet', 'green', 'red', 'blue'][index],
        })),
      };

      setData(newData); // Set data
    } else {
      const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const newData = {
        labels,
        datasets: yearly.map((item, index) => ({
          label: item.services,
          data: labels.map((month) => item[month]),
          borderColor: ['brown', 'violet', 'green', 'red', 'blue'][index],
          backgroundColor: ['brown', 'violet', 'green', 'red', 'blue'][index],
        })),
      };

      setData(newData); // Set data
    }
  }, [filter, yearly]);

  const handleChangeFilter = (event) => {
    setFilter(event.target.value);
  };
 
  return (
    <div>
      <div>
        <Form.Group>
          <Row>
            <Col xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filter || ''}
                  label="Filter"
                  onChange={handleChangeFilter}
                >
                  <MenuItem value="">Today</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                  <MenuItem value="datrange">Date Range</MenuItem>
                </Select>
              </FormControl>
            </Col>
            <Col xs={12} md={4}>
              {/* <FormControl fullWidth>
                <InputLabel>Services</InputLabel>
                <Select 
                  // value={age}
                  label="Services"
                  // onChange={handleChange}
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                  <MenuItem value="datrange">Date Range</MenuItem>
                </Select>
              </FormControl> */}
            </Col>
            <Col xs={12} md={4}>
              {/* <FormControl fullWidth>
                <InputLabel>Service Center</InputLabel>
                <Select 
                  // value={age}
                  label="Service Center"
                  // onChange={handleChange}
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                  <MenuItem value="datrange">Date Range</MenuItem>
                </Select>
              </FormControl> */}
            </Col>
          </Row>
        </Form.Group>
      </div>
      {data && <Line options={options} data={data} />} {/* Render the Line component only when data is defined */}
    </div>
  );
}
