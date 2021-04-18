<template>
    <div class="login box">
        <img src="../../static/image/03.png" alt="">
        <div class="login">
            <div class="login-title">
                <img src="../../static/image/logo.png" alt="">
                <p>百知教育给你最优质的学习体验!</p>
            </div>
            <div class="login_box">
                <div class="title">
                    <span>忘记密码</span>
                </div>
                <div class="inp">
                    <input type="text" placeholder="手机号码" class="user" v-model="phone" @blur="check_phone">
                    <input type="text" class="pwd" placeholder="短信验证码" v-model="code" @blur="check_message">
                    <input type="password"  v-model="password" name="" class="pwd" placeholder="密码" @blur="pwd">
                    <input type="re_password"  v-model="re_password" name="" class="pwd" placeholder="确认密码" @blur="re_pwd">
                    <button id="get_code" class="btn btn-primary" @click="get_code">{{ code_text }}</button>
                    <button class="login_btn" @click="check_pwd">提交</button>
                    <span class="go_login">没有账号
                        <router-link to="/register">立即注册</router-link>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Check_Pwd",
    data(){
            return{
                username:'',
                password:'',
                re_password:"",
                phone:"",
                token:'',
                code:"",
                rember:false,
                flag2:0,
                code_text:"发送验证码",
                i:60,
            }
        },
    methods:{
        time60s(){
            this.i = this.i - 1;
            this.code_text = this.i
            console.log(this.i)
            if (this.i === 0) {
                this.code_text = '重新发送'
                this.i = 60;
                return;
            }
            clearTimeout(this.timer);  //清除延迟执行 */
            this.timer = setTimeout(()=>{   //设置延迟执行
                this.time60s()
            },1000);
        },
        check_phone() {
            let phone = this.phone;
            let pattern = /^1[356789]\d{9}$/;
            if (phone === null || phone === "") {
                this.$message.error("手机号不能为空")
            }else if (pattern.test(phone) === false) {
                this.$message.error("手机号格式有误")
            }
        },
        re_pwd() {
            let pwd = this.password;
            let re_pwd = this.re_password;
            if (user_pwd === null || user_pwd === "") {
                this.$message.error("请再次输入密码")
            } else if (re_pwd !== pwd ) {
                this.$message.error("两次输入密码不一致")
            }
        },
        check_message() {
            let code = this.code;
            let pattern = /^\d{6}$/;
            if (code === null || code === "") {
                this.$message.error("验证码不能为空")
            } else if (pattern.test(code) === false) {
                this.$message.error("验证码格式有误")
            }
        },
        check_pwd(){
            this.$axios({
                url:this.$settings.HOST + "user/login2/",
                method:"post",
                data:{
                    phone:this.phone,
                    sms_code:this.code,
                }
            }).then(res=>{
                console.log(res.data);
                sessionStorage.username = res.data.username;
                sessionStorage.token = res.data.token;
                this.$message({
                    message:"登录成功",
                    type:"success",
                    duration:1000,
                    showClose:true
                })
                this.$router.push("/home")
            }).catch(error=>{
                console.log(error);
                this.$message.error(error.response.data.msg);
            })
        },
        get_code(){
            if(!/1[3-9]\d{9}/.test(this.phone)){
                this.$alert("手机号格式有误，请确认","警告");
                return false;
            }
            this.time60s()
            this.$axios({
                url:this.$settings.HOST + "user/message/",
                method:'get',
                params:{
                    phone:this.phone,
                    flag:0,
                }
            }).then(res=>{
                console.log(res.data)
                this.$message.success("登录成功")
            }).catch(error=>{
                console.log(error.response)
                this.$message.error("登录失败")
            })
        },
        get_captcha() {
            this.$axios({
                url: this.$settings.HOST + "user/captcha/",
                method: 'get',
                params: {
                    username: this.username
                }
            }).then(res => {
                let data = JSON.parse(res.data);
                // 获取challenge成功后在前端生成验证码
                // 使用initGeetest接口
                // 参数1：配置参数
                // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
                initGeetest({
                    gt: data.gt,
                    challenge: data.challenge,
                    product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                    offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                    new_captcha: data.new_captcha
                }, this.handlerPopup);

            }).catch(error => {
                console.log(error);
            })
        },

        // 获取验证码的回调函数  完成验证码验证的
        handlerPopup(captchaObj) {
            let self = this;
            captchaObj.onSuccess(function () {
                // 获取验证码对象
                let validate = captchaObj.getValidate();
                // 当用户滑动滑块后会发送请求校验结果
                self.$axios({
                    url: self.$settings.HOST + "user/captcha/",
                    method: "post",
                    data: {
                        account: self.account,
                        // password: $('#password1').val(),
                        geetest_challenge: validate.geetest_challenge,
                        geetest_validate: validate.geetest_validate,
                        geetest_seccode: validate.geetest_seccode
                    },
                }).then(res => {
                    // 验证码校验通过则完成登录
                    self.user_login()

                }).catch(error => {
                    console.log(error);
                })
            });
            // 在显示验证码之前先将div置为空
            document.getElementById("geetest1").innerHTML = "";
            // 显示验证码
            captchaObj.appendTo("#geetest1");
        },
    },
    created() {
        if (localStorage.username){
            this.username = localStorage.username
            this.password = localStorage.password
        }
    }
}
</script>

<style scoped>

</style>
