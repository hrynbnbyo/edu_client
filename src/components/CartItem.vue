<template>
    <div class="cart_item">
        <div class="cart_column column_1">
            <el-checkbox class="my_el_checkbox" v-model="course.selected" @change="change_course_select"></el-checkbox>
        </div>
        <div class="cart_column column_2">
            <img :src="this.$settings.HOST + course.image" alt="">
            <span><router-link to="/course/detail/1">{{ course.name }}</router-link></span>
        </div>
        <div class="cart_column column_3">
            <el-select v-model="course.expire_id" size="mini" placeholder="请选择购买有效期" class="my_el_select">
                <el-option v-for="value in course.expire_list" :label="value.expire_text" :value="value.id" :key="value.id"></el-option>
            </el-select>
        </div>
        <div class="cart_column column_4">¥{{ course.expire_price }}</div>
        <div class="cart_column column_4">
            <span @click="del_item_select">删除</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "CateItem",
    props: ['course'],
    price:0.00,
    data(){
        return{
            checked: this.course.selected,
        }
    },
    watch: {
        // 监听勾选状态是否发生了变化
        "course.selected": function (){
            this.change_course_select();
        },
        "course.expire_id":function (){
            this.change_expire_id();
        }
    },
    methods: {
        change_expire_id(){
            let token = sessionStorage.token;

            this.$axios.patch(this.$settings.HOST + "cart/option2/", {
                course_id: this.course.id,
                expire_id: this.course.expire_id,
            }, {
                headers: {
                    "Authorization": "jwt " + token
                }
            }).then(res => {
                // console.log(res);
                this.$message.success('已切换' );
                this.$parent.get_cart_list();
                this.price = this.course.expire_price;
                console.log(res.data)
                this.$emit("change_selected")
            }).catch(error => {
                console.log(1)
                console.log(error);
            })
        },
        // 发起请求修改redis中的选中状态
        change_course_select() {
            let token = sessionStorage.token;

            this.$axios.patch(this.$settings.HOST + "cart/option/", {
                course_id: this.course.id,
                selected: !this.checked,
            }, {
                headers: {
                    "Authorization": "jwt " + token
                }
            }).then(res => {
                // console.log(res);
                if (!this.checked) {
                    this.$message.success('已勾选 ' + this.course.name);
                } else {
                    this.$message.success('取消勾选 ' + this.course.name);
                }
                this.$emit("change_selected")
            }).catch(error => {
                console.log(error);
            })
        },
        del_item_select(){
            let token = sessionStorage.token;
            console.log(this.course)
            this.$axios({
                url: this.$settings.HOST + "cart/option/",
                method:'delete',
                data:{
                    course_id: this.course.id,
                },
                headers: {
                    "Authorization": "jwt " + token
                }
            }).then(res => {
                this.$message.success('已删除');
                this.$emit("del_item")
            }).catch(error => {
                if (error.response.data.detail === "Signature has expired.")
                    this.$confirm("登录已过期，请重新登录，点击确认可前往登录！").then(() => {
                    this.$store.commit('change_username', '');
                    this.$store.commit('change_count', '');
                    sessionStorage.clear();
                    this.$router.push('/login');
            })
            console.log(error);
            })
        },
    },
}
</script>

<style scoped>
    .cart_item::after {
        content: "";
        display: block;
        clear: both;
    }

    .cart_column {
        float: left;
        height: 250px;
    }

    .cart_item .column_1 {
        width: 88px;
        position: relative;
    }

    .my_el_checkbox {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        width: 16px;
        height: 16px;
    }

    .cart_item .column_2 {
        padding: 67px 10px;
        width: 520px;
        height: 116px;
    }

    .cart_item .column_2 img {
        width: 175px;
        height: 115px;
        margin-right: 35px;
        vertical-align: middle;
    }

    .cart_item .column_3 {
        width: 197px;
        position: relative;
        padding-left: 10px;
    }

    .my_el_select {
        width: 117px;
        height: 28px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
    }

    .cart_item .column_4 {
        padding: 67px 10px;
        height: 116px;
        width: 142px;
        line-height: 116px;
    }

</style>

