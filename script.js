document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('setup-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    const startDownloadBtn = document.getElementById('start-download-btn');
    if (startDownloadBtn) {
        startDownloadBtn.addEventListener('click', startFakeDownload);
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove any non-digit character
            this.value = this.value.replace(/\D/g, '');
        });
    }
});

function handleFormSubmit(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnSpinner.style.display = 'block';

    // Collect form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // NOTE: In a real scenario, you would send this to your Google Apps Script Web App URL
    // const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
    // fetch(scriptURL, { method: 'POST', body: formData})
    //   .then(response => ...)

    // Simulating a network request delay (1.5 seconds)
    setTimeout(() => {
        // Hide form and features
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('feature-list').style.display = 'none';
        
        // Show download section
        document.getElementById('download-section').style.display = 'block';
    }, 1500);
}

function startFakeDownload() {
    const startDownloadBtn = document.getElementById('start-download-btn');
    const progressContainer = document.getElementById('progress-container');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');
    
    // Hide the start button and show the progress bar
    startDownloadBtn.style.display = 'none';
    progressContainer.style.display = 'block';

    let progress = 0;
    
    // Simulate download progress
    const downloadInterval = setInterval(() => {
        // Random increment between 1 and 5
        const increment = Math.floor(Math.random() * 5) + 1;
        progress += increment;

        if (progress >= 95) {
            progress = 95;
            clearInterval(downloadInterval);
            
            // Trigger failure
            setTimeout(() => {
                showErrorAndChat();
            }, 800);
        }

        progressBarFill.style.width = `${progress}%`;
        progressText.innerText = `${progress}%`;
        
    }, 200); // Update every 200ms
}

function showErrorAndChat() {
    // Show error message
    document.getElementById('error-message').style.display = 'block';
    
    // Turn progress bar red
    document.getElementById('progress-bar-fill').style.backgroundColor = '#cc0000';

    // Show custom jumping chat button
    const customChatBtn = document.getElementById('custom-chat-btn');
    if (customChatBtn) {
        customChatBtn.style.display = 'flex';
        customChatBtn.classList.add('bounce-animation');
    }
}

// Add click listener to custom chat button
document.addEventListener('DOMContentLoaded', () => {
    const customChatBtn = document.getElementById('custom-chat-btn');
    if (customChatBtn) {
        customChatBtn.addEventListener('click', function() {
            if (typeof Tawk_API !== 'undefined') {
                Tawk_API.maximize();
                this.classList.remove('bounce-animation');
            }
        });
    }
});
