const { test, expect } = require( '@playwright/test' );

const adminPath = '/wp-admin/admin.php?page=blablablocks-popup';
const popupRestPath = '/wp-json/blablablocks-popup/v1/popups';
const expectedWordPressVersion = process.env.WP_VERSION || '6.9';

async function getRestNonce( page ) {
	await page.goto( adminPath );
	await expect(
		page.getByRole( 'heading', { name: 'BlaBlaBlocks Popup' } )
	).toBeVisible();
	await expect(
		page
			.locator( `script[src*="ver=${ expectedWordPressVersion }"]` )
			.first()
	).toBeAttached();

	return page.evaluate( () => window.BlaBlaBlocksPopupAdmin.nonce );
}

async function restRequest( page, nonce, path, options = {} ) {
	const response = await page.request.fetch( path, {
		...options,
		headers: {
			'X-WP-Nonce': nonce,
			...( options.headers || {} ),
		},
	} );

	expect(
		response.ok(),
		`${ options.method || 'GET' } ${ path } returned ${ response.status() }`
	).toBeTruthy();

	return response.json();
}

async function clearPopups( page, nonce ) {
	const popups = await restRequest( page, nonce, popupRestPath );

	await Promise.all(
		popups.map( ( popup ) =>
			restRequest(
				page,
				nonce,
				`${ popupRestPath }/${ popup.id }?force=true`,
				{ method: 'DELETE' }
			)
		)
	);
}

async function createPopup( page, nonce, title ) {
	return restRequest( page, nonce, popupRestPath, {
		method: 'POST',
		data: { title },
	} );
}

async function openRowAction( page, title, action ) {
	const row = page.getByRole( 'row' ).filter( { hasText: title } );

	await expect( row ).toBeVisible();
	await row.getByRole( 'button', { name: 'Actions' } ).click();
	await page.getByRole( 'menuitem', { name: action, exact: true } ).click();
}

const getSnackbar = ( page, message ) =>
	page
		.locator( '.components-snackbar__content' )
		.filter( { hasText: message } );

test.beforeEach( async ( { page } ) => {
	const nonce = await getRestNonce( page );
	await clearPopups( page, nonce );
} );

test( 'creates a popup and applies a starter variation', async ( { page } ) => {
	await page.goto( adminPath );
	await expect(
		page.getByRole( 'heading', { name: 'No Popups' } )
	).toBeVisible();
	await expect(
		page.getByRole( 'button', { name: 'Add Popup' } )
	).toHaveCount( 1 );

	await page.getByRole( 'button', { name: 'Add Popup' } ).click();
	const createDialog = page.getByRole( 'dialog', {
		name: 'Draft new: Popup',
	} );
	await createDialog
		.getByRole( 'textbox', { name: 'Title' } )
		.fill( 'Launch offer' );
	await createDialog.getByRole( 'button', { name: 'Create Popup' } ).click();

	await expect( page ).toHaveURL( /post\.php\?post=\d+&action=edit/ );
	const variationDialog = page.getByRole( 'dialog', {
		name: 'Choose popup type',
	} );
	await expect( variationDialog ).toBeVisible();
	await variationDialog
		.getByRole( 'button', { name: /Modal Popup/ } )
		.click();
	await expect( variationDialog ).toBeHidden();
	await expect(
		page
			.frameLocator( 'iframe[name="editor-canvas"]' )
			.getByText( 'Popup headline', { exact: true } )
	).toBeVisible();
} );

test( 'saves settings without closing the modal', async ( { page } ) => {
	const nonce = await getRestNonce( page );
	await createPopup( page, nonce, 'Settings test' );
	await page.goto( adminPath );

	await openRowAction( page, 'Settings test', 'Settings' );
	const settingsDialog = page.getByRole( 'dialog', {
		name: 'Settings: Settings test',
	} );
	const escapeToggle = settingsDialog.getByRole( 'checkbox', {
		name: 'Prevent ESC close',
	} );

	await escapeToggle.check();
	await settingsDialog
		.getByRole( 'button', { name: 'Save settings' } )
		.click();
	await expect( settingsDialog ).toBeVisible();
	await expect( getSnackbar( page, 'Popup settings saved.' ) ).toBeVisible();
	await settingsDialog.getByRole( 'button', { name: 'Close' } ).click();

	await openRowAction( page, 'Settings test', 'Settings' );
	await expect(
		page
			.getByRole( 'dialog', { name: 'Settings: Settings test' } )
			.getByRole( 'checkbox', { name: 'Prevent ESC close' } )
	).toBeChecked();
} );

test( 'moves a popup to Trash and restores it', async ( { page } ) => {
	const nonce = await getRestNonce( page );
	await createPopup( page, nonce, 'Restore test' );
	await page.goto( adminPath );

	await openRowAction( page, 'Restore test', 'Trash' );
	const confirmDialog = page.getByRole( 'dialog' );
	await expect( confirmDialog ).toContainText(
		'Are you sure you want to move "Restore test" to the trash?'
	);
	await confirmDialog.getByRole( 'button', { name: 'Trash' } ).click();
	await expect( getSnackbar( page, 'Popup moved to Trash.' ) ).toBeVisible();
	await expect(
		page.getByRole( 'cell', { name: 'Restore test' } )
	).toHaveCount( 0 );

	await page.getByRole( 'button', { name: /Add filter/ } ).click();
	await page.getByRole( 'menuitem', { name: 'Status' } ).click();
	await page.getByRole( 'option', { name: 'Trash', exact: true } ).click();
	await openRowAction( page, 'Restore test', 'Restore' );
	await expect( getSnackbar( page, 'Popup restored.' ) ).toBeVisible();
} );

test( 'opens an accessible frontend dialog and restores focus', async ( {
	page,
} ) => {
	const nonce = await getRestNonce( page );
	const popup = await createPopup( page, nonce, 'Accessible offer' );

	await restRequest( page, nonce, `${ popupRestPath }/${ popup.id }`, {
		method: 'PUT',
		data: {
			status: 'publish',
			settings: {
				advanced: {
					disableScroll: true,
					openSelectors: '.e2e-popup-trigger',
					preventEscClose: false,
				},
				conditions: { includeEntireSite: true },
				triggers: { pageLoad: false },
			},
		},
	} );

	const testPage = await restRequest( page, nonce, '/wp-json/wp/v2/pages', {
		method: 'POST',
		data: {
			title: 'Popup accessibility test',
			content:
				'<button type="button" class="e2e-popup-trigger">Open popup</button>',
			status: 'publish',
		},
	} );

	await page.goto( testPage.link );
	const trigger = page.getByRole( 'button', { name: 'Open popup' } );
	const dialog = page.getByRole( 'dialog', { name: 'Accessible offer' } );

	await trigger.focus();
	await trigger.click();
	await expect( dialog ).toBeVisible();
	await expect( page.locator( 'html' ) ).toHaveClass(
		/blablablocks-popup-scroll-locked/
	);
	await expect(
		dialog.getByRole( 'button', { name: 'Close popup' } )
	).toBeFocused();

	await page.keyboard.press( 'Tab' );
	await expect(
		dialog.getByRole( 'button', { name: 'Close popup' } )
	).toBeFocused();
	await page.keyboard.press( 'Escape' );
	await expect( dialog ).toBeHidden();
	await expect( trigger ).toBeFocused();
	await expect( page.locator( 'html' ) ).not.toHaveClass(
		/blablablocks-popup-scroll-locked/
	);
} );
