<?php
/**
 * Tests for Plugin class.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup\Tests;

use BlaBlaBlocks_Popup\Frontend;
use BlaBlaBlocks_Popup\Plugin;
use BlaBlaBlocks_Popup\Post_Type;
use BlaBlaBlocks_Popup\Rest_Controller;
use Brain\Monkey\Actions;
use Brain\Monkey\Functions;

class PluginTest extends TestCase {

	public function test_constants_and_properties() {
		$this->assertSame( 'popup_block', Plugin::POST_TYPE );
		$this->assertSame( '_popup_block_settings', Plugin::META_KEY );
		$this->assertSame( 'blablablocks-popup/v1', Plugin::REST_NS );
		$this->assertSame( 'blablablocks-popup', Plugin::MENU_SLUG );
	}

	public function test_menu_icon_returns_valid_data_uri() {
		$icon = Plugin::menu_icon();

		$this->assertStringStartsWith( 'data:image/svg+xml;base64,', $icon );
		$base64_data = substr( $icon, strlen( 'data:image/svg+xml;base64,' ) );
		$decoded     = base64_decode( $base64_data, true );

		$this->assertNotFalse( $decoded );
		$this->assertStringContainsString( '<svg', $decoded );
		$this->assertStringContainsString( '</svg>', $decoded );
	}

	public function test_init_registers_frontend_hooks() {
		Functions\when( 'is_admin' )->justReturn( false );

		Actions\expectAdded( 'init' )
			->once()
			->with( array( Post_Type::class, 'init' ) );

		Actions\expectAdded( 'rest_api_init' )
			->once()
			->with( array( Rest_Controller::class, 'register_routes' ) );

		Actions\expectAdded( 'wp_enqueue_scripts' )
			->once()
			->with( array( Frontend::class, 'enqueue_scripts' ) );

		Actions\expectAdded( 'wp_footer' )
			->once()
			->with( array( Frontend::class, 'render_popups' ), 1 );

		Plugin::init();

		$this->assertSame( 10, has_action( 'wp_enqueue_scripts', array( Frontend::class, 'enqueue_scripts' ) ) );
	}
}
