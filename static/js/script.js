// Add this code at the beginning of the file
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPromotion();
});

function showInstallPromotion() {
  const installButton = document.createElement('button');
  installButton.textContent = 'Install NoctuTrack App';
  installButton.addEventListener('click', installApp);
  document.body.appendChild(installButton);
}

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  }
}

// Error handling wrapper function
function safeExecute(func) {
  try {
    func();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

let visits = [];
let intakes = [];
let urineOutputs = [];

function initializeAppData() {
  console.log('Initializing app data');
  visits = JSON.parse(localStorage.getItem('visits')) || [];
  intakes = JSON.parse(localStorage.getItem('intakes')) || [];
  urineOutputs = JSON.parse(localStorage.getItem('urineOutputs')) || [];
  console.log('Initialization complete');
}

function trackVisit() {
  console.log('Tracking visit');
  const now = new Date();
  visits.push(now.toISOString());
  localStorage.setItem('visits', JSON.stringify(visits));
  updateReport();
}

function updateReport() {
  console.log('Updating report');
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  
  const todayCount = visits.filter(v => new Date(v) >= todayStart).length;
  const weekCount = visits.filter(v => new Date(v) >= weekStart).length;
  const avgCount = (weekCount / 7).toFixed(1);
  
  console.log('Counts calculated:', { todayCount, weekCount, avgCount });
  
  const elements = {
    'todayCount': todayCount,
    'weekCount': weekCount,
    'avgCount': avgCount,
    'todayCountSummary': todayCount,
    'weekCountSummary': weekCount,
    'avgCountSummary': avgCount
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  });
  
  updateChart();
}

function updateChart() {
  console.log('Updating chart');
  const ctx = document.getElementById('weeklyChart');
  if (!ctx) {
    console.warn('Chart element not found');
    return;
  }

  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const data = new Array(7).fill(0);
  
  const now = new Date();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  
  visits.forEach(v => {
    const visitDate = new Date(v);
    if (visitDate >= weekStart) {
      const dayIndex = visitDate.getDay();
      data[dayIndex]++;
    }
  });
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Bathroom Visits',
        data: data,
        backgroundColor: 'rgba(30, 144, 255, 0.6)',
        borderColor: 'rgba(30, 144, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
}

function generateDetailedReport() {
  console.log('Generating detailed report');
  const reportWindow = window.open('', '_blank');
  reportWindow.document.write(`
    <html>
    <head>
      <title>Detailed NoctuTrack Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f0f8ff;
        }
        h1, h2 {
          color: #1e90ff;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #1e90ff;
          color: white;
        }
        .button {
          background-color: #1e90ff;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 5px;
          margin-right: 10px;
        }
        .button:hover {
          background-color: #0000cd;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 0.8em;
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>NoctuTrack: Detailed Report</h1>
      <button class="button" onclick="window.close()">Back to Home</button>
      <button class="button" onclick="window.print()">Download PDF</button>
      
      <h2>Bathroom Visits</h2>
      <table>
        <tr><th>Date</th><th>Time</th></tr>
        ${visits.map(visit => `<tr><td>${new Date(visit).toLocaleDateString()}</td><td>${new Date(visit).toLocaleTimeString()}</td></tr>`).join('')}
      </table>
      
      <h2>Intakes</h2>
      <table>
        <tr><th>Date</th><th>Time</th><th>Type</th><th>Amount</th></tr>
        ${intakes.map(intake => `<tr><td>${new Date(intake.timestamp).toLocaleDateString()}</td><td>${new Date(intake.timestamp).toLocaleTimeString()}</td><td>${intake.liquidAmount ? 'Liquid' : 'Food'}</td><td>${intake.liquidAmount ? intake.liquidAmount + 'ml' : intake.foodType}</td></tr>`).join('')}
      </table>
      
      <h2>Urine Outputs</h2>
      <table>
        <tr><th>Date</th><th>Time</th><th>Amount (ml)</th></tr>
        ${urineOutputs.map(output => `<tr><td>${new Date(output.timestamp).toLocaleDateString()}</td><td>${new Date(output.timestamp).toLocaleTimeString()}</td><td>${output.amount}</td></tr>`).join('')}
      </table>
      
      <div class="footer">
        Report generated on ${new Date().toLocaleString()}
      </div>
    </body>
    </html>
  `);
  reportWindow.document.close();
  console.log('Detailed report generated');
}

function clearReport() {
  console.log('Clearing report');
  const elements = ['todayCount', 'weekCount', 'avgCount', 'todayCountSummary', 'weekCountSummary', 'avgCountSummary'];
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = '0';
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  });
  console.log('Report cleared');
}

