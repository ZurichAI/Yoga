// Filter functions
function filterByStudent() {
    applyAllFilters();
}

function filterByPurpose() {
    applyAllFilters();
}

function filterByDate() {
    applyAllFilters();
}

function filterByActive() {
    applyAllFilters();
}

function filterByInstructor() {
    applyAllFilters();
}

function filterByGroup() {
    applyAllFilters();
}

function filterByStudentName() {
    applyAllFilters();
}

function applyAllFilters() {
    // Get search terms
    const searchStudentTerm = document.getElementById('search-student-input').value.toLowerCase();
    const searchPurposeTerm = document.getElementById('search-purpose-input').value.toLowerCase();
    
    // Get date filter values
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    
    // Get active filter value
    const activeFilter = document.querySelector('input[name="active-filter"]:checked').value;
    
    // Get selected instructors
    const selectedInstructors = Array.from(document.querySelectorAll('.instructor-checkbox:not(#select-all-instructors):checked')).map(checkbox => checkbox.value);
    
    // Get selected groups
    const selectedGroups = Array.from(document.querySelectorAll('.group-checkbox:not(#select-all-groups):checked')).map(checkbox => checkbox.value);
    
    // Get selected student names
    const selectedStudentNames = Array.from(document.querySelectorAll('.student-checkbox:not(#select-all-students):checked')).map(checkbox => checkbox.value);
    
    // Filter costs
    const filteredCosts = costs.filter(cost => {
        // Student name filter (for both search and dropdown)
        const matchesStudentName = 
            (!searchStudentTerm || cost.studentName.toLowerCase().includes(searchStudentTerm)) &&
            (selectedStudentNames.length === 0 || selectedStudentNames.includes(cost.studentName));
        
        // Purpose filter
        const matchesPurpose = !searchPurposeTerm || cost.purpose.toLowerCase().includes(searchPurposeTerm);
        
        // Date filter
        const costDate = new Date(cost.date);
        const matchesDateFrom = !dateFrom || costDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || costDate <= new Date(dateTo);
        
        // Active filter
        const student = students.find(s => s.name === cost.studentName);
        const matchesActive = 
            activeFilter === 'all' || 
            (activeFilter === 'active' && student && student.active === true) ||
            (activeFilter === 'non-active' && student && student.active !== true);
        
        // Instructor filter
        const matchesInstructor = selectedInstructors.length === 0 || 
            (student && selectedInstructors.includes(student.instructor));
        
        // Group filter
        const matchesGroup = selectedGroups.length === 0 || 
            (student && selectedGroups.includes(student.group));
        
        return matchesStudentName && matchesPurpose && matchesDateFrom && matchesDateTo && 
               matchesActive && matchesInstructor && matchesGroup;
    });
    
    // Filter payments
    const filteredPayments = payments.filter(payment => {
        // Student name filter (for both search and dropdown)
        const matchesStudentName = 
            (!searchStudentTerm || payment.studentName.toLowerCase().includes(searchStudentTerm)) &&
            (selectedStudentNames.length === 0 || selectedStudentNames.includes(payment.studentName));
        
        // Purpose filter
        const matchesPurpose = !searchPurposeTerm || (payment.purpose && payment.purpose.toLowerCase().includes(searchPurposeTerm));
        
        // Date filter
        const paymentDate = new Date(payment.date);
        const matchesDateFrom = !dateFrom || paymentDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || paymentDate <= new Date(dateTo);
        
        // Active filter
        const student = students.find(s => s.name === payment.studentName);
        const matchesActive = 
            activeFilter === 'all' || 
            (activeFilter === 'active' && student && student.active === true) ||
            (activeFilter === 'non-active' && student && student.active !== true);
        
        // Instructor filter
        const matchesInstructor = selectedInstructors.length === 0 || 
            (student && selectedInstructors.includes(student.instructor));
        
        // Group filter
        const matchesGroup = selectedGroups.length === 0 || 
            (student && selectedGroups.includes(student.group));
        
        return matchesStudentName && matchesPurpose && matchesDateFrom && matchesDateTo && 
               matchesActive && matchesInstructor && matchesGroup;
    });
    
    // Store filtered results
    visibleCosts = filteredCosts;
    visiblePayments = filteredPayments;
    
    // Display filtered results
    displayCosts(filteredCosts);
    displayPayments(filteredPayments);
    
    // Update filter counts
    updateFilterCounts(filteredCosts, filteredPayments);
    
    // Update totals
    updateTotals(filteredCosts, filteredPayments);
    
    // Update button states
    updateButtonStates();
}

