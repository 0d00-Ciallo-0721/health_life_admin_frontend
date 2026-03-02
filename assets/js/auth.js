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
            try {
                const response = await window.API.login({
                    username: this.username,
                    password: this.password
                });
                // ✅ 正确代码：兼容被 CustomRenderer 包装的 data 层
                const responseData = response.data || response; // 兼容包装和未包装的情况

                localStorage.setItem('access_token', responseData.token);
                localStorage.setItem('refresh_token', responseData.refresh_token);
                localStorage.setItem('user_info', JSON.stringify(responseData.user_info));
                window.location.href = 'layout.html';
            } catch (err) {
                this.errorMsg = err.message || '登录失败，请检查账号密码';
            } finally {
                this.loading = false;
            }
        }
    }
}