// Fetch students data from Airtable
async function fetchStudents() {
    try {
        console.log('GET operation - Sending request for students...');
        const airtableApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.students}`;
        
        const response = await fetch(airtableApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.airtable.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('GET operation - Students response data:', data);
        
        // Format Airtable records to student objects
        students = data.records.map(record => ({
            id: record.id,
            name: record.fields.Name || '',
            group: record.fields.Group || '',
            instructor: record.fields.Instructor || '',
            birthday: record.fields.Birthday || '',
            startDate: record.fields.StartDate || '',
            active: record.fields.Active === true
        }));
        
        // Initialize visibleStudents with all students (needed for students.html)
        if (typeof visibleStudents !== 'undefined') {
            visibleStudents = [...students];
        }
        
        // Extract unique student names for the student filter
        if (typeof studentNames !== 'undefined') {
            studentNames = [...new Set(students.map(student => student.name))].filter(Boolean).sort();
        }
        
        // Extract unique instructors and groups
        extractUniqueValues();
        
        // Populate filter checkboxes
        populateFilterCheckboxes();
        
        // Display students if the function exists (needed for students.html)
        if (typeof displayStudents === 'function') {
            displayStudents();
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        alert('Error fetching students data. Please try again.');
    }
}

// Fetch costs data from Airtable
async function fetchCosts() {
    try {
        console.log('GET operation - Sending request for costs...');
        const airtableApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.cost}`;
        
        const response = await fetch(airtableApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.airtable.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('GET operation - Costs response data:', data);
        
        // Format Airtable records to cost objects
        costs = data.records.map(record => {            
            return {
                id: record.id,
                date: record.fields.CreatedDateTime || '',
                purpose: record.fields['Purpose of payment'] || '',
                studentID: record.fields.StudentID || '',
                studentName: record.fields['Student Name'] || '',
                amount: record.fields['Amount CHF'] || 0,
                notes: record.fields.Notes || []
            };
        });
               // Add this console.log to inspect the formatted costs array
               console.log('Formatted costs array:', costs); 
        
        // Sort costs by date descending by default
        sortCosts('date');
        
        // Set visibleCosts to all costs initially
        visibleCosts = [...costs];
        
        // Display costs
        displayCosts(costs);
        
        // Update totals if payments are already loaded
        if (payments.length > 0) {
            updateTotals(visibleCosts, visiblePayments);
        }
    } catch (error) {
        console.error('Error fetching costs:', error);
        alert('Error fetching costs data. Please try again.');
    }
}

// Fetch payments data from Airtable
async function fetchPayments() {
    try {
        console.log('GET operation - Sending request for payments...');
        const airtableApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.payment}`;
        
        const response = await fetch(airtableApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.airtable.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('GET operation - Payments response data:', data);
        
        // Add this console.log to inspect the raw records
        console.log('Raw payment records from Airtable:', data.records);


        // Format Airtable records to payment objects
        payments = data.records.map(record => {
            // Add this console.log to inspect each record's fields
            console.log('Payment record fields:', record.fields);
            
            return {
                id: record.id,
                date: record.fields.CreatedDateTime || '',
                purpose: record.fields['Purpose of payment'] || '',
                studentID: record.fields.StudentID || '',
                studentName: record.fields['Student Name']  || '',
                amount: record.fields['Amount CHF']  || 0
            };
        });

        // Add this console.log to inspect the formatted payments array
        console.log('Formatted payments array:', payments);
        
        // Sort payments by date descending by default
        sortPayments('date');
        
        // Set visiblePayments to all payments initially
        visiblePayments = [...payments];
        
        // Display payments
        displayPayments(payments);
        
        // Update totals if costs are already loaded
        if (costs.length > 0) {
            updateTotals(visibleCosts, visiblePayments);
        }
    } catch (error) {
        console.error('Error fetching payments:', error);
        alert('Error fetching payments data. Please try again.');
    }
}

// Fetch dossier data from Airtable
async function fetchDossiers() {
    try {
        console.log('GET operation - Sending dossier request...');
        const airtableApiUrl = `https://api.airtable.com/v0/${config.airtable.baseId}/${config.airtable.tables.dossiers}`;
        
        const response = await fetch(airtableApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.airtable.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('GET operation - Dossier response data:', data);
        
        // Format Airtable records to dossier objects
        dossiers = data.records.map(record => ({
            id: record.id,
            timestamp: record.fields.Timestamp || '',
            studentID: record.fields.studentID || '',
            createdBy: record.fields['Created By'] || '',
            record: record.fields.Record || ''
        }));
        
        // Sort dossiers by timestamp descending by default
        dossiers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Update student table to show dossier indicators
        if (students.length > 0) {
            displayStudents(visibleStudents.length > 0 ? visibleStudents : students);
        }
    } catch (error) {
        console.error('Error fetching dossiers:', error);
        // Show error message
    }
}
