import React, { useEffect, useState } from 'react';
import { FormControl, IconButton, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import { Col, Form, Row } from 'react-bootstrap';
import Highcharts from 'highcharts';
import axiosClient from '../../axios-client';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Swal from 'sweetalert2'
import exportingInit from 'highcharts/modules/exporting'

exportingInit(Highcharts);

export default function HighChart() {
  const [today, setToday] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [filter, setFilter] = useState();
  const [selectedYearStart, setSelectedYearStart] = useState('');
  const [selectedMonthStart, setSelectedMonthStart] = useState('');
  const [selectedYearEnd, setSelectedYearEnd] = useState('');
  const [selectedMonthEnd, setSelectedMonthEnd] = useState('');
  const [selectedMonthYear, setSelectedMonthYear] = useState('');

  const getReportToday= async () => {
    try {
      const response = await axiosClient.get('/reports_today');
      const { data } = response;
      setToday(data);
    } catch (error) {
      // Handle error appropriately
    }
  };

  const getReportMonthly= async () => {
    try {
      const response = await axiosClient.get('/reports_monthly');
      const { data } = response;
      setMonthly(data);
    } catch (error) {
      // Handle error appropriately
    }
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

  const getDropList = () => {
  	const year = new Date().getFullYear();
    return (
      Array.from(new Array(50), (v, i) => (
        <MenuItem key={i} value={year - i}>{year - i}</MenuItem>
      ))
    );
  };

  const handleChangeFilter = (event) => {
    if (event.target.value == 'monthly') {
      setSelectedYearStart('')
      setSelectedYearEnd('') 
    } else if (event.target.value == 'yearly') {
      setSelectedMonthStart('')
      setSelectedMonthEnd('')
      setSelectedMonthYear('')
    }
    setFilter(event.target.value);
    getReportYearly();
    getReportMonthly()
    getReportToday();
  };
  
  const handleChangeYearStart = (event) => {
    setSelectedYearStart(event.target.value);
  };

  const handleChangeYearEnd = (event) => {
    setSelectedYearEnd(event.target.value);
  };

  const handleChangeMonthStart = (event) => {
    setSelectedMonthStart(event.target.value);
  };

  const handleChangeMonthEnd = (event) => {
    setSelectedMonthEnd(event.target.value);
  };
  
  const handleChangeMonthYear = (event) => {
    setSelectedMonthYear(event.target.value);
  };

  const handleReset = () => {
    setFilter()
    setSelectedMonthStart('')
    setSelectedYearStart('')
    setSelectedMonthEnd('')
    setSelectedYearEnd('')
    setSelectedMonthYear('')
    setMonthly([])
    setYearly([])

    getReportYearly();
    getReportMonthly()
    getReportToday();
  }

  const handleMonthlySearch = async () => {
    try {
      if (selectedMonthStart === "" || selectedMonthEnd === "" || selectedMonthYear === "") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You need to fill up the Month Start, Month End and Year',
        })
      } else {
        if (selectedMonthStart == selectedMonthEnd) {
          const response = await axiosClient.get(`/reports_monthly/${selectedMonthStart}/${selectedMonthYear}`);
          const { data } = response;
          setMonthly(data);
        } else {
          const response = await axiosClient.get(`/reports_monthlyfilter/${selectedMonthStart}/${selectedMonthEnd}/${selectedMonthYear}`);
          const { data } = response;
          setMonthly(data);
        }
      }
    } catch (error) {
      // Handle error appropriately
    }
  }

  const handleYearlySearch = async () => {
    try {
      if (selectedYearStart === "" || selectedYearEnd === "") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You need to fill up the Year Start and Year End',
        })
      } else {
        if (selectedYearStart == selectedYearEnd) {
          const response = await axiosClient.get(`/reports_yearly/${selectedYearStart}`);
          const { data } = response;
          setYearly(data);
        } else {
          const response = await axiosClient.get(`/reports_yearlyfilter/${selectedYearStart}/${selectedYearEnd}`);
          const { data } = response;
          setYearly(data);
        }
      }
    } catch (error) {
      // Handle error appropriately
    }
  }

  useEffect(() => {
    getReportYearly();
    getReportMonthly()
    getReportToday();
  }, []);

  useEffect(() => {
    if (filter === "monthly") {
      if (selectedMonthStart === "" || selectedMonthEnd === "" || selectedMonthYear === "") {
        const categories = Array.from({ length: monthly.length }, (_, index) => index);
        const seriesData = monthly.map((item) => {
          const values = Object.values(item).slice(2);
          return values.map((value, index) => {
            const dayNumber = index + 1; // Adjusting the day number
            return [dayNumber, parseFloat(value)]; // Return a tuple [x, y]
          });
        });
        // Create the chart
        Highcharts.chart('chart-container', {
          legend: {
            align: 'center',
            verticalAlign: 'top',
            layout: 'horizontal',
            y: 10 // Adjust the vertical position as needed
          },
          chart: {
            type: 'spline',
          },
          title: {
            text: 'Current Month',
          },
          xAxis: {
            categories,
          },
          yAxis: {
            title: {
              text: 'Quantity',
            },
          },
          series: seriesData.map((data, index) => ({
            
            name: monthly[index].services, // Use the 'services' property as the legend name
            data,
          })),
        });
      } else {
        if (monthly && monthly.length > 0) {
          if (selectedMonthStart == selectedMonthEnd)  {
              const categories = Array.from({ length: monthly.length }, (_, index) => index);
              const seriesData = monthly.map((item) => {
                const values = Object.values(item).slice(2);
                return values.map((value, index) => {
                  const dayNumber = index + 1; // Adjusting the day number
                  return [dayNumber, parseFloat(value)]; // Return a tuple [x, y]
                });
              });
              // Create the chart
              Highcharts.chart('chart-container', {
                legend: {
                  align: 'center',
                  verticalAlign: 'top',
                  layout: 'horizontal',
                  y: 10 // Adjust the vertical position as needed
                },
                chart: {
                  type: 'spline',
                },
                title: {
                  text: selectedMonthStart+' '+selectedMonthYear,
                },
                xAxis: {
                  categories,
                },
                yAxis: {
                  title: {
                    text: 'Quantity',
                  },
                },
                series: seriesData.map((data, index) => ({
                  
                  name: monthly[index].services, // Use the 'services' property as the legend name
                  data,
                })),
              });
          } else {
              // Extract the unique months from the fetched data
              const months = Object.keys(monthly[0]).filter(key => key.startsWith('month'));
              const xCategories = months.map(month => month.substring(5)); // Extract month name from key

              // Prepare the series data based on the fetched data
              const seriesData = monthly.map(item => {
                const data = months.map(month => parseInt(item[month]));

                return {
                  name: item.services,
                  data: data
                };
              });
              // Create the chart
              Highcharts.chart('chart-container', {
                legend: {
                  align: 'center',
                  verticalAlign: 'top',
                  layout: 'horizontal',
                  y: 10 // Adjust the vertical position as needed
                },
                chart: {
                  type: 'spline',
                },
                title: {
                  text: selectedMonthStart+' to '+selectedMonthEnd+' '+selectedMonthYear,
                },
                xAxis: {
                  categories: xCategories
                },
                yAxis: {
                  title: {
                    text: 'Quantity',
                  },
                },
                series: seriesData
              });
          }
          
        } else {
          Highcharts.chart('chart-container', {
            chart: {
              type: 'spline',
            },
            title: {
              text: 'NO DATA TO DISPLAY',
            }, 
            yAxis: {
              title: {
                text: 'Quantity',
              },
            },
            series: [{
                name: 'NO DATA',
                data: []
            }]
          });
        }
      }
    } else if (filter === "yearly") {
      if (selectedYearStart === "" || selectedYearEnd === "") {
        // Update chart options with dynamic data
        const options = {
          legend: {
            align: 'center',
            verticalAlign: 'top',
            layout: 'horizontal',
            y: 10 // Adjust the vertical position as needed
          },
          chart: {
            type: 'spline'
          },
          title: {
            text: 'Current Year'
          },
          xAxis: {
            categories: [
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
              'December'
            ]
          },
          yAxis: {
            title: {
              text: 'SERVICES QTY' // Modify the y-axis label here
            }
          },
          series: []
        };

        // Convert fetched data into Highcharts compatible series format
        const seriesData = yearly.map(item => ({
          name: item.services,
          data: [
            item.January,
            item.February,
            item.March,
            item.April,
            item.May,
            item.June,
            item.July,
            item.August,
            item.September,
            item.October,
            item.November,
            item.December
          ]
        }));

        options.series = seriesData;

        // Render the chart with updated options
        Highcharts.chart('chart-container', options);
      } else {
        if (yearly && yearly.length > 0) {
          if (selectedYearStart == selectedYearEnd) {
             // Update chart options with dynamic data
              const options = {
                legend: {
                  align: 'center',
                  verticalAlign: 'top',
                  layout: 'horizontal',
                  y: 10 // Adjust the vertical position as needed
                },
                chart: {
                  type: 'spline'
                },
                title: {
                  text: 'Month of '+selectedYearStart
                },
                xAxis: {
                  categories: [
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
                    'December'
                  ]
                },
                yAxis: {
                  title: {
                    text: 'SERVICES QTY' // Modify the y-axis label here
                  }
                },
                series: []
              };

              // Convert fetched data into Highcharts compatible series format
              const seriesData = yearly.map(item => ({
                name: item.services,
                data: [
                  item.January,
                  item.February,
                  item.March,
                  item.April,
                  item.May,
                  item.June,
                  item.July,
                  item.August,
                  item.September,
                  item.October,
                  item.November,
                  item.December
                ]
              }));

              options.series = seriesData;

              // Render the chart with updated options
              Highcharts.chart('chart-container', options);
          } else {
            // Extract the unique months from the fetched data
            const years = Object.keys(yearly[0]).filter(key => key.startsWith('year'));
            const xCategories = years.map(year => year.substring(4)); // Extract month name from key

            // Prepare the series data based on the fetched data
            const seriesData = yearly.map(item => {
              const data = years.map(year => parseInt(item[year]));

              return {
                name: item.services,
                data: data
              };
            });
            // Create the chart
            Highcharts.chart('chart-container', {
              legend: {
                align: 'center',
                verticalAlign: 'top',
                layout: 'horizontal',
                y: 10 // Adjust the vertical position as needed
              },
              chart: {
                type: 'spline',
              },
              title: {
                text: selectedYearStart+' - '+selectedYearEnd,
              },
              xAxis: {
                categories: xCategories
              },
              yAxis: {
                title: {
                  text: 'Quantity',
                },
              },
              series: seriesData
            });
          }
          
        } else {
          Highcharts.chart('chart-container', {
            chart: {
              type: 'spline',
            },
            title: {
              text: 'NO DATA TO DISPLAY',
            }, 
            yAxis: {
              title: {
                text: 'Quantity',
              },
            },
            series: [{
                name: 'NO DATA',
                data: []
            }]
          });
        }
      }
      
    } else {
      if (today && today.length > 0) {
        const options = {
          // Enable the menu options
          // legend:{ enabled:false },
          chart: {
            type: 'spline'
          },
          title: {
            text: 'AS OF TODAY'
          },
          xAxis: {
            categories: [
              "08:00",
              "08:30",
              "09:00",
              "09:30",
              "10:00",
              "10:30",
              "11:00",
              "11:30",
              "12:00",
              "12:30",
              "13:00",
              "13:30",
              "14:00",
              "14:30",
              "15:00",
              "15:30",
              "16:00",
              "16:30",
              "17:00",
              "17:30",
              "18:00",
              "18:30",
              "19:00"
            ]
          },
          yAxis: {
            title: {
              text: 'Quantity' // Modify the y-axis label here
            }
          },
          series: []
        };

        // Convert fetched data into Highcharts compatible series format
        const seriesData = today.map(item => ({
          name: item.services,
          data: [
            item.qty_08_00,
            item.qty_08_30,
            item.qty_09_00,
            item.qty_09_30,
            item.qty_10_00,
            item.qty_10_30,
            item.qty_11_00,
            item.qty_11_30,
            item.qty_12_00,
            item.qty_12_30,
            item.qty_13_00,
            item.qty_13_30,
            item.qty_14_00,
            item.qty_14_30,
            item.qty_15_00,
            item.qty_15_30,
            item.qty_16_00,
            item.qty_16_30,
            item.qty_17_00,
            item.qty_17_30,
            item.qty_18_00,
            item.qty_18_30,
            item.qty_19_00
          ]
        }));

        options.series = seriesData;

        // Render the chart with updated options
        Highcharts.chart('chart-container', options);
      } else {
        Highcharts.chart('chart-container', {
          chart: {
            type: 'spline',
          },
          title: {
            text: 'NO DATA TO DISPLAY',
          }, 
          yAxis: {
            title: {
              text: 'Quantity',
            },
          },
          series: [{
              name: 'NO DATA',
              data: []
          }]
        });
      }
    }
    
  }, [filter, today, monthly, yearly]);
 
  
  return(
    <div>
        <div>
        <Form.Group  className="mb-3" >
          <Row>
            <Col xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filter || ''}
                  label="Filter"
                  onChange={handleChangeFilter}
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                  {/* <MenuItem value="datrange">Date Range</MenuItem> */}
                </Select>
              </FormControl>
            </Col>
            <Col xs={12} md={1}>
              <FormControl fullWidth> 
                <Tooltip title="Reset">
                  <IconButton
                    onClick={handleReset}
                    className='search-icon'  
                    sx={{
                      ml: 1,
                      "&.MuiButtonBase-root:hover": {
                        bgcolor: "transparent"
                      }
                    }}>
                        <RestartAltIcon />
                  </IconButton>
                </Tooltip>
              </FormControl>
            </Col>
          </Row>
        </Form.Group>
        { filter === "monthly" && 
          <Form.Group>
            <Row>
              <Col xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Month Start</InputLabel>
                  <Select
                    value={selectedMonthStart}
                    label="Month Start"
                    onChange={handleChangeMonthStart}
                  >
                    <MenuItem value="January">January</MenuItem>
                    <MenuItem value="February">February</MenuItem>
                    <MenuItem value="March">March</MenuItem>
                    <MenuItem value="April">April</MenuItem>
                    <MenuItem value="May">May</MenuItem>
                    <MenuItem value="June">June</MenuItem>
                    <MenuItem value="July">July</MenuItem>
                    <MenuItem value="August">August</MenuItem>
                    <MenuItem value="September">September</MenuItem>
                    <MenuItem value="October">October</MenuItem>
                    <MenuItem value="November">November</MenuItem>
                    <MenuItem value="December">December</MenuItem>
                  </Select>
                </FormControl>
              </Col>
              <Col xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Month End</InputLabel>
                  <Select
                    value={selectedMonthEnd}
                    label="Month End"
                    onChange={handleChangeMonthEnd}
                  >
                    <MenuItem value="January">January</MenuItem>
                    <MenuItem value="February">February</MenuItem>
                    <MenuItem value="March">March</MenuItem>
                    <MenuItem value="April">April</MenuItem>
                    <MenuItem value="May">May</MenuItem>
                    <MenuItem value="June">June</MenuItem>
                    <MenuItem value="July">July</MenuItem>
                    <MenuItem value="August">August</MenuItem>
                    <MenuItem value="September">September</MenuItem>
                    <MenuItem value="October">October</MenuItem>
                    <MenuItem value="November">November</MenuItem>
                    <MenuItem value="December">December</MenuItem>
                  </Select>
                </FormControl>
              </Col>
              <Col xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedMonthYear}
                    label="Year"
                    onChange={handleChangeMonthYear}
                  >
                    {getDropList()}
                  </Select>
                </FormControl>
              </Col>
              <Col xs={12} md={1}>
                <FormControl fullWidth> 
                  <Tooltip title="Search">
                    <IconButton
                      onClick={handleMonthlySearch}
                      className='search-icon'  
                      sx={{
                        ml: 1,
                        "&.MuiButtonBase-root:hover": {
                          bgcolor: "transparent"
                        }
                      }}>
                          <SearchIcon />
                    </IconButton>
                  </Tooltip>
                </FormControl>
              </Col>
            </Row>
          </Form.Group>
        }
        {filter === "yearly" && 
          <Form.Group>
            <Row>
              <Col xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Year Start</InputLabel>
                  <Select
                    value={selectedYearStart}
                    label="Year Start"
                    onChange={handleChangeYearStart}
                  >
                    {getDropList()}
                  </Select>
                </FormControl>
              </Col>
              <Col xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Year End</InputLabel>
                  <Select
                    value={selectedYearEnd}
                    label="Year End"
                    onChange={handleChangeYearEnd}
                  >
                    {getDropList()}
                  </Select>
                </FormControl>
              </Col>
              <Col xs={12} md={1}>
                <FormControl fullWidth> 
                  <Tooltip title="Search">
                    <IconButton
                      onClick={handleYearlySearch}
                      className='search-icon'  
                      sx={{
                        ml: 1,
                        "&.MuiButtonBase-root:hover": {
                          bgcolor: "transparent"
                        }
                      }}>
                          <SearchIcon />
                    </IconButton>
                  </Tooltip>
                </FormControl>
              </Col>
            </Row>
          </Form.Group>
        }
      </div>
      <div id="chart-container" className='mt-5'/>
      </div>
  );
}
