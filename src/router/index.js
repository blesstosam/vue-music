import Vue from 'vue'
import Router from 'vue-router'


//异步懒加载组件
const Rank = (resolve) => {
    import('@/components/rank/rank').then((rank) => {resolve(rank);})
};
const Recommend = (resolve) => {
    import('@/components/recommend/recommend').then((recommend) => {resolve(recommend);})
};
const Search = (resolve) => {
    import('@/components/search/search').then((search) => {resolve(search);})
};
const Singer = (resolve) => {
    import('@/components/singer/singer').then((singer) => {resolve(singer);})
};
const SingerDetail = (resolve) => {
    import('@/components/singer-detail/singer-detail').then((singerdetail) => {resolve(singerdetail);})
};
const Disc = (resolve) => {
    import('@/components/disc/disc').then((disc) => {resolve(disc);})
};
const TopList = (resolve) => {
    import('@/components/top-list/top-list').then((toplist) => {resolve(toplist);})
};
const UserCenter = (resolve) => {
    import('@/components/user-center/user-center').then((usercenter) => {resolve(usercenter);})
};

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Root',
            redirect: '/recommend'
        },
        {
            path: '/recommend',
            name: 'Recommend',
            component: Recommend,
            children: [
                {
                    path: ':id',
                    component: Disc
                }

            ]
        },
        {
            path: '/singer',
            name: 'Singer',
            component: Singer,
            children: [
                {
                    path: ':id',
                    name: 'SingerDetail',
                    component: SingerDetail
                }
            ]
        },
        {
            path: '/rank',
            name: 'Rank',
            component: Rank,
            children: [
                {
                    path: ':id',
                    component: TopList
                }
            ]
        },
        {
            path: '/search',
            name: 'Search',
            component: Search,
            children: [
                {
                    path: ':id',
                    component: SingerDetail
                }
            ]
        },
        {
            path: '/user',
            name: 'UserCenter',
            component:UserCenter ,
        },

    ]
})
