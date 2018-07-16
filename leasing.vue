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
                    <div class="details_row">
                        <div class="details_col_3 hidden_phone">
                            <img class="img_max" src="//codecloud.cdn.speedyrails.net/sites/5b2925776e6f6432b6110000/image/jpeg/1531500156000/sidebanner4.jpg" alt="" />    
                        </div>
                        <div class="details_col_9">
                            <h3>Permanent Leasing</h3>
                            <hr>
                            <div v-html=""></div>
                            <div class="page_body" v-if="permLeasing" v-html="permLeasing.body"></div>
        					<form class="form-horizontal padding_top_20" action="form-submit" v-on:submit.prevent="validateBeforeSubmit">
        						<div class="form-group ">
        							<div class="col-xs-12 margin_20" :class="{'has-error': errors.has('legalName')}">
        								<label for="legalName">Legal Name of Organization<span class="req_star"> *</span></label>
        								<input v-model="form_data.legalName" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="legalName" type="text" data-vv-delay="500" data-vv-as="Legal Name of Organization">
        								<span v-show="errors.has('legalName')" class="form-control-feedback">{{ errors.first('legalName') }}</span>
        							</div>
        						</div>
        						<div class="form-group">
        							<div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errors.has('firstName')}">
        							    <label for="firstName">Contact First Name<span class="req_star"> *</span></label>
        								<input v-model="form_data.firstName" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="firstName" type="text" data-vv-delay="500" data-vv-as="Contact First Name">
        								<span v-show="errors.has('firstName')" class="form-control-feedback">{{ errors.first('firstName') }}</span>
        							</div>
        							<div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errors.has('lastName')}">
        							    <label for="lastName">Contact Last Name<span class="req_star"> *</span></label>
        								<input v-model="form_data.lastName" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="lastName" type="text" data-vv-delay="500" data-vv-as="Contact Last Name">
        								<span v-show="errors.has('lastName')" class="form-control-feedback">{{ errors.first('legalName') }}</span>
        							</div>
        						</div>
        						<div class="form-group">
        						    <div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errors.has('phone')}">
    									<label for="phone">Contact Phone Number<span class="req_star"> *</span></label>
    									<input v-model="form_data.phone" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="phone" type="text" data-vv-delay="500" data-vv-as="Contact Phone Number">
    									<span v-show="errors.has('phone')" class="form-control-feedback">{{ errors.first('phone') }}</span>
    								</div>
        							<div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errors.has('email')}">
        								<label for="email">Contact Email Address<span class="req_star"> *</span></label>
        								<input v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" data-vv-delay="500" data-vv-as="Contact Email Address">
        								<span v-show="errors.has('email')" class="form-control-feedback">{{ errors.first('email') }}</span>
        							</div>
        						</div>
    							<div class="form-group">
        						    <div class="col-xs-12 margin_20" :class="{'has-error': errors.has('size')}">
    									<label for="size">Square Footage Required</label>
    									<!--<input v-model="form_data.size" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="size" type="text" data-vv-delay="500" data-vv-as="Square Footage Required">-->
    									<!--<span v-show="errors.has('size')" class="form-control-feedback">{{ errors.first('size') }}</span>-->
    									<select id="size" v-model="form_data.size" class="form-control">
                                            <option value="">Select square footage</option>
                                            <option value="Less than 500 sq.ft.">Less than 500 sq.ft.</option>
                                            <option value="500 - 1000 sq. ft.">500 - 1000 sq. ft.</option>
                                            <option value="1000 - 2500 sq. ft.">1000 - 2500 sq. ft. </option>
                                            <option value="More than 2500 sq. ft.">More than 2500 sq. ft.</option>
                                        </select>
    								</div>
        						</div>
        						<div class="form-group">
        						    <div class="col-xs-12" :class="{'has-error': errors.has('size')}">
    									<label for="comments">Comments</label>
    									<textarea class="form-control"></textarea>
    								</div>
    							</div>
        						<div class="form-group">
        							<div class="col-xs-12">
        								<button class="fill_btn" type="submit" :disabled="formSuccess">
        								    Submit <i class="fa fa-angle-right" aria-hidden="true"></i>
    								    </button>
        							</div>
        						</div>
        					</form>
        					<div id="send_contact_success" class="alert alert-success text-left" role="alert" v-show="formSuccess">
        						<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
        						<span class="sr-only">Success</span>
        						Thank you for contacting us. A member from our team will contact you shortly.
        					</div>
        					<div id="send_contact_error" class="alert alert-danger text-left" role="alert" v-show="formError">
        						<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        						<span class="sr-only">Error:</span>
        						There was an error when trying to submit your request. Please try again later.
        					</div>
        				</div>
    				</div>
    			</div>           
            </div>
        </transition>
    </div>
