<template>
  <div class="sidebar">
    <el-menu 
    class="sidebar-el-menu" 
    :default-active="onRoutes" 
    :collapse="collapse" 
    background-color="#324157"
    text-color="#bfcbd9" 
    active-text-color="#20a0ff" 
    unique-opened 
    router>
      <template v-for="item in items">
        <template>
            <el-menu-item :index="item.index" :key="item.index">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.title }}</span>
            </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                  {
                      icon: 'el-icon-lx-cascades',
                      index: 'user',
                      title: '用户管理'
                  },
                  {
                      icon: 'el-icon-lx-copy',
                      index: 'message',
                      title: '留言管理'
                  },
                  {
                      icon: 'el-icon-lx-copy',
                      index: 'review',
                      title: '评论管理'
                  }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 135px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
