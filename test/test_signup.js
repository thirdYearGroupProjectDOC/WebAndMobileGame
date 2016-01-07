module.exports = {

	'Testing signup error checking, for local host': function (test){
        var t = 2000
		test
            .wait(t)
			.open('http://localhost:8080')
			.wait(t)
			.assert.title().is('Welcome','title is right')
			.assert.exists('#jump_to_home','exist home page')
			.screenshot('screenshots/signup/welcome page.png')

			//test unmatched password when sign up
			.type('#welcome_display', 'displayname')
    		.assert.val('#welcome_display', 'displayname', 'displayText has been set')
			.type('#welcome_usr', 'user')
     		.type('#welcome_pss', 'passwd')
     		.type('#welcome_pssconf', 'passwddiff')
     		.screenshot('screenshots/signup/check input text set.png')
     		.click('#welcome_signup')
            .wait(t)
     		// since click on sign up on welcomepage should redirect to signup page
     		.screenshot('screenshots/signup/welcome unmatched password.png')
			.assert.exists('#signup_signup','fails register, redirect to sign up page ')
     		
     		//existing username

     		.type('#displayName', 'displayname')
    		.assert.val('#displayName', 'displayname', 'displayText has been set')
			.type('#signup_usr', 'admin')
     		.type('#signup_pss', 'admin')
     		.type('#signup_pssconf', 'admin')
     		.click('#signup_signup')
			.wait(t)
     		.assert.exists('#signup_signup','fails register, redirect to sign up again')
     		.screenshot('screenshots/signup/register with existing username.png')


     		//short password, for now only workes under chrome
     		/*.type('#displayName', 'displayname')
    		.assert.val('#displayName', 'displayname', 'displayText has been set')
			.type('#signup_usr', 'afs')
     		.type('#signup_pss', 'ps')
     		.type('#signup_pssconf', 'ps')
     		.click('#signup_signup')
            .wait(t)
     		.screenshot('screenshots/signup/register with short password.png')
     		.assert.doesntExist('#createLevel','fails register, cant see createLevel')
            .assert.doesntExist('#logout','fails register, cant see logout')    */
           
			.done();
		test.screenshot('screenshots/final.png');
	}
};
