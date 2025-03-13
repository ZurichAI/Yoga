// Configuration settings
// =============== !!! IMPORTANT !!! ===============
// This file contains TEST environment keys. For the PROD switch to the CRM.env.js file with access to the PROD environment.
// Airtable API configuration
const config = {
    airtable: {
        apiKey: 'patDOF9oxwBSX51xF.35a49f7d32794d0af49cbb224077937df851caf037eb821dd46034e79018b111',
        baseId: 'appTgYGpfTSWAPkLC',
        tables: {
            students: 'tblclIYLAoNfisfA4',  // Current table (renamed to be more descriptive)
            dossiers: 'tblwTBz0MaLZcxwlb',
            cost: 'tblZJDOPYzSDLbJp8',
            payment: 'tbliYRWH2TeciIeZo',
            // Add additional tables here
            // For example:
            // courses: 'tblXXXXXXXXXXXX',
            // assignments: 'tblYYYYYYYYYYYY',
        }
    }
};

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
    // For Node.js environments
    module.exports = config;
} else {
    // For browser environments
    window.config = config;
}
