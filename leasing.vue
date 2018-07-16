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
                            <div class="margin_40">
                                <h3 class="inside_page_header">Permanent Leasing</h3>
                                <div class="margin_40 page_body" v-if="permLeasing" v-html="permLeasing.body"></div>
            					<form class="form-horizontal padding_top_20" action="form-submit" v-on:submit.prevent="validateBeforeSubmitPerm">
            						<div class="form-group ">
            							<div class="col-xs-12 margin_20" :class="{'has-error': errorsPerm.has('legalName')}">
            								<label for="legalName">Legal Name of Organization<span class="req_star"> *</span></label>
            								<input v-model="form_data.legalName" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="legalName" type="text" data-vv-delay="500" data-vv-as="Legal Name of Organization">
            								<span v-show="errorsPerm.has('legalName')" class="form-control-feedback">{{ errorsPerm.first('legalName') }}</span>
            							</div>
            						</div>
            						<div class="form-group">
            							<div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errorsPerm.has('firstName')}">
            							    <label for="firstName">Contact First Name<span class="req_star"> *</span></label>
            								<input v-model="form_data.firstName" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="firstName" type="text" data-vv-delay="500" data-vv-as="Contact First Name">
            								<span v-show="errorsPerm.has('firstName')" class="form-control-feedback">{{ errorsPerm.first('firstName') }}</span>
            							</div>
            							<div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errorsPerm.has('lastName')}">
            							    <label for="lastName">Contact Last Name<span class="req_star"> *</span></label>
            								<input v-model="form_data.lastName" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="lastName" type="text" data-vv-delay="500" data-vv-as="Contact Last Name">
            								<span v-show="errorsPerm.has('lastName')" class="form-control-feedback">{{ errorsPerm.first('legalName') }}</span>
            							</div>
            						</div>
            						<div class="form-group">
            						    <div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errorsPerm.has('phone')}">
        									<label for="phone">Contact Phone Number<span class="req_star"> *</span></label>
        									<input v-model="form_data.phone" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="phone" type="text" data-vv-delay="500" data-vv-as="Contact Phone Number">
        									<span v-show="errorsPerm.has('phone')" class="form-control-feedback">{{ errorsPerm.first('phone') }}</span>
        								</div>
            							<div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errorsPerm.has('email')}">
            								<label for="email">Contact Email Address<span class="req_star"> *</span></label>
            								<input v-model="form_data.email" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="email" type="email" data-vv-delay="500" data-vv-as="Contact Email Address">
            								<span v-show="errorsPerm.has('email')" class="form-control-feedback">{{ errorsPerm.first('email') }}</span>
            							</div>
            						</div>
        							<div class="form-group">
            						    <div class="col-xs-12 margin_20">
        									<label for="size">Square Footage Required</label>
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
            						    <div class="col-xs-12">
        									<label for="comments">Comments</label>
        									<textarea id="comments" class="form-control" v-model="form_data.comments"></textarea>
        								</div>
        							</div>
            						<div class="form-group">
            							<div class="col-xs-12">
            								<button class="fill_btn" type="submit" :disabled="formSuccessPerm">
            								    Submit <i class="fa fa-angle-right" aria-hidden="true"></i>
        								    </button>
            							</div>
            						</div>
            					</form>
            					<div id="send_contact_success" class="alert alert-success text-left" role="alert" v-show="formSuccessPerm">
            						<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            						<span class="sr-only">Success</span>
            						Thank you for contacting us. A member from our team will contact you shortly.
            					</div>
            					<div id="send_contact_error" class="alert alert-danger text-left" role="alert" v-show="formErrorPerm">
            						<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            						<span class="sr-only">Error:</span>
            						There was an error when trying to submit your request. Please try again later.
            					</div>
            				</div>
        				</div>
    				</div>
    			</div>
    			<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.0099599626933!2d-79.3415429844806!3d43.668762679120704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb7ece9e16db%3A0x7e63831ebf683b46!2sGerrard+Square+Shopping+Centre!5e0!3m2!1sen!2sca!4v1531755543275" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen></iframe>
				<div class="main_container mobile_padding margin_30">
                    <div class="row">
                        <div class="col-md-12">
            				<div>
            				    <h3 class="inside_page_header">Specialty Short Term Leasing</h3>
                                <div class="margin_40 page_body" v-if="tempLeasing" v-html="tempLeasing.body"></div>
                                <form class="form-horizontal padding_top_20" action="form-submit" v-on:submit.prevent="validateBeforeSubmitTemp">
            						<div class="form-group ">
            							<div class="col-xs-12 margin_20" :class="{'has-error': errorsTemp.has('legalNameTemp')}">
            								<label for="legalNameTemp">Legal Name of Organization<span class="req_star"> *</span></label>
            								<input v-model="form_data.legalNameTemp" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="legalNameTemp" type="text" data-vv-delay="500" data-vv-as="Legal Name of Organization">
            								<span v-show="errorsTemp.has('legalNameTemp')" class="form-control-feedback">{{ errorsTemp.first('legalNameTemp') }}</span>
            							</div>
            						</div>
            						<div class="form-group">
            							<div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errorsTemp.has('firstNameTemp')}">
            							    <label for="firstNameTemp">Contact First Name<span class="req_star"> *</span></label>
            								<input v-model="form_data.firstNameTemp" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="firstNameTemp" type="text" data-vv-delay="500" data-vv-as="Contact First Name">
            								<span v-show="errorsTemp.has('firstNameTemp')" class="form-control-feedback">{{ errorsTemp.first('firstNameTemp') }}</span>
            							</div>
            							<div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errorsTemp.has('lastNameTemp')}">
            							    <label for="lastNameTemp">Contact Last Name<span class="req_star"> *</span></label>
            								<input v-model="form_data.lastNameTemp" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="lastNameTemp" type="text" data-vv-delay="500" data-vv-as="Contact Last Name">
            								<span v-show="errorsTemp.has('lastNameTemp')" class="form-control-feedback">{{ errorsTemp.first('lastNameTemp') }}</span>
            							</div>
            						</div>
            						<div class="form-group">
            						    <div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errorsTemp.has('phoneTemp')}">
        									<label for="phoneTemp">Contact Phone Number<span class="req_star"> *</span></label>
        									<input v-model="form_data.phoneTemp" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="phoneTemp" type="text" data-vv-delay="500" data-vv-as="Contact Phone Number">
        									<span v-show="errorsTemp.has('phoneTemp')" class="form-control-feedback">{{ errorsTemp.first('phoneTemp') }}</span>
        								</div>
            							<div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errorsTemp.has('emailTemp')}">
            								<label for="emailTemp">Contact Email Address<span class="req_star"> *</span></label>
            								<input v-model="form_data.emailTemp" v-validate="'required|email'" class="form-control" :class="{'input': true}" name="emailTemp" type="email" data-vv-delay="500" data-vv-as="Contact Email Address">
            								<span v-show="errorsTemp.has('emailTemp')" class="form-control-feedback">{{ errorsTemp.first('emailTemp') }}</span>
            							</div>
            						</div>
            						<div class="form-group">
            						    <div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errorsTemp.has('dates')}">
        									<label for="dates">Requested Dates <span class="req_star"> *</span></label>
        									<input v-model="form_data.dates" v-validate="'required:true'" class="form-control" :class="{'input': true}" name="dates" type="text" data-vv-delay="500" data-vv-as="Requested Dates">
        									<span v-show="errorsTemp.has('dates')" class="form-control-feedback">{{ errorsTemp.first('dates') }}</span>
        								</div>
            							<div class="col-sm-6 col-xs-12 margin_20" :class="{'has-error': errorsTemp.has('location')}">
            								<label for="location">Requested Location<span class="req_star"> *</span></label>
            								<input v-model="form_data.location" v-validate="'required|location'" class="form-control" :class="{'input': true}" name="location" type="text" data-vv-delay="500" data-vv-as="Requested Location">
            								<span v-show="errorsTemp.has('location')" class="form-control-feedback">{{ errorsTemp.first('location') }}</span>
            							</div>
            						</div>
            						<div class="form-group">
            						    <div class="col-xs-12">
        									<label for="use_of_space">Proposed Use of Space</label>
        									<textarea id="use_of_space" class="form-control" v-model="form_data.use_of_space"></textarea>
        								</div>
        							</div>
            						<div class="form-group">
            							<div class="col-xs-12">
            								<button class="fill_btn" type="submit" :disabled="formSuccessTemp">
            								    Submit <i class="fa fa-angle-right" aria-hidden="true"></i>
        								    </button>
            							</div>
            						</div>
            					</form>
            					<div id="send_contact_success" class="alert alert-success text-left" role="alert" v-show="formSuccessTemp">
            						<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
            						<span class="sr-only">Success</span>
            						Thank you for contacting us. A member from our team will contact you shortly.
            					</div>
            					<div id="send_contact_error" class="alert alert-danger text-left" role="alert" v-show="formErrorTemp">
            						<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            						<span class="sr-only">Error:</span>
            						There was an error when trying to submit your request. Please try again later.
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
                    permLeasing: null,
                    tempLeasing: null,
                    form_data: {},
                    errorsPerm: {},
                    formSuccessPerm: false,
                    formErrorPerm: false,
                    errorsTemp: {},
                    formSuccessTemp: false,
                    formErrorTemp: false
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

                    this.permLeasing = response[0].data;
                    this.tempLeasing = response[1].data;
                    
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
                        let results = await Promise.all([this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/gerrardsquare-permanent-leasing.json"}), this.$store.dispatch('LOAD_PAGE_DATA', { url: this.property.mm_host + "/pages/gerrardsquare-temporary-leasing.json"})]);
                        return results;
                    } catch (e) {
                        console.log("Error loading data: " + e.message);
                    }
                },
                validateBeforeSubmitPerm() {
                    this.validNumError = false;
                    this.$validator.validateAll().then((result) => {
                        if (result) {
                            this.errors = this.errorsPerm
                            let errors = this.errors;
                            //format email
                            send_data = {};
                            send_data.url = "https://www.mallmaverick.com/send_contact_email";
                            var perm_formdata = {}; //JSON.stringify(this.serializeObject(this.form_data));
                            perm_formdata.send_to = "caitlin@mobilefringe.com";
                            perm_formdata.subject = "Gerrard Square Permanent Leasing Form"; 
                            perm_formdata.body = {};
                            perm_formdata.body["Legal Name of Organization"] =  this.form_data.legalName;
                             
                            perm_formdata.body["Contact First Name"] =   this.form_data.firstName, 
                            perm_formdata.body["Contact Last Name"] = this.form_data.lastName,
                            perm_formdata.body["Contact Phone Number"] = this.form_data.phone, 
                            perm_formdata.body["Contact Email Address" ] =  this.form_data.email, 
                            perm_formdata.body["Square Footage Required"] =  this.form_data.size, 
                            perm_formdata.body["Comments"] =  this.form_data.comments,
                            
                            send_data.form_data = Utility.serializeObject(perm_formdata);
                            console.log("Data ", send_data.form_data)
                            var vm = this;
                            $.ajax({
                                url : send_data.url,
                                type: "POST",
                                data : perm_formdata,
                                success: function(data, textStatus, jqXHR){
                                    vm.formSuccessPerm = true;
                                },
                                error: function (jqXHR, textStatus, errorThrown){
                                  console.log("Data load error: " + error.message);
                                  vm.formErrorPerm = true;
                                }
                            });
                        }
                    })
                },
                validateBeforeSubmitTemp() {
                    this.validNumError = false;
                    this.$validator.validateAll().then((result) => {
                        if (result) {
                            this.errors = this.errorsTemp
                            let errors = this.errors;
                            //format email
                            send_data = {};
                            send_data.url = "https://www.mallmaverick.com/send_contact_email";
                            var temp_formdata = {}; //JSON.stringify(this.serializeObject(this.form_data));
                            temp_formdata.send_to = "caitlin@mobilefringe.com";
                            temp_formdata.subject = "Gerrard Square Permanent Leasing Form"; 
                            temp_formdata.body = {};
                            temp_formdata.body["Legal Name of Organization"] =  this.form_data.legalName;
                             
                            temp_formdata.body["Contact First Name"] =   this.form_data.firstName, 
                            temp_formdata.body["Contact Last Name"] = this.form_data.lastName,
                            temp_formdata.body["Contact Phone Number"] = this.form_data.phone, 
                            temp_formdata.body["Contact Email Address" ] =  this.form_data.email, 
                            temp_formdata.body["Square Footage Required"] =  this.form_data.size, 
                            temp_formdata.body["Comments"] =  this.form_data.comments,
                            
                            send_data.form_data = Utility.serializeObject(temp_formdata);
                            console.log("Data ", send_data.form_data)
                            // var vm = this;
                            // $.ajax({
                            //     url : send_data.url,
                            //     type: "POST",
                            //     data : temp_formdata,
                            //     success: function(data, textStatus, jqXHR){
                            //         vm.formSuccessTemp = true;
                            //     },
                            //     error: function (jqXHR, textStatus, errorThrown){
                            //       console.log("Data load error: " + error.message);
                            //       vm.formErrorTemp = true;
                            //     }
                            // });
                        }
                    })
                }
            }
        });
    });
</script>