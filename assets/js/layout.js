// 布局页面逻辑 (供 layout.html 的 x-data 调用)
function layoutApp() {
    return {
        menus: [],
        userInfo: {},
        loadingMenus: true,
        iframeLoading: true,
        activePath: './pages/dashboard.html',
        
        get currentMenuName() {
            for(let parent of this.menus) {
                for(let child of parent.children || []) {
                    if(child.path === this.activePath) return child.name;
                }
            }
            return '数据看板';
        },

        async initApp() {
            // 1. 检查登录状态
            const token = localStorage.getItem('access_token');
            // ✅ 修改点：增加对 'undefined' 字符串的过滤
            if (!token || token === 'undefined') {
                window.location.href = 'index.html';
                return;
            }
            this.userInfo = window.Utils.getUserInfo();
            try {
                const response = await window.API.getMenus();
                this.menus = response.data || [];
            } catch (error) {
                console.error("加载菜单失败", error);
            } finally {
                this.loadingMenus = false;
                this.$nextTick(() => lucide.createIcons());
            }
        },

        onIframeLoad() {
            this.iframeLoading = false;
            try {
                const iframeWindow = document.getElementById('content_frame').contentWindow;
                this.activePath = iframeWindow.location.pathname + iframeWindow.location.search;
            } catch(e) {}
        },

        logout() {
            if(confirm("确定要退出系统吗？")) {
                window.Utils.clearAuth();
                window.location.href = 'index.html';
            }
        }
    }
}