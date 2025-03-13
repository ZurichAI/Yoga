        // Open view comments dialog
        function openViewCommentsDialog(studentId) {
            // Find student
            const student = students.find(s => s.id === studentId);
            if (!student) return;
            
            // Update dialog title with student name
            const dialogTitle = document.querySelector('#view-comments-dialog .dialog-title');
            dialogTitle.textContent = `Comments for ${student.name}`;
            
            // Filter dossiers for this student
            const studentDossiers = dossiers.filter(dossier => dossier.studentID === studentId);
            
            // Sort by timestamp descending
            studentDossiers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Display dossiers in the table
            const tableBody = document.getElementById('student-comments-table-body');
            tableBody.innerHTML = '';
            
            studentDossiers.forEach(dossier => {
                const row = document.createElement('tr');
                
                // Format timestamp for display
                const formattedTimestamp = dossier.timestamp ? new Date(dossier.timestamp).toLocaleString() : '';
                
                row.innerHTML = `
                    <td>${formattedTimestamp}</td>
                    <td>${dossier.record}</td>
                    <td>${dossier.createdBy}</td>
                `;
                
                tableBody.appendChild(row);
            });
            
            // Store the student ID for the Add Comment button
            document.getElementById('add-comment-btn').setAttribute('data-student-id', studentId);
            
            // Show dialog
            document.getElementById('view-comments-dialog').style.display = 'flex';
            
            // Select the student row in the table
            document.querySelectorAll('.row-select').forEach(checkbox => {
                if (checkbox.getAttribute('data-id') === studentId) {
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                }
            });
            
            // Update selected rows
            updateSelectedRows();
        }
        
        // Close view comments dialog
        function closeViewCommentsDialog() {
            document.getElementById('view-comments-dialog').style.display = 'none';
        }
        
        // Update selected rows array - allow multiple selections
        function updateSelectedRows(event) {
            // Get the checkbox that triggered this event (if any)
            const clickedCheckbox = event ? event.target : null;
            
            // Clear the selected rows array
            selectedRows = [];
            
            // Remove selected-row class from all rows
            document.querySelectorAll('#students-table tbody tr').forEach(row => {
                row.classList.remove('selected-row');
            });
            
            // Get all checked checkboxes
            document.querySelectorAll('.row-select:checked').forEach(checkbox => {
                const studentId = checkbox.getAttribute('data-id');
                selectedRows.push(studentId);
                
                // Add selected-row class to the selected row
                const row = checkbox.closest('tr');
                if (row) {
                    row.classList.add('selected-row');
                }
            });
            
            console.log('Selected rows:', selectedRows);
            
            // Update button states based on selection
            updateCreateCommentButtonState();
            
            // Update "select all" checkbox state
            updateSelectAllCheckbox();
        }
        
        // Update buttons state based on selection
        function updateCreateCommentButtonState() {
            const createCommentBtn = document.getElementById('create-comment-btn');
            const createPaymentBtn = document.getElementById('create-payment-btn');
            const editContactBtn = document.getElementById('edit-contact-btn');
            const deleteContactBtn = document.getElementById('delete-contact-btn');
            const createCostBtn = document.getElementById('create-cost-btn');
            
            const hasExactlyOneSelection = selectedRows.length === 1;
            const hasAnySelection = selectedRows.length > 0;
            
            // Enable buttons only if exactly one row is selected
            createCommentBtn.disabled = !hasExactlyOneSelection;
            createPaymentBtn.disabled = !hasExactlyOneSelection;
            editContactBtn.disabled = !hasExactlyOneSelection;
            deleteContactBtn.disabled = !hasExactlyOneSelection;
            
            // Enable create cost button if any rows are selected
            createCostBtn.disabled = !hasAnySelection;
            
            // Apply or remove dimmed appearance based on selection
            // Apply dimmed appearance when no rows or multiple rows are selected
            if (!hasExactlyOneSelection) {
                createCommentBtn.classList.add('button-dimmed');
                createPaymentBtn.classList.add('button-dimmed');
                editContactBtn.classList.add('button-dimmed');
                deleteContactBtn.classList.add('button-dimmed');
            } else {
                createCommentBtn.classList.remove('button-dimmed');
                createPaymentBtn.classList.remove('button-dimmed');
                editContactBtn.classList.remove('button-dimmed');
                deleteContactBtn.classList.remove('button-dimmed');
            }
            
            // Apply or remove dimmed appearance for create cost button
            if (!hasAnySelection) {
                createCostBtn.classList.add('button-dimmed');
            } else {
                createCostBtn.classList.remove('button-dimmed');
            }
        }
        
        // Function to update "select all" checkbox state based on individual checkboxes
        function updateSelectAllCheckbox() {
            const selectAllCheckbox = document.getElementById('select-all-rows');
            const rowCheckboxes = document.querySelectorAll('.row-select');
            const checkedRowCheckboxes = document.querySelectorAll('.row-select:checked');
            
            if (selectAllCheckbox) {
                // If all row checkboxes are checked, check the "select all" checkbox
                // If some row checkboxes are checked, make "select all" indeterminate
                // If no row checkboxes are checked, uncheck the "select all" checkbox
                if (checkedRowCheckboxes.length === rowCheckboxes.length) {
                    selectAllCheckbox.checked = true;
                    selectAllCheckbox.indeterminate = false;
                } else if (checkedRowCheckboxes.length > 0) {
                    selectAllCheckbox.checked = false;
                    selectAllCheckbox.indeterminate = true;
                } else {
                    selectAllCheckbox.checked = false;
                    selectAllCheckbox.indeterminate = false;
                }
            }
        }
        
        // Open comment dialog
        function openCommentDialog() {
            if (selectedRows.length !== 1) {
                return; // Only proceed if exactly one student is selected
            }
            
            // Clear previous input
            document.getElementById('comment-input').value = '';
            
            // Disable save button initially
            document.getElementById('save-comment-btn').disabled = true;
            
            // Show dialog
            document.getElementById('comment-dialog').style.display = 'flex';
        }
        
        // Close comment dialog
        function closeCommentDialog() {
            document.getElementById('comment-dialog').style.display = 'none';
        }
        
        // Validate comment input
        function validateCommentInput() {
            const commentInput = document.getElementById('comment-input');
            const saveCommentBtn = document.getElementById('save-comment-btn');
            
            // Enable save button only if input is not empty
            saveCommentBtn.disabled = commentInput.value.trim() === '';
        }
        
        // Save comment to Airtable
        async function saveComment() {
            if (selectedRows.length !== 1) {
                return; // Only proceed if exactly one student is selected
            }
            
            const studentId = selectedRows[0];
            const commentText = document.getElementById('comment-input').value.trim();
            
            if (commentText === '') {
                return; // Don't save empty comments
            }
            
            try {
                // Find student name for notification
                const student = students.find(s => s.id === studentId);
                const studentName = student ? student.name : 'Unknown';
                
                // Prepare record data
                const recordData = {
                    fields: {
                        Record: commentText,
                        studentID: studentId,
                        'Created By': 'Instructor 1',
                        Timestamp: new Date().toISOString()
                    }
                };
                
                // Send POST request to Airtable
                const airtableApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.dossiers}`;
                
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
                
                // Close dialog
                closeCommentDialog();
                
                // Show notification
                alert(`The comment to the student ${studentName} added`);
                
                // Refresh dossier data
                fetchDossiers();
                
            } catch (error) {
                console.error('Error saving comment:', error);
                alert('Error saving comment. Please try again.');
            }
        }
