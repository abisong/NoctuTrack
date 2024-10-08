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

// Rest of the existing code...

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    initializeAppData();
    
    flatpickr(".flatpickr", {
        dateFormat: "Y-m-d",
        maxDate: "today"
    });

    // Existing event listeners...

    loadSyntheticData();
    updateReport();
});

// Rest of the existing code...
