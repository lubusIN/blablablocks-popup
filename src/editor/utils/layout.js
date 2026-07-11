/**
 * Convert layout settings into AlignmentMatrixControl's expected value.
 */
export const getPositionValue = ( layout ) => {
	const vertical = layout.vertical || 'center';
	const horizontal = layout.horizontal || 'center';

	return `${ vertical } ${ horizontal }`;
};

/**
 * Convert AlignmentMatrixControl's value back into layout settings.
 */
export const parsePositionValue = ( value ) => {
	const [ vertical = 'center', horizontal = 'center' ] = String( value || 'center center' ).split( ' ' );

	return { horizontal, vertical };
};

export const getDimensionMode = ( value, type ) => {
	if ( 'height' === type && ( ! value || 'auto' === value ) ) {
		return 'fit';
	}

	if ( 'width' === type && ( ! value || 'fit-content' === value || 'auto' === value ) ) {
		return 'fit';
	}

	if ( '100%' === value ) {
		return 'grow';
	}

	return 'fixed';
};

export const getFixedDimensionValue = ( value, type ) => {
	if ( 'fixed' === getDimensionMode( value, type ) ) {
		return value;
	}

	return 'height' === type ? '480px' : '640px';
};

export const getDimensionValue = ( mode, fixedValue, type ) => {
	if ( 'fit' === mode ) {
		return 'height' === type ? 'auto' : 'fit-content';
	}

	if ( 'grow' === mode ) {
		return '100%';
	}

	return fixedValue;
};
