var Login = function() {
    var runLoginButtons = function() {
        $('.forgot').bind('click', function() {
            $('.box-login').hide();
            $('.box-forgot').show();
        });
        $('.register').bind('click', function() {
            $('.box-login').hide();
            $('.box-register').show();
        });
        $('.go-back').click(function() {
            $('.box-login').show();
            $('.box-forgot').hide();
            $('.box-register').hide();
        });
    };
    var runSetDefaultValidation = function() {
        $.validator.setDefaults({
            errorElement: "span", // contain the error msg in a small tag
            errorClass: 'help-block',
            errorPlacement: function(error, element) { // render error placement for each input type
                if (element.attr("type") == "radio" || element.attr("type") == "checkbox") { // for chosen elements, need to insert the error after the chosen container
                    error.insertAfter($(element).closest('.form-group').children('div').children().last());
                } else if (element.attr("name") == "card_expiry_mm" || element.attr("name") == "card_expiry_yyyy") {
                    error.appendTo($(element).closest('.form-group').children('div'));
                } else {
                    error.insertAfter(element);
                    // for other inputs, just perform default behavior
                }
            },
            ignore: ':hidden',
            highlight: function(element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.form-group').removeClass('has-success').addClass('has-error').find('.symbol').removeClass('ok').addClass('required');
                // add the Bootstrap error class to the control group
            },
            unhighlight: function(element) { // revert the change done by hightlight
                $(element).closest('.form-group').removeClass('has-error');
                // set error class to the control group
            },
            success: function(label, element) {
                label.addClass('help-block valid');
                // mark the current input as valid and display OK icon
                $(element).closest('.form-group').removeClass('has-error');
            },
            highlight: function(element) {
                $(element).closest('.help-block').removeClass('valid');
                // display OK icon
                $(element).closest('.form-group').addClass('has-error');
                // add the Bootstrap error class to the control group
            },
                    unhighlight: function(element) { // revert the change done by hightlight
                        $(element).closest('.form-group').removeClass('has-error');
                        // set error class to the control group
                    }
        });
    };
    var runLoginValidator = function() {
        var form = $('.form-login');
        var errorHandler = $('.errorHandler', form);
        form.validate({
            rules: {
                username: {
                    removeEL :"username",
                    required: true
                },
                password: {
                    removeEL :"password",
                    minlength: 6,
                    required: true

                }
            },
            submitHandler: function(form) {
                errorHandler.hide();
                form.submit();
            },
            invalidHandler: function(event, validator) { //display error alert on form submit
                errorHandler.show();
            }
        });
    };
    var runForgotValidator = function() {
        var form2 = $('.form-forgot');
        var errorHandler2 = $('.errorHandler', form2);
        form2.validate({
            rules: {
                email: {
                    required: true
                }
            },
            submitHandler: function(form) {
                errorHandler2.hide();
                form2.submit();
            },
            invalidHandler: function(event, validator) { //display error alert on form submit
                errorHandler2.show();
            }
        });
    };
    var runRegisterValidator = function() {
        var form3 = $('.form-register');
        var errorHandler3 = $('.errorHandler', form3);
        form3.validate({
            rules: {
                name: {
                    required: true
                },
                address: {
                    required: true
                },
                city: {
                    required: true
                },
                gender: {
                    required: true
                },
                email: {
                    required: true
                },
                password: {
                    minlength: 6,
                    required: true
                },
                password_again: {
                    required: true,
                    minlength: 6,
                    equalTo: "#user-password"
                },
                agree: {
                    minlength: 1,
                    required: true
                }
            },
            submitHandler: function(form) {
                errorHandler3.hide();
                form3.submit();
            },
            invalidHandler: function(event, validator) { //display error alert on form submit
                errorHandler3.show();
            }
        });
    };
    
    var runUploadValidator = function() {
    var uploadForm = $('.form-register');
    var uploadErrorHandler = $('.errorHandler', uploadForm);
    uploadForm.validate({
        rules: {
            title: {
                required: true
            },
            author: {
                required: true
            },
            tags: {
                required: true
            },
            coverImg: {
                required: true
            }
        },
        submitHandler: function(form) {
            uploadErrorHandler.hide();
            uploadForm.submit();
        },
        invalidHandler: function(event, validator) { //display error alert on form submit
            uploadErrorHandler.show();
        }
    });
    };

    return {
        //main function to initiate template pages
        init: function() {
            runLoginButtons();
            runSetDefaultValidation();
            runLoginValidator();
            runForgotValidator();
            runRegisterValidator();
            runUploadValidator();
        }
    };
}();