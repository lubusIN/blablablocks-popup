<?php
/**
 * Tests for Settings class.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup\Tests;

use BlaBlaBlocks_Popup\Plugin;
use BlaBlaBlocks_Popup\Settings;
use Brain\Monkey\Functions;

class SettingsTest extends TestCase {

	public function test_defaults_structure() {
		$defaults = Settings::defaults();

		$this->assertIsArray( $defaults );
		$this->assertArrayHasKey( 'layout', $defaults );
		$this->assertArrayHasKey( 'style', $defaults );
		$this->assertArrayHasKey( 'advanced', $defaults );
		$this->assertArrayHasKey( 'conditions', $defaults );
		$this->assertArrayHasKey( 'triggers', $defaults );
		$this->assertArrayHasKey( 'rules', $defaults );

		// Check some key default values
		$this->assertSame( '640px', $defaults['layout']['width'] );
		$this->assertTrue( $defaults['layout']['overlay'] );
		$this->assertTrue( $defaults['conditions']['includeEntireSite'] );
		$this->assertTrue( $defaults['triggers']['pageLoad'] );
		$this->assertSame( 50, $defaults['triggers']['scrollAmount'] );
	}

	public function test_sanitize_returns_defaults_on_non_array() {
		$sanitized = Settings::sanitize( 'invalid string' );
		$this->assertSame( Settings::defaults(), $sanitized );

		$sanitized_null = Settings::sanitize( null );
		$this->assertSame( Settings::defaults(), $sanitized_null );
	}

	public function test_sanitize_casts_and_bounds_values() {
		$input = array(
			'layout'   => array(
				'width'             => ' 800px ',
				'overlay'           => 1, // should cast to bool true
				'animationDuration' => '1.5',
			),
			'triggers' => array(
				'scrollAmount' => '-10', // int max(0, absint) -> 10
				'exitIntent'   => '1',   // bool true
			),
			'advanced' => array(
				'autoClose' => 5,
			),
			'rules'    => array(
				'devices' => array( 'desktop', 'invalid-device!', 123 ),
			),
		);

		$sanitized = Settings::sanitize( $input );

		$this->assertSame( '800px', $sanitized['layout']['width'] );
		$this->assertTrue( $sanitized['layout']['overlay'] );
		$this->assertSame( 1.5, $sanitized['layout']['animationDuration'] );
		$this->assertSame( 10, $sanitized['triggers']['scrollAmount'] );
		$this->assertTrue( $sanitized['triggers']['exitIntent'] );
		$this->assertSame( 5, $sanitized['advanced']['autoClose'] );

		// Lists sanitization
		$this->assertContains( 'desktop', $sanitized['rules']['devices'] );
		$this->assertContains( 123, $sanitized['rules']['devices'] );
	}

	public function test_sanitize_normalizes_millisecond_durations() {
		$input = array(
			'layout' => array(
				'animationDuration' => 300, // Legacy ms: > 20 should be converted to seconds (300 / 1000 = 0.3)
			),
		);

		$sanitized = Settings::sanitize( $input );
		$this->assertSame( 0.3, $sanitized['layout']['animationDuration'] );
	}

	public function test_get_fetches_and_sanitizes_post_meta() {
		Functions\expect( 'get_post_meta' )
			->once()
			->with( 42, Plugin::META_KEY, true )
			->andReturn(
				array(
					'layout' => array(
						'width' => '500px',
					),
				)
			);

		$result = Settings::get( 42 );

		$this->assertSame( '500px', $result['layout']['width'] );
		$this->assertTrue( $result['layout']['overlay'] ); // Defaults preserved
	}

	public function test_schema_returns_valid_rest_schema() {
		$schema = Settings::schema();

		$this->assertSame( 'object', $schema['type'] );
		$this->assertArrayHasKey( 'properties', $schema );
		$this->assertArrayHasKey( 'layout', $schema['properties'] );
		$this->assertArrayHasKey( 'triggers', $schema['properties'] );
	}
}
