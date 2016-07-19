/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import StandardEditor from '../editor/standardeditor.js';

import HtmlDataProcessor from '../engine/dataprocessor/htmldataprocessor.js';

import ClassicEditorUI from './classiceditorui.js';
import BoxedEditorUIView from '../ui/editorui/boxed/boxededitoruiview.js';

import ElementReplacer from '../utils/elementreplacer.js';

/**
 * Classic editor. Uses inline editable and sticky toolbar, all
 * enclosed in a boxed UI.
 *
 * @memberOf editor-classic
 * @extends ckeditor5.editor.StandardEditor
 */
export default class ClassicEditor extends StandardEditor {
	/**
	 * Creates an instance of the classic editor.
	 *
	 * @param {HTMLElement} element The DOM element that will be the source for the created editor.
	 * The data will be loaded from it and loaded back to it once the editor is destroyed.
	 * @param {Object} config The editor config.
	 */
	constructor( element, config ) {
		super( element, config );

		this.document.createRoot();

		this.editing.createRoot( 'div' );

		this.data.processor = new HtmlDataProcessor();

		this.ui = new ClassicEditorUI( this );
		this.ui.view = new BoxedEditorUIView( this.locale );

		/**
		 * The element replacer instance used to hide editor element.
		 *
		 * @protected
		 * @member {utils.ElementReplacer} editor-classic.Classic#_elementReplacer
		 */
		this._elementReplacer = new ElementReplacer();
	}

	/**
	 * Destroys the editor instance, releasing all resources used by it.
	 *
	 * Updates the original editor element with the data.
	 *
	 * @returns {Promise}
	 */
	destroy() {
		this.updateEditorElement();
		this._elementReplacer.restore();

		return this.ui.destroy()
			.then( () => super.destroy() );
	}

	/**
	 * Creates a classic editor instance.
	 *
	 *		ClassicEditor.create( document.querySelector( '#editor' ), {
	 *			features: [ 'delete', 'enter', 'typing', 'paragraph', 'undo', 'basic-styles/bold', 'basic-styles/italic' ],
	 *			toolbar: [ 'bold', 'italic', 'undo', 'redo' ]
	 *		} )
	 *		.then( editor => {
	 *			console.log( 'Editor was initialized', editor );
	 *		} )
	 *		.catch( err => {
	 *			console.error( err.stack );
	 *		} );
	 *
	 * @param {HTMLElement} element See {@link ckeditor5.editor.ClassicEditor#constructor}'s param.
	 * @param {Object} config See {@link ckeditor5.editor.ClassicEditor#constructor}'s param.
	 * @returns {Promise} Promise resolved once editor is ready.
	 * @returns {ckeditor5.editor.StandardEditor} return.editor The editor instance.
	 */
	static create( element, config ) {
		return new Promise( ( resolve ) => {
			const editor = new ClassicEditor( element, config );

			resolve(
				editor.initPlugins()
					.then( () => editor._elementReplacer.replace( element, editor.ui.view.element ) )
					.then( () => editor.ui.init() )
					.then( () => editor.editing.view.attachDomRoot( editor.ui.editableElement ) )
					.then( () => editor.loadDataFromEditorElement() )
					.then( () => editor )
			);
		} );
	}
}
