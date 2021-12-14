<template>

  <div class="lieBiaoYe">
<!--    公共组件  Header-->
    <Header></Header>

<!--    博客列表页  使用TimeLine时间线-->
    <div class="shiJianXian">
      <el-timeline>

        <el-timeline-item :timestamp="record.created" placement="top" v-for="record in records" v-show="hasLogin">
          <el-card>
            <h4>
<!--              这个name: 'BlogDetail' 代表的是route/index.js下的name，会跳转到那-->
<!--              具体跳转到哪篇博客是 path: '/blog/:blogId'  同时利用record.id给blogId赋值-->
              <router-link :to="{name: 'BlogDetail', params: {blogId: record.id}}">
                {{record.title}}
              </router-link>
            </h4>
            <p>{{record.description}}</p>
          </el-card>
        </el-timeline-item>

      </el-timeline>
    </div>

<!--    封页-->
    <div class="fenYe">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5,10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          v-show="hasLogin">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
export default {
  name: "Blogs.vue",
  components: {Header},
  data() {
    return {
      records: {},
      currentPage: 1,
      total: 0,
      pageSize: 5,
      hasLogin:false
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      console.log(`每页 ${pageSize} 条`);
      this.pageSize = pageSize;
      this.getInfo();
    },

    handleCurrentChange(currentPage) {
      console.log(`当前页码是: ${currentPage}`);
      this.currentPage = currentPage;
      this.getInfo()
    },
    // 查询信息
    async getInfo() {
      this.$axios.get('/blogs', {
        params: {
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.records = res.data.data.records
        this.total = res.data.data.total
      });
    }
  },
  created(){
    //渲染的时候默认第一页
    this.handleCurrentChange(1);
    if (this.$store.getters.getUser) {
      this.hasLogin = true;
    }
  }
}
</script>

<style scoped>
  .fenYe{
    margin: 0 auto;
    text-align: center;
  }

</style>