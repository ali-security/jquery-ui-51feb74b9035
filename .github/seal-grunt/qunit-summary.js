// Prints QUnit test-case counts per page and in total; grunt-contrib-qunit
// 1.0.1 only prints an assertion total. Loaded on Travis with
// `grunt --tasks .github/seal-grunt ... seal-qunit-summary`; lives under
// .github so it never enters the packed tarball.
module.exports = function( grunt ) {
	var current = null,
		pages = [],
		totals = { tests: 0, passed: 0, failed: 0 };

	grunt.event.on( "qunit.spawn", function( url ) {
		current = { url: url, tests: 0, failed: 0 };
		pages.push( current );
	} );

	grunt.event.on( "qunit.testDone", function( name, failed ) {
		current.tests++;
		totals.tests++;
		if ( failed > 0 ) {
			current.failed++;
			totals.failed++;
		} else {
			totals.passed++;
		}
	} );

	grunt.registerTask( "seal-qunit-summary", "Print QUnit test counts", function() {
		pages.forEach( function( page ) {
			grunt.log.writeln( page.url + ": " + page.tests + " tests, " +
				( page.tests - page.failed ) + " passed, " + page.failed + " failed" );
		} );
		grunt.log.writeln( "QUnit summary: " + totals.tests + " tests, " + totals.passed +
			" passed, " + totals.failed + " failed across " + pages.length + " pages" );
		if ( totals.failed > 0 || totals.tests === 0 ) {
			grunt.fail.warn( "QUnit summary reports failures or no tests" );
		}
	} );
};
