// Global variables
let students = [];
let instructors = [];
let groups = [];
let dossiers = [];
let costs = [];
let payments = [];
let currentSort = { field: 'name', direction: 'asc' };
let dossierSort = { field: 'timestamp', direction: 'desc' };
let selectedRows = [];
let visibleStudents = []; // Store currently visible students after filtering

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Fetch students data
    fetchStudents();
    
    // Fetch dossier data
    fetchDossiers();
    
    // Fetch costs and payments data for balance calculation
    fetchStudentCosts();
    fetchStudentPayments();
    
    // Initialize event listeners
    initEventListeners();
});

// Initialize event listeners
function initEventListeners() {
    // Initialize button states
    updateCreateCommentButtonState();
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', filterStudents);
    
    // Comment button functionality
    const createCommentBtn = document.getElementById('create-comment-btn');
    createCommentBtn.addEventListener('click', openCommentDialog);
    
    // Payment button functionality
    const createPaymentBtn = document.getElementById('create-payment-btn');
    createPaymentBtn.addEventListener('click', openCreatePaymentDialog);
    
    // Comment dialog buttons
    const cancelCommentBtn = document.getElementById('cancel-comment-btn');
    cancelCommentBtn.addEventListener('click', closeCommentDialog);
    
    const saveCommentBtn = document.getElementById('save-comment-btn');
    saveCommentBtn.addEventListener('click', saveComment);
    
    // Payment dialog buttons
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
    cancelPaymentBtn.addEventListener('click', closeCreatePaymentDialog);
    
    const savePaymentDialogBtn = document.getElementById('save-payment-dialog-btn');
    savePaymentDialogBtn.addEventListener('click', openConfirmPaymentDialog);
    
    // Payment input validation
    const paymentAmount = document.getElementById('payment-amount');
    paymentAmount.addEventListener('input', validatePaymentForm);
    
    // Payment confirmation dialog buttons
    const cancelConfirmPaymentBtn = document.getElementById('cancel-confirm-payment-btn');
    cancelConfirmPaymentBtn.addEventListener('click', closeConfirmPaymentDialog);
    
    const saveConfirmPaymentBtn = document.getElementById('save-confirm-payment-btn');
    saveConfirmPaymentBtn.addEventListener('click', savePayment);
    
    // Comment input validation
    const commentInput = document.getElementById('comment-input');
    commentInput.addEventListener('input', validateCommentInput);
    
    // View comments dialog buttons
    const closeCommentsBtn = document.getElementById('close-comments-btn');
    closeCommentsBtn.addEventListener('click', closeViewCommentsDialog);
    
    const addCommentBtn = document.getElementById('add-comment-btn');
    addCommentBtn.addEventListener('click', () => {
        // Close the view comments dialog
        closeViewCommentsDialog();
        // Open the add comment dialog
        openCommentDialog();
    });
    
    // Edit student dialog buttons
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    cancelEditBtn.addEventListener('click', closeEditStudentDialog);
    
    const saveEditBtn = document.getElementById('save-edit-btn');
    saveEditBtn.addEventListener('click', openConfirmEditDialog);
    
    // Confirm edit dialog buttons
    const cancelConfirmEditBtn = document.getElementById('cancel-confirm-edit-btn');
    cancelConfirmEditBtn.addEventListener('click', closeConfirmEditDialog);
    
    const saveConfirmEditBtn = document.getElementById('save-confirm-edit-btn');
    saveConfirmEditBtn.addEventListener('click', saveStudentChanges);
    
    // Student table sorting
    const studentTableHeaders = document.querySelectorAll('#students-table th[data-sort]');
    studentTableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const field = header.getAttribute('data-sort');
            sortStudents(field);
        });
    });
    
    // "Select all" checkbox is now disabled since we only allow single selection
    
    // Active filter radio buttons
    const activeFilterRadios = document.querySelectorAll('input[name="active-filter"]');
    activeFilterRadios.forEach(radio => {
        radio.addEventListener('change', filterStudentsByActive);
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
        filterStudentsByInstructor();
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
        filterStudentsByGroup();
    });
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Create cost button functionality
    const createCostBtn = document.getElementById('create-cost-btn');
    createCostBtn.addEventListener('click', openCreateCostDialog);
    
    // Cost dialog buttons
    const cancelCostBtn = document.getElementById('cancel-cost-btn');
    cancelCostBtn.addEventListener('click', closeCreateCostDialog);
    
    const saveCostBtn = document.getElementById('save-cost-btn');
    saveCostBtn.addEventListener('click', openConfirmCostDialog);
    
    const saveWithReferencePaymentBtn = document.getElementById('save-with-reference-payment-btn');
    saveWithReferencePaymentBtn.addEventListener('click', openCreatePaymentReferenceDialog);
    
    // Cost form input validation
    const costPurpose = document.getElementById('cost-purpose');
    costPurpose.addEventListener('input', validateCostForm);
    
    const costAmount = document.getElementById('cost-amount');
    costAmount.addEventListener('input', validateCostForm);
    
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
}
