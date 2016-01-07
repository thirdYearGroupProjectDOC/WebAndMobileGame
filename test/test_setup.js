module.exports = {

	'Testing signup set up an account if not exist, for local host': function (test){
        var t = 2000
		test
            .wait(t)
			.open('http://localhost:8080')
			.wait(t)
			.assert.title().is('Welcome','title is right')
			.assert.exists('#jump_to_home','exist home page')
			
			.type('#welcome_display', 'displayname')
    		.assert.val('#welcome_display', 'displayname', 'displayText has been set')
			.type('#welcome_usr', 'admin')
     		.type('#welcome_pss', 'passwd')
     		.type('#welcome_pssconf', 'passwd')
     		.click('#welcome_signup')
            .wait(t)
     		// since click on sign up on welcomepage should redirect to signup page
     		.assert.doesntExist('#signup_signup','fails register, redirect to sign up page ')
     		

			.done();
		test.screenshot('screenshots/final.png');
	}
};
