<template>
    <div>
        <!-- 按钮 -->
        <div class="flex justify-start gap-3">
            <button class="rounded text-white text-xs font-mono font-bold px-4 py-2"
                    v-for="(item,index) in btnList"
                    :key="index"
                    :class="item.bgColor || 'bg-sky-500'"
                    @click="item.click">
                {{ item.text }}
            </button>
            <TailwindSelect v-model="paperType"
                            :options="paperTypes"
                            @changed="onPaperTypeChange"></TailwindSelect>
            <div class="inline-block border border-sky-600 rounded">
                <button class="py-1.5 px-3"
                        @click="onScale(true)"> - </button>
                <button class="py-1.5 px-3 border-x border-sky-600 text-sm "> {{ scale + '%' }} </button>
                <button class="py-1.5 px-3"
                        @click="onScale(false)"> + </button>
            </div>
        </div>
        <!-- 主体 -->
        <div class="grid grid-cols-5 gap-4 mt-4">
            <div class="flex flex-col gap-5">
                <div class="w-72 h-fit rounded border border-violet-300 shadow-md">
                    <h1 class="text-base font-semibold my-2 mx-4">打印设计组件 - Unorder List Build</h1>
                    <div id="default-elems-box"
                         class="elems-box"></div>
                </div>

                <div class="w-72 h-fit rounded border border-violet-300 shadow-md">
                    <h1 class="text-base font-semibold my-2 mx-4">打印设计组件 - HTML Build</h1>
                </div>

                <div class="w-72 h-fit rounded border border-violet-300 shadow-md">
                    <h1 class="text-base font-semibold my-2 mx-4">我的元素 - Custom Elements</h1>
                    <div id="my-elems-box"
                         class="elems-box"></div>
                </div>
            </div>
            <div class="col-span-3 mt-4 p-4 h-full overflow-x-auto">
                <div id="canvas-box"></div>
            </div>
            <div class="w-96 h-fit rounded border border-violet-300 shadow-md">
                <h1 class="text-xl font-semibold my-2 mx-4">配置选项</h1>
                <div id="setting-box"></div>
            </div>
        </div>
        <!-- 预览 -->
        <dialog ref="previewDialog">
            <div class="flex justify-between items-center">
                <span class="ml-4 font-bold">预览</span>
                <button class="bg-red-600 text-white rounded p-2 m-1 w-10"
                        @click="onDialogClose"> X </button>
            </div>
            <div style="height: 85vh;background-color: white;overflow: auto;">
                <div v-html="html"
                     style="border: 10px #ccc solid;">
                </div>
            </div>
        </dialog>

    </div>
</template>
<script>
import TailwindSelect from "@/components/TailwindSelect.vue";
import myElements from "@/providers/myElement";
export default {
    name: "TailwindcssView",
    components: { TailwindSelect },
    mounted() {
        const myGroup = this.$createElemsGroup("我的分组", myElements);
        const myPprovider = this.$createProvider("myElement", myGroup);
        this.$initProviders(myPprovider);

        this.$buildElemsByUlist("defaultModule", "#default-elems-box");
        this.$buildElemsByUlist("myElement", "#my-elems-box");

        this.$buildElemsByHtml();

        this.hpt = this.$createCoreObj({ settingContainer: "#setting-box" });
        this.$design(this.hpt, "#canvas-box");
    },
    data() {
        return {
            // core object
            hpt: {},

            btnList: [
                {
                    text: "浏览器打印",
                    type: "primary",
                    icon: "el-icon-printer",
                    bgColor: "bg-violet-700",
                    click: this.onBrowserPrintBtnClick,
                },
                {
                    text: "客户端打印",
                    type: "warning",
                    bgColor: "bg-orange-600",
                    click: this.onClientPrintBtnClick,
                },
                {
                    text: "导出为PDF",
                    type: "success",
                    bgColor: "bg-sky-600",
                    click: this.onExportToPdf,
                },
                {
                    text: "预览",
                    type: "success",
                    bgColor: "bg-lime-600",
                    click: this.onPreview,
                },
                {
                    text: "清空",
                    type: "danger",
                    bgColor: "bg-red-800",
                    click: this.onClear,
                },
                {
                    text: "旋转",
                    type: "warning",
                    bgColor: "bg-zinc-600",
                    click: this.onRotate,
                    plain: true,
                    round: true,
                },
            ],
            scale: 100,
            paperTypes: [
                ...Array.from({ length: 5 }, (_, i) => {
                    return { value: "A" + (i + 1), text: "A" + (i + 1) };
                }),
                ...Array.from({ length: 5 }, (_, i) => {
                    return { value: "B" + (i + 1), text: "B" + (i + 1) };
                }),
            ],
            paperType: "A4",

            preview: false,
            html: "",
        };
    },
    computed: {},

    watch: {},

    methods: {
        onBrowserPrintBtnClick() {
            this.$browserPrint(this.hpt, {}, 1);
        },
        onClientPrintBtnClick() {
            this.$clientPrint(this.hpt, {}, 1);
        },
        onExportToPdf() {
            this.$exportToPDF(this.hpt, {});
        },
        onClear() {
            this.$clearCanvas(this.hpt);
        },
        onPreview() {
            this.html = this.$getPrintHTMLStr(this.hpt, {});
            this.$refs.previewDialog.showModal();
        },
        onRotate() {
            this.$rotatePaper(this.hpt);
        },
        onScale(smaller) {
            if (smaller) {
                this.scale = this.scale - 20 < 20 ? 20 : this.scale - 20;
            } else {
                this.scale = this.scale + 20 > 200 ? 200 : this.scale + 20;
            }
            this.$scaleContent(this.hpt, this.scale / 100);
        },
        onPaperTypeChange(value) {
            console.log("change", value);
            this.$setPaperType(this.hpt, this.paperType);
        },

        onDialogClose() {
            this.$refs.previewDialog.close();
        },
    },
};
</script>
<style src="tailwindcss/tailwind.css" scoped></style>
<style src="@/assets/print-elements/elements-list.scss" scoped lang="scss"></style>