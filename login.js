// Login functionality with role-based redirection
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginSuccess = document.getElementById('loginSuccess');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const role = document.getElementById('role').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Clear previous messages
        loginError.style.display = 'none';
        loginSuccess.style.display = 'none';

        // Basic validation
        if (!role || !email || !password) {
            showError('Please fill in all fields');
            return;
        }

        // Simulate login process
        showSuccess();
        
        // Store user role
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);

        // Redirect based on role after 2 seconds
        setTimeout(() => {
            switch(role) {
                case 'admin':
                    window.location.href = 'admin-dashboard.html';
                    break;
                case 'worker':
                    window.location.href = 'worker-dashboard.html';
                    break;
                case 'user':
                    window.location.href = 'index.html';
                    break;
                default:
                    window.location.href = 'index.html';
            }
        }, 2000);
    });

    function showError(message) {
        errorMessage.textContent = message;
        loginError.style.display = 'flex';
    }

    function showSuccess() {
        loginSuccess.style.display = 'flex';
    }
});

// Password toggle functionality
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Check if user is already logged in
function checkLoginStatus() {
    const userRole = localStorage.getItem('userRole');
    if (userRole && window.location.pathname.includes('login.html')) {
        switch(userRole) {
            case 'admin':
                window.location.href = 'admin-dashboard.html';
                break;
            case 'worker':
                window.location.href = 'worker-dashboard.html';
                break;
            case 'user':
                window.location.href = 'index.html';
                break;
        }
    }
}

// Run on page load
checkLoginStatus();