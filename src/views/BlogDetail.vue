<template>
  <div class="detail-content">
    <Header></Header>
<!--    浅色投影边框-->
    <div class="bianKuang" v-if="ownBlog">
      <h2> {{ blog.title }}</h2>
<!--      编辑文字链接  图标是个小笔头  这里设置跳转路径依据的是data()下的blogId,编辑权限ownBlog为true再展示-->
      <el-link icon="el-icon-edit"  class="linklist">
<!--        <el-button type="info" :to="{name: 'BlogEdit', params: {blogId: blog.id}}">-->
<!--          编辑博客-->
<!--        </el-button>-->
        <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}" >
          编辑博客
        </router-link>
      </el-link>
<!--      竖行分割线-->
      <el-divider direction="vertical"></el-divider>
<!--   删除文字链接  图标是个删除  这里设置点击执行delblog()方法-->
      <el-link icon="el-icon-delete" class="linklist">
        <el-button type="danger" round @click="delblog">
          删除博客
        </el-button>
      </el-link>
<!--      分割线-->
      <el-divider><i class="el-icon-unlock"></i></el-divider>

<!--   这里就用 github-markdown-css工具把content渲染的更好看 -->
      <div class="markdown-body" v-html="blog.content"></div>

    </div>

  </div>
</template>

<script>
import Header from "@/components/Header";
import 'github-markdown-css'

export default {
  name: "BlogDetail",
  components: {Header},
  data() {
    return {
      blog: {
        id: "",
        title: "",
        content: ""
      },
      //可编辑权限默认false
      ownBlog: false
    }
  },
  methods: {
    delblog () {
      const blogDelId = this.$route.params.blogId
      console.log(blogDelId)
      // const _this = this
      if (blogDelId) {
        //这里用vue的确认框组件
        this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //后端的/blogdel/id方法设置了@RequiresAuthentication 所以需要设置header
          this.$axios.get('/blogdel/' + blogDelId, {
            headers: {
              "Authorization": localStorage.getItem("token")
            }
          }).then(res => {
            //这里用vue的消息提示
            this.$message({
              type: 'success',
              message: res.data.data
            });
            //删除完在重定向到列表页面
            this.$router.push("/blogs")
          });

        }).catch(() => {

          //有异常就弹出取消删除消息框
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  },
  created() {
    const blogId = this.$route.params.blogId
    console.log(blogId)
    const _this = this
    //get请求获取对应blogId的信息填充到data()
    this.$axios.get('/blog/' + blogId).then(res => {
      const blogRes = res.data.data
      _this.blog.id = blogRes.id
      _this.blog.title = blogRes.title

      //上述res直接得到的content对象是markdown格式（带##这些）  这里要用"markdown-it做渲染
      var MardownIt = require("markdown-it")
      var md = new MardownIt()
      //转换
      var result = md.render(blogRes.content)
      _this.blog.content = result;

      //博客的userId和在store中存储的userInfo下的id已知时 允许编辑  ownBlog = true
      _this.ownBlog = (blogRes.userId === _this.$store.getters.getUser.id)
    });
  }

}
</script>


<style scoped>
.bianKuang {
  /*边框样式*/
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  min-height: 700px;
  padding: 20px 15px;
}
.linklist {
  max-height: 960px;
  margin: 0 auto;
  text-align: center;
}
/*.detail-content{*/
/*  max-height: 960px;*/
/*  margin: 0 auto;*/
/*  text-align: center;*/
/*}*/

</style>