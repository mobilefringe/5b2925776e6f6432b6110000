<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background" :style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }">
                    <div class="main_container">
                        <div class="page_container">
                            <h2>Center Map</h2>
                        </div>
                    </div>
                </div>
                <div class="main_container margin_30">
                    <div class="details_row">
                        <div class="details_col_3">
                            <div class="hidden_phone">
                                <h3 class="inside_page_title">Find Store</h3>
                                <div class="store_list_container hidden-mobile" v-if="allStores">
                                    <p class="store_name" v-for="store in allStores" v-on:click="dropPin(store)">{{store.name}}</p>
                                </div>
                            </div>
                            <div class="visible_phone">
                                <v-select 
                                    :options="allStores" 
                                    :placeholder="'Select A Store'" 
                                    :searchable="false" 
                                    :label="'name'" 
                                    :on-change="dropPin"
                                ></v-select>
                            </div>
                        </div>
                        <div class="details_col_9">
                            <mapplic-map ref="mapplic_ref" :height="566" :minimap= "false" :deeplinking="false" :sidebar="false" :hovertip="true" :maxscale= "5" :storelist="allStores" :floorlist="floorList" tooltiplabel="Info"></mapplic-map>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "vue!mapplic-map", "vue-select"], function(Vue, Vuex, MapplicComponent, VueSelect) {
        Vue.component('v-select', VueSelect.VueSelect);
        return Vue.component("stores-component", {
            template: template, // the variable template will be injected
            props:['inside_banner'],
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    floorOne: null,
                    floorTwo: null,
                    miniOne: null,
                    miniTwo: null
                }
            },
            created (){
                this.loadData().then(response => {
                    var temp_repo = this.findRepoByName('Map Banner').images;
                    if(temp_repo != null) {
                        this.pageBanner = temp_repo[0];
                    } else {
                        this.pageBanner = {
                            "image_url": "//codecloud.cdn.speedyrails.net/sites/5b2925776e6f6432b6110000/image/png/1531495616000/inside_banner.png"
                        }
                    }
                    this.getSVGMap;
                    this.dataLoaded = true;
                });
            },
            // computed: {
            //     ...Vuex.mapGetters([
            //         'property',
            //         'findRepoByName',
            //         'processedStores'
            //     ]),
            //     allStores() {
            //         this.processedStores.map(function(store){
            //             store.zoom = 1;
            //         })
            //         return this.processedStores;
            //     },
            //     getPNGurl() {
            //         return "https://www.mallmaverick.com" + this.property.map_url;
            //     },
            //     pngMapRef() {
            //         return this.$refs.pngmap_ref;
            //     },
            //     floorList () {
            //         var floor_list = [];
                    
            //         var floor_1 = {};
            //         floor_1.id = "first-floor";
            //         floor_1.title = "Floor 1";
            //         floor_1.map = this.getPNGurl;
            //         floor_1.z_index = 1;
            //         floor_1.show = true;
                    
            //         floor_list.push(floor_1);
            //         return floor_list;
            //     }
            // },
            // methods: {
            //     loadData: async function () {
            //         try {
            //             let results = await Promise.all([this.$store.dispatch("getData", "repos")]);
            //             return results;
            //         } catch (e) {
            //             console.log("Error loading data: " + e.message);
            //         }
            //     },
            //     dropPin(store) {
            //         this.pngMapRef.showLocation(store.id);
            //     }
            // }
            computed: {
                ...Vuex.mapGetters([
                    "property",
                    "timezone",
                    "repos",
                    "findRepoByName",
                    "processedStores",
                    'storesByAlphaIndex',
                ]),
                allStores() {
                    var all_stores = this.processedStores;
                    _.forEach(all_stores, function(value, key) {
                        value.zoom = 2;
                    });
                    var initZoom = {};
                    initZoom.svgmap_region = "init";
                    initZoom.z_coordinate = 1;
                    initZoom.x = 0.5;
                    initZoom.y = 0.5;
                    initZoom.zoom = 1;
                    all_stores.push(initZoom)
                    return all_stores
                },
                getSVGMap() {
                    var svg_maps = this.findRepoByName("SVG Maps").images 
                    console.log(svg_maps)
                    var floor_one = "";
                    var floor_two = "";
                    _.forEach(svg_maps, function(value, key) {
                        if(value.id == 41084) {
                            console.log(value)
                            floor_one = _.split(value.image_url, '?');
                            floor_one = floor_one[0];
                            console.log(floor_one)
                        }
                        if (value.id == 41085) {
                            floor_two = _.split(value.image_url, '?');
                            floor_two = floor_two[0];
                        }
                    });
                    this.floorOne = floor_one;
                    this.floorTwo = floor_two;
                },
                // getMiniMap () {
                //     var svg_maps = this.findRepoByName("PNG Mini Map").images 
                //     var floor_one = "";
                //     var floor_two = "";
                //     _.forEach(svg_maps, function(value, key) {
                //         if(value.id == 37990) {
                //             floor_one = _.split(value.image_url, '?');
                //             floor_one = floor_one[0];
                //         }
                //         if (value.id == 37991) {
                //             floor_two = _.split(value.image_url, '?');
                //             floor_two = floor_two[0];
                //         }
                //     });
                //     this.miniOne = floor_one;
                //     this.miniTwo = floor_two;
                // },
                floorList () {
                    var floor_list = [];
                    
                    var floor_1 = {};
                    floor_1.id = "first-floor";
                    floor_1.title = "Level One";
                    floor_1.map = this.floorOne;
                    // floor_1.minimap = this.miniOne;
                    floor_1.z_index = 1;
                    floor_1.show = true;
                    floor_list.push(floor_1);
                    
                    var floor_2 = {};
                    floor_2.id = "second-floor";
                    floor_2.title = "Level Two";
                    floor_2.map = this.floorTwo;
                    floor_2.minimap = this.miniTwo;
                    // floor_2.z_index = 2;
                    floor_2.show = false;
                    floor_list.push(floor_2);
                    
                    return floor_list;
                }
            },
            methods: {
                loadData: async function() {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "repos")]);
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                filterStores (letter) {
                    if(letter == "All" || letter == undefined || letter == null){
                        this.filteredStores = this.processedStores;
                    } else {
                        var filtered = _.filter(this.storesByAlphaIndex, function(o,i) { return _.lowerCase(i) == _.lowerCase(letter); })[0];
                        this.filteredStores = filtered
                    }
                },
                onOptionSelect(option) {
                    this.$nextTick(function() {
                        this.storeSearch = ""
                    });
                    this.svgMapRef.addMarker(option);
                },
                dropPin(store) {
                    console.log(store)
                    this.$refs.mapplic_ref.showLocation(store.svgmap_region);
                }
            }
        });
    });
</script>