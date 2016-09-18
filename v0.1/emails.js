/*******************************************************************************
* Indigo
********************************************************************************
* Name          : emails.js
* Description   : handles emails
* Author        : Scott Walkinshaw
* Date          : 5th January 2012
* Parameters    : 
* Comments      :

  Ext.Msg.alert('Status', 'test');

********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 05 Jan 12 | Initial issue                                     *
*******************************************************************************/
function f_emails() {

  /****
  *  f_select_template
  ****/
  function f_select_template() {

    /****
    *  Selection window
    ****/
    var w_template = Ext.create('Ext.Window', {
                       id          : 'w_template',
                       title       : 'Template or Ad-hoc email?',
                       height      : 150,
                       width       : 250,
                       resizable   : false,
                       draggable   : true,
                       modal       : true,
                       closeAction : 'destroy',
                       layout      : 'fit',
                       frame       : false,
                       items       : [
                         {
                           xtype  : 'form',
                           id     : 'wt_form',
                           frame  : true,
                           items  : [ 
                             {
                               xtype          : 'combobox',
                               id             : 'wt_templates',
                               store          : s_templates,
                               valueField     : 'template_id',
                               displayField   : 'template_name',
                               value          : 'template_name',
                               typeAhead      : true,
                               queryMode      : 'local',
                               forceSelection : true,
                               emptyText      : 'select',
                               style          : 'margin : 15 20 15 40',  // top right bottom left
                               listeners : {
                                 change : function() {
                                            f_validate_form (
                                              'wt_form',
                                              'ts_template'
                                            )
                                          }
                               }
                             }
                           ]
                         }
                       ],
                       dockedItems: [
                         {
                           xtype       : 'toolbar',
                           id          : 'ts_t_bottom',
                           name        : 'ts_t_bottom',
                           dock        : 'bottom',
                           layout      : {
                             pack: 'center'
                           },
                           items: [
                             {
                               xtype     : 'button',
                               id        : 'ts_template',
                               width     : 80,
                               frame     : true,
                               border    : true,
                               type      : 'submit',
                               scale     : 'medium',
                               text      : 'Template',
                               disabled  : true,
                               icon      : 'icons/wizard_blue_24.png',
                               iconAlign : 'top',
                               cls       : 'x-btn-text-icon',
                               handler   : function() {

                                 /****
                                 *  Get template store record
                                 ****/
                                 var v_i = Ext.getCmp('wt_templates').getValue();
 
                                 /****
                                 *  And insert the template
                                 ****/
                                 v_i          = Number(--v_i);
                                 var v_record = s_templates.getAt(v_i);
                                 var v_html   = v_record.get('html');
                                 var v_temp   = v_record.get('template_id');

                                 /****
                                 *  Close the window
                                 ****/
                                 Ext.getCmp('w_template').destroy();

                                 /****
                                 *  Show the detail window
                                 ****/
                                 Ext.getCmp('w_email_detail').show();

                                 /****
                                 *  Add the template - thankfully the detail
                                 *  window renders quickly enough
                                 ****/
                                 Ext.getCmp('fp_ed_body').setValue(v_html);
                                
                                 /****
                                 *  Also add the template ID
                                 ****/
                                 Ext.getCmp('fp_ed6').setValue(v_temp);

                               }
                             },
                             {
                               xtype     : 'button',
                               id        : 'ts_adhoc',
                               width     : 80,
                               frame     : true,
                               border    : true,
                               type      : 'submit',
                               scale     : 'medium',
                               text      : 'Ad-hoc',
                               icon      : 'icons/write_message_blue_24.png',
                               iconAlign : 'top',
                               cls       : 'x-btn-text-icon',
                               handler   : function() {

                                 /****
                                 *  Close the window
                                 ****/
                                 Ext.getCmp('w_template').destroy();
                                
                                 /****
                                 *  Show the detail window
                                 ****/
                                 Ext.getCmp('w_email_detail').show();

                               }
                             }
                           ]
                         }
                       ]
                    });
    w_template.show();
  };

  /****
  *  Function    : f_view_email
  *  Description : opens the email in a new window
  ****/
  var f_view_email = function f_view_email (
             p_callback
           ) {


    if ( p_callback == 'N' ) {

      /****
      *  Submit the form
      ****/
      f_submit_form (
        'V',
        'w_email_detail',
        'g_email',
        'fp_email_detail',
        'email_maintenance.php',
        'fp_ed16',
        'f_view_email',
        'N'
      );

    } else {

      /****
      *  Pop open an window for the html
      ****/
      var w_view_email1 = Ext.create('Ext.Window', {
                           id          : 'w_view_email1',
                           title       : 'Email View',
                           height      : 600,
                           width       : 900,
                           resizable   : true,
                           draggable   : true,
                           autoScroll  : true,
                           modal       : true,
                           closeAction : 'destroy',
                           layout      : {
                             type  : 'fit',
                             align : 'stretch'
                           },
                           frame       : false,
                           items : [
                             {
                               xtype: 'box',
                               autoScroll  : true,
                               autoEl: {
                                 tag: 'a',
                                 html : '<iframe src="http://indigo.com/views/'+Ext.getCmp('fp_ed16').value+'" style="border:0" width="885" height="565"> </iframe>'
//                                 html : '<iframe src="http://indigo.com/views/test.htm width="885" height="565"> </iframe>'
                               }
                             }
/*
                             {
                               xtype : 'panel',
                               html  : Ext.getCmp('fp_ed16').value
                             }
*/
                           ]
                        });

       w_view_email1.show();
    };

  };

  /****
  *  Function    : f_add_sub
  *  Description : adds a substitution field into the email body
  ****/
  function f_add_sub (
             p_field
           ) {

    /****
    *  Wrap the field and insert
    ****/
    var v_field = '[sub{'+p_field.text+'}]'
    Ext.getCmp('fp_ed_body').setActive(true);
    Ext.getCmp('fp_ed_body').insertAtCursor(v_field);
  };

  /****
  *  Function    : f_email_test
  *  Description : sends a test email
  ****/
  function f_email_test (
            p_button,
            p_text
          ) {

    if ( p_button == 'ok' ) {

      /****
      *  Set the test address form field
      ****/
      Ext.getCmp('fp_ed15').setValue(p_text);

      /****
      *  Submit the form
      ****/
      f_submit_form (
        'T',
        'w_email_detail',
        'g_email',
        'fp_email_detail',
        'email_maintenance.php',
        'fp_ed1',
        '',
        'N'
      );
    };
  };

  /****
  *  Function    : f_test_address
  *  Description : gets the test recipient
  ****/
  function f_test_address() {

    /****
    *  Popup a message box for the test email address
    ****/
    Ext.MessageBox.prompt('Test Send', 'Please enter a test email address:', f_email_test);

  };

  /****
  *  Function    : f_email_type
  *  Description : reloads store for selected email type
  ****/
  function f_email_type (
             p_item,
             p_checked
           ) {

       /****
       *  Change the grid title
       ****/
       Ext.getCmp('g_emails').setTitle('Emails : ' + p_item.text);

       /****
       *  Load selected segment type
       ****/
       Ext.getCmp('g_emails').getStore().getProxy().extraParams.type = p_item.text;
       Ext.getCmp('g_emails').getStore().loadPage(1);
  };

  /****
  *  Function    : f_email_detail
  *  Description : functionality to modify/create emails
  ****/
  function f_email_detail (
             p_grid,
             p_record,
             p_item,
             p_index,
             p_object
           ) {

    /****
    *  Misc variables
    ****/
    var v_form = 'fp_email_detail';
    var v_php  = 'email_maintenance.php';

    /****
    *  Creating or modifying?
    ****/
    if (p_grid) {

      /****
      *  Get the store used by the grid then
      *  get the record at the index from the store
      ****/
      var v_record   = p_grid.getStore().getAt(p_index);

      var v_action   = 'U';
      var v_hidden   = false;
      var v_disabled = false;
      var v_record   = p_grid.getStore().getAt(p_index);;
      var v_email_id = v_record.get('email_id');
      var v_title    = v_record.get('email_name');
      var v_readonly = true;
      var v_load     = false;
      var v_value    = undefined;

    } else {
      var v_action   = 'I';
      var v_disabled = true;
      var v_hidden   = true;
      var v_readonly = false;
      var v_load     = true;
      var v_title    = 'New Email';
      var v_email_id = 0;
      var v_form     = 'fp_email_detail';
      f_select_template();

    };
  
    /****
    *  Substitution field model
     ****/
     Ext.define('indigo.substitution_model', {
       extend: 'Ext.data.Model',
       fields: [
         { name : 'field_id',    type : 'int'},
         { name : 'field_label', type : 'string'},
       ]
     });

     /****
     *  Email store
     ****/
     var s_substitution = Ext.create('Ext.data.Store', {
            model           : 'indigo.substitution_model',
            clearOnPageLoad : true,
            autoLoad        : false,
            proxy           : {
              type            : 'ajax',
              url             : 'fetch_substitution_fields.php',
              actionMethods   : {
                create  : 'POST',
                read    : 'POST',
                update  : 'POST',
                destroy : 'POST'
              },
              reader           : {
                id            : 'term',
                type          : 'json',
                root          : 'results',
                totalProperty : 'total'
              }
            },
            extraParams          : {
              type : ''
            }
          });

    /****
    *  Create and populate the substitution field menu
    ****/
    var m_substitution = Ext.create('Ext.menu.Menu', {
                           plain : true
                         });

    s_substitution.load ({
       callback :  function(records, options, success) {
                     s_substitution.each (
                       function (record) {
                          m_substitution.add ({
                            text    : record.get('field_label'),
                            handler : f_add_sub
                          })
                         }
                       )
       }
    });

    /****
    *  Form panel to hold email details
    *
    *  NOTE: there is a huge difference between creating and defingin
    *       a panel in terms of when the panel items can be accessed
    *       create - immediately
    *       define - when parent container is rendered? fuck knows.
    ****/
    var fp_email_detail = Ext.create('Ext.form.Panel', {
                            xtype     : 'form',
                            id        : 'fp_email_detail',
                            alias     : 'widget.fp_email_detail',
//                            title         : v_title,
                            layout        : {
                              type  : 'vbox',
                              align : 'stretch'
                            },
/*
                            listeners : {
                              afterrender : function() {
                                              f_select_template()
                                            }
                            },
*/
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
                                    xtype         : 'fieldcontainer',
                                    height        : 22,
                                    layout        : 'hbox',
                                    fieldDefaults : {
                                      labelAlign     : 'left',
                                      labelWidth     : 80,
                                      labelSeparator : ':'
                                    },
                                    items : [
                                      {
                                        xtype      : 'textfield',
                                        id         : 'fp_ed2',
                                        name       : 'email_name',
                                        flex       : 1, // width      : 500,
                                        readOnly   : false,
                                        allowBlank : false,
                                        maxLength  : 32,
                                        fieldLabel : 'Email Name',
                                          change : function() {
                                                     f_validate_form (
                                                       'fp_email_detail',
                                                       'edb_test',
                                                           'edb_save'
                                                     )
                                                   }
                      
                                      },
                                      {
                                        xtype : 'splitter',
                                        width : 30,
                                      },
                                      {
                                        xtype      : 'textfield',
                                        id         : 'fp_ed3',
                                        name       : 'description',
                                        flex       : 1, // width      : 500,
                                        readOnly   : false,
                                        allowBlank : true,
                                        maxLength  : 256,
                                        fieldLabel : 'Description',
                                        labelWidth : 100,
                                        listeners : {
                                          change : function() {
                                                     f_validate_form (
                                                       'fp_email_detail',
                                                       'edb_test',
                                                       'edb_save'
                                                     )
                                                   }
                                        }
                                      },
                                    ]
                                  },
                                  {
                                    xtype         : 'fieldcontainer',
                                    height        : 22,
                                    layout        : 'hbox',
                                    fieldDefaults : {
                                      labelAlign     : 'left',
                                      labelWidth     : 80,
                                      labelSeparator : ':'
                                    },
                                    items : [
                                      {
                                        xtype      : 'textfield',
                                        id         : 'fp_ed4',
                                        name       : 'email_subject',
                                        flex       : 1,
                                        readOnly   : false,
                                        allowBlank : false,
                                        maxLength  : 128,
                                        fieldLabel : 'Subject Line',
                                        listeners : {
                                          change : function() {
                                                     f_validate_form (
                                                       'fp_email_detail',
                                                       'edb_test',
                                                       'edb_save'
                                                     )
                                                   }
                                        }                     
                                      },
                                      {
                                        xtype : 'splitter',
                                        width : 30,
                                      },
                                      {
                                        xtype      : 'textfield',
                                        id         : 'fp_ed5',
                                        name       : 'sender_name',
                                        flex       : 1,
                                        readOnly   : false,
                                        allowBlank : true,
                                        maxLength  : 64,
                                        labelWidth : 100,
                                        fieldLabel : 'Sender Name',
                                        listeners : {
                                          change : function() {
                                                     f_validate_form (
                                                       'fp_email_detail',
                                                       'edb_test',
                                                       'edb_save'
                                                     )
                                                   }
                                        }
                                      }
                                    ]
                                  },
                                  {
                                    xtype         : 'fieldcontainer',
                                    height        : 22,
                                    layout        : 'hbox',
                                    fieldDefaults : {
                                      labelAlign     : 'left',
                                      labelWidth     : 80,
                                      labelSeparator : ':'
                                    },
                                    items : [
                                      {
                                        xtype      : 'textfield',
                                        id         : 'fp_ed20',
                                        name       : 'reply_to',
                                        flex       : 1,
                                        readOnly   : false,
                                        allowBlank : false,
                                        maxLength  : 128,
                                        fieldLabel : 'Reply To',
                                        listeners : {
                                          change : function() {
                                                     f_validate_form (
                                                       'fp_email_detail',
                                                       'edb_test',
                                                       'edb_save'
                                                     )
                                                   }
                                        }                     
                                      },
                                      {
                                        xtype : 'splitter',
                                        width : 30,
                                      },
                                      {
                                        xtype      : 'textfield',
                                        id         : 'fp_ed21',
                                        name       : 'sender_address',
                                        flex       : 1,
                                        readOnly   : false,
                                        allowBlank : false,
                                        labelWidth : 100,
                                        maxLength  : 64,
                                        fieldLabel : 'Sender Address',
                                        listeners : {
                                          change : function() {
                                                     f_validate_form (
                                                       'fp_email_detail',
                                                       'edb_test',
                                                       'edb_save'
                                                     )
                                                   }
                                        }
                                      }
                                    ]
                                  },















                                  {
                                    xtype      : 'hiddenfield',
                                    id         : 'fp_ed6',
                                    name       : 'template_id',
                                    width      : 200,
                                    readOnly   : true
                                  },
/*
                                  {
                                    xtype      : 'hiddenfield',
                                    id         : 'fp_ed7',
                                    name       : 'created_by',
                                    width      : 200,
                                    readOnly   : true
                                  },
                                  {
                                    xtype      : 'hiddenfield',
                                    id         : 'fp_ed8',
                                    name       : 'created_date',
                                    width      : 200,
                                    readOnly   : true
                                  },
                                  {
                                    xtype      : 'hiddenfield',
                                    id         : 'fp_ed9',
                                    name       : 'modified_by',
                                    width      : 200,
                                    readOnly   : true
                                  },
                                  {
                                    xtype      : 'hiddenfield',
                                    id         : 'fp_ed10',
                                    name       : 'modified_date',
                                    width      : 200,
                                    readOnly   : true
                                  },
*/
                                  {
                                    xtype      : 'hiddenfield',
                                    id         : 'fp_ed15',
                                    name       : 'test_address',
                                    width      : 200,
                                    readOnly   : true
                                  },
                                  {
                                    xtype      : 'hiddenfield',
                                    id         : 'fp_ed16',
                                    name       : 'view_html',
                                    width      : 200,
                                    readOnly   : true
                                  },
                                ]
                              },

                              {
                                xtype         : 'fieldset',
                                id            : 'fp_ed_fs2',
                                title         : 'Audit Trail',
                                layout        : 'anchor',
                                hidden        : v_hidden,
                                height        : 75,
                                defaultType   : 'displayfield',
                                items : [
                                  {
                                    xtype         : 'fieldcontainer',
                                    height        : 20,
                                    layout        : 'hbox',
                                    fieldDefaults : {
                                      labelAlign     : 'left',
                                      labelWidth     : 80,
                                      labelSeparator : ':'
                                    },
                                    items  : [
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_ed_cb',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Created By'
                                      },
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_ed_mb',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Modified By'
                                      },
                                    ]
                                  },
                                  {
                                    xtype         : 'fieldcontainer',
                                    height        : 20,
                                    layout        : 'hbox',
                                    fieldDefaults : {
                                      labelAlign     : 'left',
                                      labelWidth     : 80,
                                      labelSeparator : ':'
                                    },
                                    items: [
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_ed_cd',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Created Date',
                                      },
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_ed_md',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Modified Date',
                                      },
                                    ]
                                  },
                                ]
                              },
                              {
                                xtype       : 'toolbar',
                                id          : 'ed_ed_top',
                                name        : 'ed_ed_top',
                                dock        : 'top',
                                items: [
                                  {
                                    xtype    : 'button',
                                    id       : 'ed_tb_b_sub',
                                    text     : 'Add Substitution Field',
                                    icon     : 'icons/refresh_blue_16.png',
                                    cls      : 'x-btn-text-icon',
                                    menu     : m_substitution
                                  }
/*
                                  {
                                    xtype          : 'combobox',
                                    id             : 'ed_ed_sub_combbo',
                                    store          : s_substitution,
                                    valueField     : 'field_label',
                                    displayField   : 'field_label',
//                                    value          : 'field_label',
                                    typeAhead      : true,
                                    queryMode      : 'local',  // this prevents the store being loaded > once
                                    forceSelection : true,
                                    emptyText      : 'select'
                                  }
*/
                                ]
                              },
                              {
                                xtype      : 'htmleditor',
                                id         : 'fp_ed_body',
                                name       : 'email body',
                                flex       : 1,
                                anchor     : '100%',
//                                allowblank : true,
//                                value      : '<br>',
                                plugins    : Ext.ux.form.HtmlEditor.plugins()

                              }
                            ]
                          });



    /****
    *  Modal window to hold email detail
    ****/
    var w_email_detail = Ext.create('Ext.Window', {
                           id             : 'w_email_detail',
                           title          : 'Email Editor',
                           height         : 700,
                           animateTarget  : Ext.getCmp('ge_tb_b_create'),
                           width          : 900,
                           resizable      : true,
                           draggable      : true,
                           modal          : true,
// hidden : true,
                           focusOnToFront : false,
                           closeAction    : 'destroy',
                           listeners      : {
                             beforeclose : function() {
/*
                                             s_emails.getProxy().extraParams.type = 'All';
                                             s_emails.loadPage(s_emails.currentPage);
*/
                                             var v_type = {
                                                   text : 'All'
                                                 };

                                             f_email_type (
                                               v_type
                                             );
                                           },
/*
                              afterlayout : function() {
                                              f_select_template();
                                             this.toBack();
                                            }
*/

                           },
                           layout      : {
                             type  : 'vbox',
                             align : 'stretch'
                           },
                           frame       : false,
                           items:       [fp_email_detail],
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
                                   id        : 'edb_view',
                                   width     : 80,
                                   frame     : true,
                                   border    : true,
                                   type      : 'submit',
                                   scale     : 'medium',
                                   text      : 'View',
                                   icon      : 'icons/document_blue_24.png',
                                   iconAlign : 'top',
                                   tooltip   : 'View email in new window',
                                   cls       : 'x-btn-text-icon',
                                   handler   : function() {

                                     /****
                                     *  View the email
                                     ****/
                                     f_view_email (
                                       'N'
                                     );
                                   }
                                 },
                                 {
                                   xtype     : 'button',
                                   id        : 'edb_test',
                                   width     : 80,
                                   disabled  : true,
                                   frame     : true,
                                   border    : true,
                                   type      : 'submit',
                                   scale     : 'medium',
                                   text      : 'Test Send',
                                   icon      : 'icons/full_size_blue_24.png',
                                   iconAlign : 'top',
                                   cls       : 'x-btn-text-icon',
                                   tooltip   : 'Send test email',
                                   handler   : function() {

                                     /****
                                     *  Submit the form for an insert or update
                                     ****/
                                     f_test_address();
                                   }
                                 },
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
                                         p_grid,
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
                                         p_grid,
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
                                   disabled  : v_disabled,
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
                                       p_grid,
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
    *  Show the window if updating
    ****/
    if ( v_action == 'U' ) {
      w_email_detail.show();
    };

    /****
    *  If we are dealing with an
    *  existing email populate the fields
    *
    *  Wait i
    ****/
    if ( v_action == 'U' ) {

      Ext.getCmp('fp_ed1').setValue(v_record.get('email_id'));
      Ext.getCmp('fp_ed2').setValue(v_record.get('email_name'));
      Ext.getCmp('fp_ed3').setValue(v_record.get('description'));
      Ext.getCmp('fp_ed4').setValue(v_record.get('email_subject'));

      Ext.getCmp('fp_ed5').setValue(v_record.get('sender_name'));
      Ext.getCmp('fp_ed20').setValue(v_record.get('reply_to'));
      Ext.getCmp('fp_ed21').setValue(v_record.get('sender_address'));



      Ext.getCmp('fp_ed6').setValue(v_record.get('template_id'));
/*
      Ext.getCmp('fp_ed7').setValue(v_record.get('created_by'));
      Ext.getCmp('fp_ed8').setValue(v_record.get('created_date'));
      Ext.getCmp('fp_ed9').setValue(v_record.get('modified_by'));
      Ext.getCmp('fp_ed10').setValue(v_record.get('modified_date'));
*/
      Ext.getCmp('fp_ed_body').setValue(v_record.get('email_body'));

                                        id         : 'fp_md13',
      /****
      *  Audit trail fields
      ****/
      Ext.getCmp('fp_ed_cb').setValue(v_record.get('created_by'));
      Ext.getCmp('fp_ed_mb').setValue(v_record.get('modified_by'));
      Ext.getCmp('fp_ed_cd').setValue(v_record.get('created_date'));
      Ext.getCmp('fp_ed_md').setValue(v_record.get('modified_date'));
   
      /****
      *  Also enable the delete button
      ****/
      Ext.getCmp('edb_delete').enable(true);
    };
  };


  /****
  *  Template model
  ****/
  Ext.define('indigo.template_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'template_id',   type : 'int'    },
      { name : 'template_name', type : 'string' },
      { name : 'html',          type : 'string' }
    ]
  });

  /****
  *  Template store
  ****/
  var s_templates = Ext.create('Ext.data.Store', {
                      model           : 'indigo.template_model',
                      clearOnPageLoad : true,
                      autoLoad        : true,
                      pageSize        : 100,
                      proxy           : {
                        type          : 'ajax',
                        url           : 'fetch_templates.php',
                        actionMethods : {
                          create  : 'POST',
                          read    : 'POST',
                          update  : 'POST',
                          destroy : 'POST'
                       },
                       reader         : {
                         id            : 'term',
                         type          : 'json',
                         root          : 'results',
                         totalProperty : 'total'
                       }
                     },
                     extraParams      : {
                       action : ''
                     }
                   });


  /****
  *  Email model
  ****/
  Ext.define('indigo.email_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'email_id',        type : 'int'}, 
      { name : 'email_name',      type : 'string'}, 
      { name : 'email_subject',   type : 'string'}, 
      { name : 'email_body',      type : 'string'}, 
      { name : 'sender_name',     type : 'string'}, 
      { name : 'sender_address',  type : 'string'}, 
      { name : 'reply_to',        type : 'string'}, 
      { name : 'description',     type : 'string'}, 
      { name : 'template_id',     type : 'string'},
      { name : 'email_type',      type : 'string'},
      { name : 'created_by',      type : 'string'},
      { name : 'created_date',    type : 'string'},
      { name : 'modified_by',     type : 'string'},
      { name : 'modified_date',   type : 'string'}
    ]
  });

  /****
  *  Email store
  ****/
  var s_emails = Ext.create('Ext.data.Store', {
         model           : 'indigo.email_model',
         clearOnPageLoad : true,
         autoLoad        : true,
         proxy           : {
           type            : 'ajax',
           url             : 'fetch_emails.php',
           actionMethods   : {
             create  : 'POST',
             read    : 'POST',
             update  : 'POST',
             destroy : 'POST'
           },
           reader           : {
             id            : 'term',
             type          : 'json',
             root          : 'results',
             totalProperty : 'total'
           }     
         },
         extraParams          : {
           type : ''
         }
       });


  /****
  *  Email grid
  ****/
  return Ext.define('indigo.g_emails', {
      extend         : 'Ext.grid.Panel',
      id             : 'g_emails',
      alias          : 'widget.g_emails',
      title          : 'Emails',
      store          : s_emails,
      trackMouseOver : true,
      layout         : 'fit',
      loadMask       : true,
      enableHdMenu   : true,
      stripeRows     : true,
      autoRender     : true,
      autoShow       : true,
      listeners      : {
        itemdblclick : f_email_detail
      },
      columns        : [
        {
          id        : 'ge_c1',
          text      : 'Email ID',
          width     : 80,
          sortable  : true,
          dataIndex : 'email_id' 
        }, 
        {
          id        : 'ge_c2',
          text      : 'Email Name',
          width     : 150,
          sortable  : true,
          dataIndex : 'email_name'
        },
        {
          id        : 'ge_c3',
          text      : 'Email Type',
          width     : 100,
          sortable  : true,
          dataIndex : 'email_type'
        },
        {
          id        : 'ge_c4',
          text      : 'Date Created',
          width     : 150,
          sortable  : true,
          dataIndex : 'created_date'
        },
        {
          id        : 'ge_c5',
          text      : 'Created By',
          flex      : 1,
          sortable  : true,
          dataIndex : 'created_by'
        },
      ],
      dockedItems    : [
        {
          xtype       : 'pagingtoolbar',
          id          : 'ge_spt_bottom',
          name        : 'ge_pt_bottom',
          store       : s_emails,
          dock        : 'bottom',
          displayInfo : true,
          displayMsg  : 'Displaying rows {0} - {1} of {2}',
      emptyMsg    : "No data to display",
      pageSize    : 25
        },
        {     
          xtype       : 'toolbar',
          id          : 'ge_st_top',
          name        : 'ge_st_top',
          dock        : 'top',
          items: [ 
      {
         xtype   : 'button',
         id      : 'ge_tb_b_create',
         text    : 'Create',
         icon    : 'icons/plus_blue_16.png',
         cls     : 'x-btn-text-icon',
         handler : function() {
                f_email_detail()
              }
       },
       {
         xtype : 'tbspacer',
         id    : 'ge_tb_spacer',
         width : 5
       },
       {
         xtype    : 'button',
         text     : 'Type',
         icon     : 'icons/mail_blue_16.png',
         cls      : 'x-btn-text-icon',
         menu     : {
           defaults : {
             checked : false,
             group   : 'email_type'  // radio buttons
           },
           items : [
             {
          text         : 'All',
          checked      : true,
          checkHandler : f_email_type
             },
             {
          text         : 'Template',
          checkHandler : f_email_type
             }, 
             {
          text         : 'Ad-hoc',
          checkHandler : f_email_type
             }
           ]
         }
       }
          ]
        }
      ]
    });

};
