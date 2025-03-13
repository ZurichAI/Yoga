// Functions for the "Create contact" functionality

// Open create student dialog
function openCreateStudentDialog() {
    // Clear form fields
    document.getElementById('create-student-name').value = '';
    document.getElementById('create-student-group').value = '';
    document.getElementById('create-student-birthday').value = '';
    
    // Set default values
    // Set current date for start date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('create-student-start-date').value = today;
    
    // Set active checkbox to true by default
    document.getElementById('create-student-active').checked = true;
    
    // Populate instructor dropdown
    const instructorSelect = document.getElementById('create-student-instructor');
    instructorSelect.innerHTML = '';
    
    // Add empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'Select an instructor';
    instructorSelect.appendChild(emptyOption);
    
    // Add all unique instructors from students data
    instructors.forEach(instructor => {
        const option = document.createElement('option');
        option.value = instructor;
        option.textContent = instructor;
        instructorSelect.appendChild(option);
    });
    
    // Disable save button initially
    document.getElementById('save-create-btn').disabled = true;
    
    // Show dialog
    document.getElementById('create-student-dialog').style.display = 'flex';
}

// Close create student dialog
function closeCreateStudentDialog() {
    document.getElementById('create-student-dialog').style.display = 'none';
}

// Validate create student form
function validateCreateStudentForm() {
    const name = document.getElementById('create-student-name').value.trim();
    const group = document.getElementById('create-student-group').value.trim();
    const instructor = document.getElementById('create-student-instructor').value;
    const startDate = document.getElementById('create-student-start-date').value;
    
    // Enable save button only if all required fields are filled
    const saveCreateBtn = document.getElementById('save-create-btn');
    saveCreateBtn.disabled = !(name && group && instructor && startDate);
}

// Open confirm create dialog
function openConfirmCreateDialog() {
    // Get form values
    const name = document.getElementById('create-student-name').value.trim();
    const group = document.getElementById('create-student-group').value.trim();
    const birthday = document.getElementById('create-student-birthday').value;
    const instructor = document.getElementById('create-student-instructor').value;
    const startDate = document.getElementById('create-student-start-date').value;
    const active = document.getElementById('create-student-active').checked;
    
    // Validate form
    if (!name || !group || !instructor || !startDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Format dates for display
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    
    // Display confirmation details
    const confirmationDetails = document.getElementById('create-confirmation-details');
    confirmationDetails.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <tr>
                <td><strong>Name:</strong></td>
                <td>${name}</td>
            </tr>
            <tr>
                <td><strong>Group:</strong></td>
                <td>${group}</td>
            </tr>
            <tr>
                <td><strong>Birthday:</strong></td>
                <td>${formatDateForDisplay(birthday)}</td>
            </tr>
            <tr>
                <td><strong>Instructor:</strong></td>
                <td>${instructor}</td>
            </tr>
            <tr>
                <td><strong>Start Date:</strong></td>
                <td>${formatDateForDisplay(startDate)}</td>
            </tr>
            <tr>
                <td><strong>Active:</strong></td>
                <td>${active ? 'Yes' : 'No'}</td>
            </tr>
        </table>
    `;
    
    // Hide create dialog and show confirm dialog
    document.getElementById('create-student-dialog').style.display = 'none';
    document.getElementById('confirm-create-dialog').style.display = 'flex';
}

// Close confirm create dialog
function closeConfirmCreateDialog() {
    document.getElementById('confirm-create-dialog').style.display = 'none';
    document.getElementById('create-student-dialog').style.display = 'flex';
}

// Save new student to Airtable
async function saveNewStudent() {
    // Get form values
    const name = document.getElementById('create-student-name').value.trim();
    const group = document.getElementById('create-student-group').value.trim();
    const birthday = document.getElementById('create-student-birthday').value;
    const instructor = document.getElementById('create-student-instructor').value;
    const startDate = document.getElementById('create-student-start-date').value;
    const active = document.getElementById('create-student-active').checked;
    
    try {
        // Prepare record data
        const recordData = {
            fields: {
                Name: name,
                Group: group,
                Birthday: birthday,
                Instructor: instructor,
                "StartDate": startDate,
                Active: active
            }
        };
        
        // Send POST request to Airtable
        const airtableApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.students}`;
        
        const response = await fetch(airtableApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.airtable.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recordData)
        });
        
        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
        
        // Close dialogs
        document.getElementById('confirm-create-dialog').style.display = 'none';
        
        // Show notification
        alert(`Contact ${name} created successfully`);
        
        // Refresh students data
        fetchStudents();
        
    } catch (error) {
        console.error('Error creating student:', error);
        alert('Error creating student. Please try again.');
    }
}

// Initialize event listeners for create contact functionality
function initCreateContactEventListeners() {
    // Create contact button functionality
    const createContactBtn = document.getElementById('create-contact-btn');
    createContactBtn.addEventListener('click', openCreateStudentDialog);
    
    // Create student dialog buttons
    const cancelCreateBtn = document.getElementById('cancel-create-btn');
    cancelCreateBtn.addEventListener('click', closeCreateStudentDialog);
    
    const saveCreateBtn = document.getElementById('save-create-btn');
    saveCreateBtn.addEventListener('click', openConfirmCreateDialog);
    
    // Create student form validation
    const createStudentForm = document.getElementById('create-student-form');
    createStudentForm.addEventListener('input', validateCreateStudentForm);
    
    // Confirm create dialog buttons
    const cancelConfirmCreateBtn = document.getElementById('cancel-confirm-create-btn');
    cancelConfirmCreateBtn.addEventListener('click', closeConfirmCreateDialog);
    
    const saveConfirmCreateBtn = document.getElementById('save-confirm-create-btn');
    saveConfirmCreateBtn.addEventListener('click', saveNewStudent);
}

// Add the initialization to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    // Initialize event listeners for create contact functionality
    initCreateContactEventListeners();
});
