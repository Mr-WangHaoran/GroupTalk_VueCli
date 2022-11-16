<template>
  <el-container style="height:100%">
    <el-header>
      Welcome to <el-tag type="danger" effect="dark">GroupTalk</el-tag> ,
      Please input your <el-tag type="danger" effect="dark">nickname</el-tag> .
      And please note that you can't come into GroupTalk if you don't input.
    </el-header>
    <el-main>
      <user />
      <audio autoplay controls ref="audio">
        <source src="../assets/makegumi.mp3" type="audio/mp3" />
        <source src="../assets/BeautifulMyth.mp3" type="audio/mp3" />
      </audio>
    </el-main>
  </el-container>
</template>
  
<script>
import user from '@/components/user'
export default {
  name: 'App',
  components: {
    user,
  },
  created() {
    //任何组件都可以通过ref的方式引入
    let audio = this.$ref.audio;
    if(audio.paused){
      audio.play();
    }
  }
}
</script>
  
<style scoped>
.el-header {
  background-color: #000000;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 60px;
  font-weight: bold;
  box-shadow: 3px 3px 100px white;
}
 audio{
  height: 40px;
 }
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 80px;
  height: 100%;
  background-image: url("../assets/bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
  