<?php
/**
 * Admin page and assets.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * BlaBlaBlocks Popup admin app integration.
 */
final class Admin {
	/**
	 * Add admin page.
	 */
	public static function register_page() {
		add_menu_page(
			__( 'BlaBlaBlocks Popup', 'blablablocks-popup' ),
			__( 'BlaBlaBlocks Popup', 'blablablocks-popup' ),
			'edit_posts',
			Plugin::MENU_SLUG,
			array( __CLASS__, 'render_page' ),
			Plugin::menu_icon(),
			58
		);
	}

	/**
	 * Redirect direct list-table access to the modern app.
	 */
	public static function redirect_classic_list_table() {
		global $pagenow;

		if ( 'edit.php' !== $pagenow || Plugin::POST_TYPE !== filter_input( INPUT_GET, 'post_type', FILTER_SANITIZE_FULL_SPECIAL_CHARS ) ) {
			return;
		}

		wp_safe_redirect( admin_url( 'admin.php?page=' . Plugin::MENU_SLUG ) );
		exit;
	}

	/**
	 * Render admin app shell.
	 */
	public static function render_page() {
		echo '<div class="wrap blablablocks-popup-admin-wrap"><div id="blablablocks-popup-admin"></div></div>';
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @param string $hook Hook suffix.
	 */
	public static function enqueue_assets( $hook ) {
		if ( 'toplevel_page_' . Plugin::MENU_SLUG !== $hook ) {
			return;
		}

		$asset = self::get_asset( 'admin' );

		wp_enqueue_style( 'wp-components' );
		wp_enqueue_script(
			'blablablocks-popup-admin',
			BLABLABLOCKS_POPUP_URL . 'build/admin.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_enqueue_style(
			'blablablocks-popup-admin',
			BLABLABLOCKS_POPUP_URL . 'build/admin.css',
			array( 'wp-components' ),
			$asset['version']
		);

		wp_add_inline_script( 'blablablocks-popup-admin', 'window.BlaBlaBlocksPopupAdmin = ' . wp_json_encode( self::script_data() ), 'before' );
	}

	/**
	 * Enqueue block editor sidebar assets.
	 */
	public static function enqueue_editor_assets() {
		$screen = get_current_screen();

		if ( ! $screen || Plugin::POST_TYPE !== $screen->post_type ) {
			return;
		}

		$asset        = self::get_asset( 'editor' );
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
			BLABLABLOCKS_POPUP_URL . 'build/editor.js',
			$dependencies,
			$asset['version'],
			true
		);

		if ( file_exists( BLABLABLOCKS_POPUP_DIR . 'build/editor.css' ) ) {
			wp_enqueue_style(
				'blablablocks-popup-editor',
				BLABLABLOCKS_POPUP_URL . 'build/editor.css',
				array( 'wp-components' ),
				$asset['version']
			);
			wp_add_inline_style( 'blablablocks-popup-editor', self::get_editor_canvas_css( self::get_current_editor_post_id() ) );
		}

		wp_add_inline_script( 'blablablocks-popup-editor', 'window.BlaBlaBlocksPopupEditor = ' . wp_json_encode( self::editor_script_data() ), 'before' );
	}

	/**
	 * Add popup preview styles to the iframed editor canvas.
	 *
	 * @param array                    $editor_settings Editor settings.
	 * @param \WP_Block_Editor_Context $context         Editor context.
	 * @return array
	 */
	public static function add_editor_canvas_styles( $editor_settings, $context ) {
		if ( empty( $context->post ) || Plugin::POST_TYPE !== $context->post->post_type ) {
			return $editor_settings;
		}

		$editor_settings['styles'][] = array(
			'css'            => self::get_editor_canvas_css( $context->post->ID ),
			'__unstableType' => 'theme',
		);

		return $editor_settings;
	}

