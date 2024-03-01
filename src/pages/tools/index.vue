<template>
    <Header />
    <section class="section tools-outer">
        <div class="container tools">
            <div class="category-grid-topbar">
                <div class="row align-items-center">
                    <div class="col-12">
                        <nav>
                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                <button class="nav-link" id="nav-grid-tab" title="编辑器" @click="component = 'Editor'"><i
                                        class="lni lni-grid-alt"></i></button>
                                <button class="nav-link" id="nav-list-tab" title="画板" @click="component = 'DrawBroad'"><i
                                        class="lni lni-list"></i></button>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>

            <keep-alive>
                <component :is="map.get(component)"></component>
            </keep-alive>
            <!-- <Editor /> -->
            <!-- <DrawBroad /> -->

        </div>
    </section>
</template>
<script setup>
import Header from '../../components/header/index.vue'
import Editor from '../../components/editor/index2.vue'
import DrawBroad from '../../components/drawbroad/index2.vue'
import { ref } from 'vue'

const map = new Map([
    ['Editor', Editor],
    ['DrawBroad', DrawBroad]
])
const component = ref('Editor')
</script>
<style lang='scss' scoped>
.tools-outer {
    background-color: #f9f9f9;
}

.tools {
    height: 690px;
}
</style>