<template>
    <Header />
    <section class="hero-area style2 overlay">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-7 col-md-12 col-12">
                    <div class="hero-text wow fadeInLeft" data-wow-delay=".3s">
                        <!-- Start Hero Text -->
                        <div class="section-heading">
                            <h2>欢迎来到bedulive</h2>
                            <p>一个学习与编程的教育平台</p>
                        </div>
                        <!-- End Hero Text -->
                    </div>
                </div>
                <div class="col-lg-5 col-md-12 col-12">
                    <!-- Start Search Form -->
                    <div class="search-form style2 wow fadeInRight" data-wow-delay=".5s">
                        <h3 class="heading-title">Search Here</h3>
                        <p class="sub-heding-text">There are many variations of passages of Lorem Ipsum available, but
                            the majority.</p>
                        <div class="row">
                            <div class="col-12 ">
                                <div class="search-input">
                                    <label for="keyword"><i class="lni lni-search-alt theme-color"></i></label>
                                    <input type="text" name="keyword" id="keyword" placeholder="Product keyword">
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="search-input">
                                    <label for="category"><i class="lni lni-grid-alt theme-color"></i></label>
                                    <select name="category" id="category">
                                        <option value="none" selected disabled>Categories</option>
                                        <option value="none">Vehicle</option>
                                        <option value="none">Electronics</option>
                                        <option value="none">Mobiles</option>
                                        <option value="none">Furniture</option>
                                        <option value="none">Fashion</option>
                                        <option value="none">Jobs</option>
                                        <option value="none">Real Estate</option>
                                        <option value="none">Animals</option>
                                        <option value="none">Education</option>
                                        <option value="none">Matrimony</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="search-input">
                                    <label for="location"><i class="lni lni-map-marker theme-color"></i></label>
                                    <select name="location" id="location">
                                        <option value="none" selected disabled>Locations</option>
                                        <option value="none">New York</option>
                                        <option value="none">California</option>
                                        <option value="none">Washington</option>
                                        <option value="none">Birmingham</option>
                                        <option value="none">Chicago</option>
                                        <option value="none">Phoenix</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="search-btn button">
                                    <button class="btn"><i class="lni lni-search-alt"></i> Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- End Search Form -->
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import Header from '../components/header/index.vue'
</script>
<style lang="scss" scoped></style>