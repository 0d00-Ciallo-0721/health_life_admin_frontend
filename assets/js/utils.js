window.Utils = {
    // 日期格式化: 2023-10-24 14:30
    formatDate: (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + 
               date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute:'2-digit' });
    },
    
    // 获取 Token
    getToken: () => localStorage.getItem('access_token'),
    
    // 清除登录状态
    clearAuth: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
    },

    // 获取当前登录用户信息
    getUserInfo: () => JSON.parse(localStorage.getItem('user_info') || '{}')
};