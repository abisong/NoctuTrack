let visits = [];
let intakes = [];
let urineOutputs = [];

function initializeAppData() {
    console.log('Initializing app data');
    if (!localStorage.getItem('appInitialized')) {
        console.log('Setting up initial data');
        localStorage.setItem('visits', JSON.stringify([]));
        localStorage.setItem('intakes', JSON.stringify([]));
        localStorage.setItem('urineOutputs', JSON.stringify([]));
        localStorage.setItem('appInitialized', 'true');
    }
    console.log('Loading data from local storage');
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
    
    document.getElementById('todayCount').textContent = todayCount;
    document.getElementById('weekCount').textContent = weekCount;
    document.getElementById('avgCount').textContent = avgCount;
    
    document.getElementById('todayCountSummary').textContent = todayCount;
    document.getElementById('weekCountSummary').textContent = weekCount;
    document.getElementById('avgCountSummary').textContent = avgCount;
    
    updateChart();
}

function updateChart() {
    console.log('Updating chart');
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
    console.log('Generating detailed report');
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write('<html><head><title>Detailed NoctuTrack Report</title></head><body>');
    reportWindow.document.write('<h1>Detailed NoctuTrack Report</h1>');
    
    // Add visit details
    reportWindow.document.write('<h2>Bathroom Visits</h2>');
    visits.forEach(visit => {
        reportWindow.document.write(`<p>${new Date(visit).toLocaleString()}</p>`);
    });
    
    // Add intake details
    reportWindow.document.write('<h2>Intakes</h2>');
    intakes.forEach(intake => {
        reportWindow.document.write(`<p>${new Date(intake.timestamp).toLocaleString()} - ${intake.liquidAmount ? `Liquid: ${intake.liquidAmount}ml` : `Food: ${intake.foodType}`}</p>`);
    });
    
    // Add urine output details
    reportWindow.document.write('<h2>Urine Outputs</h2>');
    urineOutputs.forEach(output => {
        reportWindow.document.write(`<p>${new Date(output.timestamp).toLocaleString()} - ${output.amount}ml</p>`);
    });
    
    reportWindow.document.write('</body></html>');
    reportWindow.document.close();
    console.log('Detailed report generated');
}

function clearReport() {
    console.log('Clearing report');
    document.getElementById('todayCount').textContent = '0';
    document.getElementById('weekCount').textContent = '0';
    document.getElementById('avgCount').textContent = '0';
    document.getElementById('todayCountSummary').textContent = '0';
    document.getElementById('weekCountSummary').textContent = '0';
    document.getElementById('avgCountSummary').textContent = '0';
    console.log('Report cleared');
}

function generateTimeRangeReport() {
    console.log('Generating time range report');
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    const filteredVisits = visits.filter(v => {
        const visitDate = new Date(v);
        return visitDate >= start && visitDate <= end;
    });
    
    document.getElementById('timeRangeCount').textContent = filteredVisits.length;
    console.log('Time range report generated');
}

function clearTimeRangeReport() {
    console.log('Clearing time range report');
    document.getElementById('timeRangeCount').textContent = '0';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('startTime').value = '00:00';
    document.getElementById('endTime').value = '23:59';
    console.log('Time range report cleared');
}

function trackLiquid() {
    console.log('Tracking liquid intake');
    const liquidAmount = document.getElementById('liquidAmount').value;
    if (liquidAmount) {
        const intake = {
            timestamp: new Date().toISOString(),
            liquidAmount: parseInt(liquidAmount),
            foodType: null
        };
        intakes.push(intake);
        localStorage.setItem('intakes', JSON.stringify(intakes));
        document.getElementById('liquidAmount').value = '';
        console.log('Liquid intake tracked:', intake);
    }
}

function trackFood() {
    console.log('Tracking food intake');
    const foodType = document.getElementById('foodType').value;
    if (foodType) {
        const intake = {
            timestamp: new Date().toISOString(),
            liquidAmount: null,
            foodType: foodType
        };
        intakes.push(intake);
        localStorage.setItem('intakes', JSON.stringify(intakes));
        document.getElementById('foodType').value = '';
        console.log('Food intake tracked:', intake);
    }
}

function trackUrine() {
    console.log('Tracking urine output');
    const urineAmount = document.getElementById('urineAmount').value;
    if (urineAmount) {
        const output = {
            timestamp: new Date().toISOString(),
            amount: parseInt(urineAmount)
        };
        urineOutputs.push(output);
        localStorage.setItem('urineOutputs', JSON.stringify(urineOutputs));
        document.getElementById('urineAmount').value = '';
        console.log('Urine output tracked:', output);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    initializeAppData();
    
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
    
    updateReport();
});
