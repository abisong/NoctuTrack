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
    
    // Update the new summary section
    document.getElementById('todayCountSummary').textContent = todayCount;
    document.getElementById('weekCountSummary').textContent = weekCount;
    document.getElementById('avgCountSummary').textContent = avgCount;
    
    updateChart();
}

// ... [rest of the code remains unchanged]

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
