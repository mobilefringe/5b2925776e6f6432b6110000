<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background" :style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
                    <div class="main_container">
                        <div class="page_container">
                            <h2>{{ currentStore.name }}</h2>
                        </div>
                    </div>
                </div>
                <div class="main_container margin_30">
                    <div class="details_row">
                        <div class="details_col_3">
                            <img class="store_details_image center-block" :src="currentStore.store_front_url_abs" :alt="currentStore.name + ' Logo'" />
                            <div v-if="currentStore.phone">
                                <h3 class="inside_page_title">Phone</h3>
                                <a class="store_details_phone" :href="'tel:' + currentStore.phone">{{ currentStore.phone }}</a>    
                            </div>
                            <a v-if="currentStore.website" class="animated_btn" :href="'http://' + currentStore.website" target="_blank">Visit Website</a>
                        </div>
                        <div class="details_col_9">
                            <div id="map" class="margin_20">
                                <!--<mapplic-map ref="mapplic_ref" :height="400" :minimap= "false" :deeplinking="false" :sidebar="false" :hovertip="false" :maxscale= "5" :storelist="allStores" :floorlist="floorList" tooltiplabel="View Store Details"></mapplic-map>-->
                                
                                <mapplic-map ref="svgmap_ref" :height="300" :minimap= "false" :deeplinking="false" :sidebar="false" :hovertip="true" :maxscale= "5" :storelist="processedStores" :floorlist="floorList" :svgWidth="2500" :svgHeight="2500" @updateMap="updateSVGMap" :key="currentStore.id"></mapplic-map>
                            </div>
                            <div class="inside_page_header">Store Hours & Information</div>
                            <ul v-if="storeHours" class="store_details_hours_list">
                                <li v-for="hour in storeHours" :class="{ today: hour.todays_hours }">
                                    <div v-if="!hour.is_closed">
                                        <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}} </span>{{hour.open_time | moment("h:mma", timezone)}} - {{hour.close_time | moment("h:mma", timezone)}}
                                    </div>
                                    <div v-else>
                                        <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}} </span>CLOSED
                                    </div>
                                </li>
                            </ul>
                            <div class=" margin_30 store_details_desc" v-html="currentStore.rich_description"></div>
                            <div v-if="this.currentStore.promotions">
                                <b-card no-body class="mb-1 inside_page_toggle">
                                    <b-card-header header-tag="header" class="p-1" role="tab">
                                        <b-btn block @click="togglePromos = !togglePromos" :aria-expanded="togglePromos ? 'true' : 'false'" aria-controls="togglePromotions">
                                            Promotions
                                            <i v-if="togglePromos"  class="fa fa-minus f"></i>
                                            <i v-else  class="fa fa-plus"></i>
                                        </b-btn>
                                    </b-card-header>
                                    <b-collapse v-for="promo in storePromotions" v-model="togglePromos" role="tabpanel" id="togglePromotions" class="accordion_body">
                                        <b-card-body>
                                            <div class="row">
                                                <div class="col-md-5" v-if="">
                                                    <img :src="promo.image_url" :alt="'Promotion: ' + promo.name" />
                                                </div>
                                                <div class="col-md-7">
                                                    <h3 class="promo_name">{{promo.name}}</h3>
                                                    <p class="promo_date" v-if="isMultiDay(promo)">
                        							    {{ promo.start_date | moment("MMMM D", timezone)}} to {{ promo.end_date | moment("MMMM D", timezone)}}
                                                    </p>
                                                    <p class="promo_date" v-else>{{ promo.start_date | moment("MMMM D", timezone)}}</p>
                                                    <div class="promo_desc" v-html="promo.description_short"></div>
                                                    <router-link :to="'/promotions/'+ promo.slug" >
							                            <i class="fa fa-caret-right"></i> <span class="read_more">View Promotion Details</span>
					                                </router-link>
                                                </div>
                                            </div>
                                            <hr class="promo_separator" />
                                        </b-card-body>
                                    </b-collapse>
                                </b-card>
                            </div>
                            <div v-if="this.currentStore.jobs">
                                <b-card no-body class="mb-1 inside_page_toggle">
                                    <b-card-header header-tag="header" class="p-1" role="tab">
                                        <b-btn block @click="toggleJobs = !toggleJobs" :aria-expanded="toggleJobs ? 'true' : 'false'" aria-controls="toggleJobs">
                                            Jobs
                                            <i v-if="toggleJobs"  class="fa fa-minus f"></i>
                                            <i v-else  class="fa fa-plus"></i>
                                        </b-btn>
                                    </b-card-header>
                                    <b-collapse v-for="job in storeJobs" v-model="toggleJobs" role="tabpanel" id="toggleJobs" class="accordion_body">
                                        <b-card-body>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <h3 class="promo_name">{{job.name}}</h3>
                                                    <p class="promo_date" v-if="isMultiDay(job)">
                        							    {{ job.start_date | moment("MMMM D", timezone)}} to {{ job.end_date | moment("MMMM D", timezone)}}
                                                    </p>
                                                    <p class="promo_date" v-else>{{ job.start_date | moment("MMMM D", timezone)}}</p>
                                                    <router-link :to="'/jobs/'+ job.slug" >
							                            <i class="fa fa-caret-right"></i> <span class="read_more">View Job Details</span>
					                                </router-link>
                                                </div>
                                            </div>
                                            <hr class="promo_separator" />
                                        </b-card-body>
                                    </b-collapse>
                                </b-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    define(["Vue", "vuex", "moment", "jquery", "bootstrap-vue", "vue!mapplic-map"], function (Vue, Vuex, moment, $, BootstrapVue, MapplicComponent) {
        Vue.use(BootstrapVue);
        return Vue.component("store-details-component", {
            template: template, // the variable template will be injected,
            props: ['id'],
            data: function () {
                return {
                    dataLoaded: false,
                    currentStore: null,
                    storeHours: null,
                    storePromotions: null,
                    togglePromos: false,
                    storeJobs: null,
                    toggleJobs: false,
                    map: null
                }
            },
            created (){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Directory Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5b2925776e6f6432b6110000/image/png/1531495616000/inside_banner.png"
                        }
                    }
                    this.getSVGMap;
                    this.updateCurrentStore(this.id);
                    this.dataLoaded = true;
                });
            },
            watch: {
                $route: function () {
                    this.updateCurrentStore(this.$route.params.id);
                },
                currentStore: function () {
                    this.currentStore.zoom = 2;
                    if (_.includes(this.currentStore.store_front_url_abs, 'missing')) {
                        this.currentStore.store_front_url_abs = this.property.default_logo_url;
                    }
                    
                    var vm = this;
                    var storeHours = [];
                    _.forEach(this.currentStore.store_hours, function (value, key) {
                        hours = vm.findHourById(value)
                        today = moment().day();
                        if( today == hours.day_of_week ){
                            hours.todays_hours = true;
                        } else {
                            hours.todays_hours = false;
                        }
                        storeHours.push(hours);
                    });
                    this.storeHours = _.sortBy(storeHours, function(o) { return o.day_of_week });
                
                    var vm = this;
                    var temp_promo = [];
                    _.forEach(this.currentStore.promotions, function(value, key) {
                        var current_promo = vm.findPromoById(value);
                        
                        if (_.includes(current_promo.image_url, 'missing')) {
                            current_promo.image_url = "http://placehold.it/1560x800/757575";
                        }
                        current_promo.description_short = _.truncate(current_promo.description, { 'length': 150, 'separator': ' ' });

                        temp_promo.push(current_promo);
                    }); 
                    this.storePromotions = temp_promo;
                    this.togglePromos = true;
                    
                    var vm = this;
                    var temp_job = [];
                    _.forEach(this.currentStore.jobs, function(value, key) {
                        var current_job = vm.findJobById(value);
                        temp_job.push(current_job);
                    }); 
                    this.storeJobs = temp_job;
                    this.toggleJobs = true;
                },
                // map : function (){
                    
                //         var vm = this;
                //         setTimeout(function () {
                //             vm.dropPin();
                //         }, 500);
                   
                // }
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'findRepoByName',
                    'processedStores',
                    'findStoreBySlug',
                    'findCategoryById',
                    'findHourById',
                    'findPromoById',
                    'findJobById'
                ]),
                storeCategory() {
                    var currentStoreCategory = this.currentStore.categories[0];
                    category = this.findCategoryById(currentStoreCategory)
                    return category.name
                },
                // allStores() {
                //     this.processedStores.map(function(store){
                //         store.zoom = 4;
                //     })
                //     return this.processedStores;
                // },
                // getSVGMap() {
                //     var svg_maps = this.findRepoByName("SVG Maps").images 
                //     var floor_one = "";
                //     var floor_two = "";
                //     _.forEach(svg_maps, function(value, key) {
                //         if(value.id == 41084) {
                //             floor_one = _.split(value.image_url, '?');
                //             floor_one = floor_one[0];
                //         }
                //         if (value.id == 41085) {
                //             floor_two = _.split(value.image_url, '?');
                //             floor_two = floor_two[0];
                //         }
                //     });
                //     this.floorOne = floor_one;
                //     this.floorTwo = floor_two;
                // },
                // floorList () {
                //     var floor_list = [];
                    
                //     var floor_1 = {};
                //     floor_1.id = "first-floor";
                //     floor_1.title = "Level One";
                //     floor_1.map = this.floorOne;
                //     // floor_1.minimap = this.miniOne;
                //     floor_1.z_index = 1;
                //     floor_1.show = true;
                //     floor_list.push(floor_1);
                    
                //     var floor_2 = {};
                //     floor_2.id = "second-floor";
                //     floor_2.title = "Level Two";
                //     floor_2.map = this.floorTwo;
                //     // floor_2.minimap = this.miniTwo;
                //     floor_2.z_index = 2;
                //     floor_2.show = false;
                //     floor_list.push(floor_2);
                    
                //     return floor_list;
                // }
                
                getSVGurl() {
                    return "https://www.mallmaverick.com" + this.property.svg_map_url;
                },
                svgMapRef() {
                    return this.$refs.svgmap_ref;
                },
                allStores() {
                    this.processedStores.map(function(store){
                        store.zoom = 4;
                    })
                    return this.processedStores;
                },
                floorList () {
                    var floor_list = [];
                    
                    //get svg maps from repo
                    var floor_maps_repo = this.findRepoByName('SVG Map');
                    
                    if(floor_maps_repo !== null && floor_maps_repo !== undefined && floor_maps_repo.images.length > 0){
                        floor_maps = floor_maps_repo.images;
                        if (this.currentStore.z_coordinate == 0) {
                            var floor_0 = {};
                            floor_0.id = "basement-floor";
                            floor_0.title = "Level 0";
                            floor_0.map = _.find(floor_maps, function(o){ return _.toNumber(o.id) == _.toNumber(40469);}).image_url;
                            floor_0.z_index = 0;
                            floor_0.show = true;
                            
                            floor_list.push(floor_0);
                        } else if (this.currentStore.z_coordinate == 1) {
                            var floor_1 = {};
                            floor_1.id = "first-floor";
                            floor_1.title = "Level 1";
                            floor_1.map = _.find(floor_maps, function(o){ return _.toNumber(o.id) == _.toNumber(40470);}).image_url;
                            floor_1.z_index = 1;
                            floor_1.show = true;
                            
                            floor_list.push(floor_1);
                        } else if (this.currentStore.z_coordinate == 2) {
                            var floor_2 = {};
                            floor_2.id = "second-floor";
                            floor_2.title = "Level 2";
                            floor_2.map = _.find(floor_maps, function(o){ return _.toNumber(o.id) == _.toNumber(40471);}).image_url;
                            floor_2.z_index = 2;
                            floor_2.show = true;
                            
                            floor_list.push(floor_2);
                        }
                    }
                    
                    return floor_list;
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "categories"), this.$store.dispatch("getData","promotions"), this.$store.dispatch("getData","jobs")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                updateCurrentStore(id) {
                    this.currentStore = this.findStoreBySlug(id);
                    if (this.currentStore === null || this.currentStore === undefined) {
                        this.$router.replace({ name: 'stores' });
                    }
                },
                updateSVGMap(map) {
                    console.log(map)
                    this.map = map;
                    this.svgMapRef.showLocation(this.currentStore.svgmap_region);
                    this.svgMapRef.addActiveClass(this.currentStore.svgmap_region);
                },
                dropPin(store) {
                    this.svgMapRef.showLocation(store.svgmap_region);
                },
                isMultiDay(promo) {
                    var timezone = this.timezone
                    var start_date = moment(promo.start_date).tz(timezone).format("MM-DD-YYYY")
                    var end_date = moment(promo.end_date).tz(timezone).format("MM-DD-YYYY")
                    if (start_date === end_date) {
                        return false
                    } else {
                        return true
                    }
                }
            }
        });
    });
</script>
