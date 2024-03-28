<template>
    <div>
        <el-container>
            <!-- 按钮 -->
            <el-header class="btn-box">
                <el-input-number v-model="batchNum"
                                 size="small"
                                 :min="1"
                                 :max="10"
                                 title="批量打印数量"></el-input-number>
                <el-button v-for="(item,index) in btnList"
                           :key="index"
                           :type="item.type"
                           :icon="item.icon"
                           :plain="item.plain"
                           :round="item.round"
                           size="small"
                           @click="item.click"
                           style="margin: 0;">
                    {{ item.text }}
                </el-button>
                <el-button-group>
                    <el-button type="primary"
                               icon="el-icon-remove-outline"
                               size="small"
                               :plain="true"
                               @click="onScale(true)"></el-button>
                    <el-button type="primary"
                               size="small"
                               :plain="true"
                               disabled>
                        {{ scale + '%' }}
                    </el-button>
                    <el-button type="primary"
                               icon="el-icon-circle-plus-outline"
                               size="small"
                               :plain="true"
                               @click="onScale(false)"></el-button>
                </el-button-group>

                <el-select v-model="paperType"
                           size="small"
                           placeholder="请选择"
                           @change="onPaperTypeChange">
                    <el-option v-for="item in paperTypes"
                               :key="item"
                               :label="item"
                               :value="item">
                    </el-option>
                </el-select>

                <el-input v-model="paperSize"
                          size="small"
                          placeholder="自定义尺寸,格式：宽,高. 如 160,240"
                          suffix-icon="el-icon-rank"
                          style="width: 280px"
                          :clearable="true"
                          @blur="onPaperSizeChange">
                </el-input>

                <el-dropdown size="small"
                             split-button
                             type="primary"
                             @command="onCommand">
                    开发辅助
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">
                            打印内容对象到 <span style="color: red;font-weight: bold;">控制台</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="b">
                            打印内容HTML到 <span style="color: red;font-weight: bold;">控制台</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="c">
                            打印模板对象到 <span style="color: red;font-weight: bold;">控制台</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="d">
                            导出模板对象到 <span style="color: green;font-weight: bold;">文件</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="e"
                                          disabled>
                            从当前模板提取 Provider 到文件
                        </el-dropdown-item>
                        <el-dropdown-item command="f"
                                          disabled>锁定页码在右下角
                            <el-switch v-model="keepPageNumberPosition"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       disabled>
                            </el-switch>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>

            <!-- 主体 -->
            <el-container style="margin-top: 1rem;">
                <el-aside width="360px">
                    <el-container direction="vertical">
                        <div class="aside-box">
                            <h1 class="aside-title">打印设计组件 - Unorder List Build</h1>
                            <div id="default-elems-box"
                                 class="elems-box">
                            </div>
                        </div>

                        <div class="aside-box">
                            <h1 class="aside-title">打印设计组件 - HTML Build</h1>
                            <el-row>
                                <el-col :span="8"
                                        v-for="(item, index) in defaultElems"
                                        :key="index">
                                    <div class="ep-draggable-item elems-item"
                                         :tid="item.tid">
                                        <i :class="item.icon" />
                                        <div>{{ item.title }}</div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>

                        <div class="aside-box">
                            <h1 class="aside-title">我的元素 - Custom Elements</h1>
                            <div id="my-elems-box"
                                 class="elems-box">
                            </div>
                        </div>
                    </el-container>
                </el-aside>
                <el-main class="main-box">
                    <div id="canvas-box">
                    </div>
                </el-main>
                <el-aside width="360px"
                          class="aside-box">
                    <h1 class="aside-title">配置选项</h1>
                    <div id="setting-box">
                        <el-empty description="点击元素查看"></el-empty>
                    </div>
                </el-aside>
            </el-container>
        </el-container>

        <!-- 预览弹窗 -->
        <el-dialog title="预览"
                   width="fit-content"
                   :visible.sync="preview">
            <div style="background-color: #ccc;padding: 1rem;">
                <div v-html="html"
                     style="background-color: white;width: fit-content;">
                </div>
            </div>
            <span slot="footer"
                  class="dialog-footer">
                <el-button size="small"
                           type="primary"
                           @click="preview = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import myElement from "@/providers/myElement.js";

