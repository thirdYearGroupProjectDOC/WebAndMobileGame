module.exports = {

	'Test for local host': function (test){
		test
			.open('http://localhost:8080')
			.assert.title().is('Welcome','title is right')
			.assert.exists('#jump_to_home','exist home page')
			.screenshot('screenshots/welcome page.png')

     		//check home page have expected buttons
			.click('#jump_to_home')
			.assert.exists('#play','exist play page')
			.assert.exists('#signin','exist signin button')
			.assert.exists('#signup','exist signup button')
			.assert.doesntExist('#createLevel','not login shoudnt be able to create level')			
			.screenshot('screenshots/homepage.png')

			//check when select levels tehre are no unexpected buttons when not logged in
			.click('#play')
			.assert.doesntExist('#createLevel','not login shoudnt be able to create level')
			.assert.doesntExist('logout','cant logout when not logged in')
			.screenshot('screenshots/levels_not logged in.png')

			// assume admin is an existing account
			.click('#signin')
			.type('#login_usr', 'admin')
    		.type('#login_pss', 'passwd')
    		.click('#login_submit')
    		.assert.title().is('Select Levels','title is select levels')
    		.assert.exists('#createLevel')

			.done();
		test.screenshot('screenshots/final.png');
	}
};
