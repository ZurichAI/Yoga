// Comment dialog functions
function openCommentDialog() {
    if (selectedCostRows.length !== 1) {
        alert('Please select exactly one cost record to add a comment.');
        return;
    }
    
    // Get the selected cost
    const costId = selectedCostRows[0];
    const cost = costs.find(c => c.id === costId);
    
    if (!cost) {
        alert('Selected cost record not found.');
        return;
    }
    
    // Populate the dialog
    document.getElementById('comment-date').value = new Date(cost.date).toLocaleDateString();
    document.getElementById('comment-student').value = cost.studentName;
    document.getElementById('comment-input').value = '';
    
    // Disable save button initially
    document.getElementById('save-comment-btn').disabled = true;
    
    // Show dialog
    document.getElementById('comment-dialog').style.display = 'flex';
}

function closeCommentDialog() {
    document.getElementById('comment-dialog').style.display = 'none';
}

function validateCommentInput() {
    const commentInput = document.getElementById('comment-input');
    const saveCommentBtn = document.getElementById('save-comment-btn');
    
    // Enable save button only if input is not empty
    saveCommentBtn.disabled = commentInput.value.trim() === '';
}

function saveComment() {
    if (selectedCostRows.length !== 1) {
        alert('Please select exactly one cost record to add a comment.');
        return;
    }
    
    const costId = selectedCostRows[0];
    const cost = costs.find(c => c.id === costId);
    console.log('Selected row ${costId}');
    
    if (!cost) {
        alert('Selected cost record not found.');
        return;
    }
    
// Update the cost record with the comment
const commentText = document.getElementById('comment-input').value.trim();

if (commentText === '') {
    alert('Please enter a comment.');
    return;
}

// If there was an existing note, append the new comment to it
if (typeof cost.notes === 'string' && cost.notes.trim() !== '') {
    cost.notes = `${cost.notes}\n\n${commentText}`;
} else {
    // If no existing note, create a new one
    cost.notes = ` ${commentText}`;
}
    
// Send the updated notes to Airtable
const airtableApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.cost}/${costId}`;

// Show loading indicator or disable the save button
document.getElementById('save-comment-btn').disabled = true;
document.getElementById('save-comment-btn').textContent = 'Saving...';

// Prepare the data for Airtable
const updateData = {
    fields: {
        Notes: cost.notes
    }
};

// Make the API call to update the record
fetch(airtableApiUrl, {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${config.airtable.apiKey}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
})
.then(data => {
    console.log('Comment saved successfully:', data);
    
    // Close dialog
    closeCommentDialog();
    
    // Show success notification
    alert(`Comment added to the cost record for ${cost.studentName}`);
    
    // Refresh the display
    applyAllFilters();
})
.catch(error => {
    console.error('Error saving comment:', error);
    alert(`Error saving comment: ${error.message}`);
    
    // Re-enable the save button
    document.getElementById('save-comment-btn').disabled = false;
    document.getElementById('save-comment-btn').textContent = 'Save';
})
.finally(() => {
    // Reset button state if dialog is still open
    if (document.getElementById('comment-dialog').style.display === 'flex') {
        document.getElementById('save-comment-btn').disabled = false;
        document.getElementById('save-comment-btn').textContent = 'Save';
    }
});
    
// Close dialog
closeCommentDialog();
    
// Show notification
alert(`Comment added to the cost record for ${cost.studentName}`);
    
// Refresh the display
applyAllFilters();
}

function openViewCommentsDialog(costId) {
    const cost = costs.find(c => c.id === costId);
    
    if (!cost) {
        alert('Cost record not found.');
        return;
    }
    
    // Update dialog title
    const dialogTitle = document.querySelector('#view-comments-dialog .dialog-title');
    dialogTitle.textContent = `Comments for ${cost.studentName}`;
    
// Display comments in the table
const tableBody = document.getElementById('comments-table-body');
tableBody.innerHTML = '';

// Handle the case where notes is a string
if (typeof cost.notes === 'string' && cost.notes.trim() !== '') {
    // If notes is a non-empty string, create a single comment entry
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${formatDate(cost.date)}</td>
        <td>${cost.notes}</td>
        <td>System</td>
    `;
    tableBody.appendChild(row);
} else {
    // If notes is empty or not a string
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="3">No comments available</td>';
    tableBody.appendChild(row);
}
    
    // Store the cost ID for the Add Comment button
    document.getElementById('add-comment-btn').setAttribute('data-cost-id', costId);
    
    // Show dialog
    document.getElementById('view-comments-dialog').style.display = 'flex';
}

function closeViewCommentsDialog() {
    document.getElementById('view-comments-dialog').style.display = 'none';
}
