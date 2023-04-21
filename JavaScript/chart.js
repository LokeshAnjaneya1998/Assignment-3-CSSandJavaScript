const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'Wish List',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      data: [5, 8, 10, 9, 6, 12, 11, 15, 8, 8, 12, 4],
    },
    {
      label: 'Applications Sent',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      data: [3, 9, 9, 5, 6, 7, 9, 10, 6, 8, 10, 2],
    },
    {
      label: 'Applications In-Process',
      backgroundColor: 'rgba(139, 0, 139, 0.2)',
      borderColor: 'rgba(139, 0, 139, 1)',
      borderWidth: 1,
      data: [1, 2, 4, 2, 1, 2, 3, 4, 3, 3, 2, 2, 0],
    },
    {
      label: 'Offers',
      backgroundColor: 'rgba(255, 165, 0, 0.2)',
      borderColor: 'rgba(255, 165, 0, 1)',
      borderWidth: 1,
      data: [1, 0, 0, 2, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    }]
  };
  
  // Configuration options
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  };
  
  // Create chart
  const ctx = document.getElementById('job-applications-chart').getContext('2d');
  const chart = new Chart(ctx, config);
  