	/**
	 * Admin app data.
	 *
	 * @return array
	 */
	private static function script_data() {
		return array(
			'restUrl'    => esc_url_raw( rest_url( Plugin::REST_NS ) ),
			'nonce'      => wp_create_nonce( 'wp_rest' ),
			'postType'   => Plugin::POST_TYPE,
			'defaults'   => Settings::defaults(),
			'newPostUrl' => admin_url( 'post-new.php?post_type=' . Plugin::POST_TYPE ),
			'statuses'   => array(
				'publish' => __( 'Published', 'blablablocks-popup' ),
				'draft'   => __( 'Draft', 'blablablocks-popup' ),
				'pending' => __( 'Pending', 'blablablocks-popup' ),
				'future'  => __( 'Scheduled', 'blablablocks-popup' ),
				'private' => __( 'Private', 'blablablocks-popup' ),
				'trash'   => __( 'Trash', 'blablablocks-popup' ),
			),
		);
	}

	/**
	 * Block editor script data.
	 *
	 * @return array
	 */
	private static function editor_script_data() {
		return array(
			'postId'   => self::get_current_editor_post_id(),
			'postType' => Plugin::POST_TYPE,
			'metaKey'  => Plugin::META_KEY,
			'pluginUrl' => BLABLABLOCKS_POPUP_URL,
			'defaults' => Settings::defaults(),
		);
	}

	/**
	 * Read a generated asset metadata file.
	 *
	 * @param string $entry Entry name.
	 * @return array
	 */
	private static function get_asset( $entry ) {
		$asset_file = BLABLABLOCKS_POPUP_DIR . 'build/' . $entry . '.asset.php';

		if ( file_exists( $asset_file ) ) {
			return require $asset_file;
		}

		return array(
			'dependencies' => array( 'wp-api-fetch', 'wp-components', 'wp-element', 'wp-i18n' ),
			'version'      => BLABLABLOCKS_POPUP_VERSION,
		);
	}

	/**
	 * Resolve the post being edited from the editor request.
	 *
	 * @return int
	 */
	private static function get_current_editor_post_id() {
		$post_id = filter_input( INPUT_GET, 'post', FILTER_VALIDATE_INT );

		return $post_id ? absint( $post_id ) : 0;
	}

