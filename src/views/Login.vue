<template>
    <div class="login-container">
        <h2>登录 / 注册</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" id="username" v-model="username" required />
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">{{ isLogin ? '登录' : '注册' }}</button>
            <p @click="toggleMode">{{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}</p>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
            isLogin: true, // 切换登录/注册模式
        };
    },
    methods: {
        handleSubmit() {
            if (this.isLogin) {
                // 登录逻辑
                console.log('登录:', this.username, this.password);
            } else {
                // 注册逻辑
                console.log('注册:', this.username, this.password);
            }
        },
        toggleMode() {
            this.isLogin = !this.isLogin;
        },
    },
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

p {
    text-align: center;
    margin-top: 15px;
    color: #007bff;
    cursor: pointer;
}
</style>