<template>
  <div class="edit-content">
    <Header></Header>

<!--    表单-->
    <div class="markdown-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

<!--        可拉伸表单-->
        <el-form-item label="摘要" prop="description">
          <el-input type="textarea" v-model="ruleForm.description"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
<!--           这里直接调用mavon-editor编辑器-->
          <mavon-editor v-model="ruleForm.content"></mavon-editor>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: "BlogEdit",
  components: {Header},
  data() {
    return {
      ruleForm: {
        id: '',
        title: '',
        description: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入摘要', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          // post请求到后端/blog/edit接口，该接口要认证，所以添加headers
          this.$axios.post('/blog/edit', this.ruleForm, {
            headers: {
              "Authorization": localStorage.getItem("token")
            }
          }).then(res => {
            console.log(res);
            //提示框组件
            _this.$alert('操作成功', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                //点击确认后执行callback 路由到/blogs 即列表页面
                _this.$router.push("/blogs")
              }
            });
          })
        } else {
          console.log('您的操作有误（操作了别人的博客)');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    //route中本来就已经定义了blogId，所以直接用params方法获取
    const blogId = this.$route.params.blogId;
    console.log(blogId);
    const _this = this
    if(blogId) {
      //请求后端/blog/id接口 获得数据赋值给表单ruleForm对应的列就会显示
      this.$axios.get('/blog/' + blogId).then(res => {
        const blog = res.data.data
        _this.ruleForm.id = blog.id
        _this.ruleForm.title = blog.title
        _this.ruleForm.description = blog.description
        _this.ruleForm.content = blog.content
      })
    }

  }

}
</script>

<style scoped>
  .markdown-content {
    text-align: center;
  }

</style>