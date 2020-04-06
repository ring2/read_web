<template>
  <div class="container">
    <el-carousel :interval="1600" type="card" height="300px">
      <el-carousel-item v-for="(item) in 4" :key="item">
        <!-- <h3 class="medium">{{ item }}</h3> -->
        <!-- <img src="../assets/img/1212.jpg" style="width: 648px" /> -->
        {{carouselData[item-1]}}
      </el-carousel-item>
    </el-carousel>
    <div class="tian"></div>
    <div class="tiana">
      <div>
        <el-alert title="@毕业设计作品：李真" type="info" style="margin-top:400px;height:30px" :closable="false" center show-icon></el-alert>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      carouselData: ['欢', '迎', '光', '临']
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.container{
  height: 150%;
}
.tiana {
  height: 50px;
  text-align: center;
  line-height: 100px;
}
.tian {
  margin-top: 130px;
  height: 300px;
  text-align: center;
  line-height: 300px;
  position: relative;
  background-image: url(../assets/bgimg.jpeg);
  background-attachment: fixed;
  background-position: center 0;
  background-repeat: no-repeat;
  background-size: cover;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 40px;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  font-size: 250px;
  text-align: center;
  color: antiquewhite;
  font-family: 'SimSun';
  background-image: url('../assets/img/111.jpg');
}

.el-carousel__item:nth-child(2n + 1) {
  font-size: 250px;
  text-align: center;
  font-family: 'SimSun';
  color: antiquewhite;
  background-image: url('../assets/img/111.jpg');
}
</style>
