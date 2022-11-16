<template>
    <div class="block">
        <el-image :src="src" :preview-src-list="srcList" style="width:400px;height:400px" fit="fill"></el-image>
        <br>
        <el-input v-model="username" placeholder="请输入您的昵称,长度限制在2-16个字符之间" maxlength="16" minlength="2" show-word-limit
            clearable autofocus style="width:500px;"></el-input>

        <el-tooltip class="item" effect="dark" content="请将昵称长度限制在2-16个字符之间" placement="top" :disabled="d_tooltip">
            <el-button type="primary" :disabled="btn_disable" @click="jump">进入聊天室</el-button>
        </el-tooltip>

        <div class="introd">
            <el-tag type="danger" effect="dark">为了您的良好体验，建议用电脑浏览器打开</el-tag>
            <br><br>
            GroupTalk 是一款IM在线群聊Web系统，用户只需要输入自定用户名就可以进入聊天室畅谈，无需登录注册<br><br>
            本系统未用到任何数据库，均内存处理，所以如果二次开发建议采用redis，不过要先征得本人同意<br><br>
            邮箱：<el-tag type="">【国外】whr1065@gmail.com </el-tag> <el-tag type="">【国内】whr1065@126.com </el-tag> <el-tag type="">twitter@garfield_human</el-tag>
            <br><br>
            以下是本系统采用的技术栈：
            <br>
            <p><el-tag type="info" effect="dark">前端：Vue,Vue-cli,ElementUI</el-tag></p>
            <p><el-tag type="info" effect="dark">后端：SpringBoot,Spring-Websocket,Slf4j&FastJson</el-tag></p>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具 js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import bus from '../util/bus';
import axios from 'axios'
//图片也要导入
import ngu from '../assets/avatar.jpg'
export default {
    //import 引入的组件需要注入到对象中才能使用
    components: {
        bus,
        axios
    },
    props: {},
    data() {
        //这里存放数据
        return {
            src: ngu,
            srcList: [ngu],
            username: '',
            d_tooltip: false,
        };
    },
    //计算属性 类似于 data 概念
    computed: {
        btn_disable() {
            return this.username.length < 2 ? true : false;
        },
    },
    //监控 data 中的数据变化
    watch: {},
    //方法集合
    methods: {
        keydown() {
            document.onkeydown = (e) => {
                //事件对象兼容
                let e1 = e || event || window.event || arguments.callee.caller.arguments[0];
                if (this.username.length >= 2 && e1.keyCode == 13) {
                    this.jump();
                }
            }
        },
        jump() {
            if (this.username.length < 2) return;
            axios.get("http://localhost:8080/inspectName/" + this.username).then((result) => {
                // console.log(result);
                if (result.data.permit === 'ok') {
                    this.$router.push("/group");//这里加不加/都可以
                } else {
                    this.$message.error(result.data.error);
                }
            }).catch((err) => {

            });
            return;

        }
    },
    //生命周期 - 创建完成（可以访问当前 this 实例）
    created() {
        document.addEventListener('keydown', this.keydown);
    },
    //生命周期 - 挂载完成（可以访问 DOM 元素）
    mounted() {

    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    /* 
        先新页面的beforeCreate、created、beforeMount，
        然后旧页面的beforeDestroy、destroyed，再然后新页面的mounted
    */
    beforeDestroy() {
        document.removeEventListener('keydown', this.keydown);
        bus.$emit("sendNickName", this.username);
    }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有 keep-alive 缓存功能，这个函数会触发
}
</script>
<style scoped>
.introd {
    color: rgb(255, 0, 0);
    font-weight: bold;
    line-height: 1;
}
.el-image:hover{
    box-shadow: 3px 3px 100px white;
}
</style>