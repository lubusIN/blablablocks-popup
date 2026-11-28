<?php
/**
 * Base PHPUnit test case.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup\Tests;

use Brain\Monkey;
use Mockery;
use Yoast\PHPUnitPolyfills\TestCases\TestCase as PolyfillTestCase;

abstract class TestCase extends PolyfillTestCase {

	protected function set_up(): void {
		parent::set_up();
		Monkey\setUp();
	}

	protected function tear_down(): void {
		Monkey\tearDown();
		Mockery::close();
		parent::tear_down();
	}
}
