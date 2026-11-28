<?php
/**
 * Tests for Sample_Popups class.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup\Tests;

use BlaBlaBlocks_Popup\Plugin;
use BlaBlaBlocks_Popup\Sample_Popups;
use BlaBlaBlocks_Popup\Settings;
use Brain\Monkey\Functions;
use ReflectionClass;
use WP_Error;

require_once BLABLABLOCKS_POPUP_DIR . 'includes/class-sample-popups.php';

class SamplePopupsTest extends TestCase {

	private function get_sample_definitions() {
		$reflector = new ReflectionClass( Sample_Popups::class );
		$method    = $reflector->getMethod( 'definitions' );
		if ( PHP_VERSION_ID < 80100 ) {
			$method->setAccessible( true );
		}
		return $method->invoke( null );
	}

	public function test_definitions_count_and_keys() {
		$definitions = $this->get_sample_definitions();

		$this->assertCount( 5, $definitions );

		$expected_titles = array(
			'Welcome Discount',
			'Newsletter Slide-in',
			'Free Shipping Bar',
			'Exit Intent Offer',
			'Order Update Toast',
		);

		$titles = array_column( $definitions, 'title' );
		$this->assertSame( $expected_titles, $titles );

		foreach ( $definitions as $def ) {
			$this->assertArrayHasKey( 'title', $def );
			$this->assertArrayHasKey( 'content', $def );
			$this->assertArrayHasKey( 'settings', $def );

			// Ensure content is non-empty Gutenberg markup
			$this->assertNotEmpty( $def['content'] );
			$this->assertStringContainsString( '<!-- wp:', $def['content'] );

			// Ensure settings can be sanitized successfully
			$sanitized = Settings::sanitize( $def['settings'] );
			$this->assertIsArray( $sanitized );
			$this->assertArrayHasKey( 'layout', $sanitized );
		}
	}

	public function test_create_successful_run() {
		Functions\stubs(
			array(
				'get_current_user_id' => 1,
				'is_wp_error'         => false,
			)
		);

		Functions\expect( 'wp_insert_post' )
			->times( 5 )
			->andReturn( 101, 102, 103, 104, 105 );

		Functions\expect( 'update_post_meta' )
			->times( 5 )
			->andReturn( true );

		Functions\expect( 'get_post' )
			->times( 5 )
			->andReturn( (object) array( 'ID' => 101 ) );

		$result = Sample_Popups::create();
		$this->assertCount( 5, $result );
	}
}
