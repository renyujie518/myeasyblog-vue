<template>
  <div class="h-content">
    <!--    首先是标题-->
    <h3>博客技术分享</h3>
    <!--     头像设置-->
    <div class="touXiang">
      <el-avatar :size="100" :src="user.avatar"></el-avatar>

      <div>{{ user.username }}</div>
    </div>


<!--    添加竖行分割线-->
    <div class="shuFenGeXian">
      <span><el-link href="/blogs">主页</el-link></span>
      <el-divider direction="vertical"></el-divider>
      <span><el-link type="success" href="/blog/add">发表博客</el-link></span>
      <el-divider direction="vertical"></el-divider>
<!--      直接进/blogs(实际上就是登录流程，localStorage无信息的时候)-->
      <span v-show="!hasLogin"><el-link type="primary" href="/login">登录</el-link></span>
<!--      退出的时候调用clickOut方法-->
      <span v-show="hasLogin"><el-link type="danger" @click="clickOut" >退出</el-link></span>
    </div>
  </div>


</template>

<script>
  export default {
    name: "Header",
    data() {
      return {
        user: {
          username: '请先登录',
          avatar: ''
        },
        // 默认未登录 已登录标志位 = false
        hasLogin: false
      }
    },
    methods: {
      clickOut() {
      //请求后端获取token（因为重定向到/logout时要@RequiresAuthentication的时候需要token）并删除store中的信息
        //其实这一步中从后端请求获得jwtToken没必要，只不过标准做法是redis会对token做状态缓存，这样每需要token的时候需要重新请求
        //本实验也可也可以直接从localStorage获取
        const _this = this;
        _this.$axios.get("/logout", {
          headers: {
            //配置本次请求的时候添加头 Authorization
            "Authorization": localStorage.getItem("token")
          }
        }).then(res => {
          _this.$store.commit("REMOVE_INFO");
          _this.$router.push("/login")
        });
      }
    },
    created() {
      //页面创建的时候回显信息  就是将store中的user信息赋值到当前页面
      if (this.$store.getters.getUser) {
        this.user.username = this.$store.getters.getUser.username;
        this.user.avatar = this.$store.getters.getUser.avatar;
        //页面创建了 代表是从login验证后进来的  所以 已登录标志位 = true
        this.hasLogin = true;
      }
    }
  }

</script>

<style scoped>
  .h-content {
    max-height: 960px;
    margin: 0 auto;
    text-align: center;
  }

  .shuFenGeXian {
    margin: 10px 0;
  }

</style>