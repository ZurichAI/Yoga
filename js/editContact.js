// Edit contact functionality

// Initialize event listener for edit contact button
document.addEventListener('DOMContentLoaded', () => {
    // Edit contact button functionality
    const editContactBtn = document.getElementById('edit-contact-btn');
    editContactBtn.addEventListener('click', openEditStudentDialog);
});

// Open edit student dialog
function openEditStudentDialog() {
    if (selectedRows.length !== 1) {
        return; // Only proceed if exactly one student is selected
    }
    
    const studentId = selectedRows[0];
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return;
    }
    
    // Populate form fields with student data
    document.getElementById('edit-student-id').value = student.id;
    document.getElementById('edit-student-name').value = student.name;
    document.getElementById('edit-student-group').value = student.group;
    
    // Format dates for input fields (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    
    document.getElementById('edit-student-birthday').value = formatDateForInput(student.birthday);
    document.getElementById('edit-student-start-date').value = formatDateForInput(student.startDate);
    
    // Populate instructor dropdown
    const instructorSelect = document.getElementById('edit-student-instructor');
    instructorSelect.innerHTML = '';
    
    // Add all unique instructors from students data
    instructors.forEach(instructor => {
        const option = document.createElement('option');
        option.value = instructor;
        option.textContent = instructor;
        option.selected = instructor === student.instructor;
        instructorSelect.appendChild(option);
    });
    
    // Set active checkbox
    document.getElementById('edit-student-active').checked = student.active;
    
    // Show dialog
    document.getElementById('edit-student-dialog').style.display = 'flex';
}

// Close edit student dialog
function closeEditStudentDialog() {
    document.getElementById('edit-student-dialog').style.display = 'none';
}

// Open confirm edit dialog
function openConfirmEditDialog() {
    // Get form values
    const id = document.getElementById('edit-student-id').value;
    const name = document.getElementById('edit-student-name').value;
    const group = document.getElementById('edit-student-group').value;
    const birthday = document.getElementById('edit-student-birthday').value;
    const instructor = document.getElementById('edit-student-instructor').value;
    const startDate = document.getElementById('edit-student-start-date').value;
    const active = document.getElementById('edit-student-active').checked;
    
    // Validate form
    if (!name || !group || !birthday || !instructor || !startDate) {
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
    const confirmationDetails = document.getElementById('edit-confirmation-details');
    confirmationDetails.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <tr>
                <td><strong>ID:</strong></td>
                <td>${id}</td>
            </tr>
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
    
    // Hide edit dialog and show confirm dialog
    document.getElementById('edit-student-dialog').style.display = 'none';
    document.getElementById('confirm-edit-dialog').style.display = 'flex';
}

// Close confirm edit dialog
function closeConfirmEditDialog() {
    document.getElementById('confirm-edit-dialog').style.display = 'none';
    document.getElementById('edit-student-dialog').style.display = 'flex';
}

// Save student changes to Airtable
async function saveStudentChanges() {
    // Get form values
    const id = document.getElementById('edit-student-id').value;
    const name = document.getElementById('edit-student-name').value;
    const group = document.getElementById('edit-student-group').value;
    const birthday = document.getElementById('edit-student-birthday').value;
    const instructor = document.getElementById('edit-student-instructor').value;
    const startDate = document.getElementById('edit-student-start-date').value;
    const active = document.getElementById('edit-student-active').checked;
    
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
        
        // Send PATCH request to Airtable
        const airtableApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.students}/${id}`;
        
        const response = await fetch(airtableApiUrl, {
            method: 'PATCH',
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
        document.getElementById('confirm-edit-dialog').style.display = 'none';
        
        // Show notification
        alert(`Student ${name} updated successfully`);
        
        // Refresh students data
        fetchStudents();
        
    } catch (error) {
        console.error('Error updating student:', error);
        alert('Error updating student. Please try again.');
    }
}
