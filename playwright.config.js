const { defineConfig, devices } = require( '@playwright/test' );

const port = process.env.PLAYGROUND_PORT || 9401;
const wordpressVersion = process.env.WP_VERSION || '6.9';
const baseURL = `http://127.0.0.1:${ port }`;

module.exports = defineConfig( {
	testDir: './tests/e2e',
	fullyParallel: false,
	workers: 1,
	timeout: 60_000,
	expect: {
		timeout: 10_000,
	},
	use: {
		baseURL,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},
	webServer: {
		command: `wp-playground-cli server --auto-mount --login --wp=${ wordpressVersion } --php=8.3 --port=${ port } --workers=1 --verbosity=quiet`,
		url: `${ baseURL }/wp-admin/load-styles.php?c=0&dir=ltr&load=dashicons`,
		reuseExistingServer: false,
		timeout: 180_000,
	},
	projects: [
		{
			name: `chromium-wp-${ wordpressVersion }`,
			use: { ...devices[ 'Desktop Chrome' ] },
		},
	],
} );
