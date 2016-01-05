module.exports = {

	'Test for local host': function (test){
		test
			.open('http://localhost:8080')
			.assert.title().is('Welcome','title is right')
			.assert.exists('#jump_to_home','exist home page')
			.click('#jump_to_home')
			.assert.exists('#play','exist play page')
			.click('#play')
			.done();
		test.screenshot('screenshots/final.png');
	}
};
