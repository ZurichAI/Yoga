// Create payment dialog functions for students page
function openCreatePaymentDialog() {
    // Only proceed if exactly one student is selected
    if (selectedRows.length !== 1) {
        return;
    }
    
    // Get the selected student
    const studentId = selectedRows[0];
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        console.error('Selected student not found');
        return;
    }
    
    // Clear previous inputs
    document.getElementById('payment-purpose').value = '';
    document.getElementById('payment-amount').value = '';
    
    // Date input permanently removed
    
    // Set the student name
    document.getElementById('payment-student').value = student.name;
    
    // Validate form to enable/disable save button
    validatePaymentForm();
    
    // Show dialog
    document.getElementById('create-payment-dialog').style.display = 'flex';
}

function closeCreatePaymentDialog() {
    document.getElementById('create-payment-dialog').style.display = 'none';
}

function validatePaymentForm() {
    const amount = document.getElementById('payment-amount').value.trim();
    
    // Enable save button only if required fields are filled
    const savePaymentDialogBtn = document.getElementById('save-payment-dialog-btn');
    savePaymentDialogBtn.disabled = !amount;
}

function openConfirmPaymentDialog() {
    // Get form values
    // Date input permanently removed
    const purpose = document.getElementById('payment-purpose').value.trim() || 'N/A';
    const amount = document.getElementById('payment-amount').value.trim();
    const studentName = document.getElementById('payment-student').value;
    
    // Validate form
    if (!amount || !studentName) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Create confirmation message
    const confirmMessage = `You are going to create the ${amount} CHF payment for ${purpose} for the ${studentName}. Are you sure?`;
    document.getElementById('confirm-payment-message').textContent = confirmMessage;
    
    // Show dialog
    document.getElementById('confirm-payment-dialog').style.display = 'flex';
}

function closeConfirmPaymentDialog() {
    document.getElementById('confirm-payment-dialog').style.display = 'none';
}

function savePayment() {
    // Get form values
    // Date input permanently removed
    const purpose = document.getElementById('payment-purpose').value.trim() || '';
    const amount = parseFloat(document.getElementById('payment-amount').value.trim());
    const studentName = document.getElementById('payment-student').value;
    
    // Find the student ID
    const student = students.find(s => s.name === studentName);
    if (!student) {
        alert('Student not found. Please try again.');
        return;
    }
    
    const studentId = student.id;
    
    // Disable the save button to prevent multiple submissions
    const saveButton = document.getElementById('save-confirm-payment-btn');
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';
    
    // Prepare the payment data for Airtable
    const newPaymentData = {
        fields: {
            // 'CreatedDateTime' field permanently removed
            'Purpose of payment': purpose,
            'StudentID': studentId,
            'Student Name': studentName,
            'Amount CHF': amount
        }
    };
    
    // Make the API call to create the payment record
    const paymentApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.payment}`;
    
    fetch(paymentApiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.airtable.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPaymentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Payment created successfully:', data);
        
        // Create a local payment object from the response
        const newPayment = {
            id: data.id,
            date: data.fields.CreatedDateTime || new Date().toISOString().split('T')[0], // Use current date for display
            purpose: data.fields['Purpose of payment'] || purpose,
            studentID: data.fields.StudentID || studentId,
            studentName: data.fields['Student Name'] || studentName,
            amount: data.fields['Amount CHF'] || amount
        };
        
        // Add to payments array
        payments.push(newPayment);
        
        // Close dialogs
        closeConfirmPaymentDialog();
        closeCreatePaymentDialog();
        
        // Show notification
        alert(`Payment created successfully for ${studentName}.`);
        
        // Refresh the display and update totals
        displayStudents(visibleStudents.length > 0 ? visibleStudents : students);
    })
    .catch(error => {
        console.error('Error creating payment:', error);
        alert(`Failed to create payment: ${error.message}`);
    })
    .finally(() => {
        // Reset button state
        saveButton.disabled = false;
        saveButton.textContent = 'Yes';
    });
}
