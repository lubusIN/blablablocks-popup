<?php
/**
 * Popup settings schema and sanitization.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Popup settings helpers.
 */
final class Settings {
	/**
	 * Default popup settings.
	 *
	 * @return array
	 */
	public static function defaults() {
		return array(
			'layout'     => array(
				'width'             => '640px',
				'height'            => 'auto',
				'horizontal'        => 'center',
				'vertical'          => 'center',
				'overlay'           => true,
				'closeButton'       => true,
				'entranceAnimation' => 'fade',
				'exitAnimation'     => 'fade',
				'animationDuration' => 0.3,
			),
			'style'      => array(
				'popupBackground'   => '#ffffff',
				'overlayBackground' => 'rgba(0,0,0,0.55)',
				'border'            => array(
					'color'  => '',
					'style'  => '',
					'width'  => '',
					'top'    => array(
						'color' => '',
						'style' => '',
						'width' => '',
					),
					'right'  => array(
						'color' => '',
						'style' => '',
						'width' => '',
					),
					'bottom' => array(
						'color' => '',
						'style' => '',
						'width' => '',
					),
					'left'   => array(
						'color' => '',
						'style' => '',
						'width' => '',
					),
				),
				'borderType'        => 'none',
				'borderColor'       => '#dcdcde',
				'borderWidth'       => '1px',
				'borderRadius'      => '8px',
				'boxShadow'         => '0 20px 60px rgba(0,0,0,0.24)',
				'closeColor'        => '#1e1e1e',
				'closeBackground'   => 'transparent',
				'closeSize'         => 28,
				'margin'            => '24px',
				'padding'           => '32px',
				'customClass'       => '',
			),
			'advanced'  => array(
				'closeDelay'          => 0,
				'autoClose'           => 0,
				'preventOverlayClose' => false,
				'preventEscClose'     => false,
				'disableScroll'       => true,
				'avoidMultiple'       => true,
				'openSelectors'       => '',
			),
			'conditions' => array(
				'includeEntireSite' => true,
				'includeFrontPage'  => false,
				'includeSingular'   => false,
				'includeSingularType' => 'post',
				'includeSingularIds' => array(),
				'includeArchives'   => false,
				'includeArchiveIds' => array(),
				'includeIds'        => array(),
				'excludeFrontPage'  => false,
				'excludeIds'        => array(),
			),
			'triggers'   => array(
				'pageLoad'          => true,
				'pageLoadDelay'     => 0,
				'scroll'            => false,
				'scrollDirection'   => 'down',
				'scrollAmount'      => 50,
				'scrollElement'     => false,
				'scrollSelector'    => '',
				'click'             => false,
				'clickCount'        => 3,
				'inactivity'        => false,
				'inactivitySeconds' => 20,
				'exitIntent'        => false,
			),
			'rules'      => array(
				'pageViews'        => false,
				'pageViewsCount'   => 2,
				'sessions'         => false,
				'sessionsCount'    => 2,
				'maxDisplays'      => false,
				'maxDisplaysCount' => 3,
				'countMode'        => 'open',
				'referrerUrl'      => false,
				'referrerMode'     => 'show',
				'referrerPattern'  => '',
				'referrerRegex'    => false,
				'arrivingFrom'     => array(),
				'hideLoggedIn'     => false,
				'hideRoles'        => array(),
				'devices'          => array( 'desktop', 'tablet', 'mobile' ),
			),
		);
	}

	/**
	 * REST schema for settings meta.
	 *
	 * @return array
	 */
	public static function schema() {
		return array(
			'type'                 => 'object',
			'additionalProperties' => true,
			'properties'           => array(
				'layout'     => self::group_schema(),
				'style'      => self::group_schema(),
				'advanced'   => self::group_schema(),
				'conditions' => self::group_schema(),
				'triggers'   => self::group_schema(),
				'rules'      => self::group_schema(),
			),
		);
	}

	/**
	 * REST schema for a settings group.
	 *
	 * @return array
	 */
	private static function group_schema() {
		return array(
			'type'                 => 'object',
			'additionalProperties' => true,
		);
	}

	/**
	 * Get merged popup settings for a post.
	 *
	 * @param int $post_id Post ID.
	 * @return array
	 */
	public static function get( $post_id ) {
		$settings = get_post_meta( $post_id, Plugin::META_KEY, true );
		return self::sanitize( is_array( $settings ) ? $settings : array() );
	}

	/**
	 * Sanitize settings recursively against default shape.
	 *
	 * @param mixed $value Raw settings.
	 * @return array
	 */
	public static function sanitize( $value ) {
		if ( ! is_array( $value ) ) {
			return self::defaults();
		}

		return self::sanitize_by_defaults( $value, self::defaults() );
	}

	/**
	 * Sanitize an input array using default values as type hints.
	 *
	 * @param array $input    Input data.
	 * @param array $defaults Defaults.
	 * @return array
	 */
	private static function sanitize_by_defaults( array $input, array $defaults ) {
		$output = $defaults;

		foreach ( $defaults as $key => $default ) {
			if ( ! array_key_exists( $key, $input ) ) {
				continue;
			}

			$value = $input[ $key ];

			if ( is_array( $default ) ) {
				$output[ $key ] = self::is_list_array( $default )
					? self::sanitize_list( $value )
					: ( is_array( $value ) ? self::sanitize_by_defaults( $value, $default ) : $default );
			} elseif ( is_bool( $default ) ) {
				$output[ $key ] = (bool) $value;
			} elseif ( is_int( $default ) ) {
				$output[ $key ] = max( 0, absint( $value ) );
			} elseif ( is_float( $default ) ) {
				$output[ $key ] = self::sanitize_float( $value );
			} else {
				$output[ $key ] = sanitize_text_field( (string) $value );
			}
		}

		return $output;
	}

	/**
	 * Sanitize a float setting and normalize legacy millisecond durations.
	 *
	 * @param mixed $value Raw value.
	 * @return float
	 */
	private static function sanitize_float( $value ) {
		$value = is_numeric( $value ) ? (float) $value : 0.0;
		$value = max( 0.0, $value );

		if ( $value > 20 ) {
			$value = $value / 1000;
		}

		return round( $value, 3 );
	}

	/**
	 * Determine if an array is a list.
	 *
	 * @param array $array Array.
	 * @return bool
	 */
	private static function is_list_array( array $array ) {
		if ( array() === $array ) {
			return true;
		}

		return array_keys( $array ) === range( 0, count( $array ) - 1 );
	}

	/**
	 * Sanitize a list.
	 *
	 * @param mixed $value Raw list.
	 * @return array
	 */
	private static function sanitize_list( $value ) {
		if ( ! is_array( $value ) ) {
			return array();
		}

		return array_values(
			array_filter(
				array_map(
					function ( $item ) {
						if ( is_numeric( $item ) ) {
							return absint( $item );
						}

						return sanitize_key( (string) $item );
					},
					$value
				),
				function ( $item ) {
					return '' !== $item && 0 !== $item;
				}
			)
		);
	}
}
