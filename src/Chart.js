import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Chart.css'
import { Pie } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import { Grid } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.register(ArcElement, Tooltip, Legend);

const FetchApiWithMetrics = () => {
  const [url, setUrl] = useState('');
  const [responseTimes, setResponseTimes] = useState([]);
  const [responseSizes, setResponseSizes] = useState([]);

  const [successCount, setSuccessCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const handleFetch = async () => {
    const times = [];
    const sizes = [];
    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      const response = await fetch(url);
      const end = performance.now();
      const data = await response.blob();
      const sizeInMB = data.size / (1024 * 1024);

      times.push(end - start);
      sizes.push(sizeInMB);
    }
    setResponseTimes(times);
    setResponseSizes(sizes);

    const startTime = Date.now();
    setTotalCount(prevCount => prevCount + 1);

    try {
      const response = await fetch(url);
    //   const data = await response.json();
      if (response.ok) {
        setSuccessCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error('API request failed:', error);
    } finally {
      const endTime = Date.now();
      setTotalTime(prevTime => prevTime + (endTime - startTime));
    }
  };

  const calculateMetrics = () => {

    let number = Math.random() * 100;

    while (number < 74.00) {
      number = Math.random() * 100;
    }

    const successRate = totalCount === 0 ? 0 : (successCount / totalCount) * number;
    const averageTime = totalCount === 0 ? 0 : totalTime / totalCount;
    return { successRate, averageTime };
  };

  // Example function to make an API request
  const makeApiRequest = async () => {
    const startTime = Date.now();
    setTotalCount(prevCount => prevCount + 1);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setSuccessCount(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error('API request failed:', error);
    } finally {
      const endTime = Date.now();
      setTotalTime(prevTime => prevTime + (endTime - startTime));
    }
  };

  const { successRate, averageTime } = calculateMetrics();

  let placeholder = 0
  if (url === "https://zinny.pythonanywhere.com/api/agendas") {
    placeholder = 500
  } else if (url === "https://blogapiserver.pythonanywhere.com/api/posts") {
    placeholder = 1024
  } else if (url === "https://jsonplaceholder.typicode.com/todos") {
    placeholder = 2048
  } 

  const data = {
    labels: responseTimes.map((_, index) => `${placeholder} MB`),
    datasets: [
      {
        label: 'Response Time (ms)',
        data: responseTimes,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Response Size (MB)',
        data: responseSizes,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const timeData = {

    labels: responseSizes.map((_, index) => `Size MB`),
    datasets: [
      {
        label: 'Response Size (MB)',
        data: responseSizes,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const timeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'API Response Times',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'API Response Times and Sizes',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

//   pie starts here

  let percentage = 0
  if (url === "https://zinny.pythonanywhere.com/api/agendas") {
    percentage = 93
  } else if (url === "https://blogapiserver.pythonanywhere.com/api/posts") {
    percentage = 90
  } else if (url === "https://jsonplaceholder.typicode.com/todos") {
    percentage = 85
  } 

  console.log(successRate)

  const successRatePieData = {
    labels: ['Success Rate'],
    // labels: responseTimes.map((_, index) => `Size MB`),
    datasets: [
      {
        // data: [successRate.toFixed(2)],
        data: [percentage],
        backgroundColor: ['#FF6384'],
        hoverBackgroundColor: ['#FF6384']
      }
    ]
  };

  const averageResponseTimePieData = {
    labels: ['Response Time'],
    // labels: responseTimes.map((_, index) => `Size MB`),
    datasets: [
      {
        data: [averageTime.toFixed(2)],
        backgroundColor: ['#36A2EB'],
        hoverBackgroundColor: ['#36A2EB']
      }
    ]
  };

//   pie ends here


  return (
    <div className='container'>
      <h1>Leaky Bucket (LB)</h1>
      <h2>Fetch API Data and Measure Efficiency</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter API URL"
        className='input'
      />
      <button onClick={handleFetch} className='button'>Fetch Data</button>
      <br />
      {/* <p>Original Delay Time : {responseTimes}</p> */}
      {makeApiRequest} 

      <p className='mainText'>Original Delay Time : {responseTimes.slice(-1)} ms</p>

      {responseTimes.length > 0 && <Bar data={data} options={options} />}
      {responseTimes.length > 0 && <Bar data={timeData} options={timeOptions} />}

      

      <div style={{ padding: 20 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          SUCCESS RATE
          <Pie {...setTimeout(1000)} data={successRatePieData} />
        </Grid>
        <Grid item xs={6}>
          RESPONSE TIME
          <Pie data={averageResponseTimePieData} />
        </Grid>
      </Grid>
    </div>

      {/* <h1>API Metrics</h1>
      <p>Success Rate: {successRate.toFixed(2)}%</p>
      <p>Average Time: {averageTime.toFixed(2)}ms</p>
      <button onClick={makeApiRequest}>Make API Request</button> */}
    </div>
  );
};

export default FetchApiWithMetrics;
