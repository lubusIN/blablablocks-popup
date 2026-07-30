<?php
/**
 * Plugin asset registration and enqueueing.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Loads generated asset metadata and enqueues plugin entry points.
 */
final class Assets {
	/**
	 * Enqueue the DataViews admin application.
	 *
	 * @param array $script_data Admin bootstrap data.
	 */
	public static function enqueue_admin( array $script_data ) {
		$asset = self::get_asset(
			'admin',
			array( 'wp-api-fetch', 'wp-components', 'wp-element', 'wp-i18n' )
		);

		wp_enqueue_style( 'wp-components' );
		wp_enqueue_script(
			'blablablocks-popup-admin',
			self::url( 'admin.js' ),
			$asset['dependencies'],
			$asset['version'],
			true
		);
		wp_enqueue_style(
			'blablablocks-popup-admin',
			self::url( 'admin.css' ),
			array( 'wp-components' ),
			$asset['version']
		);
		wp_add_inline_script(
			'blablablocks-popup-admin',
			'window.BlaBlaBlocksPopupAdmin = ' . wp_json_encode( $script_data ),
			'before'
		);
	}

	/**
	 * Enqueue popup block editor assets.
	 *
	 * @param array  $script_data Editor bootstrap data.
	 * @param string $canvas_css  Dynamic editor canvas CSS.
	 */
	public static function enqueue_editor( array $script_data, $canvas_css ) {
		$asset        = self::get_asset(
			'editor',
			array( 'wp-api-fetch', 'wp-components', 'wp-element', 'wp-i18n' )
		);
		$dependencies = array_values(
			array_unique(
				array_merge(
					$asset['dependencies'],
					array( 'wp-block-editor', 'wp-edit-post', 'wp-editor', 'wp-plugins' )
				)
			)
		);

		wp_enqueue_script(
			'blablablocks-popup-editor',
			self::url( 'editor.js' ),
			$dependencies,
			$asset['version'],
			true
		);

		if ( self::exists( 'editor.css' ) ) {
			wp_enqueue_style(
				'blablablocks-popup-editor',
				self::url( 'editor.css' ),
				array( 'wp-components' ),
				$asset['version']
			);
			wp_add_inline_style( 'blablablocks-popup-editor', $canvas_css );
		}

		wp_add_inline_script(
			'blablablocks-popup-editor',
			'window.BlaBlaBlocksPopupEditor = ' . wp_json_encode( $script_data ),
			'before'
		);
	}

	/**
	 * Enqueue frontend styles, the viewport bridge, and Interactivity module.
	 */
	public static function enqueue_frontend() {
		$asset        = self::get_asset( 'frontend' );
		$module_asset = self::get_asset(
			'frontend/module',
			array( '@wordpress/interactivity' )
		);

		wp_enqueue_style(
			'blablablocks-popup-frontend',
			self::url( 'frontend.css' ),
			array(),
			$asset['version']
		);
		wp_enqueue_script(
			'blablablocks-popup-viewport',
			self::url( 'frontend.js' ),
			$asset['dependencies'],
			$asset['version'],
			true
		);
		wp_enqueue_script_module(
			'@blablablocks/popup-frontend',
			self::url( 'frontend/module.js' ),
			$module_asset['dependencies'],
			$module_asset['version']
		);
	}

	/**
	 * Read generated dependency and version metadata for an entry point.
	 *
	 * @param string $entry                 Entry path relative to the build directory.
	 * @param array  $fallback_dependencies Dependencies used when metadata is unavailable.
	 * @return array
	 */
	private static function get_asset( $entry, array $fallback_dependencies = array() ) {
		$asset_file = self::path( $entry . '.asset.php' );

		if ( file_exists( $asset_file ) ) {
			$asset = require $asset_file;

			if ( is_array( $asset ) ) {
				return wp_parse_args(
					$asset,
					array(
						'dependencies' => $fallback_dependencies,
						'version'      => BLABLABLOCKS_POPUP_VERSION,
					)
				);
			}
		}

		return array(
			'dependencies' => $fallback_dependencies,
			'version'      => BLABLABLOCKS_POPUP_VERSION,
		);
	}

	/**
	 * Check whether a generated asset exists.
	 *
	 * @param string $file File path relative to the build directory.
	 * @return bool
	 */
	private static function exists( $file ) {
		return file_exists( self::path( $file ) );
	}

	/**
	 * Build an absolute filesystem path for a generated asset.
	 *
	 * @param string $file File path relative to the build directory.
	 * @return string
	 */
	private static function path( $file ) {
		return BLABLABLOCKS_POPUP_DIR . 'build/' . ltrim( $file, '/' );
	}

	/**
	 * Build a public URL for a generated asset.
	 *
	 * @param string $file File path relative to the build directory.
	 * @return string
	 */
	private static function url( $file ) {
		return BLABLABLOCKS_POPUP_URL . 'build/' . ltrim( $file, '/' );
	}
}
