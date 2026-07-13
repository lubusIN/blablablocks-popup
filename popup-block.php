<?php

/**
 * Plugin Name: 		BlaBlaBlocks Popup
 * Description: 		Create block-editor powered popups with a modern DataViews admin experience.
 * Version: 			0.1.0
 * Requires at least:	6.9
 * Requires PHP: 		7.4
 * Author: 				Lubus
 * Author URI:			https://lubus.in
 * License:				MIT
 * License URI:			https://www.gnu.org/licenses/MIT
 * Text Domain: 		blablablocks-popup
 *
 * @package BlaBlaBlocksPopup
 */

if (! defined('ABSPATH')) {
	exit;
}

define('BLABLABLOCKS_POPUP_VERSION', '0.1.0');
define('BLABLABLOCKS_POPUP_FILE', __FILE__);
define('BLABLABLOCKS_POPUP_DIR', plugin_dir_path(__FILE__));
define('BLABLABLOCKS_POPUP_URL', plugin_dir_url(__FILE__));

require_once BLABLABLOCKS_POPUP_DIR . 'includes/class-plugin.php';

register_activation_hook(__FILE__, array('BlaBlaBlocks_Popup\\Plugin', 'activate'));
register_deactivation_hook(__FILE__, array('BlaBlaBlocks_Popup\\Plugin', 'deactivate'));

add_action('plugins_loaded', array('BlaBlaBlocks_Popup\\Plugin', 'init'));