	/**
	 * Build popup preview CSS for the editor canvas.
	 *
	 * @param int $post_id Popup post ID.
	 * @return string
	 */
	private static function get_editor_canvas_css( $post_id = 0 ) {
		$settings = $post_id ? Settings::get( $post_id ) : Settings::defaults();
		$layout   = $settings['layout'];
		$style    = $settings['style'];
		$vars     = self::get_editor_canvas_variables( $layout, $style );

		$css = (
			'body.post-type-popup_block.editor-styles-wrapper, .editor-styles-wrapper.blablablocks-popup-editor-canvas {' .
				'__BLABLABLOCKS_POPUP_EDITOR_VARS__' .
				'background: var(--blablablocks-popup-editor-overlay-background) !important;' .
				'box-sizing: border-box;' .
				'display: flex;' .
				'position: relative;' .
				'align-items: var(--blablablocks-popup-editor-align-x);' .
				'justify-content: var(--blablablocks-popup-editor-align-y);' .
				'flex-direction: column;' .
				'min-height: 100vh;' .
			'}' .
			'body.post-type-popup_block.editor-styles-wrapper .editor-visual-editor__post-title-wrapper, .editor-styles-wrapper.blablablocks-popup-editor-canvas .editor-visual-editor__post-title-wrapper {' .
				'box-sizing: border-box;' .
				'width: var(--blablablocks-popup-editor-width);' .
				'max-width: calc(100vw - 64px);' .
				'margin: 0 0 16px !important;' .
				'padding: 0;' .
				'opacity: .72;' .
			'}' .
			'body.post-type-popup_block.editor-styles-wrapper .editor-post-title__input, .editor-styles-wrapper.blablablocks-popup-editor-canvas .editor-post-title__input {' .
				'font-size: 13px !important;' .
				'font-weight: 500 !important;' .
				'line-height: 20px !important;' .
				'text-align: center;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas .block-editor-writing-flow {' .
				'display: flex;' .
				'flex-direction: column;' .
				'box-sizing: border-box;' .
				'width: 100%;' .
				'min-height: calc(100vh - 192px);' .
			'}' .
			'body.post-type-popup_block.editor-styles-wrapper .block-editor-block-list__layout.is-root-container, .editor-styles-wrapper.blablablocks-popup-editor-canvas .block-editor-block-list__layout.is-root-container {' .
				'position: absolute;' .
				'box-sizing: border-box;' .
				'width: var(--blablablocks-popup-editor-width);' .
				'max-width: calc(100vw - 64px);' .
				'height: var(--blablablocks-popup-editor-height);' .
				'max-height: calc(100vh - 128px);' .
				'overflow: auto;' .
				'margin: var(--blablablocks-popup-editor-margin) !important;' .
				'padding: var(--blablablocks-popup-editor-padding);' .
				'background: var(--blablablocks-popup-editor-background);' .
				'border: var(--blablablocks-popup-editor-border);' .
				'border-radius: var(--blablablocks-popup-editor-radius);' .
				'box-shadow: 0 24px 80px rgba(0, 0, 0, .24);' .
				'transform-origin: center;' .
				'will-change: opacity, transform;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas.blablablocks-popup-editor-canvas--animating .block-editor-block-list__layout.is-root-container {' .
				'animation: blablablocks-popup-editor-fade-in var(--blablablocks-popup-editor-duration, .3s) ease both;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas.blablablocks-popup-editor-canvas--animating[data-popup-entrance-animation="zoom"] .block-editor-block-list__layout.is-root-container {' .
				'animation-name: blablablocks-popup-editor-zoom-in;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas.blablablocks-popup-editor-canvas--animating[data-popup-entrance-animation="zoom-out"] .block-editor-block-list__layout.is-root-container {' .
				'animation-name: blablablocks-popup-editor-zoom-out-in;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas.blablablocks-popup-editor-canvas--animating[data-popup-entrance-animation="slide-up"] .block-editor-block-list__layout.is-root-container {' .
				'animation-name: blablablocks-popup-editor-slide-up-in;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas.blablablocks-popup-editor-canvas--animating[data-popup-entrance-animation="slide-down"] .block-editor-block-list__layout.is-root-container {' .
				'animation-name: blablablocks-popup-editor-slide-down-in;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas.blablablocks-popup-editor-canvas--animating[data-popup-entrance-animation="slide-left"] .block-editor-block-list__layout.is-root-container {' .
				'animation-name: blablablocks-popup-editor-slide-left-in;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas.blablablocks-popup-editor-canvas--animating[data-popup-entrance-animation="slide-right"] .block-editor-block-list__layout.is-root-container {' .
				'animation-name: blablablocks-popup-editor-slide-right-in;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas.blablablocks-popup-editor-canvas--animating[data-popup-entrance-animation="flip-up"] .block-editor-block-list__layout.is-root-container {' .
				'animation-name: blablablocks-popup-editor-flip-up-in;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas.blablablocks-popup-editor-canvas--animating[data-popup-entrance-animation="flip-down"] .block-editor-block-list__layout.is-root-container {' .
				'animation-name: blablablocks-popup-editor-flip-down-in;' .
			'}' .
			'.editor-styles-wrapper.blablablocks-popup-editor-canvas.blablablocks-popup-editor-canvas--animating[data-popup-entrance-animation="none"] .block-editor-block-list__layout.is-root-container {' .
				'animation: none;' .
			'}' .
			'body.post-type-popup_block.editor-styles-wrapper .block-editor-block-list__layout.is-root-container::before, .editor-styles-wrapper.blablablocks-popup-editor-canvas .block-editor-block-list__layout.is-root-container::before {' .
				'content: "×";' .
				'position: absolute;' .
				'top: 12px;' .
				'right: 12px;' .
				'z-index: 2;' .
				'display: var(--blablablocks-popup-editor-close-display);' .
				'align-items: center;' .
				'justify-content: center;' .
				'width: var(--blablablocks-popup-editor-close-size);' .
				'height: var(--blablablocks-popup-editor-close-size);' .
				'border-radius: 999px;' .
				'background: var(--blablablocks-popup-editor-close-background);' .
				'color: var(--blablablocks-popup-editor-close-color);' .
				'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;' .
				'font-size: calc(var(--blablablocks-popup-editor-close-size) * .72);' .
				'line-height: 1;' .
				'pointer-events: none;' .
			'}' .
			'body.post-type-popup_block.editor-styles-wrapper .block-editor-block-list__layout.is-root-container > .wp-block, .editor-styles-wrapper.blablablocks-popup-editor-canvas .block-editor-block-list__layout.is-root-container > .wp-block {' .
				'max-width: 100%;' .
			'}' .
			'body.post-type-popup_block.editor-styles-wrapper .block-editor-block-list__layout.is-root-container > .alignwide, body.post-type-popup_block.editor-styles-wrapper .block-editor-block-list__layout.is-root-container > .alignfull, .editor-styles-wrapper.blablablocks-popup-editor-canvas .block-editor-block-list__layout.is-root-container > .alignwide, .editor-styles-wrapper.blablablocks-popup-editor-canvas .block-editor-block-list__layout.is-root-container > .alignfull {' .
				'width: 100%;' .
				'max-width: 100%;' .
				'margin-right: 0 !important;' .
				'margin-left: 0 !important;' .
			'}' .
			'@keyframes blablablocks-popup-editor-fade-in {' .
				'from { opacity: 0; }' .
				'to { opacity: 1; }' .
			'}' .
			'@keyframes blablablocks-popup-editor-zoom-in {' .
				'from { opacity: 0; transform: scale(.94); }' .
				'to { opacity: 1; transform: scale(1); }' .
			'}' .
			'@keyframes blablablocks-popup-editor-zoom-out-in {' .
				'from { opacity: 0; transform: scale(1.06); }' .
				'to { opacity: 1; transform: scale(1); }' .
			'}' .
			'@keyframes blablablocks-popup-editor-slide-up-in {' .
				'from { opacity: 0; transform: translateY(32px); }' .
				'to { opacity: 1; transform: translateY(0); }' .
			'}' .
			'@keyframes blablablocks-popup-editor-slide-down-in {' .
				'from { opacity: 0; transform: translateY(-32px); }' .
				'to { opacity: 1; transform: translateY(0); }' .
			'}' .
			'@keyframes blablablocks-popup-editor-slide-left-in {' .
				'from { opacity: 0; transform: translateX(32px); }' .
				'to { opacity: 1; transform: translateX(0); }' .
			'}' .
			'@keyframes blablablocks-popup-editor-slide-right-in {' .
				'from { opacity: 0; transform: translateX(-32px); }' .
				'to { opacity: 1; transform: translateX(0); }' .
			'}' .
			'@keyframes blablablocks-popup-editor-flip-up-in {' .
				'from { opacity: 0; transform: perspective(900px) rotateX(-12deg) translateY(16px); }' .
				'to { opacity: 1; transform: perspective(900px) rotateX(0) translateY(0); }' .
			'}' .
			'@keyframes blablablocks-popup-editor-flip-down-in {' .
				'from { opacity: 0; transform: perspective(900px) rotateX(12deg) translateY(-16px); }' .
				'to { opacity: 1; transform: perspective(900px) rotateX(0) translateY(0); }' .
			'}'
		);

		return str_replace(
			'__BLABLABLOCKS_POPUP_EDITOR_VARS__',
			self::format_editor_canvas_variables( $vars ),
			$css
		);
	}

