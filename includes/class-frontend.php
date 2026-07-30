<?php
/**
 * Frontend popup rendering.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup;

use WP_Query;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Frontend popup output.
 */
final class Frontend {
	/**
	 * Render candidate popups and enqueue frontend assets.
	 */
	public static function render_popups() {
		if ( is_admin() || wp_doing_ajax() || is_feed() || is_robots() ) {
			return;
		}

		$popups = self::get_runtime_popups();

		if ( empty( $popups ) ) {
			return;
		}

		self::enqueue_assets();

		foreach ( $popups as $post ) {
			self::render_popup( $post );
		}
	}

	/**
	 * Render one popup.
	 *
	 * @param \WP_Post $post Popup post.
	 */
	private static function render_popup( $post ) {
		$settings = Settings::get( $post->ID );
		$classes  = array( 'blablablocks-popup', 'blablablocks-popup--hidden' );
		$context  = wp_interactivity_data_wp_context(
			array(
				'id'             => (string) $post->ID,
				'isOpen'         => false,
				'animationState' => 'hidden',
			),
			'blablablocks/popup'
		);

		if ( ! empty( $settings['style']['customClass'] ) ) {
			$classes[] = sanitize_html_class( $settings['style']['customClass'] );
		}

		$content = apply_filters( 'the_content', $post->post_content );

		$html = sprintf(
			'<div id="blablablocks-popup-%1$d" class="%2$s" data-blablablocks-popup data-popup-id="%1$d" data-settings="%3$s" data-state="hidden" data-wp-interactive="blablablocks/popup" %7$s data-wp-bind--data-state="context.animationState" data-wp-init="callbacks.initPopup" data-wp-on-window--keydown="actions.closeOnEscape" role="dialog" aria-modal="true" aria-hidden="true" aria-label="%4$s">' .
				'<div class="blablablocks-popup__overlay" data-popup-close data-wp-on--click="actions.closeCurrentPopup"></div>' .
				'<div class="blablablocks-popup__dialog">' .
					'<button type="button" class="blablablocks-popup__close" data-popup-close data-wp-on--click="actions.closeCurrentPopup" aria-label="%5$s">&times;</button>' .
					'<div class="blablablocks-popup__content">%6$s</div>' .
				'</div>' .
			'</div>',
			absint( $post->ID ),
			esc_attr( implode( ' ', $classes ) ),
			esc_attr( wp_json_encode( $settings ) ),
			esc_attr( get_the_title( $post ) ),
			esc_attr__( 'Close popup', 'blablablocks-popup' ),
			$content, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$context // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);

		echo wp_interactivity_process_directives( $html ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Get frontend candidate popups.
	 *
	 * @return \WP_Post[]
	 */
	private static function get_runtime_popups() {
		$query = new WP_Query(
			array(
				'post_type'      => Plugin::POST_TYPE,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'menu_order date',
				'order'          => 'DESC',
				'no_found_rows'  => true,
			)
		);

		return array_values(
			array_filter(
				$query->posts,
				function ( $post ) {
					return self::matches_conditions( Settings::get( $post->ID ) );
				}
			)
		);
	}

	/**
	 * Check server-side display conditions.
	 *
	 * @param array $settings Settings.
	 * @return bool
	 */
	private static function matches_conditions( array $settings ) {
		$conditions = $settings['conditions'];
		$current_id = get_queried_object_id();

		if ( ! empty( $conditions['excludeFrontPage'] ) && is_front_page() ) {
			return false;
		}

		if ( $current_id && in_array( $current_id, array_map( 'absint', (array) $conditions['excludeIds'] ), true ) ) {
			return false;
		}

		if ( ! empty( $conditions['includeEntireSite'] ) ) {
			return true;
		}

		if ( ! empty( $conditions['includeFrontPage'] ) && is_front_page() ) {
			return true;
		}

		if ( ! empty( $conditions['includeSingular'] ) && is_singular() ) {
			$singular_type = sanitize_key( $conditions['includeSingularType'] ?? 'post' );
			$singular_ids  = ! empty( $conditions['includeSingularIds'] ) ? (array) $conditions['includeSingularIds'] : (array) $conditions['includeIds'];

			if ( ! in_array( $singular_type, array( 'post', 'page' ), true ) || ! is_singular( $singular_type ) ) {
				return false;
			}

			return empty( $singular_ids ) || in_array( $current_id, array_map( 'absint', $singular_ids ), true );
		}

		if ( ! empty( $conditions['includeArchives'] ) && is_archive() ) {
			$archive_ids = ! empty( $conditions['includeArchiveIds'] ) ? (array) $conditions['includeArchiveIds'] : (array) $conditions['includeIds'];

			return empty( $archive_ids ) || in_array( $current_id, array_map( 'absint', $archive_ids ), true );
		}

		return $current_id && in_array( $current_id, array_map( 'absint', (array) $conditions['includeIds'] ), true );
	}

	/**
	 * Enqueue frontend assets.
	 */
	private static function enqueue_assets() {
		Assets::enqueue_frontend();
		wp_interactivity_config( 'blablablocks/popup', self::script_data() );
	}

	/**
	 * Frontend runtime data.
	 *
	 * @return array
	 */
	private static function script_data() {
		return array(
			'isLoggedIn' => is_user_logged_in(),
			'userRoles'  => is_user_logged_in() ? wp_get_current_user()->roles : array(),
			'homeUrl'    => home_url(),
		);
	}

}
