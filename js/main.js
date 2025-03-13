// Global variables
let students = [];
let instructors = [];
let groups = [];
let costs = [];
let payments = [];
let costsSort = { field: 'date', direction: 'desc' };
let paymentsSort = { field: 'date', direction: 'desc' };
let selectedCostRows = [];
let selectedPaymentRows = [];
let visibleCosts = [];
let visiblePayments = [];
let studentNames = []; // For student name filter

// Helper function to format date as dd.mm.yyyy
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return '';
    }
    
    // Format as dd.mm.yyyy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
// Set default date for cost creation
const today = new Date().toISOString().split('T')[0];
// Check if cost-date element exists before setting its value
const costDateElement = document.getElementById('cost-date');
if (costDateElement) {
    costDateElement.value = today;
}
// Date input for payment permanently removed
    
    // Fetch data
    fetchStudents();
    fetchCosts();
    fetchPayments();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize totals with empty arrays (will be updated when data is loaded)
    updateTotals([], []);
    
    // Add an event listener that will update totals once all data is loaded
    window.addEventListener('load', () => {
        // Wait a bit longer to ensure all async data is loaded
        setTimeout(() => {
            // Make sure visibleCosts and visiblePayments are populated
            if (costs.length > 0 && visibleCosts.length === 0) {
                visibleCosts = [...costs];
            }
            if (payments.length > 0 && visiblePayments.length === 0) {
                visiblePayments = [...payments];
            }
            
            // Update totals with the current visible data
            updateTotals(visibleCosts, visiblePayments);
        }, 1000);
    });
    
    // Force a clear all filters operation after a short delay to ensure totals are displayed correctly
    setTimeout(() => {
        clearAllFilters();
    }, 500);
});

