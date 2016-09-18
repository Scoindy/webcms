Ext.define('DYNFM.model.DynamicFormData', {
	extend: 'Ext.data.Model',

	fields: ['id', 'parent_id',
	{
		name: 'first',
		mapping: 'name.first'
	}, {
		name: 'last',
		mapping: 'name.last'
	}, 'company', 'email', 'state',
	{
		name: 'dob',
		type: 'date',
		dateFormat: 'm/d/Y'
	}]
});