export default {
    name: "ElementuiView",
    components: {},
    mounted() {
        const myGroup = this.$createElemsGroup("我的分组", myElement);
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
            hpt: {},

            defaultElems: [
                {
                    tid: "defaultModule.text",
                    icon: "el-icon-edit",
                    title: "文本",
                },
                {
                    tid: "defaultModule.image",
                    icon: "el-icon-picture-outline",
                    title: "图片",
                },
                {
                    tid: "defaultModule.longText",
                    icon: "el-icon-document",
                    title: "长文本",
                },
                {
                    tid: "defaultModule.table",
                    icon: "el-icon-s-grid",
                    title: "表格",
                },
                {
                    tid: "defaultModule.html",
                    icon: "el-icon-s-opportunity",
                    title: "HTML",
                },
                {
                    tid: "defaultModule.customText",
                    icon: "el-icon-star-off",
                    title: "自定义",
                },
                {
                    tid: "defaultModule.barcode",
                    icon: "el-icon-c-scale-to-original",
                    title: "条形码",
                },
                {
                    tid: "defaultModule.qrcode",
                    icon: "el-icon-menu",
                    title: "二维码",
                },
                {
                    tid: "defaultModule.hline",
                    icon: "el-icon-minus",
                    title: "横线",
                },
                {
                    tid: "defaultModule.vline",
                    icon: "el-icon-d-caret",
                    title: "竖线",
                },
                {
                    tid: "defaultModule.rect",
                    icon: "el-icon-full-screen",
                    title: "矩形",
                },
                {
                    tid: "defaultModule.oval",
                    icon: "el-icon-coin",
                    title: "圆形",
                },
            ],

            btnList: [
                {
                    text: "浏览器打印",
                    type: "primary",
                    icon: "el-icon-printer",
                    click: this.onBrowserPrintBtnClick,
                },
                {
                    text: "客户端打印",
                    type: "warning",
                    icon: "el-icon-monitor",
                    click: this.onClientPrintBtnClick,
                },
                {
                    text: "导出为PDF",
                    type: "success",
                    icon: "el-icon-document",
                    click: this.onExportToPdf,
                },
                {
                    text: "预览",
                    type: "success",
                    icon: "el-icon-view",
                    click: this.onPreview,
                    plain: true,
                    round: true,
                },
                {
                    text: "清空",
                    type: "danger",
                    icon: "el-icon-delete",
                    click: this.onClear,
                    plain: true,
                    round: true,
                },
                {
                    text: "旋转",
                    type: "warning",
                    icon: "el-icon-refresh-right",
                    click: this.onRotate,
                    plain: true,
                    round: true,
                },
            ],
            batchNum: 1,
            scale: 100,
            paperTypes: [
                ...Array.from({ length: 8 }, (_, i) => "A" + (i + 1)),
                ...Array.from({ length: 8 }, (_, i) => "B" + (i + 1)),
            ],
            paperType: "A4",
            paperSize: "",

            preview: false,
            html: "",

            keepPageNumberPosition: false,
        };
    },
    computed: {},

    watch: {},

    methods: {
        onBrowserPrintBtnClick() {
            this.$browserPrint(this.hpt, {}, this.batchNum);
        },
        onClientPrintBtnClick() {
            this.$clientPrint(this.hpt, {}, this.batchNum);
        },
        onExportToPdf() {
            this.$exportToPDF(this.hpt, {});
        },
        onClear() {
            this.$clearCanvas(this.hpt);
        },
        onPreview() {
            this.html = this.$getPrintHTMLStr(this.hpt, {});
            this.preview = true;
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
        onPaperTypeChange() {
            this.$setPaperType(this.hpt, this.paperType);
        },
        onPaperSizeChange() {
            if (this.paperSize) {
                const size = this.paperSize.split(",");
                if (size.length === 2) {
                    if (/^\d+$/.test(size[0]) && /^\d+$/.test(size[1])) {
                        this.$setPaperSize(this.hpt, size[0], size[1]);
                    } else {
                        this.$message.error(
                            "请按正确格式输入，提示：宽高均为数字"
                        );
                    }
                } else {
                    this.$message.error(
                        "请按正确格式输入，提示：逗号为英文逗号"
                    );
                }
            } else {
                this.$setPaperType(this.hpt, this.paperType);
            }
        },

        // 开发辅助
        onCommand(command) {
            switch (command) {
                case "a": {
                    const html = this.$getPrintHTML(this.hpt, {});
                    console.log(html);
                    break;
                }
                case "b": {
                    const htmlStr = this.$getPrintHTMLStr(this.hpt, {});
                    console.log(htmlStr);
                    break;
                }
                case "c": {
                    const tobj = this.$getTemplateObj(this.hpt);
                    console.log(tobj);
                    break;
                }
                case "d": {
                    const tobj = this.$getTemplateObj(this.hpt);
                    this.$exportTemplateJson(tobj, "模板对象");
                    break;
                }
                case "e": {
                    // TODO
                    const tobj = this.$getTemplateObj(this.hpt);
                    this.$extractElements(JSON.stringify(tobj));
                    break;
                }
                case "f": {
                    // TODO
                    this.keepPageNumberPosition = !this.keepPageNumberPosition;
                    break;
                }
            }
        },
    },
};
</script>
<style src="@/assets/print-elements/elements-list.scss" scoped lang="scss"></style>
<style scoped lang="scss">
.btn-box {
    display: flex;
    justify-self: flex-start;
    align-items: center;
    border: 1px solid #ccc;
    gap: 0.5rem;
}

.main-box {
    margin: 0 2rem;
}

.aside-box {
    border: 1px solid #ccc;
    border-radius: 1rem;
    height: fit-content;
    margin-bottom: 1rem;
}

.aside-title {
    margin: 1rem;
}

.elems-item {
    text-align: center;
    margin: 0.5rem;
}
</style>