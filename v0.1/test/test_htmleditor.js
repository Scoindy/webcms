/*******************************************************************************
* Indigo v0.2 
********************************************************************************
* Name          : dashboard.js
* Description   : renders dashboard
* Author        : Scott Walkinshaw
* Date          : 29th December 2011
* Parameters    : 
* Comments      :


  Ext.Msg.alert('Status', 'test');

********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 29 Dec 11 | Initial issue                                     *
*******************************************************************************/
function f_test() {

    v_title     = 'New Email';
    v_php       = 'email_maintenance.php';
    v_grid      = 'g_emails';
    v_form      = 'fp_email_detail';

    /****
    *  First we've got to do some specific tasks
    *  if we're looking at an existing record
    if (p_grid) {
      var v_action = 'U';

      ****
      *  Get the store used by the grid then
      *  get the record at the index from the store
      ****
      var rec = p_grid.getStore().getAt(p_index);

      ****
      *  Get the email ID
      ****
      var v_email_id = rec.get('filter_id');

    };
    ****/


    /****
    *  Form panel to hold email details
    ****/
    Ext.define('indigo.fp_editor', {
      extend         : 'Ext.Panel',
      id             : 'fp_editor',
      alias          : 'widget.fp_editor',
      title          : 'Email Editor',
      layout      : {
        type  : 'vbox',
        align : 'stretch'
      },
      frame : true,
      flex  : 1,
      items : [  
                             {
                               xtype         : 'fieldset',
                               id            : 'fp_ed_fs1',
                               title         : 'Email',
                               layout        : 'anchor',
                               defaultType   : 'textfield',
                               fieldDefaults : {
                                 labelAlign     : 'left',
                                 labelSeparator : ':'
                               },
                               items: [
                                 {
                                   xtype      : 'hiddenfield',
                                   id         : 'fp_ed1',
                                   name       : 'email_id',
                                   width      : 200,
                                   readOnly   : true
                                 },
                                 {
                                   xtype      : 'textfield',
                                   id         : 'fp_ed2',
                                   name       : 'email_name',
                                   width      : 500,
                                   readOnly   : false,
                                   allowBlank : false,
                                   maxLength  : 32,
                                   fieldLabel : 'Email Name',
/*
                                   listeners : {
                                     change : f_validate_email
                                   }
*/
                                 },
                                 {
                                   xtype      : 'textarea',
                                   id         : 'fp_ed3',
                                   name       : 'description',
                                   width      : 500,
                                   height     : 50,
                                   readOnly   : false,
                                   allowBlank : true,
                                   maxLength  : 256,
                                   fieldLabel : 'Description',
/*
                                   listeners : {
                                     change : f_validate_email
                                   }
*/
                                 }
                               ]
                             },
        {
          xtype  : 'htmleditor',
          id     : 'fpe_editor',
          flex   : 1,
           
          anchor : '100%'
/*
	plugins: [
	        new Ext.ux.form.HtmlEditor.Word(),  
	        new Ext.ux.form.HtmlEditor.Divider(),  
	        new Ext.ux.form.HtmlEditor.Table(),  
	        new Ext.ux.form.HtmlEditor.HR(),  
	        new Ext.ux.form.HtmlEditor.IndentOutdent(),  
	        new Ext.ux.form.HtmlEditor.SubSuperScript(),  
	        new Ext.ux.form.HtmlEditor.RemoveFormat() 
	],
*/
        }
      ]
    });

    /****
    *  Modal window to hold email detail
    ****/
    var w_email_detail = Ext.create('Ext.Window', {
                           id          : 'w_email_detail',
                           title       : 'Email',
                           height      : 575,
                           width       : 775,
                           resizable   : true,
                           draggable   : true,
                           modal       : true,
                           closeAction : 'destroy',
                           layout      : {
                             type  : 'vbox',
                             align : 'stretch'
                           },
                           frame       : false,
                           items:       [
                             {
                               xtype : 'fp_editor'
                             }
                           ],
                           dockedItems: [
                             {
                               xtype       : 'toolbar',
                               id          : 'edb_t_bottom',
                               name        : 'edb_t_bottom',
                               dock        : 'bottom',
                               layout      : {
                                 pack: 'center'
                               },
                               items: [
                                 {
                                   xtype     : 'button',
                                   id        : 'edb_save',
                                   width     : 80,
                                   disabled  : true,
                                   frame     : true,
                                   border    : true,
                                   type      : 'submit',
                                   scale     : 'medium',
                                   text      : 'Save',
                                   icon      : 'icons/save_blue_24.png',
                                   iconAlign : 'top',
                                   cls       : 'x-btn-text-icon',
                                   handler   : function() {

                                     /****
                                     *  Submit the form for an insert or update
                                     ****/
                                     if (Ext.getCmp('fp_ed1').value) {

                                       f_submit_form (
                                         'U',
                                         'w_email_detail',
                                         v_grid,
                                         v_form,
                                         v_php,
                                         'fp_ed1',
                                         '',
                                         'Y'
                                       );
                                     } else {
                                       f_submit_form (
                                         'I',
                                         'w_email_detail',
                                         v_grid,
                                         v_form,
                                         v_php,
                                         'fp_ed1',
                                         '',
                                         'N'
                                       );
                                     };

                                     /****
                                     *  Enable the delete button once saved
                                     ****/
                                     Ext.getCmp('edb_delete').enable(true);
                                   }
                                 },
                                 {
                                   xtype     : 'button',
                                   id        : 'edb_delete',
                                   width     : 80,
                                   disabled  : true,
                                   frame     : true,
                                   border    : true,
                                   type      : 'submit',
                                   scale     : 'medium',
                                   text      : 'Delete',
                                   icon      : 'icons/trash_red_24.png',
                                   iconAlign : 'top',
                                   cls       : 'x-btn-text-icon',
                                   handler   : function() {

                                     f_submit_form (
                                       'D',
                                       'w_email_detail',
                                       v_grid,
                                       v_form,
                                       v_php,
                                       'fp_ed1',
                                       '',
                                       'Y'
                                     );
                                   }
                                 }
                               ]
                             }
                           ]
                         });

    /****
    *  Open the window
    ****/
    w_email_detail.show();

};

Ext.onReady(f_test);