	/**
	 * Build popup preview CSS variable values.
	 *
	 * @param array $layout Layout settings.
	 * @param array $style  Style settings.
	 * @return array
	 */
	private static function get_editor_canvas_variables( array $layout, array $style ) {
		$width      = self::sanitize_css_value( $layout['width'] ?? '640px', '640px' );
		$height     = self::sanitize_css_value( $layout['height'] ?? 'auto', 'auto' );
		$border     = self::get_editor_canvas_border( $style );
		$close_size = max( 12, absint( $style['closeSize'] ?? 28 ) ) . 'px';

		return array(
			'--blablablocks-popup-editor-width'              => '100%' === $width ? 'min(100%, 960px)' : $width,
			'--blablablocks-popup-editor-height'             => $height,
			'--blablablocks-popup-editor-align-x'            => self::get_flex_alignment( $layout['horizontal'] ?? 'center' ),
			'--blablablocks-popup-editor-align-y'            => self::get_flex_alignment( $layout['vertical'] ?? 'center' ),
			'--blablablocks-popup-editor-overlay-background' => ! empty( $layout['overlay'] ) ? self::sanitize_css_value( $style['overlayBackground'] ?? 'rgba(0,0,0,.55)', 'rgba(0,0,0,.55)' ) : '#f0f0f0',
			'--blablablocks-popup-editor-background'         => self::sanitize_css_value( $style['popupBackground'] ?? '#ffffff', '#ffffff' ),
			'--blablablocks-popup-editor-border'             => $border,
			'--blablablocks-popup-editor-radius'             => self::sanitize_css_value( $style['borderRadius'] ?? '8px', '8px' ),
			'--blablablocks-popup-editor-margin'             => self::sanitize_css_value( $style['margin'] ?? '24px', '24px' ),
			'--blablablocks-popup-editor-padding'            => self::sanitize_css_value( $style['padding'] ?? '32px', '32px' ),
			'--blablablocks-popup-editor-close-display'      => ! empty( $layout['closeButton'] ) ? 'flex' : 'none',
			'--blablablocks-popup-editor-close-size'         => $close_size,
			'--blablablocks-popup-editor-close-color'        => self::sanitize_css_value( $style['closeColor'] ?? '#1e1e1e', '#1e1e1e' ),
			'--blablablocks-popup-editor-close-background'   => self::sanitize_css_value( $style['closeBackground'] ?? 'transparent', 'transparent' ),
			'--blablablocks-popup-editor-duration'           => max( 0.0, (float) ( $layout['animationDuration'] ?? 0.3 ) ) . 's',
		);
	}

