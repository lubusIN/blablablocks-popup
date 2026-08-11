<?php
/**
 * Popup REST API routes.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup;

use WP_Error;
use WP_Post;
use WP_Query;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * REST controller for popup management.
 */
final class Rest_Controller {
	/**
	 * Register plugin REST routes.
	 */
	public static function register_routes() {
		register_rest_route(
			Plugin::REST_NS,
			'/popups',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'list_popups' ),
					'permission_callback' => array( __CLASS__, 'can_edit_popups' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( __CLASS__, 'create_popup' ),
					'permission_callback' => array( __CLASS__, 'can_create_popups' ),
					'args'                => array(
						'title'    => array(
							'type'     => 'string',
							'required' => true,
						),
						'settings' => array(
							'type'     => 'object',
							'required' => false,
						),
					),
				),
			)
		);

		register_rest_route(
			Plugin::REST_NS,
			'/popups/(?P<id>\d+)',
			array(
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( __CLASS__, 'update_popup' ),
					'permission_callback' => array( __CLASS__, 'can_edit_popup_request' ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( __CLASS__, 'trash_popup' ),
					'permission_callback' => array( __CLASS__, 'can_delete_popup_request' ),
					'args'                => array(
						'force' => array(
							'type'    => 'boolean',
							'default' => false,
						),
					),
				),
			)
		);

		register_rest_route(
			Plugin::REST_NS,
			'/popups/samples',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'create_sample_popups' ),
				'permission_callback' => array( __CLASS__, 'can_create_popups' ),
			)
		);

		register_rest_route(
			Plugin::REST_NS,
			'/popups/(?P<id>\d+)/restore',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'restore_popup' ),
				'permission_callback' => array( __CLASS__, 'can_delete_popup_request' ),
			)
		);

		register_rest_route(
			Plugin::REST_NS,
			'/popups/(?P<id>\d+)/duplicate',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( __CLASS__, 'duplicate_popup' ),
				'permission_callback' => array( __CLASS__, 'can_duplicate_popup_request' ),
			)
		);
	}

	/**
	 * Whether current user can edit popups.
	 *
	 * @return bool
	 */
	public static function can_edit_popups() {
		$post_type = get_post_type_object( Plugin::POST_TYPE );

		return $post_type && current_user_can( $post_type->cap->edit_posts );
	}

	/**
	 * Whether the current user can create popups.
	 *
	 * @return bool
	 */
	public static function can_create_popups() {
		$post_type = get_post_type_object( Plugin::POST_TYPE );

		return $post_type && current_user_can( $post_type->cap->create_posts );
	}

	/**
	 * Whether the current user can publish popups.
	 *
	 * @return bool
	 */
	private static function can_publish_popups() {
		$post_type = get_post_type_object( Plugin::POST_TYPE );

		return $post_type && current_user_can( $post_type->cap->publish_posts );
	}

	/**
	 * Whether current request can edit a popup.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return bool
	 */
	public static function can_edit_popup_request( WP_REST_Request $request ) {
		return current_user_can( 'edit_post', absint( $request['id'] ) );
	}

	/**
	 * Whether the current request can duplicate a popup.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return bool
	 */
	public static function can_duplicate_popup_request( WP_REST_Request $request ) {
		return self::can_create_popups() && self::can_edit_popup_request( $request );
	}

	/**
	 * Whether current request can delete a popup.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return bool
	 */
	public static function can_delete_popup_request( WP_REST_Request $request ) {
		return current_user_can( 'delete_post', absint( $request['id'] ) );
	}

	/**
	 * List popups for admin app.
	 *
	 * @return WP_REST_Response
	 */
	public static function list_popups() {
		$query = new WP_Query(
			array(
				'post_type'      => Plugin::POST_TYPE,
				'post_status'    => array( 'publish', 'draft', 'pending', 'private', 'future', 'trash' ),
				'posts_per_page' => -1,
				'orderby'        => 'modified',
				'order'          => 'DESC',
				'no_found_rows'  => true,
			)
		);

		$editable_popups = array_filter(
			$query->posts,
			function ( $post ) {
				return current_user_can( 'edit_post', $post->ID );
			}
		);

		return rest_ensure_response(
			array_values( array_map( array( __CLASS__, 'prepare_item' ), $editable_popups ) )
		);
	}

	/**
	 * Create popup.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function create_popup( WP_REST_Request $request ) {
		$title = sanitize_text_field( (string) $request->get_param( 'title' ) );

		if ( '' === $title ) {
			return new WP_Error( 'popup_block_empty_title', __( 'A popup title is required.', 'blablablocks-popup' ), array( 'status' => 400 ) );
		}

		$post_id = wp_insert_post(
			array(
				'post_type'    => Plugin::POST_TYPE,
				'post_title'   => $title,
				'post_status'  => 'draft',
				'post_author'  => get_current_user_id(),
				'post_content' => self::starter_content(),
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		update_post_meta( $post_id, Plugin::META_KEY, Settings::sanitize( (array) $request->get_param( 'settings' ) ) );

		return rest_ensure_response( self::prepare_item( get_post( $post_id ) ) );
	}

	/**
	 * Create the complete sample popup set.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public static function create_sample_popups() {
		$posts = Sample_Popups::create();

		if ( is_wp_error( $posts ) ) {
			return $posts;
		}

		return rest_ensure_response(
			array_map( array( __CLASS__, 'prepare_item' ), $posts )
		);
	}

	/**
	 * Update popup.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function update_popup( WP_REST_Request $request ) {
		$post = self::get_popup_from_request( $request );

		if ( is_wp_error( $post ) ) {
			return $post;
		}

		$updates = array( 'ID' => $post->ID );

		if ( null !== $request->get_param( 'title' ) ) {
			$updates['post_title'] = sanitize_text_field( (string) $request->get_param( 'title' ) );
		}

		if ( null !== $request->get_param( 'status' ) ) {
			$status = sanitize_key( (string) $request->get_param( 'status' ) );
			$allowed_statuses = array( 'publish', 'draft', 'pending', 'private', 'future' );

			if ( ! in_array( $status, $allowed_statuses, true ) ) {
				return new WP_Error(
					'popup_block_invalid_status',
					__( 'The popup status is invalid.', 'blablablocks-popup' ),
					array( 'status' => 400 )
				);
			}

			if (
				$post->post_status !== $status &&
				in_array( $status, array( 'publish', 'private', 'future' ), true ) &&
				! self::can_publish_popups()
			) {
				return new WP_Error(
					'popup_block_cannot_publish',
					__( 'Sorry, you are not allowed to publish popups.', 'blablablocks-popup' ),
					array( 'status' => rest_authorization_required_code() )
				);
			}

			$updates['post_status'] = $status;
		}

		if ( null !== $request->get_param( 'slug' ) ) {
			$updates['post_name'] = sanitize_title( (string) $request->get_param( 'slug' ) );
		}

		if ( null !== $request->get_param( 'date' ) ) {
			$date = sanitize_text_field( (string) $request->get_param( 'date' ) );

			if ( '' !== $date ) {
				$datetime = \DateTimeImmutable::createFromFormat( 'Y-m-d\TH:i', $date, wp_timezone() );

				if ( ! $datetime ) {
					return new WP_Error( 'popup_block_invalid_date', __( 'The popup date is invalid.', 'blablablocks-popup' ), array( 'status' => 400 ) );
				}

				$updates['post_date']     = $datetime->format( 'Y-m-d H:i:s' );
				$updates['post_date_gmt'] = $datetime->setTimezone( new \DateTimeZone( 'UTC' ) )->format( 'Y-m-d H:i:s' );
			}
		}

		if ( count( $updates ) > 1 ) {
			$result = wp_update_post( $updates, true );
			if ( is_wp_error( $result ) ) {
				return $result;
			}
		}

		if ( null !== $request->get_param( 'settings' ) ) {
			update_post_meta( $post->ID, Plugin::META_KEY, Settings::sanitize( (array) $request->get_param( 'settings' ) ) );
		}

		return rest_ensure_response( self::prepare_item( get_post( $post->ID ) ) );
	}

	/**
	 * Duplicate popup.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function duplicate_popup( WP_REST_Request $request ) {
		$post = self::get_popup_from_request( $request );

		if ( is_wp_error( $post ) ) {
			return $post;
		}

		$post_id = wp_insert_post(
			array(
				'post_type'    => Plugin::POST_TYPE,
				'post_title'   => sprintf(
					/* translators: %s: Popup title. */
					__( '%s Copy', 'blablablocks-popup' ),
					$post->post_title
				),
				'post_status'  => 'draft',
				'post_author'  => get_current_user_id(),
				'post_content' => $post->post_content,
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		update_post_meta( $post_id, Plugin::META_KEY, Settings::get( $post->ID ) );

		return rest_ensure_response( self::prepare_item( get_post( $post_id ) ) );
	}

	/**
	 * Trash popup.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function trash_popup( WP_REST_Request $request ) {
		$post = self::get_popup_from_request( $request );

		if ( is_wp_error( $post ) ) {
			return $post;
		}

		if ( rest_sanitize_boolean( $request->get_param( 'force' ) ) ) {
			$deleted = wp_delete_post( $post->ID, true );

			if ( ! $deleted ) {
				return new WP_Error( 'popup_block_delete_failed', __( 'Could not permanently delete popup.', 'blablablocks-popup' ), array( 'status' => 500 ) );
			}

			return rest_ensure_response( array( 'deleted' => true ) );
		}

		$trashed = wp_trash_post( $post->ID );

		if ( ! $trashed ) {
			return new WP_Error( 'popup_block_trash_failed', __( 'Could not trash popup.', 'blablablocks-popup' ), array( 'status' => 500 ) );
		}

		return rest_ensure_response( self::prepare_item( get_post( $post->ID ) ) );
	}

	/**
	 * Restore popup from Trash.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function restore_popup( WP_REST_Request $request ) {
		$post = self::get_popup_from_request( $request );

		if ( is_wp_error( $post ) ) {
			return $post;
		}

		$restored = wp_untrash_post( $post->ID );

		if ( ! $restored ) {
			return new WP_Error( 'popup_block_restore_failed', __( 'Could not restore popup.', 'blablablocks-popup' ), array( 'status' => 500 ) );
		}

		return rest_ensure_response( self::prepare_item( get_post( $post->ID ) ) );
	}

	/**
	 * Resolve and validate the popup referenced by a REST request.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_Post|WP_Error
	 */
	private static function get_popup_from_request( WP_REST_Request $request ) {
		$post = get_post( absint( $request['id'] ) );

		if ( ! $post || Plugin::POST_TYPE !== $post->post_type ) {
			return new WP_Error( 'popup_block_not_found', __( 'Popup not found.', 'blablablocks-popup' ), array( 'status' => 404 ) );
		}

		return $post;
	}

	/**
	 * Prepare popup for admin app.
	 *
	 * @param WP_Post|null $post Post.
	 * @return array
	 */
	private static function prepare_item( $post ) {
		if ( ! $post instanceof WP_Post ) {
			return array();
		}

		$settings = Settings::get( $post->ID );
		$author   = get_userdata( (int) $post->post_author );
		$avatar   = get_avatar_data( (int) $post->post_author, array( 'size' => 48 ) );

		return array(
			'id'                => $post->ID,
			'title'             => get_the_title( $post ),
			'slug'              => $post->post_name,
			'status'            => $post->post_status,
			'authorId'          => (int) $post->post_author,
			'authorName'        => $author ? $author->display_name : __( 'Unknown', 'blablablocks-popup' ),
			'authorAvatarUrl'   => ! empty( $avatar['found_avatar'] ) ? esc_url_raw( $avatar['url'] ) : '',
			'date'              => get_post_time( 'c', true, $post ),
			'dateLocal'         => get_post_time( 'Y-m-d\TH:i', false, $post ),
			'dateFormatted'     => get_post_time( 'M j, Y g:i a', false, $post ),
			'modified'          => get_post_modified_time( 'c', true, $post ),
			'modifiedFormatted' => get_post_modified_time( 'M j, Y g:i a', false, $post ),
			'editUrl'           => get_edit_post_link( $post->ID, 'raw' ),
			'previewUrl'        => get_preview_post_link( $post ),
			'settings'          => $settings,
			'triggersSummary'   => self::summarize_triggers( $settings ),
			'conditionsSummary' => self::summarize_conditions( $settings ),
			'devicesSummary'    => implode( ', ', array_map( 'ucfirst', (array) $settings['rules']['devices'] ) ),
		);
	}

	/**
	 * Starter popup content for REST-created drafts.
	 *
	 * @return string
	 */
	private static function starter_content() {
		return '<!-- wp:group {"layout":{"type":"constrained"}} --><div class="wp-block-group"><!-- wp:heading --><h2 class="wp-block-heading">' . esc_html__( 'Popup headline', 'blablablocks-popup' ) . '</h2><!-- /wp:heading --><!-- wp:paragraph --><p>' . esc_html__( 'Add your popup message, form, offer, or call to action.', 'blablablocks-popup' ) . '</p><!-- /wp:paragraph --></div><!-- /wp:group -->';
	}

	/**
	 * Summarize triggers.
	 *
	 * @param array $settings Settings.
	 * @return string
	 */
	private static function summarize_triggers( array $settings ) {
		$triggers = $settings['triggers'];
		$labels   = array();

		if ( ! empty( $triggers['pageLoad'] ) ) {
			$labels[] = 0 < (int) $triggers['pageLoadDelay']
				? sprintf(
					/* translators: %d: Page load delay in seconds. */
					__( 'Page load: %ds', 'blablablocks-popup' ),
					(int) $triggers['pageLoadDelay']
				)
				: __( 'Page load', 'blablablocks-popup' );
		}
		if ( ! empty( $triggers['scroll'] ) ) {
			$labels[] = sprintf(
				/* translators: 1: Scroll direction, 2: Scroll amount. */
				__( 'Scroll %1$s %2$s', 'blablablocks-popup' ),
				$triggers['scrollDirection'],
				$triggers['scrollAmount']
			);
		}
		if ( ! empty( $triggers['scrollElement'] ) ) {
			$labels[] = __( 'Scroll to selector', 'blablablocks-popup' );
		}
		if ( ! empty( $triggers['click'] ) ) {
			$labels[] = sprintf(
				/* translators: %d: Number of clicks. */
				__( '%d clicks', 'blablablocks-popup' ),
				(int) $triggers['clickCount']
			);
		}
		if ( ! empty( $triggers['inactivity'] ) ) {
			$labels[] = sprintf(
				/* translators: %d: Inactivity duration in seconds. */
				__( 'Inactive %ds', 'blablablocks-popup' ),
				(int) $triggers['inactivitySeconds']
			);
		}
		if ( ! empty( $triggers['exitIntent'] ) ) {
			$labels[] = __( 'Exit intent', 'blablablocks-popup' );
		}

		return $labels ? implode( ', ', $labels ) : __( 'Manual only', 'blablablocks-popup' );
	}

	/**
	 * Summarize conditions.
	 *
	 * @param array $settings Settings.
	 * @return string
	 */
	private static function summarize_conditions( array $settings ) {
		$conditions = $settings['conditions'];
		$labels     = array();

		if ( ! empty( $conditions['includeEntireSite'] ) ) {
			$labels[] = __( 'Entire site', 'blablablocks-popup' );
		}
		if ( ! empty( $conditions['includeFrontPage'] ) ) {
			$labels[] = __( 'Front page', 'blablablocks-popup' );
		}
		if ( ! empty( $conditions['includeSingular'] ) ) {
			$type     = 'page' === ( $conditions['includeSingularType'] ?? 'post' ) ? __( 'Pages', 'blablablocks-popup' ) : __( 'Posts', 'blablablocks-popup' );
			$selected = ! empty( $conditions['includeSingularIds'] ) ? count( $conditions['includeSingularIds'] ) : 0;
			$labels[] = $selected
				? sprintf(
					/* translators: 1: Content type label, 2: Number of selected items. */
					__( '%1$s: %2$d selected', 'blablablocks-popup' ),
					$type,
					$selected
				)
				: $type;
		}
		if ( ! empty( $conditions['includeArchives'] ) ) {
			$selected = ! empty( $conditions['includeArchiveIds'] ) ? count( $conditions['includeArchiveIds'] ) : 0;
			$labels[] = $selected
				? sprintf(
					/* translators: %d: Number of selected archives. */
					__( 'Archives: %d selected', 'blablablocks-popup' ),
					$selected
				)
				: __( 'Archives', 'blablablocks-popup' );
		}
		if ( ! empty( $conditions['includeIds'] ) ) {
			$labels[] = sprintf(
				/* translators: %d: Number of selected content IDs. */
				__( '%d selected IDs', 'blablablocks-popup' ),
				count( $conditions['includeIds'] )
			);
		}

		return $labels ? implode( ', ', $labels ) : __( 'No automatic locations', 'blablablocks-popup' );
	}
}
