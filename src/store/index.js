import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //全局信息(其他组件也可以调用)  类似私有属性
    //在默认值方面由于在mutations中做了类似浏览器缓存，所以可以默认取
    token: localStorage.getItem('token'),
    userInfo: JSON.parse(sessionStorage.getItem("userInfo"))

  },
  mutations: {//类似set
    SET_TOKEN: (state, token) => {
      state.token = token;
      //获取的同时把信息放在localStorage里 localStorage保存的久一点
      localStorage.setItem("token", token);
        },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
      //获取的同时把信息放在sessionStorage里 注意这种放法是非持久性的，关闭页面就没了
      //解决方案是在main.js中判断session中是否还有信息，没有的话就重新访问接口（加快相应速度）  本实验未添加  TODO
      //sessionStorage不能存对象,所以要序列化
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    //删除全局信息  就是把各个对象赋值为空
    REMOVE_INFO: (state) => {
      state.token = '';
      state.userInfo = {};  //空对象
      localStorage.setItem("token", '');
      sessionStorage.setItem("userInfo", JSON.stringify(''));
    }

  },
  getters: {//类似get
    getUser: state => {
      return state.userInfo;
    },

    //也可以直接 在其他地方state.token这样获取
    getToken: state => {
      return state.token;

    }


  },
  actions: {
  },
  modules: {
  }
})