</template>
<script>
    define(["Vue", "vuex", "vue-meta", "moment", "moment-timezone", "vue-moment", "jquery", "vee-validate", "utility"], function(Vue, Vuex, Meta, moment, tz, VueMoment, $, VeeValidate, Utility) {
        Vue.use(Meta);
        Vue.use(VeeValidate);
        return Vue.component("leasing-component", {
            template: template, // the variable template will be injected
            data: function() {
                return {
                    dataLoaded: false,
                    pageBanner: null,
                    permLeasing: null,
                    tempLeasing: null,
                    form_data: {},
                    formSuccess: false,
                    formError: false,
                    validaNum: '',
                    correctValNum: null,
                    validNumError: false,
                    currentPage: null
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
                    
                    this.dataLoaded = true;
                });
            },
            mounted() {
                //creating random validation num 
                // this.correctValNum = Utility.rannumber();//this.rannumber;
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
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/gerrardsquare-permanent-leasing.json"}), this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/gerrardsquare-temporary-leasing.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                validateBeforeSubmit() {
                    this.validNumError = false;
                    this.$validator.validateAll().then((result) => {
                        if (result && (this.correctValNum === this.validaNum)) {
                            let errors = this.errors;
                            //format email
                            send_data = {};
                            send_data.url = "https://www.mallmaverick.com/send_contact_email";
                            var formatted_formdata = {}; //JSON.stringify(this.serializeObject(this.form_data));
                            formatted_formdata.send_to = "caitlin@mobilefringe.com";
                            formatted_formdata.subject = "Milton Mall Community Rental Form Application"; 
                            formatted_formdata.body = {};
                            formatted_formdata.body["Legal Name of Organization"] =  this.form_data.legalName;
                            formatted_formdata.body["Operating Name of Organization(if different)"] =  this.form_data.operatingName, 
                            formatted_formdata.body["Description of Organization"] =   this.form_data.description, 
                            formatted_formdata.body["Street Address"] = this.form_data.street,
                            formatted_formdata.body["Town/City"] = this.form_data.city, 
                            formatted_formdata.body["Postal Code" ] =  this.form_data.postal, 
                            formatted_formdata.body["Email Address"] = this.form_data.email, 
                            formatted_formdata.body["Telephone Number"] =  this.form_data.phone, 
                            formatted_formdata.body["Fax Number"] =  this.form_data.fax,
                            formatted_formdata.body["Authorized Contact Person"] = this.form_data.contactName,
                            formatted_formdata.body["Name of Insurer"] =  this.form_data.insurer,
                            formatted_formdata.body["Charitable # (BN/Registration Number)"] =  this.form_data.cnpNum,
                            formatted_formdata.body["Lottery License # (If applicable)"] =   this.form_data.lLicense,
                            formatted_formdata.body["From Date(mm/dd/yyyy)"] =  this.form_data.fromDate,
                            formatted_formdata.body["To Date(mm/dd/yyyy)"] =  this.form_data.toDate,
                            formatted_formdata.body["Purpose for use of in-mall space"] =  this.form_data.purpose,
                            formatted_formdata.body["Please specify any other requirements"] =  this.form_data.requirement,
                            formatted_formdata.body[ "Anticipated Attendance"] =  this.form_data.aAttendance;
                            send_data.form_data = Utility.serializeObject(formatted_formdata);
                            var vm = this;
                            $.ajax({
                                url : send_data.url,
                                type: "POST",
                                data : formatted_formdata,
                                success: function(data, textStatus, jqXHR){
                                    vm.formSuccess = true;
                                },
                                error: function (jqXHR, textStatus, errorThrown){
                                   console.log("Data load error: " + error.message);
                                   vm.formError = true;
                                }
                            });
                        }
                    })
                }
            }
        });
    });
</script>