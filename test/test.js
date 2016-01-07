module.exports = {

	'Test for local host': function (test){
  		var t = 2000;

		test
			.wait(t)
			.open('http://localhost:8080')
			.assert.title().is('Welcome','title is right')
			.wait(t)
			.assert.exists('#jump_to_home','exist home page')
			.screenshot('screenshots/test/welcome page.png')

     		//check home page have expected buttons
			.click('#jump_to_home')
			.wait(t)
			.assert.exists('#play','exist play page')
			.assert.exists('#signin','exist signin button')
			.assert.exists('#signup','exist signup button')
			.assert.doesntExist('#createLevel','not login shoudnt be able to create level')			
			.screenshot('screenshots/test/homepage.png')

			//check when select levels tehre are no unexpected buttons when not logged in
			.click('#play')
			.wait(t)
			.assert.doesntExist('#createLevel','not login shoudnt be able to create level')
			.assert.doesntExist('logout','cant logout when not logged in')
			.screenshot('screenshots/test/levels not logged in.png')

			// sing up
			.click('#signin')
			.wait(t)
			.type('#login_usr', 'admin')
    		.type('#login_pss', 'passwd')
    		.click('#login_submit')
			.wait(t)
    		.assert.title().is('Select Levels','title is select levels')
    		.assert.exists('#createLevel',' createLevel should exist by now')
    		.screenshot('screenshots/test/levels when logged in.png')

    		.click('#createLevel')
			.wait(t)
			.assert.exists('#saveButton','exists savebutton')
			.assert.exists('#verifyButton','exists verifyButton')
			.click('#verifyButton')
			.accept()
    		.click('#saveButton')
    		.wait(t)
    		.accept()

    		.execute(function() {
    			
    		})


    		.wait(t)
    		.screenshot('screenshots/test/final.png')
			.done();
			}
};
