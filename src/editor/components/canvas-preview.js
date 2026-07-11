/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { config, metaKey } from '../config/wordpress';
import { mergeSettings } from '../utils/settings';
import {
	canvasPreviewVariables,
	getCanvasPreviewVariables,
} from '../utils/canvas-preview';

const canvasClassName = 'blablablocks-popup-editor-canvas';
const animatingCanvasClassName = 'blablablocks-popup-editor-canvas--animating';

const getEditorCanvases = ( document ) => {
	const canvases = [];

	if ( document.body?.classList.contains( 'editor-styles-wrapper' ) ) {
		canvases.push( document.body );
	}

	document.querySelectorAll( '.editor-styles-wrapper' ).forEach( ( element ) => {
		if ( ! canvases.includes( element ) ) {
			canvases.push( element );
		}
	} );

	return canvases;
};

const getEditorDocuments = () => {
	const documents = [ window.document ];
	const iframes = window.document.querySelectorAll( 'iframe' );

	iframes.forEach( ( iframe ) => {
		if ( iframe.contentDocument ) {
			documents.push( iframe.contentDocument );
		}
	} );

	return documents;
};

const applyPreviewVariables = ( canvas, variables, settings ) => {
	canvas.classList.add( canvasClassName );
	canvas.dataset.popupEntranceAnimation = settings.layout?.entranceAnimation || 'fade';

	Object.entries( variables ).forEach( ( [ property, value ] ) => {
		canvas.style.setProperty( property, value );
	} );
};

const clearPreviewVariables = ( canvas ) => {
	canvas.classList.remove( canvasClassName );
	canvas.classList.remove( animatingCanvasClassName );
	delete canvas.dataset.popupEntranceAnimation;

	canvasPreviewVariables.forEach( ( property ) => {
		canvas.style.removeProperty( property );
	} );
};

const replayPreviewAnimation = ( canvas, settings ) => {
	const duration = Number( settings.layout?.animationDuration || 0.3 ) * 1000;

	canvas.classList.remove( animatingCanvasClassName );
	void canvas.offsetHeight; // Force a style flush so changing controls can replay the preview.
	canvas.classList.add( animatingCanvasClassName );

	window.setTimeout( () => {
		canvas.classList.remove( animatingCanvasClassName );
	}, Math.max( 120, duration + 100 ) );
};

/**
 * Keeps the block editor canvas visually aligned with the popup settings.
 */
export function CanvasPreview() {
	const lastAnimationSignature = useRef( '' );
	const postType = useSelect(
		( select ) => select( 'core/editor' ).getCurrentPostType(),
		[]
	);
	const meta = useSelect(
		( select ) => select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {},
		[]
	);

	useEffect( () => {
		if ( postType !== config.postType ) {
			return undefined;
		}

		const settings = mergeSettings( meta[ metaKey ] );
		const variables = getCanvasPreviewVariables( settings );
		const animationSignature = [
			settings.layout?.entranceAnimation || 'fade',
			settings.layout?.animationDuration || 0.3,
		].join( ':' );
		const shouldReplayAnimation = animationSignature !== lastAnimationSignature.current;
		let hasReplayedAnimation = false;

		lastAnimationSignature.current = animationSignature;

		const appliedCanvases = new Set();

		const syncPreview = () => {
			getEditorDocuments()
				.flatMap( getEditorCanvases )
				.forEach( ( canvas ) => {
					appliedCanvases.add( canvas );
					applyPreviewVariables( canvas, variables, settings );

					if ( shouldReplayAnimation && ! hasReplayedAnimation ) {
						replayPreviewAnimation( canvas, settings );
					}
				} );

			hasReplayedAnimation = hasReplayedAnimation || shouldReplayAnimation;
		};

		syncPreview();

		const observer = new window.MutationObserver( syncPreview );
		observer.observe( window.document.body, { childList: true, subtree: true } );

		const interval = window.setInterval( syncPreview, 500 );

		return () => {
			observer.disconnect();
			window.clearInterval( interval );
			appliedCanvases.forEach( clearPreviewVariables );
		};
	}, [ meta, postType ] );

	return null;
}
