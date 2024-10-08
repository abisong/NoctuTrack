let visits = [];
let intakes = [];
let urineOutputs = [];

function loadSyntheticData() {
    fetch('/synthetic_data')
        .then(response => response.json())
        .then(data => {
            console.log('Received synthetic data:', data);
            visits = data.visits;
            intakes = data.intakes;
            urineOutputs = data.urineOutputs;
            localStorage.setItem('visits', JSON.stringify(visits));
            localStorage.setItem('intakes', JSON.stringify(intakes));
            localStorage.setItem('urineOutputs', JSON.stringify(urineOutputs));
            updateReport();
        })
        .catch(error => console.error('Error loading synthetic data:', error));
}

function trackVisit() {
    const now = new Date();
    visits.push(now.toISOString());
    localStorage.setItem('visits', JSON.stringify(visits));
    updateReport();
}

function updateReport() {
    console.log('Updating report with visits:', visits);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    
    const todayCount = visits.filter(v => new Date(v) >= todayStart).length;
    const weekCount = visits.filter(v => new Date(v) >= weekStart).length;
    const avgCount = (weekCount / 7).toFixed(1);
    
    console.log('Counts calculated:', { todayCount, weekCount, avgCount });
    
    document.getElementById('todayCount').textContent = todayCount;
    document.getElementById('weekCount').textContent = weekCount;
    document.getElementById('avgCount').textContent = avgCount;
    
    document.getElementById('todayCountSummary').textContent = todayCount;
    document.getElementById('weekCountSummary').textContent = weekCount;
    document.getElementById('avgCountSummary').textContent = avgCount;
    
    updateChart();
}

function updateChart() {
    const ctx = document.getElementById('weeklyChart').getContext('2d');
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
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write('<html><head><title>Detailed NoctuTrack Report</title>');
    reportWindow.document.write('<style>body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #1e90ff; color: white; } .center { text-align: center; margin-top: 20px; } button { background-color: #1e90ff; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 5px; transition: background-color 0.3s; } button:hover { background-color: #0000cd; }</style>');
    reportWindow.document.write('</head><body>');
    reportWindow.document.write('<div class="center"><button onclick="window.close()">Back to Home</button></div>');
    reportWindow.document.write('<h1>Detailed NoctuTrack Report</h1>');
    
    const visitsByDate = {};
    visits.forEach(v => {
        const date = new Date(v).toLocaleDateString();
        if (!visitsByDate[date]) visitsByDate[date] = [];
        visitsByDate[date].push(new Date(v).toLocaleTimeString());
    });
    
    reportWindow.document.write('<h2>Bathroom Visits</h2>');
    reportWindow.document.write('<table><tr><th>Date</th><th>Visit Times</th><th>Total Visits</th></tr>');
    Object.keys(visitsByDate).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
        reportWindow.document.write(`<tr><td>${date}</td><td>${visitsByDate[date].join(', ')}</td><td>${visitsByDate[date].length}</td></tr>`);
    });
    reportWindow.document.write('</table>');
    
    reportWindow.document.write('<h2>Intake Log</h2>');
    reportWindow.document.write('<table><tr><th>Date</th><th>Liquid Amount (ml)</th><th>Food Type</th></tr>');
    intakes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(intake => {
        const date = new Date(intake.timestamp).toLocaleString();
        reportWindow.document.write(`<tr><td>${date}</td><td>${intake.liquidAmount || '-'}</td><td>${intake.foodType || '-'}</td></tr>`);
    });
    reportWindow.document.write('</table>');
    
    reportWindow.document.write('<h2>Urine Output Log</h2>');
    reportWindow.document.write('<table><tr><th>Date</th><th>Urine Amount (ml)</th></tr>');
    urineOutputs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(output => {
        const date = new Date(output.timestamp).toLocaleString();
        reportWindow.document.write(`<tr><td>${date}</td><td>${output.amount}</td></tr>`);
    });
    reportWindow.document.write('</table>');
    
    reportWindow.document.write('<div class="center"><button onclick="window.print()">Download PDF</button></div>');
    reportWindow.document.write('</body></html>');
    reportWindow.document.close();
}

function generateTimeRangeReport() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    console.log('Generating Time Range Report with:', { startDate, endDate, startTime, endTime });

    if (!startDate || !endDate || !startTime || !endTime) {
        console.error('Missing date or time input');
        alert('Please select both start and end dates and times.');
        return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    console.log('Start datetime:', start);
    console.log('End datetime:', end);

    if (start > end) {
        console.error('Invalid date range');
        alert('Start date/time must be before end date/time.');
        return;
    }

    const filteredVisits = visits.filter(v => {
        const visitDate = new Date(v);
        return visitDate >= start && visitDate <= end;
    });

    console.log('Filtered visits:', filteredVisits);

    document.getElementById('timeRangeCount').textContent = filteredVisits.length;

    console.log(`Visits in time range (${start.toLocaleString()} - ${end.toLocaleString()}):`, filteredVisits.length);
}

function clearReport() {
    document.getElementById('todayCount').textContent = '0';
    document.getElementById('weekCount').textContent = '0';
    document.getElementById('avgCount').textContent = '0';
}

function clearTimeRangeReport() {
    document.getElementById('timeRangeCount').textContent = '0';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('startTime').value = '00:00';
    document.getElementById('endTime').value = '23:59';
}

function trackLiquid() {
    const liquidAmount = document.getElementById('liquidAmount').value;
    
    if (liquidAmount) {
        const intake = {
            timestamp: new Date().toISOString(),
            liquidAmount: parseInt(liquidAmount),
            foodType: null
        };
        
        intakes.push(intake);
        localStorage.setItem('intakes', JSON.stringify(intakes));
        
        alert('Liquid intake tracked successfully!');
        document.getElementById('liquidAmount').value = '';
    } else {
        alert('Please enter a liquid amount.');
    }
}

function trackFood() {
    const foodType = document.getElementById('foodType').value;
    
    if (foodType) {
        const intake = {
            timestamp: new Date().toISOString(),
            liquidAmount: null,
            foodType: foodType
        };
        
        intakes.push(intake);
        localStorage.setItem('intakes', JSON.stringify(intakes));
        
        alert('Food intake tracked successfully!');
        document.getElementById('foodType').value = '';
    } else {
        alert('Please enter a food type.');
    }
}

function trackUrine() {
    const urineAmount = document.getElementById('urineAmount').value;
    
    if (urineAmount) {
        const output = {
            timestamp: new Date().toISOString(),
            amount: parseInt(urineAmount)
        };
        
        urineOutputs.push(output);
        localStorage.setItem('urineOutputs', JSON.stringify(urineOutputs));
        
        alert('Urine output tracked successfully!');
        document.getElementById('urineAmount').value = '';
    } else {
        alert('Please enter a urine amount.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    flatpickr(".flatpickr", {
        dateFormat: "Y-m-d",
        maxDate: "today"
    });

    document.getElementById('trackButton').addEventListener('click', trackVisit);
    document.getElementById('generateReport').addEventListener('click', generateDetailedReport);
    document.getElementById('clearReport').addEventListener('click', clearReport);
    document.getElementById('generateTimeRangeReport').addEventListener('click', generateTimeRangeReport);
    document.getElementById('clearTimeRangeReport').addEventListener('click', clearTimeRangeReport);
    document.getElementById('trackLiquidButton').addEventListener('click', trackLiquid);
    document.getElementById('trackFoodButton').addEventListener('click', trackFood);
    document.getElementById('trackUrineButton').addEventListener('click', trackUrine);
    
    loadSyntheticData();
});