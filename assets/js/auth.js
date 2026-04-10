// 登录页面逻辑 (供 index.html 的 x-data 调用)
function loginForm() {
    return {
        username: '',
        password: '',
        loading: false,
        errorMsg: '',
        async submit() {
            this.loading = true;
            this.errorMsg = '';
            
            // 简单的表单前端校验
            if (!this.username || !this.password) {
                this.errorMsg = '请输入用户名和密码';
                this.loading = false;
                return;
            }

            try {
                // 步骤 1：收集表单中的 username 和 password，向后台发起请求
                const response = await window.API.login({
                    username: this.username,
                    password: this.password
                });
                
                // 步骤 2：兼容被底层 API 拦截器包装的情况，并提取数据
                const responseData = response.data || response; 

                // 提取 access_token 和 user_info
                const accessToken = responseData.access_token || responseData.token;
                const userInfo = responseData.user_info;

                if (!accessToken) {
                    throw new Error('登录响应格式异常，未获取到访问令牌');
                }

                // 步骤 3：将令牌和用户信息存入 localStorage
                localStorage.setItem('access_token', accessToken);
                
                if (responseData.refresh_token) {
                    localStorage.setItem('refresh_token', responseData.refresh_token);
                }
                
                if (userInfo) {
                    localStorage.setItem('user_info', JSON.stringify(userInfo));
                }

                // 成功后跳转至后台布局页 (其中会加载 Dashboard 等子页面)
                window.location.href = 'layout.html';
                
            } catch (err) {
                // UI 错误提示绑定
                this.errorMsg = err.message || '登录失败，请检查账号密码';
                console.error('Login Failed:', err);
            } finally {
                this.loading = false;
            }
        }
    }
}