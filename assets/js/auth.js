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
                localStorage.setItem('access_token', response.token);
                localStorage.setItem('refresh_token', response.refresh_token);
                localStorage.setItem('user_info', JSON.stringify(response.user_info));
                
                window.location.href = 'layout.html';
            } catch (err) {
                this.errorMsg = err.message || '登录失败，请检查账号密码';
            } finally {
                this.loading = false;
            }
        }
    }
}