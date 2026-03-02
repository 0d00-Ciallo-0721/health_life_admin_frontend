// 全局 API 配置
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

/**
 * 核心 Fetch 封装
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        // 拦截 401 (Token 过期或未登录)
        if (response.status === 401) {
            console.warn('Unauthorized. Redirecting to login...');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_info');
            window.location.href = '/index.html';
            throw new Error('Unauthorized');
        }

        // 统一错误处理
        if (!response.ok) {
            throw new Error(data.msg || data.detail || '请求失败');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// 导出的 API 方法
window.API = {
    login: (credentials) => request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    getMenus: () => request('/system/menus/tree/'),
    getDashboard: () => request('/dashboard/summary/'),
// ... 原有代码保留 (login, getMenus, getDashboard)

    // 追加 4.1 用户管理接口
    getUsers: (search = '') => request(`/business/users/?search=${encodeURIComponent(search)}`),
    toggleUserStatus: (userId) => request(`/business/users/${userId}/toggle_status/`, { method: 'POST' }),

// ... 原有代码保留 (login, getMenus, getDashboard, getUsers, toggleUserStatus)

    // 追加 4.2 菜谱审核接口
    getPendingRecipes: () => request('/business/recipes/'),
    auditRecipe: (recipeId, result) => request(`/business/recipes/${recipeId}/audit/`, {
        method: 'POST',
        body: JSON.stringify({ result }) // result 必须是 'pass' 或 'reject'
    }),

// ... 原有代码保留

    // 追加 4.3 挑战任务 CRUD 接口
    getTasks: (search = '', type = '') => {
        let query = `?search=${encodeURIComponent(search)}`;
        if (type) query += `&type=${type}`;
        return request(`/business/tasks/${query}`);
    },
    createTask: (data) => request('/business/tasks/', {
        method: 'POST', body: JSON.stringify(data)
    }),
    updateTask: (id, data) => request(`/business/tasks/${id}/`, {
        method: 'PUT', body: JSON.stringify(data)
    }),
    deleteTask: (id) => request(`/business/tasks/${id}/`, {
        method: 'DELETE'
    }),

// ... 原有代码保留 (包含 login, getMenus, getUsers, getTasks 等)

    // 追加 4.4 系统管理接口
    getLogs: (operator = '', module = '') => request(`/system/logs/?operator=${encodeURIComponent(operator)}&module=${encodeURIComponent(module)}`),
    getNotifications: () => request('/system/notifications/'),
    createNotification: (data) => request('/system/notifications/', {
        method: 'POST', body: JSON.stringify(data)
    }),
    deleteNotification: (id) => request(`/system/notifications/${id}/`, {
        method: 'DELETE'
    }),
    getConfigs: () => request('/system/configs/'),
    // ... 可以根据需要补齐角色和菜单的 CRUD

};