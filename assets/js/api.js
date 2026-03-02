// 全局 API 配置
const API_BASE_URL = 'http://127.0.0.1:8000/api/admin/v1';

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
            
            // ✅ 重定向逻辑修复
            window.location.href = window.location.origin + '/index.html';
            throw new Error('Unauthorized');
        }

        // 统一错误处理
        if (!response.ok) {
            throw new Error(data.msg || data.detail || '请求失败');
        }

        // --- 🤖 Antigravity 核心修复 V2：安全的数据响应结构归一化 ---
        if (Array.isArray(data)) {
            data.data = data;
            data.results = data;
            return data;
        } else if (data !== null && typeof data === 'object') {
            const normalized = { ...data };
            
            // 🚀 修复点：安全补充别名，绝不破坏原有嵌套！
            // 这样既能兼容 { count, results: [] } 也能兼容 { code: 200, data: {...} }
            if (normalized.results !== undefined) {
                if (normalized.data === undefined) normalized.data = normalized.results;
            } else if (normalized.data !== undefined) {
                if (normalized.results === undefined) normalized.results = normalized.data;
            } else {
                normalized.data = data;
                normalized.results = data;
            }
            return normalized;
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

    // 用户管理接口
    getUsers: (search = '') => request(`/business/users/?search=${encodeURIComponent(search)}`),
    toggleUserStatus: (userId) => request(`/business/users/${userId}/toggle_status/`, { method: 'POST' }),

    // 菜谱审核接口
    getPendingRecipes: () => request('/business/recipes/'),
    auditRecipe: (recipeId, result) => request(`/business/recipes/${recipeId}/audit/`, {
        method: 'POST',
        body: JSON.stringify({ result })
    }),

    // 挑战任务 CRUD 接口
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

    // 系统操作日志与通知
    getLogs: (operator = '', module = '') => request(`/system/logs/?operator=${encodeURIComponent(operator)}&module=${encodeURIComponent(module)}`),
    getNotifications: () => request('/system/notifications/'),
    createNotification: (data) => request('/system/notifications/', {
        method: 'POST', body: JSON.stringify(data)
    }),
    deleteNotification: (id) => request(`/system/notifications/${id}/`, {
        method: 'DELETE'
    }),
    
    // 商家管理
    getRestaurants: (search = '') => request(`/business/restaurants/?search=${encodeURIComponent(search)}`),
    createRestaurant: (data) => request('/business/restaurants/', { method: 'POST', body: JSON.stringify(data) }),
    updateRestaurant: (id, data) => request(`/business/restaurants/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteRestaurant: (id) => request(`/business/restaurants/${id}/`, { method: 'DELETE' }),

    // 补救方案管理
    getRemedies: (scenario = '') => request(`/business/remedies/?scenario=${encodeURIComponent(scenario)}`),
    
    // 系统配置 CRUD
    getConfigs: () => request('/system/configs/'),
    createConfig: (data) => request('/system/configs/', { method: 'POST', body: JSON.stringify(data) }),
    updateConfig: (id, data) => request(`/system/configs/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteConfig: (id) => request(`/system/configs/${id}/`, { method: 'DELETE' }),
    
    // 角色权限管理接口
    getRoles: () => request('/system/roles/'),
    createRole: (data) => request('/system/roles/', { method: 'POST', body: JSON.stringify(data) }),
    updateRole: (id, data) => request(`/system/roles/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteRole: (id) => request(`/system/roles/${id}/`, { method: 'DELETE' }),

    // 菜单配置管理接口
    getAllMenus: () => request('/system/menus/'), 
    createMenu: (data) => request('/system/menus/', { method: 'POST', body: JSON.stringify(data) }),
    updateMenu: (id, data) => request(`/system/menus/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteMenu: (id) => request(`/system/menus/${id}/`, { method: 'DELETE' }),
};