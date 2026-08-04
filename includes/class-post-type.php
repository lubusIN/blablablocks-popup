<?php
/**
 * Popup post type registration.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers popup post type and meta.
 */
final class Post_Type {
	/**
	 * Set up the popup post type and its registered meta.
	 */
	public static function init() {
		self::register();
		self::register_meta();
	}

	/**
	 * Register popup post type.
	 */
	public static function register() {
		register_post_type(
			Plugin::POST_TYPE,
			array(
				'labels'              => array(
					'name'               => __( 'Popups', 'blablablocks-popup' ),
					'singular_name'      => __( 'Popup', 'blablablocks-popup' ),
					'add_new_item'       => __( 'Add New Popup', 'blablablocks-popup' ),
					'edit_item'          => __( 'Edit Popup', 'blablablocks-popup' ),
					'new_item'           => __( 'New Popup', 'blablablocks-popup' ),
					'view_item'          => __( 'View Popup', 'blablablocks-popup' ),
					'search_items'       => __( 'Search Popups', 'blablablocks-popup' ),
					'not_found'          => __( 'No popups found.', 'blablablocks-popup' ),
					'not_found_in_trash' => __( 'No popups found in Trash.', 'blablablocks-popup' ),
				),
				'public'              => false,
				'publicly_queryable'  => false,
				'show_ui'             => true,
				'show_in_menu'        => false,
				'show_in_rest'        => true,
				'rest_base'           => 'blablablocks-popups',
				'menu_icon'           => Plugin::menu_icon(),
				'capability_type'     => 'post',
				'map_meta_cap'        => true,
				'hierarchical'        => false,
				'has_archive'         => false,
				'exclude_from_search' => true,
				'supports'            => array( 'title', 'editor', 'author', 'revisions', 'custom-fields' ),
				'template'            => self::default_template(),
			)
		);
	}

	/**
	 * Register REST-visible popup settings meta.
	 */
	public static function register_meta() {
		register_post_meta(
			Plugin::POST_TYPE,
			Plugin::META_KEY,
			array(
				'type'              => 'object',
				'single'            => true,
				'default'           => Settings::defaults(),
				'sanitize_callback' => array( Settings::class, 'sanitize' ),
				'auth_callback'     => function ( $allowed, $meta_key, $post_id ) {
					return current_user_can( 'edit_post', (int) $post_id );
				},
				'show_in_rest'      => array(
					'schema' => Settings::schema(),
				),
			)
		);
	}

	/**
	 * Default block editor starter content.
	 *
	 * @return array
	 */
	private static function default_template() {
		return array(
			array(
				'core/group',
				array(
					'layout' => array(
						'type' => 'constrained',
					),
				),
				array(
					array(
						'core/heading',
						array(
							'content' => __( 'Popup headline', 'blablablocks-popup' ),
						),
					),
					array(
						'core/paragraph',
						array(
							'content' => __( 'Add your popup message, form, offer, or call to action.', 'blablablocks-popup' ),
						),
					),
				),
			),
		);
	}
}
