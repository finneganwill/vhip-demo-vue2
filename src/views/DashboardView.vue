<template>
    <div>
        <el-row :gutter="12">
            <el-col v-for="(item,index) in cardList"
                    :key="index"
                    :span="8">
                <div @click="onCardClick(item)">
                    <el-card shadow="hover"
                             :header="item.title">
                        <li>vhip-easybuild-api</li>
                        <li>{{ item.title }}</li>
                        <img :src="item.img"
                             width="100%">
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name: "DashboardView",
    components: {},

    data() {
        return {
            cardList: [
                {
                    id: "1",
                    title: "Element UI",
                    path: "elementui",
                    img: require("@/assets/demo-snapshoot/elementui.png"),
                },
                {
                    id: "2",
                    title: "Tailwind CSS",
                    path: "tailwindcss",
                    img: require("@/assets/demo-snapshoot/tailwindcss.png"),
                },
                {
                    id: "3",
                    title: "Custom UI",
                    path: "customui",
                    img: require("@/assets/demo-snapshoot/customui.png"),
                },
            ],
        };
    },
    computed: {},

    watch: {},

    methods: {
        onCardClick(cardItem) {
            this.$router.push(cardItem.path);
        },
    },
};
</script>
<style scoped lang="scss">
.el-col {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
</style>