const API_TASKS = '/api/tasks';
const API_CATEGORIES = '/api/categories';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskModal = document.getElementById('taskModal');
const createTaskBtn = document.getElementById('createTaskBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');

const taskIdInput = document.getElementById('taskId');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const priorityInput = document.getElementById('priority');
const dueDateInput = document.getElementById('due_date');
const categoryInput = document.getElementById('category_id');

const filterStatus = document.getElementById('filterStatus');
const filterPriority = document.getElementById('filterPriority');
const filterCategory = document.getElementById('filterCategory');
const applyFiltersBtn = document.getElementById('applyFilters');
const clearFiltersBtn = document.getElementById('clearFilters');

const taskList = document.getElementById('taskList');
const taskCountBadge = document.getElementById('taskCountBadge');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const messageBox = document.getElementById('messageBox');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const paginationContainer = document.getElementById('paginationContainer');

// State
let currentPage = 1;
let totalPages = 1;
let currentFilters = {};
let currentSearchQuery = '';

// API Helper
async function api(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// Message Display
function showMessage(text, type = 'success') {
    messageBox.textContent = text;
    messageBox.className = `message-box ${type === 'success' ? 'message-success' : 'message-error'}`;
    messageBox.classList.remove('hidden');

    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 4000);
}

// HTML Escape
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Date Formatting
function formatDate(dateStr) {
    if (!dateStr) return 'No due date';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Modal Control
function openModal() {
    taskModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    taskModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    resetForm();
}

function resetForm() {
    taskForm.reset();
    taskIdInput.value = '';
    modalTitle.textContent = 'Create New Task';
    submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Create Task
    `;
    statusInput.value = 'pending';
    priorityInput.value = 'medium';
}

// Render Functions
function renderTasks(tasks) {
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="task-card">
                <div class="task-info">
                    <h4>No tasks found</h4>
                    <p class="task-description">Try adjusting your filters or create a new task to get started.</p>
                </div>
            </div>
        `;
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <article class="task-card">
            <div class="task-top">
                <div class="task-info">
                    <h4>${escapeHtml(task.title)}</h4>
                    <p class="task-description">${escapeHtml(task.description || 'No description provided.')}</p>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask(${task.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
            <div class="tag-row">
                <span class="tag status-${task.status}">${escapeHtml(task.status)}</span>
                <span class="tag priority-${task.priority}">${escapeHtml(task.priority)}</span>
                ${task.category_name ? `<span class="tag">${escapeHtml(task.category_name)}</span>` : ''}
                <span class="tag">${formatDate(task.due_date)}</span>
            </div>
            <p class="task-meta">Created: ${new Date(task.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </article>
    `).join('');
}

function renderPagination(page, total) {
    if (total <= 1) {
        paginationContainer.classList.add('hidden');
        return;
    }

    paginationContainer.classList.remove('hidden');

    let paginationHTML = `
        <button class="page-btn" onclick="changePage(${page - 1})" ${page === 1 ? 'disabled' : ''}>
            Previous
        </button>
    `;

    // Show page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(total, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<button class="page-number" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-info">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-number ${i === page ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    if (endPage < total) {
        if (endPage < total - 1) {
            paginationHTML += `<span class="page-info">...</span>`;
        }
        paginationHTML += `<button class="page-number" onclick="changePage(${total})">${total}</button>`;
    }

    paginationHTML += `
        <button class="page-btn" onclick="changePage(${page + 1})" ${page === total ? 'disabled' : ''}>
            Next
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Load Functions
async function loadCategories() {
    try {
        const result = await api(API_CATEGORIES);
        const categories = result.data;

        categoryInput.innerHTML = `<option value="">No Category</option>` +
            categories.map(cat => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`).join('');

        filterCategory.innerHTML = `<option value="">All Categories</option>` +
            categories.map(cat => `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`).join('');
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

async function loadTasks(page = 1) {
    try {
        const params = new URLSearchParams({
            page: page,
            limit: 5,
            ...currentFilters
        });

        let url = `${API_TASKS}?${params.toString()}`;

        if (currentSearchQuery) {
            url = `${API_TASKS}/search?q=${encodeURIComponent(currentSearchQuery)}&page=${page}&limit=5`;
        }

        const result = await api(url);
        renderTasks(result.data);

        currentPage = result.pagination.page;
        totalPages = result.pagination.totalPages;
        taskCountBadge.textContent = `${result.pagination.total} task${result.pagination.total !== 1 ? 's' : ''}`;

        renderPagination(currentPage, totalPages);

        // Scroll to top of task section smoothly
        document.querySelector('.task-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function loadStats() {
    try {
        const result = await api(`${API_TASKS}/stats`);
        const stats = result.data;

        document.getElementById('stat-total').textContent = stats.total || 0;
        document.getElementById('stat-pending').textContent = stats.pending || 0;
        document.getElementById('stat-progress').textContent = stats.in_progress || 0;
        document.getElementById('stat-done').textContent = stats.done || 0;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Page Change
function changePage(page) {
    if (page < 1 || page > totalPages) return;
    loadTasks(page);
}

// Task CRUD Operations
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        status: statusInput.value,
        priority: priorityInput.value,
        due_date: dueDateInput.value || null,
        category_id: categoryInput.value || null
    };

    try {
        if (taskIdInput.value) {
            await api(`${API_TASKS}/${taskIdInput.value}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            showMessage('Task updated successfully!');
        } else {
            await api(API_TASKS, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            showMessage('Task created successfully!');
        }

        closeModal();
        await Promise.all([loadTasks(currentPage), loadStats()]);
    } catch (error) {
        showMessage(error.message, 'error');
    }
});

async function editTask(id) {
    try {
        const result = await api(`${API_TASKS}/${id}`);
        const task = result.data;

        taskIdInput.value = task.id;
        titleInput.value = task.title || '';
        descriptionInput.value = task.description || '';
        statusInput.value = task.status || 'pending';
        priorityInput.value = task.priority || 'medium';
        dueDateInput.value = task.due_date || '';
        categoryInput.value = task.category_id || '';

        modalTitle.textContent = 'Edit Task';
        submitBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Update Task
        `;

        openModal();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

async function deleteTask(id) {
    const confirmed = window.confirm('Are you sure you want to delete this task? This action cannot be undone.');
    if (!confirmed) return;

    try {
        await api(`${API_TASKS}/${id}`, {
            method: 'DELETE'
        });

        showMessage('Task deleted successfully!');

        // If current page becomes empty, go to previous page
        const result = await api(`${API_TASKS}?page=${currentPage}&limit=5`);
        if (result.data.length === 0 && currentPage > 1) {
            currentPage--;
        }

        await Promise.all([loadTasks(currentPage), loadStats()]);
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Filter & Search
applyFiltersBtn.addEventListener('click', async () => {
    currentFilters = {};
    currentSearchQuery = '';
    searchInput.value = '';

    if (filterStatus.value) currentFilters.status = filterStatus.value;
    if (filterPriority.value) currentFilters.priority = filterPriority.value;
    if (filterCategory.value) currentFilters.category_id = filterCategory.value;

    currentPage = 1;
    await loadTasks(1);
});

clearFiltersBtn.addEventListener('click', async () => {
    filterStatus.value = '';
    filterPriority.value = '';
    filterCategory.value = '';
    currentFilters = {};
    currentSearchQuery = '';
    searchInput.value = '';
    currentPage = 1;
    await loadTasks(1);
});

searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    currentSearchQuery = query;
    currentFilters = {};
    currentPage = 1;

    if (!query) {
        await loadTasks(1);
        return;
    }

    await loadTasks(1);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Modal Events
createTaskBtn.addEventListener('click', () => {
    resetForm();
    openModal();
});

closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        closeModal();
    }
});

// Expose functions globally for onclick handlers
window.editTask = editTask;
window.deleteTask = deleteTask;
window.changePage = changePage;

// Initialize
(async function init() {
    try {
        await loadCategories();
        await Promise.all([loadTasks(), loadStats()]);
    } catch (error) {
        showMessage('Failed to initialize application. Please refresh the page.', 'error');
    }
})();
