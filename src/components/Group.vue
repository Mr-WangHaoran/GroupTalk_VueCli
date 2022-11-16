<template>
    <el-container>
        <el-aside :class="display">
            <el-tag type="danger" effect="dark">当前群聊成员</el-tag>
            <UserList :userList="userList" :nickname="nickname"></UserList>
        </el-aside>
        <el-button type="text" @click="toggle" style="position:absolute;">{{text==1?'显示':'隐藏'}}</el-button>
        <el-container>
            <el-header>
                当前在线人数：<span style="color:red;font-weight:bold">{{ online_num }}</span>&nbsp;&nbsp;&nbsp; 当前北京时间：<el-tag
                    type="info">{{ nowDate }}</el-tag>
                <span>我的昵称：</span>
                <el-tag type="danger">{{ nickname }}</el-tag>
                <el-button type="info" icon="el-icon-arrow-right" @click="exit">退出系统</el-button>
            </el-header>
            <el-main>
                <div class="scroll">
                    <div v-for="item in infos1" :key="item.id">
                        <el-tag type="warning" v-if="item.username == nickname">{{ item.time }}我</el-tag>
                        <el-tag v-else>{{ item.time }}{{ item.username }}</el-tag>
                        <span style="display:inline-block;top:5px">{{ item.data }}</span>
                    </div>
                </div>
            </el-main>
            <el-footer>
                <el-input v-model="input" placeholder="请输入消息" style="width:80%" autofocus></el-input>
                <el-popover placement="top-start" title="提示" width="200" trigger="hover"
                    content="请先输入要发送的消息哦，文明用语，构建和谐社会！(●'◡'●)">
                    <el-button type="primary" slot="reference" icon="el-icon-s-promotion" id="sendBtn"
                        :disabled="btn_disable" @click="sendMsg">发送</el-button>
                </el-popover>
            </el-footer>
        </el-container>
    </el-container>
</template>

<script>
let words = ['我操', '傻逼', '傻B', '操', '操你妈', '傻', '狗', '妈', '奶', 'B', "逼"];
let ws = null;
//这里可以导入其他文件（比如：组件，工具 js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import UserList from '@/components/UserList';
import bus from '../util/bus';
import axios from 'axios';
export default {
    //import 引入的组件需要注入到对象中才能使用
    components: {
        UserList,
        bus,
    },
    props: {},
    data() {
        //这里存放数据
        return {
            nickname: '',
            display:'display-show',
            text: 0,//0是隐藏，1是显示
            online_num: 0,
            nowDate: null,
            time_send: null,
            timer: '',
            input: '',
            infos: [

            ],
            userList: []
        };
    },
    //计算属性 类似于 data 概念
    computed: {
        btn_disable() {
            return this.input.length != 0 ? false : true;
        },
        infos1() {
            return this.infos;
        }
    },
    //监控 data 中的数据变化
    watch: {},
    //方法集合
    methods: {
        keydown() {
            document.onkeydown = (e) => {
                //事件对象兼容
                let e1 = e || event || window.event || arguments.callee.caller.arguments[0];
                if (this.input.length != 0 && e1.keyCode == 13) {
                    this.sendMsg();
                }
                //ESC
                if (e1.keyCode == 27) {
                    this.$router.replace("/");
                }
            }
        },
        toggle() {
            if (this.text == 0) {
                //如果是隐藏，就切换为显示
                this.text=1;
                this.display = "display-none";
            } else {
                //如果是显示，就切换为隐藏
                this.text=0;
                this.display = "display-show";
            }

        },
        getDate() {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            function check(i) {
                const num = (i < 10) ? ("0" + i) : i;
                return num;
            }
            this.nowDate = year + "年" + check(month) + "月" + check(day) + "日";
        },
        getTime() {
            const date = new Date();
            let hh = date.getHours();
            let mf = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            return hh + ':' + mf + " ";
        },
        sendMsg() {
            if (words.indexOf(this.input) != -1) {
                this.$message.error("发送的消息太粗鲁了😡，禁止发送！");
                this.input = '';
                return;
            }
            if (ws == null) {
                this.$message.error("WebSocket对象error，Please contact Adminstrator");
                return;
            }
            ws.send(this.input);
            this.infos.push({ id: Math.random(), time: this.getTime(), username: this.nickname, data: this.input });

            this.input = '';
            this.$message.success("发送成功");
        },
        exit() {
            if (ws != null) ws.close();
            this.$router.replace("/");
        }
    },
    //生命周期 - 创建完成（可以访问当前 this 实例）
    created() {
        this.timer = setInterval(this.getDate, 1000);
        document.addEventListener('keydown', this.keydown);
        //兄弟组件之间传值
        bus.$on("sendNickName", data => {
            // console.log(data);
            this.nickname = data;
        });
    },
    //生命周期 - 挂载完成（可以访问 DOM 元素）
    mounted() {
        if (this.nickname.length < 2) {
            this.$router.replace("/");
            return;
        }
        let url = "ws://localhost:8080";
        let req = "/chat/?username=" + this.nickname;
        ws = new WebSocket(url + req);
        // console.log(url + req);
        //初始化连接
        ws.onopen = (e) => {
            // console.log(e);
            console.log("已和服务器建立websocket连接");
        }
        //用于指定收到服务器数据后的回调函数
        ws.onmessage = (data) => {
            // console.log(data.data);
            let d = JSON.parse(data.data);
            // console.log("d="+d);
            if (d.online_num != null) {
                //如果online_num有变化，说明用户信息有变化，所以在这里面发送axios请求获取用户信息
                this.online_num = d.online_num;
                axios.get("http://localhost:8080/getUserList").then(result => {
                    // console.log(result.data);
                    // console.log(result.data.userList);
                    this.userList = result.data.userList;
                })
            }
            if (d.msg != null && d.username != null) {
                if (d.username != this.nickname) {
                    this.infos.push({ id: Math.random(), time: this.getTime(), username: d.username, data: d.msg });
                }
            }
            // console.log("d.online_num="+d.online_num);

        }
        //报错时的回调函数
        ws.onerror = (error) => {
            console.log(error);
        }
        //用于指定连接关闭后的回调函数。
        ws.onclose = (e) => {
            console.log("和服务器的websocket连接已关闭");
        }

    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() {
        if (ws != null) ws.close();
        if (this.timer) {
            clearInterval(this.timer); // 在Vue实例销毁前，清除定时器
        }
        document.removeEventListener('keydown', this.keydown);
        bus.$off('sendNickName');

    }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有 keep-alive 缓存功能，这个函数会触发
}
</script>
<style scoped>
.display-none {
    display: none;
}

.display-show {
    display: block;
}

.el-container {
    height: 100%;
    width: 100%;
}

.el-header,
.el-footer {
    background-color: black;
    color: white;
    text-align: center;
    line-height: 60px;
    font-weight: bold;
}

.el-aside {
    background-color: black;
    color: #333;
    height: 100%;
    text-align: center;
}


.el-main {
    background-color: #E9EEF3;
    color: #333;
    height: 100%;
}

.scroll {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>