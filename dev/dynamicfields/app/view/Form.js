Ext.define('DYNFM.view.Form', {
	extend: 'Ext.form.Panel',
	title: 'Dynamic Form Fields',
	alias: 'widget.formpanel',
	id: 'formPanel',
	renderTo: 'container',
	frame: true,
	width: 500,
	bodyPadding: 5,
	fieldDefaults: {
		labelAlign: 'right',
		labelWidth: 85,
		msgTarget: 'side',
		anchor: '100%'
	},
	defaultType: 'textfield',
	requires: ['Ext.form.FieldSet', 
			   'Ext.form.FieldContainer', 
			   'Ext.form.field.Display', 
			   'Ext.form.field.Date', 
			   'Ext.form.field.ComboBox', 
			   'Ext.resizer.Splitter'],

	initComponent: function () {
		Ext.apply(this, {
			items: [{
				fieldLabel: 'First Name',
				emptyText: 'First Name',
				name: 'first'
			}, {
				fieldLabel: 'Last Name',
				emptyText: 'Last Name',
				name: 'last'
			}, {
				fieldLabel: 'Company',
				name: 'company'
			}, {
				fieldLabel: 'Email',
				name: 'email',
				vtype: 'email'
			}, {
				xtype: 'fieldset',
				title: 'Education:',
				layout: 'anchor',
				items: [{
					xtype: 'fieldcontainer',
					layout: 'anchor',
					margin: '0',
					items: [{
						xtype: 'fieldcontainer',
						height: 15,
						layout: 'hbox',
						items: [{
							xtype: 'displayfield',
							value: 'Year:',
							flex: 1
						}, {
							xtype: 'splitter'
						}, {
							xtype: 'displayfield',
							value: 'College:',
							flex: 2
						}, {
							xtype: 'splitter'
						}, {
							xtype: 'displayfield',
							value: 'Grade:',
							flex: 1
						}, {
							xtype: 'splitter'
						}, {
							xtype: 'displayfield',
							value: '',
							flex: 1
						}]
					}]
				}, {
					xtype: 'fieldcontainer',
					layout: 'anchor',
					id: 'edu_items',
					margin: '0',
					items: []
				}, {
					xtype: 'fieldcontainer',
					layout: 'hbox',
					items: [{
						xtype: 'button',
						id: 'add',
						text: 'Add',
						flex: 1
					}, {
						xtype: 'splitter'
					}, {
						xtype: 'button',
						id: 'deleteall',
						text: 'Delete All',
						flex: 1
					}, {
						xtype: 'splitter'
					}, {
						xtype: 'splitter'
					}, {
						xtype: 'displayfield',
						value: '',
						flex: 3
					}]
				}]
			}, {
				xtype: 'combobox',
				fieldLabel: 'State',
				name: 'state',
				store: 'States',
				queryMode: 'local',
				displayField: 'state',
				valueField: 'abbr',
				typeAhead: true,
				emptyText: 'Select a state...'
			}, {
				xtype: 'datefield',
				fieldLabel: 'Date of Birth',
				name: 'dob',
				allowBlank: false
			}],

			buttons: [{
				text: 'Load',
				id: 'load'
			}, {
				text: 'Submit',
				id: 'submit',
				disabled: true,
				formBind: true
			}]
		});

		this.callParent(arguments);
	}
});