// Update totals based on filtered costs and payments
function updateTotals(filteredCosts, filteredPayments) {
    // Calculate total cost
    const totalCost = filteredCosts.reduce((sum, cost) => sum + parseFloat(cost.amount), 0);
    
    // Calculate total payment
    const totalPayment = filteredPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    
    // Calculate balance (payment - cost)
    const balance = totalPayment - totalCost;
    
    // Update the display
    document.getElementById('total-cost').textContent = totalCost.toFixed(2);
    document.getElementById('total-payment').textContent = totalPayment.toFixed(2);
    
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = balance.toFixed(2);
    
    // Apply styling based on balance value
    if (balance < 0) {
        balanceElement.className = 'negative';
    } else {
        balanceElement.className = 'positive';
    }
}

function clearAllFilters() {
    // Reset search inputs
    document.getElementById('search-student-input').value = '';
    document.getElementById('search-purpose-input').value = '';
    
    // Reset date filters
    document.getElementById('date-from').value = '';
    document.getElementById('date-to').value = '';
    
    // Reset active filter to "Active"
    document.getElementById('active-only').checked = true;
    
    // Reset instructor checkboxes
    document.getElementById('select-all-instructors').checked = true;
    document.querySelectorAll('.instructor-checkbox:not(#select-all-instructors)').forEach(checkbox => {
        checkbox.checked = true;
        checkbox.disabled = false;
    });
    
    // Reset group checkboxes
    document.getElementById('select-all-groups').checked = true;
    document.querySelectorAll('.group-checkbox:not(#select-all-groups)').forEach(checkbox => {
        checkbox.checked = true;
        checkbox.disabled = false;
    });
    
    // Reset student checkboxes if they exist
    const selectAllStudents = document.getElementById('select-all-students');
    if (selectAllStudents) {
        selectAllStudents.checked = true;
        document.querySelectorAll('.student-checkbox:not(#select-all-students)').forEach(checkbox => {
            checkbox.checked = true;
            checkbox.disabled = false;
        });
    }
    
    // Apply filters to update the display
    applyAllFilters();
}

// Extract unique instructors and groups from students data
function extractUniqueValues() {
    instructors = [...new Set(students.map(student => student.instructor))].filter(Boolean).sort();
    groups = [...new Set(students.map(student => student.group))].filter(Boolean).sort();
}

