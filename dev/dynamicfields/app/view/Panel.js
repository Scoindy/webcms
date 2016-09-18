Ext.define('DYNFM.view.Panel', {
	extend: 'Ext.panel.Panel',
	layout: 'fit',
	id: 'cpanel',
	width: 500,
	bodyStyle: 'border:none;',
	items: {
		xtype: 'formpanel'
	},
	renderTo: 'container'
});