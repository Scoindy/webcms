Ext.define('DYNFM.store.States', {
	extend: 'Ext.data.Store',
	model: 'DYNFM.model.States',
	autoLoad: true,

	proxy: {
		type: 'ajax',
		api: {
			read: 'data/states.json'
		},
		reader: {
			type: 'json',
			root: 'states',
			successProperty: 'success'
		}
	}
});