// Populate filter checkboxes
function populateFilterCheckboxes() {
    // Count students per instructor
    const instructorCounts = {};
    instructors.forEach(instructor => {
        instructorCounts[instructor] = students.filter(student => student.instructor === instructor).length;
    });
    
    // Sort instructors by count descending
    const sortedInstructors = [...instructors].sort((a, b) => instructorCounts[b] - instructorCounts[a]);
    
    // Populate instructor table
    const instructorCheckboxes = document.getElementById('instructor-checkboxes');
    instructorCheckboxes.innerHTML = `
        <table class="filter-table">
            <thead>
                <tr>
                    <th>Select</th>
                    <th>Instructor</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody id="instructor-table-body">
            </tbody>
        </table>
    `;
    
    const instructorTableBody = document.getElementById('instructor-table-body');
    
    sortedInstructors.forEach(instructor => {
        const row = document.createElement('tr');
        
        // Checkbox cell
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        // Convert instructor to string and sanitize for use in ID
        const instructorStr = String(instructor).replace(/\s+/g, '-');
        checkbox.id = `instructor-${instructorStr}`;
        checkbox.className = 'instructor-checkbox';
        checkbox.value = instructor;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            // Update "Select all" checkbox
            const allChecked = document.querySelectorAll('.instructor-checkbox:not(#select-all-instructors):checked').length === instructors.length;
            document.getElementById('select-all-instructors').checked = allChecked;
            
            filterByInstructor();
        });
        checkboxCell.appendChild(checkbox);
        
        // Instructor name cell
        const nameCell = document.createElement('td');
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = instructor;
        nameCell.appendChild(label);
        
        // Count cell
        const countCell = document.createElement('td');
        countCell.textContent = instructorCounts[instructor];
        
        // Add cells to row
        row.appendChild(checkboxCell);
        row.appendChild(nameCell);
        row.appendChild(countCell);
        
        // Add row to table
        instructorTableBody.appendChild(row);
    });
    
    // Count students per group
    const groupCounts = {};
    groups.forEach(group => {
        groupCounts[group] = students.filter(student => student.group === group).length;
    });
    
    // Sort groups by count descending
    const sortedGroups = [...groups].sort((a, b) => groupCounts[b] - groupCounts[a]);
    
    // Populate group table
    const groupCheckboxes = document.getElementById('group-checkboxes');
    groupCheckboxes.innerHTML = `
        <table class="filter-table">
            <thead>
                <tr>
                    <th>Select</th>
                    <th>Group</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody id="group-table-body">
            </tbody>
        </table>
    `;
    
    const groupTableBody = document.getElementById('group-table-body');
    
    sortedGroups.forEach(group => {
        const row = document.createElement('tr');
        
        // Checkbox cell
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        // Convert group to string and sanitize for use in ID
        const groupStr = String(group).replace(/\s+/g, '-');
        checkbox.id = `group-${groupStr}`;
        checkbox.className = 'group-checkbox';
        checkbox.value = group;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            // Update "Select all" checkbox
            const allChecked = document.querySelectorAll('.group-checkbox:not(#select-all-groups):checked').length === groups.length;
            document.getElementById('select-all-groups').checked = allChecked;
            
            filterByGroup();
        });
        checkboxCell.appendChild(checkbox);
        
        // Group name cell
        const nameCell = document.createElement('td');
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = group;
        nameCell.appendChild(label);
        
        // Count cell
        const countCell = document.createElement('td');
        countCell.textContent = groupCounts[group];
        
        // Add cells to row
        row.appendChild(checkboxCell);
        row.appendChild(nameCell);
        row.appendChild(countCell);
        
        // Add row to table
        groupTableBody.appendChild(row);
    });
}

