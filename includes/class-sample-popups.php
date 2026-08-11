<?php

/**
 * Sample popup creation.
 *
 * @package BlaBlaBlocksPopup
 */

namespace BlaBlaBlocks_Popup;

use WP_Error;

if (! defined('ABSPATH')) {
	exit;
}

/**
 * Creates a realistic set of draft popups for evaluation and testing.
 */
final class Sample_Popups
{
	/**
	 * Create every sample popup as a draft.
	 *
	 * The operation is rolled back when any insert fails, so the user never
	 * receives a partial sample set.
	 *
	 * @return array|WP_Error Created posts, or an insertion error.
	 */
	public static function create()
	{
		$created_ids = array();
		$posts       = array();

		foreach (self::definitions() as $definition) {
			$post_id = wp_insert_post(
				array(
					'post_type'    => Plugin::POST_TYPE,
					'post_title'   => $definition['title'],
					'post_status'  => 'draft',
					'post_author'  => get_current_user_id(),
					'post_content' => $definition['content'],
				),
				true
			);

			if (is_wp_error($post_id)) {
				self::rollback($created_ids);
				return $post_id;
			}

			$created_ids[] = $post_id;
			update_post_meta(
				$post_id,
				Plugin::META_KEY,
				Settings::sanitize($definition['settings'])
			);
			$posts[] = get_post($post_id);
		}

		return $posts;
	}

	/**
	 * Sample definitions with varied content, presentation, and triggers.
	 *
	 * @return array
	 */
	private static function definitions()
	{
		return array(
			array(
				'title'    => __('Welcome Discount', 'blablablocks-popup'),
				'content'  => self::content(
					__('Save 20% on your first order', 'blablablocks-popup'),
					__(
						'Join our list and receive a welcome code for your next purchase.',
						'blablablocks-popup'
					),
					__('Get my discount', 'blablablocks-popup')
				),
				'settings' => array(
					'layout'  => array(
						'width'             => '620px',
						'entranceAnimation' => 'zoom',
						'exitAnimation'     => 'fade',
					),
					'style'   => array(
						'popupBackground' => '#ffffff',
						'borderRadius'    => '12px',
						'padding'         => '40px',
					),
					'triggers' => array(
						'pageLoad'      => true,
						'pageLoadDelay' => 2,
					),
					'rules'    => array(
						'maxDisplays'      => true,
						'maxDisplaysCount' => 2,
					),
				),
			),
			array(
				'title'    => __('Newsletter Slide-in', 'blablablocks-popup'),
				'content'  => self::content(
					__('Useful ideas, once a week', 'blablablocks-popup'),
					__(
						'Get practical articles and product updates delivered to your inbox.',
						'blablablocks-popup'
					),
					__('Subscribe', 'blablablocks-popup')
				),
				'settings' => array(
					'layout'  => array(
						'width'             => '420px',
						'horizontal'        => 'right',
						'vertical'          => 'center',
						'entranceAnimation' => 'slide-left',
						'exitAnimation'     => 'slide-right',
					),
					'style'   => array(
						'popupBackground' => '#f6f7f7',
						'borderRadius'    => '8px',
						'padding'         => '32px',
					),
					'triggers' => array(
						'pageLoad'        => false,
						'scroll'          => true,
						'scrollDirection' => 'down',
						'scrollAmount'    => 45,
					),
					'rules'    => array(
						'devices' => array('desktop', 'tablet'),
					),
				),
			),
			array(
				'title'    => __('Free Shipping Bar', 'blablablocks-popup'),
				'content'  => self::content(
					__('Free shipping this weekend', 'blablablocks-popup'),
					__('Orders over $50 ship free through Sunday.', 'blablablocks-popup')
				),
				'settings' => array(
					'layout'     => array(
						'width'             => '100%',
						'horizontal'        => 'center',
						'vertical'          => 'top',
						'overlay'           => false,
						'entranceAnimation' => 'slide-down',
						'exitAnimation'     => 'slide-up',
					),
					'style'      => array(
						'popupBackground' => '#f0f6fc',
						'closeColor'      => '#1e1e1e',
						'borderRadius'    => '0px',
						'padding'         => '16px 24px',
					),
					'conditions' => array(
						'includeEntireSite' => false,
						'includeFrontPage'  => true,
					),
					'triggers'   => array(
						'pageLoad' => true,
					),
				),
			),
			array(
				'title'    => __('Exit Intent Offer', 'blablablocks-popup'),
				'content'  => self::content(
					__('Before you go', 'blablablocks-popup'),
					__(
						'Take another look and save your favorites for later.',
						'blablablocks-popup'
					),
					__('Continue browsing', 'blablablocks-popup')
				),
				'settings' => array(
					'layout'  => array(
						'width'             => '560px',
						'entranceAnimation' => 'flip-up',
						'exitAnimation'     => 'fade',
					),
					'style'   => array(
						'popupBackground'   => '#fff8e5',
						'overlayBackground' => 'rgba(30,30,30,0.68)',
						'borderRadius'      => '10px',
					),
					'triggers' => array(
						'pageLoad'  => false,
						'exitIntent' => true,
					),
					'rules'    => array(
						'devices' => array('desktop'),
					),
				),
			),
			array(
				'title'    => __('Order Update Toast', 'blablablocks-popup'),
				'content'  => self::content(
					__('Order confirmed', 'blablablocks-popup'),
					__(
						'Your order is being prepared. We will send tracking details soon.',
						'blablablocks-popup'
					)
				),
				'settings' => array(
					'layout'   => array(
						'width'             => '360px',
						'horizontal'        => 'right',
						'vertical'          => 'bottom',
						'overlay'           => false,
						'entranceAnimation' => 'slide-up',
						'exitAnimation'     => 'slide-down',
					),
					'style'    => array(
						'popupBackground' => '#edfaef',
						'borderRadius'    => '8px',
						'padding'         => '20px',
					),
					'advanced' => array(
						'autoClose' => 6,
					),
					'triggers' => array(
						'pageLoad'          => false,
						'inactivity'        => true,
						'inactivitySeconds' => 8,
					),
				),
			),
		);
	}

	/**
	 * Build valid block markup for a sample popup.
	 *
	 * @param string $heading Heading text.
	 * @param string $body    Body text.
	 * @param string $button  Optional button text.
	 * @return string
	 */
	private static function content($heading, $body, $button = '')
	{
		$content = '<!-- wp:group {"layout":{"type":"constrained"}} --><div class="wp-block-group">';
		$content .= '<!-- wp:heading --><h2 class="wp-block-heading">' . esc_html($heading) . '</h2><!-- /wp:heading -->';
		$content .= '<!-- wp:paragraph --><p>' . esc_html($body) . '</p><!-- /wp:paragraph -->';

		if ('' !== $button) {
			$content .= '<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button">' . esc_html($button) . '</a></div><!-- /wp:button --></div><!-- /wp:buttons -->';
		}

		return $content . '</div><!-- /wp:group -->';
	}

	/**
	 * Permanently remove a partially-created sample set.
	 *
	 * @param int[] $post_ids Created post IDs.
	 */
	private static function rollback(array $post_ids)
	{
		foreach ($post_ids as $post_id) {
			wp_delete_post($post_id, true);
		}
	}
}
