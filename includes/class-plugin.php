<?php
/**
 * Main plugin loader.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once BLABLABLOCKS_POPUP_DIR . 'includes/class-settings.php';
require_once BLABLABLOCKS_POPUP_DIR . 'includes/class-post-type.php';
require_once BLABLABLOCKS_POPUP_DIR . 'includes/class-rest-controller.php';
require_once BLABLABLOCKS_POPUP_DIR . 'includes/class-admin.php';
require_once BLABLABLOCKS_POPUP_DIR . 'includes/class-frontend.php';

/**
 * BlaBlaBlocks Popup plugin.
 */
final class Plugin {
	const POST_TYPE = 'popup_block';
	const META_KEY  = '_popup_block_settings';
	const REST_NS   = 'blablablocks-popup/v1';
	const MENU_SLUG = 'blablablocks-popup';

	/**
	 * Admin menu icon matching the editor navigationOverlay icon.
	 *
	 * @return string
	 */
	public static function menu_icon() {
		$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="black" d="M18.5 10a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5v-7a1.5 1.5 0 0 1 1.5-1.5zM16 4a2 2 0 0 1 2 2v2h-1.5V6a.5.5 0 0 0-.5-.5H6a.5.5 0 0 0-.5.5v3H8v1.5H5.5V16a.5.5 0 0 0 .5.5h2V18H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>';

		return 'data:image/svg+xml;base64,' . base64_encode( $svg );
	}

	/**
	 * Boot plugin hooks.
	 */
	public static function init() {
		add_action( 'init', array( Post_Type::class, 'register' ) );
		add_action( 'init', array( Post_Type::class, 'register_meta' ) );
		add_action( 'rest_api_init', array( Rest_Controller::class, 'register_routes' ) );
		add_action( 'wp_footer', array( Frontend::class, 'render_popups' ), 1 );

		if ( is_admin() ) {
			add_action( 'admin_menu', array( Admin::class, 'register_page' ) );
			add_action( 'admin_init', array( Admin::class, 'redirect_classic_list_table' ) );
			add_action( 'admin_enqueue_scripts', array( Admin::class, 'enqueue_assets' ) );
			add_action( 'enqueue_block_editor_assets', array( Admin::class, 'enqueue_editor_assets' ) );
			add_filter( 'block_editor_settings_all', array( Admin::class, 'add_editor_canvas_styles' ), 10, 2 );
		}
	}

	/**
	 * Activation callback.
	 */
	public static function activate() {
		Post_Type::register();
		flush_rewrite_rules();
	}

	/**
	 * Deactivation callback.
	 */
	public static function deactivate() {
		flush_rewrite_rules();
	}
}