// Update filter counts
function updateFilterCounts(filteredCosts, filteredPayments) {
    // Get current filter states
    const activeFilter = document.querySelector('input[name="active-filter"]:checked').value;
    const selectedInstructors = Array.from(document.querySelectorAll('.instructor-checkbox:not(#select-all-instructors):checked')).map(checkbox => checkbox.value);
    const selectedGroups = Array.from(document.querySelectorAll('.group-checkbox:not(#select-all-groups):checked')).map(checkbox => checkbox.value);
    const selectedStudentNames = Array.from(document.querySelectorAll('.student-checkbox:not(#select-all-students):checked')).map(checkbox => checkbox.value);
    
    // Update instructor counts
    instructors.forEach(instructor => {
        // For instructor counts, we need to apply group, student name, and active filters only
        const instructorStudents = students.filter(student => {
            // Active filter
            const matchesActive = 
                activeFilter === 'all' || 
                (activeFilter === 'active' && student.active === true) ||
                (activeFilter === 'non-active' && student.active !== true);
            
            // Group filter
            const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(student.group);
            
            // Student name filter
            const matchesStudentName = selectedStudentNames.length === 0 || selectedStudentNames.includes(student.name);
            
            return student.instructor === instructor && matchesActive && matchesGroup && matchesStudentName;
        });
        
        // Find the count cell for this instructor
        // Convert instructor to string and sanitize for use in ID
        const instructorStr = String(instructor).replace(/\s+/g, '-');
        const instructorRow = document.querySelector(`#instructor-${instructorStr}`);
        if (instructorRow) {
            const countCell = instructorRow.closest('tr').cells[2];
            countCell.textContent = instructorStudents.length;
            
            // Hide row if count is 0, regardless of checkbox state
            const checkbox = instructorRow.closest('tr').cells[0].querySelector('input');
            if (instructorStudents.length === 0) {
                instructorRow.closest('tr').style.display = 'none';
                checkbox.disabled = true;
            } else {
                instructorRow.closest('tr').style.display = '';
                checkbox.disabled = false;
            }
        }
    });
    
    // Update "Select all" checkbox for instructors
    updateSelectAllCheckbox('instructor');
    
    // Update group counts
    groups.forEach(group => {
        // For group counts, we need to apply instructor, student name, and active filters only
        const groupStudents = students.filter(student => {
            // Active filter
            const matchesActive = 
                activeFilter === 'all' || 
                (activeFilter === 'active' && student.active === true) ||
                (activeFilter === 'non-active' && student.active !== true);
            
            // Instructor filter
            const matchesInstructor = selectedInstructors.length === 0 || selectedInstructors.includes(student.instructor);
            
            // Student name filter
            const matchesStudentName = selectedStudentNames.length === 0 || selectedStudentNames.includes(student.name);
            
            return student.group === group && matchesActive && matchesInstructor && matchesStudentName;
        });
        
        // Find the count cell for this group
        // Convert group to string and sanitize for use in ID
        const groupStr = String(group).replace(/\s+/g, '-');
        const groupRow = document.querySelector(`#group-${groupStr}`);
        if (groupRow) {
            const countCell = groupRow.closest('tr').cells[2];
            countCell.textContent = groupStudents.length;
            
            // Hide row if count is 0, regardless of checkbox state
            const checkbox = groupRow.closest('tr').cells[0].querySelector('input');
            if (groupStudents.length === 0) {
                groupRow.closest('tr').style.display = 'none';
                checkbox.disabled = true;
            } else {
                groupRow.closest('tr').style.display = '';
                checkbox.disabled = false;
            }
        }
    });
    
    // Update "Select all" checkbox for groups
    updateSelectAllCheckbox('group');
}

// Update "Select all" checkbox state based on visible checkboxes
function updateSelectAllCheckbox(type) {
    if (type === 'instructor') {
        const visibleCheckboxes = Array.from(document.querySelectorAll('.instructor-checkbox:not(#select-all-instructors)'))
            .filter(checkbox => checkbox.closest('tr').style.display !== 'none' && !checkbox.disabled);
        
        const allChecked = visibleCheckboxes.length > 0 && 
            visibleCheckboxes.every(checkbox => checkbox.checked);
        
        document.getElementById('select-all-instructors').checked = allChecked;
    } else if (type === 'group') {
        const visibleCheckboxes = Array.from(document.querySelectorAll('.group-checkbox:not(#select-all-groups)'))
            .filter(checkbox => checkbox.closest('tr').style.display !== 'none' && !checkbox.disabled);
        
        const allChecked = visibleCheckboxes.length > 0 && 
            visibleCheckboxes.every(checkbox => checkbox.checked);
        
        document.getElementById('select-all-groups').checked = allChecked;
    } else if (type === 'student') {
        const visibleCheckboxes = Array.from(document.querySelectorAll('.student-checkbox:not(#select-all-students)'))
            .filter(checkbox => checkbox.closest('tr').style.display !== 'none' && !checkbox.disabled);
        
        const allChecked = visibleCheckboxes.length > 0 && 
            visibleCheckboxes.every(checkbox => checkbox.checked);
        
        document.getElementById('select-all-students').checked = allChecked;
    }
}
