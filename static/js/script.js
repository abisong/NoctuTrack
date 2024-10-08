let visits = [];
let intakes = [];
let urineOutputs = [];

function initializeAppData() {
    console.log('Initializing app data');
    localStorage.clear();
    console.log('Local storage cleared');
    
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
    // Implementation of generateDetailedReport
}

function clearReport() {
    // Implementation of clearReport
}

function generateTimeRangeReport() {
    // Implementation of generateTimeRangeReport
}

function clearTimeRangeReport() {
    // Implementation of clearTimeRangeReport
}

function trackLiquid() {
    // Implementation of trackLiquid
}

function trackFood() {
    // Implementation of trackFood
}

function trackUrine() {
    // Implementation of trackUrine
}

function loadSyntheticData() {
    // Implementation of loadSyntheticData
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
    
    loadSyntheticData();
    updateReport();
});