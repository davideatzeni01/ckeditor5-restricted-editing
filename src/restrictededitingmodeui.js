/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module restricted-editing/restrictededitingmodeui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import lockIcon from '../theme/icons/contentlock.svg';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

/**
 * The Restricted Editing Mode UI feature.
 *
 * It introduces the `'restrictedEditing'` dropdown that offers tools to navigate exceptions across
 * the document.
 *
 * @extends module:core/plugin~Plugin
 */
export default class RestrictedEditingModeUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'RestrictedEditingModeUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'restrictedEditing', locale => {
			const dropdownView = createDropdown( locale );
			const listItems = new Collection();

			listItems.add( this._getButtonDefinition(
				'goToPreviousRestrictedEditingException',
				t( 'Previous editable region' ),
				'Shift+Tab'
			) );
			listItems.add( this._getButtonDefinition(
				'goToNextRestrictedEditingException',
				t( 'Next editable region' ),
				'Tab'
			) );

			addListToDropdown( dropdownView, listItems );

			dropdownView.buttonView.set( {
				label: t( 'Navigate editable regions' ),
				icon: lockIcon,
				tooltip: true,
				isEnabled: true,
				isOn: false
			} );

			this.listenTo( dropdownView, 'execute', evt => {
				editor.execute( evt.source._commandName );
				editor.editing.view.focus();
			} );

			return dropdownView;
		} );
	}

	/**
	 * Returns a definition of the navigation button to be used in the dropdown.
	 *
	 * @private
	 * @param {String} commandName Name of the command the button represents.
	 * @param {String} label Translated label of the button.
	 * @param {String} keystroke Keystroke of the button.
	 * @returns {module:ui/dropdown/utils~ListDropdownItemDefinition}
	 */
	_getButtonDefinition( commandName, label, keystroke ) {
		const editor = this.editor;
		const command = editor.commands.get( commandName );
		const definition = {
			type: 'button',
			model: new Model( {
				label,
				withText: true,
				keystroke,
				withKeystroke: true,
				_commandName: commandName
			} )
		};

		definition.model.bind( 'isEnabled' ).to( command, 'isEnabled' );

		return definition;
	}
}
