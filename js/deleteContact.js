// Functions related to the "Delete contact" button functionality

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Delete contact button functionality
    const deleteContactBtn = document.getElementById('delete-contact-btn');
    deleteContactBtn.addEventListener('click', openDeleteOptionsDialog);
    
    // Delete options dialog buttons
    const makeInactiveBtn = document.getElementById('make-inactive-btn');
    makeInactiveBtn.addEventListener('click', makeStudentInactive);
    
    const deleteStudentBtn = document.getElementById('delete-student-btn');
    deleteStudentBtn.addEventListener('click', openConfirmDeleteDialog);
    
    const cancelDeleteOptionsBtn = document.getElementById('cancel-delete-options-btn');
    cancelDeleteOptionsBtn.addEventListener('click', closeDeleteOptionsDialog);
    
    // Confirm delete dialog buttons
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    confirmDeleteBtn.addEventListener('click', deleteStudent);
    
    const cancelConfirmDeleteBtn = document.getElementById('cancel-confirm-delete-btn');
    cancelConfirmDeleteBtn.addEventListener('click', closeConfirmDeleteDialog);
});

// Open delete options dialog
function openDeleteOptionsDialog() {
    if (selectedRows.length !== 1) {
        return; // Only proceed if exactly one student is selected
    }
    
    const studentId = selectedRows[0];
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return;
    }
    
    // Format dates for display
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    
    // Display student details
    const deleteStudentDetails = document.getElementById('delete-student-details');
    deleteStudentDetails.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <tr>
                <td><strong>ID:</strong></td>
                <td>${student.id}</td>
            </tr>
            <tr>
                <td><strong>Name:</strong></td>
                <td>${student.name}</td>
            </tr>
            <tr>
                <td><strong>Group:</strong></td>
                <td>${student.group}</td>
            </tr>
            <tr>
                <td><strong>Birthday:</strong></td>
                <td>${formatDateForDisplay(student.birthday)}</td>
            </tr>
            <tr>
                <td><strong>Instructor:</strong></td>
                <td>${student.instructor}</td>
            </tr>
            <tr>
                <td><strong>Start Date:</strong></td>
                <td>${formatDateForDisplay(student.startDate)}</td>
            </tr>
            <tr>
                <td><strong>Active:</strong></td>
                <td>${student.active ? 'Yes' : 'No'}</td>
            </tr>
        </table>
    `;
    
    // Show dialog
    document.getElementById('delete-options-dialog').style.display = 'flex';
}

// Close delete options dialog
function closeDeleteOptionsDialog() {
    document.getElementById('delete-options-dialog').style.display = 'none';
}

// Make student inactive
async function makeStudentInactive() {
    if (selectedRows.length !== 1) {
        return; // Only proceed if exactly one student is selected
    }
    
    const studentId = selectedRows[0];
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return;
    }
    
    try {
        // Prepare record data
        const recordData = {
            fields: {
                Active: false
            }
        };
        
        // Send PATCH request to Airtable
        const airtableApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.students}/${studentId}`;
        
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
        
        // Close dialog
        closeDeleteOptionsDialog();
        
        // Show notification
        alert(`Student ${student.name} has been made inactive`);
        
        // Refresh students data
        fetchStudents();
        
    } catch (error) {
        console.error('Error updating student:', error);
        alert('Error updating student. Please try again.');
    }
}

// Open confirm delete dialog
function openConfirmDeleteDialog() {
    if (selectedRows.length !== 1) {
        return; // Only proceed if exactly one student is selected
    }
    
    const studentId = selectedRows[0];
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return;
    }
    
    // Format dates for display
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    
    // Display student details
    const confirmDeleteDetails = document.getElementById('confirm-delete-details');
    confirmDeleteDetails.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
            <tr>
                <td><strong>ID:</strong></td>
                <td>${student.id}</td>
            </tr>
            <tr>
                <td><strong>Name:</strong></td>
                <td>${student.name}</td>
            </tr>
            <tr>
                <td><strong>Group:</strong></td>
                <td>${student.group}</td>
            </tr>
            <tr>
                <td><strong>Birthday:</strong></td>
                <td>${formatDateForDisplay(student.birthday)}</td>
            </tr>
            <tr>
                <td><strong>Instructor:</strong></td>
                <td>${student.instructor}</td>
            </tr>
            <tr>
                <td><strong>Start Date:</strong></td>
                <td>${formatDateForDisplay(student.startDate)}</td>
            </tr>
            <tr>
                <td><strong>Active:</strong></td>
                <td>${student.active ? 'Yes' : 'No'}</td>
            </tr>
        </table>
    `;
    
    // Hide delete options dialog and show confirm delete dialog
    document.getElementById('delete-options-dialog').style.display = 'none';
    document.getElementById('confirm-delete-dialog').style.display = 'flex';
}

// Close confirm delete dialog
function closeConfirmDeleteDialog() {
    document.getElementById('confirm-delete-dialog').style.display = 'none';
    document.getElementById('delete-options-dialog').style.display = 'flex';
}

// Delete student from Airtable
async function deleteStudent() {
    if (selectedRows.length !== 1) {
        return; // Only proceed if exactly one student is selected
    }
    
    const studentId = selectedRows[0];
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        return;
    }
    
    try {
        // Send DELETE request to Airtable
        const airtableApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.students}/${studentId}`;
        
        const response = await fetch(airtableApiUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${config.airtable.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
        
        // Close dialogs
        document.getElementById('confirm-delete-dialog').style.display = 'none';
        document.getElementById('delete-options-dialog').style.display = 'none';
        
        // Show notification
        alert(`Student ${student.name} has been permanently deleted`);
        
        // Refresh students data
        fetchStudents();
        
    } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student. Please try again.');
    }
}
