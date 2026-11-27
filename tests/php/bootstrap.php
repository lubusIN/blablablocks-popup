<?php
/**
 * PHPUnit test bootstrap file.
 *
 * @package BlaBlaBlocksPopup
 */

require_once dirname( __DIR__, 2 ) . '/vendor/autoload.php';

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __DIR__, 2 ) . '/' );
}

if ( ! defined( 'BLABLABLOCKS_POPUP_VERSION' ) ) {
	define( 'BLABLABLOCKS_POPUP_VERSION', '0.1.0' );
}
if ( ! defined( 'BLABLABLOCKS_POPUP_FILE' ) ) {
	define( 'BLABLABLOCKS_POPUP_FILE', dirname( __DIR__, 2 ) . '/blablablocks-popup.php' );
}
if ( ! defined( 'BLABLABLOCKS_POPUP_DIR' ) ) {
	define( 'BLABLABLOCKS_POPUP_DIR', dirname( __DIR__, 2 ) . '/' );
}
if ( ! defined( 'BLABLABLOCKS_POPUP_URL' ) ) {
	define( 'BLABLABLOCKS_POPUP_URL', 'https://example.com/wp-content/plugins/blablablocks-popup/' );
}

// Fallback stubs for common WordPress utility functions if not defined.
if ( ! function_exists( 'absint' ) ) {
	function absint( $maybeint ) {
		return abs( (int) $maybeint );
	}
}

if ( ! function_exists( 'sanitize_text_field' ) ) {
	function sanitize_text_field( $str ) {
		return trim( strip_tags( (string) $str ) );
	}
}

if ( ! function_exists( 'sanitize_key' ) ) {
	function sanitize_key( $key ) {
		$key = strtolower( (string) $key );
		return preg_replace( '/[^a-z0-9_\-]/', '', $key );
	}
}

if ( ! function_exists( 'sanitize_html_class' ) ) {
	function sanitize_html_class( $class, $fallback = '' ) {
		$sanitized = preg_replace( '|%[a-fA-F0-9][a-fA-F0-9]|', '', (string) $class );
		$sanitized = preg_replace( '/[^A-Za-z0-9_-]/', '', $sanitized );
		return '' === $sanitized ? $fallback : $sanitized;
	}
}

if ( ! function_exists( 'wp_json_encode' ) ) {
	function wp_json_encode( $data, $options = 0, $depth = 512 ) {
		return json_encode( $data, $options, $depth );
	}
}

if ( ! function_exists( '__' ) ) {
	function __( $text, $domain = 'default' ) {
		return $text;
	}
}

if ( ! function_exists( 'esc_attr__' ) ) {
	function esc_attr__( $text, $domain = 'default' ) {
		return $text;
	}
}

if ( ! function_exists( 'esc_attr' ) ) {
	function esc_attr( $text ) {
		return htmlspecialchars( (string) $text, ENT_QUOTES, 'UTF-8' );
	}
}

if ( ! function_exists( 'esc_html' ) ) {
	function esc_html( $text ) {
		return htmlspecialchars( (string) $text, ENT_QUOTES, 'UTF-8' );
	}
}

// Load plugin files.
require_once BLABLABLOCKS_POPUP_DIR . 'includes/class-settings.php';
require_once BLABLABLOCKS_POPUP_DIR . 'includes/class-plugin.php';
require_once __DIR__ . '/TestCase.php';