// Initialize event listeners
function initEventListeners() {
    // Search functionality
    const searchStudentInput = document.getElementById('search-student-input');
    searchStudentInput.addEventListener('input', filterByStudent);
    
    const searchPurposeInput = document.getElementById('search-purpose-input');
    searchPurposeInput.addEventListener('input', filterByPurpose);
    
    // Date filter functionality
    const dateFromInput = document.getElementById('date-from');
    dateFromInput.addEventListener('change', filterByDate);
    
    const dateToInput = document.getElementById('date-to');
    dateToInput.addEventListener('change', filterByDate);
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Comment button functionality
    const createCommentBtn = document.getElementById('create-comment-btn');
    createCommentBtn.addEventListener('click', openCommentDialog);
    
    // Create cost button functionality
    const createCostBtn = document.getElementById('create-cost-btn');
    createCostBtn.addEventListener('click', openCreateCostDialog);
    
    // Save payment button functionality
    const savePaymentBtn = document.getElementById('save-payment-btn');
    savePaymentBtn.addEventListener('click', openCreatePaymentDialog);
    
    // Select all students checkbox
    const selectAllStudents = document.getElementById('select-all-students');
    if (selectAllStudents) {
        selectAllStudents.addEventListener('change', () => {
            const checkboxes = document.querySelectorAll('.student-checkbox:not(#select-all-students)');
            checkboxes.forEach(checkbox => {
                if (!checkbox.disabled) {
                    checkbox.checked = selectAllStudents.checked;
                }
            });
            filterByStudentName();
        });
    }
    
    // Select all costs checkbox
    const selectAllCosts = document.getElementById('select-all-costs');
    selectAllCosts.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('.cost-row-select:not(#select-all-costs)');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAllCosts.checked;
        });
        updateSelectedCostRows();
    });
    
    // Cost table sorting
    const costTableHeaders = document.querySelectorAll('#costs-table th[data-sort]');
    costTableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const field = header.getAttribute('data-sort');
            sortCosts(field);
        });
    });
    
    // Payment table sorting
    const paymentTableHeaders = document.querySelectorAll('#payments-table th[data-sort]');
    paymentTableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const field = header.getAttribute('data-sort');
            sortPayments(field);
        });
    });
    
    // Active filter radio buttons
    const activeFilterRadios = document.querySelectorAll('input[name="active-filter"]');
    activeFilterRadios.forEach(radio => {
        radio.addEventListener('change', filterByActive);
    });
    
    // Select all instructors checkbox
    const selectAllInstructors = document.getElementById('select-all-instructors');
    selectAllInstructors.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('.instructor-checkbox:not(#select-all-instructors)');
        checkboxes.forEach(checkbox => {
            if (!checkbox.disabled) {
                checkbox.checked = selectAllInstructors.checked;
            }
        });
        filterByInstructor();
    });
    
    // Select all groups checkbox
    const selectAllGroups = document.getElementById('select-all-groups');
    selectAllGroups.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('.group-checkbox:not(#select-all-groups)');
        checkboxes.forEach(checkbox => {
            if (!checkbox.disabled) {
                checkbox.checked = selectAllGroups.checked;
            }
        });
        filterByGroup();
    });
    
    // Comment dialog buttons
    const cancelCommentBtn = document.getElementById('cancel-comment-btn');
    cancelCommentBtn.addEventListener('click', closeCommentDialog);
    
    const saveCommentBtn = document.getElementById('save-comment-btn');
    saveCommentBtn.addEventListener('click', saveComment);
    
    // Comment input validation
    const commentInput = document.getElementById('comment-input');
    commentInput.addEventListener('input', validateCommentInput);
    
    // View comments dialog buttons
    const closeCommentsBtn = document.getElementById('close-comments-btn');
    closeCommentsBtn.addEventListener('click', closeViewCommentsDialog);
    
    const addCommentBtn = document.getElementById('add-comment-btn');
    addCommentBtn.addEventListener('click', () => {
        closeViewCommentsDialog();
        openCommentDialog();
    });
    // Cost dialog buttons
    const cancelCostBtn = document.getElementById('cancel-cost-btn');
    cancelCostBtn.addEventListener('click', closeCreateCostDialog);
    
    const saveCostBtn = document.getElementById('save-cost-btn');
    saveCostBtn.addEventListener('click', openConfirmCostDialog);
    
    const saveWithReferencePaymentBtn = document.getElementById('save-with-reference-payment-btn');
    saveWithReferencePaymentBtn.addEventListener('click', openCreatePaymentReferenceDialog);
    
    // Cost form validation
    const costForm = document.getElementById('create-cost-form');
    costForm.addEventListener('input', validateCostForm);
    
    // Add student button
    const addStudentBtn = document.getElementById('add-student-btn');
    addStudentBtn.addEventListener('click', addStudentToCostTable);
    
    // Confirm cost dialog buttons
    const cancelConfirmCostBtn = document.getElementById('cancel-confirm-cost-btn');
    cancelConfirmCostBtn.addEventListener('click', closeConfirmCostDialog);
    
    const saveConfirmCostBtn = document.getElementById('save-confirm-cost-btn');
    saveConfirmCostBtn.addEventListener('click', saveCost);
    
    // Payment reference dialog buttons
    const cancelPaymentRefBtn = document.getElementById('cancel-payment-ref-btn');
    cancelPaymentRefBtn.addEventListener('click', closeCreatePaymentReferenceDialog);
    
    const saveCostAndPaymentBtn = document.getElementById('save-cost-and-payment-btn');
    saveCostAndPaymentBtn.addEventListener('click', openConfirmCostPaymentDialog);
    
    // Confirm cost and payment dialog buttons
    const cancelConfirmCostPaymentBtn = document.getElementById('cancel-confirm-cost-payment-btn');
    cancelConfirmCostPaymentBtn.addEventListener('click', closeConfirmCostPaymentDialog);
    
    const saveConfirmCostPaymentBtn = document.getElementById('save-confirm-cost-payment-btn');
    saveConfirmCostPaymentBtn.addEventListener('click', saveCostAndPayment);
    
    // Payment dialog buttons
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
    cancelPaymentBtn.addEventListener('click', closeCreatePaymentDialog);
    
    const savePaymentDialogBtn = document.getElementById('save-payment-dialog-btn');
    savePaymentDialogBtn.addEventListener('click', openConfirmPaymentDialog);
    
    // Payment form validation
    const paymentForm = document.getElementById('create-payment-form');
    paymentForm.addEventListener('input', validatePaymentForm);
    
    // Confirm payment dialog buttons
    const cancelConfirmPaymentBtn = document.getElementById('cancel-confirm-payment-btn');
    cancelConfirmPaymentBtn.addEventListener('click', closeConfirmPaymentDialog);
    
    const saveConfirmPaymentBtn = document.getElementById('save-confirm-payment-btn');
    saveConfirmPaymentBtn.addEventListener('click', savePayment);
}
