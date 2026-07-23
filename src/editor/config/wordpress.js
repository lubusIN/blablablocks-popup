/**
 * WordPress globals and PHP-injected editor configuration.
 */
export const config = window.BlaBlaBlocksPopupEditor || {};
export const defaults = config.defaults || {};
export const metaKey = config.metaKey || '_popup_block_settings';
export const pluginUrl = config.pluginUrl || '';

export const PluginSidebar = window.wp?.editor?.PluginSidebar || window.wp?.editPost?.PluginSidebar;
export const PluginPostStatusInfo = window.wp?.editor?.PluginPostStatusInfo || window.wp?.editPost?.PluginPostStatusInfo;
export const registerPlugin = window.wp?.plugins?.registerPlugin;
export const BlockIcon = window.wp?.blockEditor?.BlockIcon;
export const PanelColorSettings = window.wp?.blockEditor?.PanelColorSettings;
export const BorderRadiusControl = window.wp?.blockEditor?.__experimentalBorderRadiusControl;
export const SpacingSizesControl = window.wp?.blockEditor?.__experimentalSpacingSizesControl;
export const UnitControl = window.wp?.blockEditor?.__experimentalUnitControl || window.wp?.components?.__experimentalUnitControl;
export const useMultipleOriginColorsAndGradients = window.wp?.blockEditor?.__experimentalUseMultipleOriginColorsAndGradients || ( () => ( {} ) );
