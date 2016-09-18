Ext.define('DYNFM.controller.DynamicForm', {
	extend: 'Ext.app.Controller',

	models: ['DynamicFormData', 'States'],
	views: ['Panel', 'Form'],
	stores: ['DynamicFormData', 'States'],

	refs: [{
		ref: 'formPanel',
		selector: '#formPanel'
	}],

	init: function () {
		this.control({
			'#formPanel #add': {
				click: this.clickAdd
			},
			
			'#formPanel #deleteall': {
				click: this.clickDeleteAll
			},

			'#formPanel button[sid=delete]': {
				click: this.clickDelete
			},

			'#formPanel #load': {
				click: this.clickLoad
			},

			'#formPanel #submit': {
				click: this.clickSubmit
			}
		});

		Ext.create('DYNFM.view.Panel').show();
	},

	clickAdd: function (obj, e) {
		this.addRow('', '', '');
	},
	
	clickDeleteAll: function (obj, e) {
		obj.up('fieldcontainer').prev().removeAll();
	},

	clickDelete: function (obj, e) {
		obj.up('#edu_items').remove(obj.up('fieldcontainer').id);
	},

	clickLoad: function (obj, e) {
		var educationData = this.getDynamicFormDataStore().getAt(0).raw.education,
			first = this.getDynamicFormDataStore().getAt(0);
		
		obj.up('#formPanel').getForm().loadRecord(first);
		
		for (i = 0; i < educationData.length; i++) {			
			this.addRow(educationData[i].year, educationData[i].college, educationData[i].grade);			
		}
	},

	clickSubmit: function (obj, e) {
		obj.up('#formPanel').getForm().submit({
			url: 'data/json-form-errors.php',
			submitEmptyText: false,
			waitMsg: 'Saving Data...'
		});
	},

	addRow: function (year, college, grade) {
		this.getFormPanel().down('#edu_items').add([{
			xtype: 'fieldcontainer',
			height: 22,
			layout: 'hbox',
			defaultType: 'textfield',
			items: [{
				name: 'year[]',
				value: year,
				flex: 1
			}, {
				xtype: 'splitter'
			}, {
				name: 'college[]',
				value: college,
				flex: 2
			}, {
				xtype: 'splitter'
			}, {
				name: 'grade[]',
				value: grade,
				flex: 1
			}, {
				xtype: 'splitter'
			}, {
				xtype: 'button',
				sid: 'delete',
				text: 'Delete',
				flex: 1
			}]
		}]);
	}
});