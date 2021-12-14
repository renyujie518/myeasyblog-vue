import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'


axios.defaults.baseURL = "http://localhost:8081";
//前置拦截（发起请求前的处理，比如可以添加请求头header等等  本实验没有用到）
axios.interceptors.request.use(config => {
    return config;
});

//后置拦截（弹窗提示）
axios.interceptors.response.use(response => {
        let res = response.data;
        console.log("后置拦截测试+++");
        console.log(res);
        console.log("后置拦截测试---");

        //以下是针对状态吗非200，即非正常请求做的拦截处理，同时要有return
        //对res解析  由于后端做了异常统一处理，所以直接输出message
        if (res.code === 200) {
            return response;
        } else if (res.code === 400) {
            console.log(response.data);
            Element.Message.error(response.data.msg, {duration: 3 * 1000});
            // store.commit("REMOVE_INFO");  //这一步可以没有 因为400是 请求错误 这里是参数的输入错误导致，没必要清store区，再请求一次即可
            //阻止后续逻辑
            return Promise.reject(response.data.msg);
        }else if (res.code === 401) {
            //401  无权限的特殊情况  清空store中存的token和userInfo,重定向到登录页面
            store.commit("REMOVE_INFO");
            router.push("/login");
        } else {
            //超时时间3秒消失  If set to 0, it will not turn off automatically
            Element.Message.error("有不明错误，请看提示", {duration: 3 * 1000});
            //阻止后续逻辑
            return Promise.reject(response.data.msg);
        }
    },
    //以下是针对error中的做提示与拦截(保证健壮性)
    error => {
        console.log("您的请求错误");
        console.log(error);

        if (error.response.data) {  //如果error的响应中有数据的存在，就把message取出来
            error.message = error.response.data.msg;
        }

        Element.Message.error(error.message, {duration: 3 * 1000});
        //阻止后续逻辑
        return Promise.reject(error);
    }
);