function generateTimeRangeReport() {
  console.log('Generating time range report');
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  
  console.log('Date range:', startDate, endDate);
  console.log('Time range:', startTime, endTime);
  
  if (!startDate || !endDate) {
    console.error('Start date or end date is missing');
    alert('Please select both start and end dates');
    return;
  }
  
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  
  console.log('Start datetime:', start);
  console.log('End datetime:', end);
  
  const filteredVisits = visits.filter(v => {
    const visitDate = new Date(v);
    return visitDate >= start && visitDate <= end;
  });
  
  console.log('Filtered visits:', filteredVisits);
  
  const timeRangeCount = document.getElementById('timeRangeCount');
  if (timeRangeCount) {
    timeRangeCount.textContent = filteredVisits.length;
  } else {
    console.warn('Element with id "timeRangeCount" not found');
  }
  console.log('Time range report generated, count:', filteredVisits.length);
}

function clearTimeRangeReport() {
  console.log('Clearing time range report');
  const timeRangeCount = document.getElementById('timeRangeCount');
  if (timeRangeCount) {
    timeRangeCount.textContent = '0';
  } else {
    console.warn('Element with id "timeRangeCount" not found');
  }
  
  const elements = {
    'startDate': '',
    'endDate': '',
    'startTime': '00:00',
    'endTime': '23:59'
  };

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.value = value;
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  });
  
  console.log('Time range report cleared');
}

function trackLiquid() {
  console.log('Tracking liquid intake');
  const liquidAmount = document.getElementById('liquidAmount');
  if (liquidAmount && liquidAmount.value) {
    const intake = {
      timestamp: new Date().toISOString(),
      liquidAmount: parseInt(liquidAmount.value),
      foodType: null
    };
    intakes.push(intake);
    localStorage.setItem('intakes', JSON.stringify(intakes));
    liquidAmount.value = '';
    console.log('Liquid intake tracked:', intake);
  } else {
    console.warn('Liquid amount input not found or empty');
  }
}

function trackFood() {
  console.log('Tracking food intake');
  const foodType = document.getElementById('foodType');
  if (foodType && foodType.value) {
    const intake = {
      timestamp: new Date().toISOString(),
      liquidAmount: null,
      foodType: foodType.value
    };
    intakes.push(intake);
    localStorage.setItem('intakes', JSON.stringify(intakes));
    foodType.value = '';
    console.log('Food intake tracked:', intake);
  } else {
    console.warn('Food type input not found or empty');
  }
}

function trackUrine() {
  console.log('Tracking urine output');
  const urineAmount = document.getElementById('urineAmount');
  if (urineAmount && urineAmount.value) {
    const output = {
      timestamp: new Date().toISOString(),
      amount: parseInt(urineAmount.value)
    };
    urineOutputs.push(output);
    localStorage.setItem('urineOutputs', JSON.stringify(urineOutputs));
    urineAmount.value = '';
    console.log('Urine output tracked:', output);
  } else {
    console.warn('Urine amount input not found or empty');
  }
}

function clearLocalStorage() {
  console.log('Attempting to clear local storage');
  const userInput = prompt("Warning: This action will delete all your data. Type 'delete' to confirm:");
  if (userInput && userInput.toLowerCase() === 'delete') {
    console.log('User confirmed. Clearing local storage');
    localStorage.clear();
    initializeAppData();
    updateReport();
    alert('Local storage has been cleared successfully.');
  } else {
    console.log('Local storage clear operation cancelled by user');
    alert('Operation cancelled. Your data remains intact.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');
  safeExecute(() => {
    initializeAppData();
    
    flatpickr(".flatpickr", {
      dateFormat: "Y-m-d",
      maxDate: "today"
    });

    const elements = {
      'trackButton': trackVisit,
      'generateReport': generateDetailedReport,
      'clearReport': clearReport,
      'generateTimeRangeReport': generateTimeRangeReport,
      'clearTimeRangeReport': clearTimeRangeReport,
      'trackLiquidButton': trackLiquid,
      'trackFoodButton': trackFood,
      'trackUrineButton': trackUrine,
      'clearStorageButton': clearLocalStorage
    };

    Object.entries(elements).forEach(([id, func]) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('click', () => safeExecute(func));
      } else {
        console.warn(`Element with id '${id}' not found`);
      }
    });
    
    updateReport();
  });
});