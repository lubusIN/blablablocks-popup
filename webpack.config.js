const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

const scriptConfig = Array.isArray( defaultConfig ) ? defaultConfig[ 0 ] : defaultConfig;

const customScriptConfig = {
	...scriptConfig,
	entry: {
		admin: path.resolve( process.cwd(), 'src/admin.js' ),
		editor: path.resolve( process.cwd(), 'src/editor.js' ),
		frontend: path.resolve( process.cwd(), 'src/frontend.js' ),
	},
};

module.exports = Array.isArray( defaultConfig )
	? [ customScriptConfig, defaultConfig[ 1 ] ]
	: customScriptConfig;
