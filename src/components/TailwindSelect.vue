<template>
    <div class="w-48 rounded-md overflow-hidden shadow bg-white"
         style="border: 1px solid #DCDFE6;">
        <div class="h-8 flex justify-start relative">
            <input class="w-full bg-transparent px-2 py-4 outline-none border-none focus:outline-none text-sm font-mono font-bold"
                   :placeholder="placeholder"
                   :value="value"
                   @click="onOpen"
                   @blur="onClose">
            <img :src="icon"
                 class="w-6 bg-transparent outline-none border-none">
        </div>
        <ul :class="{ invisible: !collapse }"
            class="absolute w-48 h-fit rounded mt-1 py-2 ring-1 ring-black/5 bg-white z-50 shadow-sm ">
            <li v-for="(option,index) in options"
                :key="index"
                class="px-4 py-2 text-sm font-mono font-bold"
                :ref="`opt-${option.value}`"
                @click="onSelect(option)">{{ option.text }}</li>
        </ul>
    </div>
</template>
<script>
import sort from "@/assets/comp-icon/sort-solid.svg";
export default {
    name: "TailwindSelect",
    components: {},
    props: {
        value: {
            type: String,
        },
        options: {
            type: Array,
            default: () => [],
        },
        placeholder: {
            type: String,
            default: "请选择",
        },
    },
    emits: ["changed"],
    mounted() {},
    data() {
        return {
            collapse: false,

            icon: sort,
        };
    },
    computed: {},

    watch: {},

    methods: {
        onOpen() {
            // 将新选项的样式设置为选中样式
            this.setSelectedStyle(this.value);
            this.collapse = !this.collapse;
        },

        onSelect(option) {
            if (this.value !== option.text) {
                // 将旧选项的样式重置为默认样式
                this.setDefaultStyle(this.value);

                // 更新值
                this.$emit("input", option.text);

                // 相应changed事件
                this.$emit("changed", option.text);
            }
        },

        onClose() {
            setTimeout(() => {
                this.collapse = false;
            }, 150);
        },

        setDefaultStyle(value) {
            const oldOpt = this.options.find((o) => o.value === value);
            if (oldOpt) {
                const el = this.$refs[`opt-${oldOpt.value}`][0];
                el.style.backgroundColor = "white";
                el.style.color = "black";
            }
        },

        setSelectedStyle(value) {
            const newOpt = this.options.find((o) => o.value === value);
            if (newOpt) {
                const el = this.$refs[`opt-${newOpt.value}`][0];
                el.style.backgroundColor = "#FEF3C7";
                el.style.color = "#8D532C";
            }
        },
    },
};
</script>
<style src="tailwindcss/tailwind.css" scoped></style>