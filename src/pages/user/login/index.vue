<template>
    <Breadcrumb />
    <section class="login section login-container">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
                    <div class="form-head">
                        <h4 class="title">用户登录</h4>
                        <el-form :model="formData" :rules="rules" ref="formDataRef">
                            <el-form-item prop="username" class="form-group">
                                <el-input placeholder="请输入账号" v-model="formData.user_name" size="large" type="text">
                                    <template #prefix>
                                        <el-icon>
                                            <User />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password" class="form-group">
                                <el-input placeholder="请输入密码" v-model="formData.password" size="large" type="password"
                                    @keyup.enter.native="loginFunc(formDataRef)">
                                    <template #prefix>
                                        <el-icon>
                                            <Lock />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <div class="check-and-pass">
                                <div class="row align-items-center">
                                    <div class="col-lg-6 col-md-6 col-12">
                                        <!-- <div class="form-check">
                                            <input type="checkbox" class="form-check-input width-auto" id="exampleCheck1">
                                            <label class="form-check-label">Remember me</label>
                                        </div> -->
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-12">
                                        <a href="javascript:void(0)" class="lost-pass">忘记密码?</a>
                                    </div>
                                </div>
                            </div>
                            <el-form-item class="button">
                                <el-button class="btn custom-el-btn-color" type="primary" @click="loginFunc(formDataRef)"
                                    size="large">登录</el-button>
                            </el-form-item>
                            <p class="outer-link">没有账号? <router-link to="/user/register">点击注册</router-link></p>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<route>
    {
        name:'login',
        meta: {
            title: '登录'
        }
    }
</route>
<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus';
import { login } from '../../../request/index'		//这里使用自行封装的axios，下文已给出，照搬后修改运行端口即可
import { useRouter } from 'vue-router';
import { useRootStore } from '../../../store/index'


const router = useRouter();
const store = useRootStore()
//表单
const formDataRef = ref();
let formData = reactive({
    user_name: "",
    password: ""
});
const rules = {
    user_name: [{
        required: true,
        message: "请输入用户名"
    }],
    password: [{
        required: true,
        message: "请输入密码"
    }],
}


const loginFunc = async (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            var form_obj = JSON.parse(JSON.stringify(formData));

            try {
                const { data } = await login(form_obj)
                const { token, id, ...result } = data.result

                ElMessage({
                    message: data.message,
                    duration: 1000,
                    type: 'success',
                    onClose: () => {
                        const userInfo = result
                        // 登录成功后，将token存储到sessionStorage中
                        store.token = token
                        store.userInfo = userInfo
                        // sessionStorage.setItem('token', token)
                        // sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                        router.push('/')
                    }
                })

            } catch (e) {
                ElMessage({ message: '密码错误', duration: 1000, type: 'error' })
            }

        } else {
            return false
        }
    })

} 
</script>
<style lang='scss' scoped>
.login-container {
    padding-bottom: 130px;
}
</style>