	/**
	 * Format CSS custom properties for the preview shell.
	 *
	 * @param array $vars CSS variable map.
	 * @return string
	 */
	private static function format_editor_canvas_variables( array $vars ) {
		$css = '';

		foreach ( $vars as $property => $value ) {
			$css .= $property . ':' . $value . ';';
		}

		return $css;
	}

	/**
	 * Convert popup position keywords into flexbox alignment values.
	 *
	 * @param string $value Position keyword.
	 * @return string
	 */
	private static function get_flex_alignment( $value ) {
		if ( 'left' === $value || 'top' === $value ) {
			return 'flex-start';
		}

		if ( 'right' === $value || 'bottom' === $value ) {
			return 'flex-end';
		}

		return 'center';
	}

	/**
	 * Build the popup border preview value.
	 *
	 * @param array $style Style settings.
	 * @return string
	 */
	private static function get_editor_canvas_border( array $style ) {
		if ( empty( $style['borderType'] ) || 'none' === $style['borderType'] ) {
			return '0 solid transparent';
		}

		$width = self::sanitize_css_value( $style['borderWidth'] ?? '1px', '1px' );
		$type  = in_array( $style['borderType'], array( 'solid', 'dashed', 'dotted', 'double' ), true ) ? $style['borderType'] : 'solid';
		$color = self::sanitize_css_value( $style['borderColor'] ?? '#dcdcde', '#dcdcde' );

		return $width . ' ' . $type . ' ' . $color;
	}

	/**
	 * Sanitize a CSS value for use in generated editor preview rules.
	 *
	 * @param string $value    Raw CSS value.
	 * @param string $fallback Fallback value.
	 * @return string
	 */
	private static function sanitize_css_value( $value, $fallback ) {
		$value = self::resolve_css_tokens( (string) $value );

		if ( preg_match( '/^[#a-zA-Z0-9\s.,%()+*\/_-]+$/', $value ) ) {
			return $value;
		}

		return $fallback;
	}

	/**
	 * Resolve WordPress preset tokens into CSS variables.
	 *
	 * @param string $value Raw value.
	 * @return string
	 */
	private static function resolve_css_tokens( $value ) {
		return preg_replace_callback(
			'/var:preset\|(color|gradient|spacing)\|([a-zA-Z0-9_-]+)/',
			function ( $matches ) {
				return 'var(--wp--preset--' . sanitize_key( $matches[1] ) . '--' . sanitize_key( $matches[2] ) . ')';
			},
			$value
		);
	}
}
