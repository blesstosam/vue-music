<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input ref="query" @click="focus"  :placeholder="placeholder" v-model="query" class="box"/>
        <i class="icon-dismiss" v-show="query" @click="clear"></i>
    </div>
</template>

<script>
    import {debounce} from '@/assets/js/util'

    export default {
        name: 'search-box',
        data: function () {
            return {
                query: ''
            }
        },
        props: {
            placeholder: {
                type: String,
                default: '搜索歌曲 歌手'
            } ,

        },
        created: function () {
            //延时发出请求
            this.$watch('query', debounce((newVal) => {
                this.$emit('query', newVal);
            }, 200));
        },
        components: {},
        methods: {
            focus(e) {
                e.target.focus();
            },
            clear() {
                this.query = '';
            },
            setQuery(query) {
                this.query = query;
            },
            //使input失去焦点
            blur() {
                this.$refs.query.blur();
            }
        }
    };

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../assets/stylus/variable"

    .search-box
        display: flex
        align-items: center
        box-sizing: border-box
        width: 100%
        padding: 0 6px
        height: 40px
        background: $color-highlight-background
        border-radius: 6px
        .icon-search
            font-size: 24px
            color: $color-background
        .box
            flex: 1
            margin: 0 5px
            line-height: 18px
            height: 27px
            background: $color-highlight-background
            color: $color-text
            font-size: 15px
            &::placeholder
                color: $color-text-d
        .icon-dismiss
            font-size: 16px
            color: $color-background


</style>

