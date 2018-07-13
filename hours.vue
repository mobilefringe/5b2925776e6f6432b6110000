<template>
    <div> <!-- without an outer container div this component template will not render -->
        <loading-spinner v-if="!dataLoaded"></loading-spinner>
        <transition name="fade">
            <div v-if="dataLoaded" v-cloak>
                <div class="inside_header_background" :style="{ backgroundImage: 'url(' + inside_banner.image_url + ')' }">
                    <div class="main_container">
                        <h2>Hours</h2>
                    </div>
                </div>
                <div class="main_container mobile_padding margin_30">
                    <div class="col-md-6">
                        <h3 class="hours_heading caps">Hours</h3>
                        <div class="hours_container">
                            <div class="row hours_div" v-for="hour in hours">
                                <div class="col-md-6">
                                    {{hour.day_of_week | moment("dddd", timezone)}}
                                </div>
                                <div class="col-md-6">
                                    <span class="">
                                        {{hour.open_time | moment("h:mm A", timezone)}} - {{hour.close_time | moment("h:mm A", timezone)}}    
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="padding_top_20"></div>
                        <h3 class="hours_heading caps">We will be open the following Holidays</h3>
                        <div class="hours_container">
                            <div class="row hours_div"  v-for="hour in reducedHolidays">
                                <div class="col-md-6">
                                    {{ hour.holiday_name }},<br class="hidden-lg hidden-md hidden-sm-block visible-xs-block"/> {{ hour.holiday_date | moment("MMM D", timezone) }}
                                </div>
                                <div class="col-md-6">
                                    <span class="">
                                        {{ hour.open_time | moment("h:mm A", timezone) }} - {{ hour.close_time | moment("h:mm A", timezone) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="padding_top_20"></div>
                        <h3 class="hours_heading caps">We will be closed the following Statutory Holidays</h3>
                        <div class="hours_container">
                            <div class="row hours_div" v-for="hour in closeHolidays">
                                <div class="col-xs-6 col-sm-4 col-md-3">
                                    {{ hour.holiday_name }},<br class="hidden-lg hidden-md hidden-sm-block visible-xs-block"/> {{ hour.holiday_date | moment("MMM D", timezone) }}   
                                </div>
                                <div class="col-xs-6 col-md-3">
                                    <span class="">
                                        Closed
                                    </span>
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
    define(["Vue", "vuex", "moment", "moment-timezone", "vue-moment", "vue-meta"], function (Vue, Vuex, moment, tz, VueMoment, Meta) {
        Vue.use(Meta);
        return Vue.component("hours-component", {
            template: template, // the variable template will be injected
            props:['inside_banner'],
            data: function data() {
                return {
                    dataLoaded: false
                }
            },
            created() {
                this.loadData().then(response => {
                    this.dataLoaded = true;
                });
            },
            computed: {
                ...Vuex.mapGetters([
                    'property',
                    'timezone',
                    'getPropertyHours',
                    'getPropertyHolidayHours'
                ]),
                hours () {
                    return this.getPropertyHours;
                },
                holidayHours () {
                    return this.getPropertyHolidayHours;
                },
                reducedHolidays () {
                    var holidayHours = this.holidayHours;
                    return _.filter(holidayHours, function(o) { return !o.is_closed; });
                },
                closeHolidays () {
                    var holidayHours = this.holidayHours;
                    return _.sortBy(_.filter(holidayHours, function(o) { return o.is_closed; }), [function(o) { return o.holiday_date; }]);
                }
            },
            methods: {
                loadData: async function () {
                    try {
                        let results = await Promise.all([this.$store.dispatch("getData", "categories")]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                }
            }
        });
    });
</script>