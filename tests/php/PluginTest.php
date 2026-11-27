<?php
/**
 * Tests for Plugin class.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup\Tests;

use BlaBlaBlocks_Popup\Plugin;

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
}
