// Instructor data
// Check if instructors variable already exists (declared in other files)
if (typeof instructors === 'undefined') {
    instructors = [
        {
            "name": "Яна Стрелецкая",
            "login": "Yana",
            "password": "Slava"
        },
        {
            "name": "Вячеслав Бондарчук",
            "login": "Slava",
            "password": "Yana"
        }
    ];
} else {
    // If instructors array already exists, add login credentials if needed
    const loginCredentials = [
        {
            "name": "Яна Стрелецкая",
            "login": "Yana",
            "password": "Slava"
        },
        {
            "name": "Вячеслав Бондарчук",
            "login": "Slava",
            "password": "Yana"
        }
    ];
    
    // Only add if not already present
    for (const cred of loginCredentials) {
        if (!instructors.some(inst => inst.name === cred.name)) {
            instructors.push(cred);
        }
    }
}
let currentInstructor = null;

// Function to handle login validation
function validateLogin() {
    const loginInput = document.getElementById('login').value;
    const passwordInput = document.getElementById('password').value;
    
    // Validate login
    const instructor = instructors.find(
        inst => inst.login === loginInput && inst.password === passwordInput
    );
    
    if (instructor) {
        // Successful login
        currentInstructor = instructor;
        // Store user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify({ name: instructor.name }));
        document.getElementById('login-dialog').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('welcome-message').textContent = `Hello, ${instructor.name}`;
    } else {
        // Failed login
        document.getElementById('login-error').style.display = 'block';
    }
}

// Logout function
function logout() {
    // Clear user data from localStorage
    localStorage.removeItem('currentUser');
    // Redirect will happen automatically via the href
}

// Function to display current user name
function displayCurrentUser() {
    const currentUserElement = document.getElementById('current-user');
    if (!currentUserElement) return; // Skip if element doesn't exist
    
    const currentUserData = localStorage.getItem('currentUser');
    
    if (currentUserData) {
        try {
            const userData = JSON.parse(currentUserData);
            if (userData && userData.name) {
                currentUserElement.textContent = userData.name;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
}

// Initialize login page event listeners
function initLoginPage() {
    // Only run this if we're on the login page
    if (document.getElementById('login-btn')) {
        // Login button click event
        document.getElementById('login-btn').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default button behavior
            validateLogin();
        });
        
        // Form submit event (for Enter key)
        document.getElementById('login-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            validateLogin();
        });
        
        // Logout functionality
        document.getElementById('logout-btn').addEventListener('click', function() {
            currentInstructor = null;
            // Clear user data from localStorage
            localStorage.removeItem('currentUser');
            document.getElementById('login-dialog').style.display = 'flex';
            document.getElementById('main-content').style.display = 'none';
            document.getElementById('login').value = '';
            document.getElementById('password').value = '';
            document.getElementById('login-error').style.display = 'none';
        });
    }
}

// Run display current user on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    displayCurrentUser();
    initLoginPage();
});
