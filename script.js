// Function to toggle visibility of sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content');
    sections.forEach(section => section.style.display = 'none');
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.style.display = 'block';
}

function navigateToQuestionnaire() {
    window.location.href = 'questionniare.html';
}

// Form submission handlers
document.getElementById('signupForm').onsubmit = async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const response = await fetch('signup.php', {
        method: 'POST',
        body: formData,
    });
    const message = await response.text();
    alert(message.trim()); // Show success/failure message in popup
};

document.getElementById('signinForm').onsubmit = async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const response = await fetch('signin.php', {
        method: 'POST',
        body: formData,
    });
    const message = await response.text();
    alert(message.trim()); // Show success/failure message in popup

    if (message.trim() === 'Sign-in successful!') {
        // Show the 'Home' link after successful sign-in
        document.getElementById('homeLink').style.display = 'inline-block';
        
        // Redirect to "Home" section after sign-in
        showSection('home'); 
    } else {
        // If sign-in fails, hide the 'Home' link
        document.getElementById('homeLink').style.display = 'none';
    }
};

// Initially hide 'Home' link before sign-in
document.getElementById('homeLink').style.display = 'none';
