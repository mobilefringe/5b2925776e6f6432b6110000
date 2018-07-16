<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background" :style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
                    <div class="main_container">
                        <h2>Leasing</h2>
                    </div>
                </div>
                <div class="main_container mobile_padding margin_30">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="page_body" v-html="currentPage.body"></div>
                            <div v-if="leasingImages" class="leasing_images">
                                <div v-for="image in leasingImages" class="col-md-2 leasing_photo_container">
                                    <a :href="image.image_url" data-lightbox="leasing images">
                                        <div class="leasing_photo" :style="{ backgroundImage: 'url(' +image.image_url+ ')' }"></div>
                                        <p style="display:none;">{{image.id}}</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
    			</div>           
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "jquery", "vee-validate", "utility"], function(Vue, Vuex, $, VeeValidate, Utility) {
        Vue.use(VeeValidate);
        return Vue.component("leasing-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    currentPage: null,
                    leasingImages: null
                }
            },
            created() {
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Map Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5b2925776e6f6432b6110000/image/png/1531495616000/inside_banner.png"
                        }
                    }
                    
                    var repo_data = this.findRepoByName("Leasing Images");
                    if(repo_data != null && repo_data !== undefined && repo_data.images.length > 0){
                        this.leasingImages = repo_data.images;
                    }
                                
                    this.currentPage = response[0].data;

                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName'
                ]),
            },
            methods: {
                loadData: async function () {
                    this.property.mm_host = this.property.mm_host.replace("http:", "");
                    try {
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/gerrardsquare-leasing.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                
                
            }
        });
    });
</script>