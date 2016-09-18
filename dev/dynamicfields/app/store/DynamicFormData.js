Ext.define('DYNFM.store.DynamicFormData', {
	extend: 'Ext.data.Store',
	model: 'DYNFM.model.DynamicFormData',
	autoLoad: true,

	proxy: {
		type: 'ajax',
		api: {
			read: 'data/json-form-data.json'
		},
		reader: {
			type: 'json',
			root: 'contact',
			successProperty: 'success'
		}
	},

	associations: [{
		type: 'hasMany',
		model: 'DYNFM.model.DynamicFormData',
		primaryKey: 'id',
		foreignKey: 'parent_id',
		autoLoad: true,
		associationKey: 'education'
	}, {
		type: 'belongsTo',
		model: 'DYNFM.model.DynamicFormData',
		primaryKey: 'id',
		foreignKey: 'parent_id',
		autoLoad: true,
		associationKey: 'parent_group'
	}]
});