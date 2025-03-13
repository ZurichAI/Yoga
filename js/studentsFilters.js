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
        checkbox.id = `instructor-${instructor.replace(/\s+/g, '-')}`;
        checkbox.className = 'instructor-checkbox';
        checkbox.value = instructor;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            // Update "Select all" checkbox
            const allChecked = document.querySelectorAll('.instructor-checkbox:not(#select-all-instructors):checked').length === instructors.length;
            document.getElementById('select-all-instructors').checked = allChecked;
            
            filterStudentsByInstructor();
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
        checkbox.id = `group-${group.replace(/\s+/g, '-')}`;
        checkbox.className = 'group-checkbox';
        checkbox.value = group;
        checkbox.checked = true;
        checkbox.addEventListener('change', () => {
            // Update "Select all" checkbox
            const allChecked = document.querySelectorAll('.group-checkbox:not(#select-all-groups):checked').length === groups.length;
            document.getElementById('select-all-groups').checked = allChecked;
            
            filterStudentsByGroup();
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

// Filter students based on search input
function filterStudents() {
    applyAllFilters();
}

// Filter students by active status
function filterStudentsByActive() {
    applyAllFilters();
}

// Filter students by instructor
function filterStudentsByInstructor() {
    applyAllFilters();
}

// Filter students by group
function filterStudentsByGroup() {
    applyAllFilters();
}

// Apply all filters
function applyAllFilters() {
    // Get search term
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    // Get active filter value
    const activeFilter = document.querySelector('input[name="active-filter"]:checked').value;
    
    // Get selected instructors
    const selectedInstructors = Array.from(document.querySelectorAll('.instructor-checkbox:not(#select-all-instructors):checked')).map(checkbox => checkbox.value);
    
    // Get selected groups
    const selectedGroups = Array.from(document.querySelectorAll('.group-checkbox:not(#select-all-groups):checked')).map(checkbox => checkbox.value);
    
    // Apply filters
    const filtered = students.filter(student => {
        // Search filter
        const matchesSearch = !searchTerm || 
            student.name.toLowerCase().includes(searchTerm) ||
            student.group.toLowerCase().includes(searchTerm) ||
            student.instructor.toLowerCase().includes(searchTerm);
        
        // Active filter
        const matchesActive = 
            activeFilter === 'all' || 
            (activeFilter === 'active' && student.active === true) ||
            (activeFilter === 'non-active' && student.active !== true);
        
        // Instructor filter
        const matchesInstructor = selectedInstructors.length === 0 || selectedInstructors.includes(student.instructor);
        
        // Group filter
        const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(student.group);
        
        return matchesSearch && matchesActive && matchesInstructor && matchesGroup;
    });
    
    // Store the filtered students for dossier filtering
    visibleStudents = filtered;
    
    // Display filtered students
    displayStudents(filtered);
    
    // Update filter counts based on cross-filtering
    updateFilterCounts(filtered);
}

// Clear all filters and reset to default state
function clearAllFilters() {
    // Reset search input
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    
    // Reset active filter to "Active"
    document.getElementById('active-only').checked = true;
    
    // Reset instructor checkboxes
    document.getElementById('select-all-instructors').checked = true;
    document.querySelectorAll('.instructor-checkbox:not(#select-all-instructors)').forEach(checkbox => {
        checkbox.checked = true;
        checkbox.disabled = false;
        // Make sure the row is visible
        const row = checkbox.closest('tr');
        if (row) {
            row.style.display = '';
        }
    });
    
    // Reset group checkboxes
    document.getElementById('select-all-groups').checked = true;
    document.querySelectorAll('.group-checkbox:not(#select-all-groups)').forEach(checkbox => {
        checkbox.checked = true;
        checkbox.disabled = false;
        // Make sure the row is visible
        const row = checkbox.closest('tr');
        if (row) {
            row.style.display = '';
        }
    });
    
    // Apply filters to update the display
    applyAllFilters();
}

// Update filter counts based on current filtered students
function updateFilterCounts(filteredStudents) {
    // Get current filter states
    const activeFilter = document.querySelector('input[name="active-filter"]:checked').value;
    const selectedInstructors = Array.from(document.querySelectorAll('.instructor-checkbox:not(#select-all-instructors):checked')).map(checkbox => checkbox.value);
    const selectedGroups = Array.from(document.querySelectorAll('.group-checkbox:not(#select-all-groups):checked')).map(checkbox => checkbox.value);
    
    // Update instructor counts
    instructors.forEach(instructor => {
        // For instructor counts, we need to apply group and active filters only
        const instructorStudents = students.filter(student => {
            // Active filter
            const matchesActive = 
                activeFilter === 'all' || 
                (activeFilter === 'active' && student.active === true) ||
                (activeFilter === 'non-active' && student.active !== true);
            
            // Group filter
            const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(student.group);
            
            return student.instructor === instructor && matchesActive && matchesGroup;
        });
        
        // Find the count cell for this instructor
        const instructorRow = document.querySelector(`#instructor-${instructor.replace(/\s+/g, '-')}`).closest('tr');
        if (instructorRow) {
            const countCell = instructorRow.cells[2];
            countCell.textContent = instructorStudents.length;
            
            // Hide row if count is 0, regardless of checkbox state
            const checkbox = instructorRow.cells[0].querySelector('input');
            if (instructorStudents.length === 0) {
                instructorRow.style.display = 'none';
                checkbox.disabled = true;
            } else {
                instructorRow.style.display = '';
                checkbox.disabled = false;
            }
        }
    });
    
    // Update "Select all" checkbox for instructors
    updateSelectAllCheckbox('instructor');
    
    // Update group counts
    groups.forEach(group => {
        // For group counts, we need to apply instructor and active filters only
        const groupStudents = students.filter(student => {
            // Active filter
            const matchesActive = 
                activeFilter === 'all' || 
                (activeFilter === 'active' && student.active === true) ||
                (activeFilter === 'non-active' && student.active !== true);
            
            // Instructor filter
            const matchesInstructor = selectedInstructors.length === 0 || selectedInstructors.includes(student.instructor);
            
            return student.group === group && matchesActive && matchesInstructor;
        });
        
        // Find the count cell for this group
        const groupRow = document.querySelector(`#group-${group.replace(/\s+/g, '-')}`).closest('tr');
        if (groupRow) {
            const countCell = groupRow.cells[2];
            countCell.textContent = groupStudents.length;
            
            // Hide row if count is 0, regardless of checkbox state
            const checkbox = groupRow.cells[0].querySelector('input');
            if (groupStudents.length === 0) {
                groupRow.style.display = 'none';
                checkbox.disabled = true;
            } else {
                groupRow.style.display = '';
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
            .filter(checkbox => checkbox.closest('tr').style.display !== 'none');
        
        const allChecked = visibleCheckboxes.length > 0 && 
            visibleCheckboxes.every(checkbox => checkbox.checked);
        
        document.getElementById('select-all-instructors').checked = allChecked;
    } else if (type === 'group') {
        const visibleCheckboxes = Array.from(document.querySelectorAll('.group-checkbox:not(#select-all-groups)'))
            .filter(checkbox => checkbox.closest('tr').style.display !== 'none');
        
        const allChecked = visibleCheckboxes.length > 0 && 
            visibleCheckboxes.every(checkbox => checkbox.checked);
        
        document.getElementById('select-all-groups').checked = allChecked;
    }
}
