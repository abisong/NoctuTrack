function initializeAppData() {
    if (!localStorage.getItem('appInitialized')) {
        console.log('Initializing app data for the first time');
        // Clear local storage
        localStorage.clear();
        // Initialize with empty arrays
        localStorage.setItem('visits', JSON.stringify([]));
        localStorage.setItem('intakes', JSON.stringify([]));
        localStorage.setItem('urineOutputs', JSON.stringify([]));
        localStorage.setItem('appInitialized', 'true');
    } else {
        console.log('App already initialized, loading existing data');
        visits = JSON.parse(localStorage.getItem('visits')) || [];
        intakes = JSON.parse(localStorage.getItem('intakes')) || [];
        urineOutputs = JSON.parse(localStorage.getItem('urineOutputs')) || [];
    }
}

// Rest of the file remains unchanged
