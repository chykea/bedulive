<template>
    <Breadcrumb />
    <section class="login registration section">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
                    <div class="form-head">
                        <h4 class="title">Registration</h4>
                        <el-radio-group class="identity-panel" v-model="identity" label="identity">
                            <el-radio-button label="1">学生</el-radio-button>
                            <el-radio-button label="2">教师</el-radio-button>
                            <el-radio-button label="0">管理</el-radio-button>
                        </el-radio-group>
                        <el-form :model="formData" :rules="rules" ref="formDataRef">
                            <el-form-item prop="user_name" class="form-group">
                                <el-input placeholder="请输入手机号" v-model="formData.user_name" size="large" type="text">
                                    <template #prefix>
                                        <el-icon>
                                            <User />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password" class="form-group">
                                <el-input placeholder="请输入密码" v-model="formData.password" size="large" type="password"
                                    @keyup.enter.native="registerFunc">
                                    <template #prefix>
                                        <el-icon>
                                            <Lock />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="confirm_password" class="form-group">
                                <el-input placeholder="请确认密码" v-model="formData.confirm_password" size="large"
                                    type="password" @keyup.enter.native="registerFunc">
                                    <template #prefix>
                                        <el-icon>
                                            <Lock />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="" class="button">
                                <el-button type="primary" class="btn" @click="registerFunc(formDataRef)"
                                    size="large">注册</el-button>
                            </el-form-item>
                            <p class="outer-link">已有账号？ <router-link to="/user/login"> 返回登录</router-link>
                            </p>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<route>
    {
        name:'register',
        meta: {
            title: '注册'
        }
    }
</route>
<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../../../request/index'
// const { user: { login, register } } = api
const router = useRouter()
const identity = ref('1')
const formDataRef = ref();
let formData = reactive({
    user_name: "",
    password: "",
    confirm_password: "",
});

const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (formData.confirm_password !== '') {
            if (!formDataRef.value) return
            formDataRef.value.validateField('confirm_password', () => null)
        }
        callback()
    }
}
const validateConfPass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== formData.password) {
        callback(new Error("密码不一致"))
    } else {
        callback()
    }
}
const reg = /^1[3456789]\d{9}$/;
const validateUserName = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入手机号'))
    } else if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
    } else {
        callback()
    }

}
const rules = {
    user_name: [{
        required: true,
        validator: validateUserName,
        trigger: 'blur'
    }],
    password: [{
        required: true,
        validator: validatePass,
        trigger: 'blur'
    }],
    confirm_password: [{
        required: true,
        validator: validateConfPass,
        trigger: 'blur'
    }],

}


const registerFunc = (formEle) => {

    if (!formEle) return
    formEle.validate(async (valid) => {
        if (valid) {
            try {
                const { user_name, password } = formData
                const form_obj = { user_name, password, identity: identity.value }
                const { data } = await register(form_obj)
                // const token = result.token;
                // const userInfo = { user_name: result.user_name, nick_name: result.user_name, identity: result.identity }
                ElMessage({
                    message: data.message,
                    duration: 1000,
                    type: 'success',
                    onClose: () => {
                        router.push('/user/login')
                    }
                })
            } catch (e) {
                console.log(e);
            };
        } else {
            return false
        }
    })
}
</script>
<style lang='scss' scoped>
.identity-panel {
    margin-bottom: 22px;
}
</style>