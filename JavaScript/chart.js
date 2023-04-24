
monthlyData(request, 'jobs', 'wish');
monthlyData(inProcessrequest, 'inprocessjobs', 'inp');
monthlyData(offersrequest, 'offersjobs', 'eve');
monthlyData(eventrequest, 'eventjobs', 'off');


const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'wish List',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      data: [monNum('wish','jan'), monNum('wish','feb'), monNum('wish','march'), monNum('wish','april'), monNum('wish','may')
        , monNum('wish','june'), monNum('wish','july'), monNum('wish','aug'), monNum('wish','sep'), monNum('wish','oct')
        , monNum('wish','nov'), monNum('wish','dec')],
    },
    {
      label: 'Applications In-Process',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      data: [monNum('inp','jan'), monNum('inp','feb'), monNum('inp','march'), monNum('inp','april'), monNum('inp','may')
      , monNum('inp','june'), monNum('inp','july'), monNum('inp','aug'), monNum('inp','sep'), monNum('inp','oct')
      , monNum('inp','nov'), monNum('inp','dec')],
    },
    {
      label: 'Events',
      backgroundColor: 'rgba(139, 0, 139, 0.2)',
      borderColor: 'rgba(139, 0, 139, 1)',
      borderWidth: 1,
      data: [monNum('eve','jan'), monNum('eve','feb'), monNum('eve','march'), monNum('eve','april'), monNum('eve','may')
      , monNum('eve','june'), monNum('eve','july'), monNum('eve','aug'), monNum('eve','sep'), monNum('eve','oct')
      , monNum('eve','nov'), monNum('eve','dec')],
    },
    {
      label: 'Offers',
      backgroundColor: 'rgba(255, 165, 0, 0.2)',
      borderColor: 'rgba(255, 165, 0, 1)',
      borderWidth: 1,
      data: [monNum('off','jan'), monNum('off','feb'), monNum('off','march'), monNum('off','april'), monNum('off','may')
      , monNum('off','june'), monNum('off','july'), monNum('off','aug'), monNum('off','sep'), monNum('off','oct')
      , monNum('off','nov'), monNum('off','dec')],
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


  function reloadOnce() {
    if (localStorage.getItem('reloaded') == '') {
      console.log('debug');
      localStorage.setItem('reloaded', 'true');
      location.reload();
    }
  }




  // Create chart
  const ctx = document.getElementById('job-applications-chart').getContext('2d');
  const chart = new Chart(ctx, config);


