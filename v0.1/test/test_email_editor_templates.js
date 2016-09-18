Ext.QuickTips.init();
Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath('Ext.ux.form.HtmlEditor', 'plugins/html_editor');
Ext.Loader.setPath('Ext.ux.DataView', 'plugins/DataView/');

/*
 Ext.Msg.alert('Status', 'test');

    <script src="src/Ext.ux.form.HtmlEditor.MidasCommand.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.Divider.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.HR.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.Image.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.RemoveFormat.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.IndentOutdent.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.SubSuperScript.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.RemoveFormat.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.FindAndReplace.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.Table.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.Word.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.Link.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.SpecialCharacters.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.UndoRedo.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.Heading.js"></script>;
    <script src="src/Ext.ux.form.HtmlEditor.Plugins.js"></script>;
*/


function f_test() {


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

                                 Ext.getCmp('fp_ed_body').setValue(v_html);

                                 /****
                                 *  Close the window
                                 ****/
                                 Ext.getCmp('w_template').destroy();
                                 
 
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
                               }
                             }
                           ]
                         }
                       ]
                    });

    w_email_detail.toBack;
    w_template.show();
    w_template.toFront();
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
      var w_view_email = Ext.create('Ext.Window', {
                           id          : 'w_view_email',
                           title       : 'Email View',
                           height      : 500,
                           width       : 600,
                           resizable   : true,
                           draggable   : true,
                           modal       : true,
                           closeAction : 'destroy',
                           layout      : {
                             type  : 'fit',
                             align : 'stretch'
                           },
                           frame       : false,
                           items : [
                             {
                               xtype : 'panel',
                               html  : Ext.getCmp('fp_ed16').value
                             }
                           ]
                        });

       w_view_email.show();
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
    *  Misc variables
    ****/
    var v_form = 'fp_email_detail';
    var v_php  = 'email_maintenance.php';

      var v_action   = 'I';
      var v_disabled = true;
      var v_hidden   = true;
      var v_readonly = false;
      var v_load     = true;
      var v_title    = 'New Email';
      var v_email_id = 0;
      var v_form     = 'fp_email_detail';

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
                            xtype         : 'form',
                            id            : 'fp_email_detail',
                            alias         : 'widget.fp_email_detail',
//                            title         : v_title,
                            layout        : {
                              type  : 'vbox',
                              align : 'stretch'
                            },
                            frame : true,
                            flex  : 1,
                            listeners : {
                              afterrender : function() {
                                              f_select_template()
                                            }
                            },
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
                                      change : function() {
                                                 f_validate_form (
                                                   'fp_email_detail',
                                                   'edb_test',
                                                   'edb_save'
                                                 )
                                               }
                      
                                  },
                                  {
                                    xtype      : 'textfield',
                                    id         : 'fp_ed3',
                                    name       : 'description',
                                    width      : 500,
                                    readOnly   : false,
                                    allowBlank : true,
                                    maxLength  : 256,
                                    fieldLabel : 'Description',
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
                                    xtype      : 'textfield',
                                    id         : 'fp_ed4',
                                    name       : 'email_subject',
                                    width      : 500,
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
                                    xtype      : 'textfield',
                                    id         : 'fp_ed5',
                                    name       : 'email_from',
                                    width      : 500,
                                    readOnly   : false,
                                    allowBlank : false,
                                    maxLength  : 64,
                                    fieldLabel : 'Sender',
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
                                allowblank : true,
                                plugins    : Ext.ux.form.HtmlEditor.plugins()

/*
        Ext.create('Ext.ux.form.HtmlEditor.image', {}),
        Ext.create('Ext.ux.form.HtmlEditor.divider', {}),


        Ext.create('Ext.ux.form.HtmlEditor.Link', {}),
        Ext.create('Ext.ux.form.HtmlEditor.Divider', {}),
        Ext.create('Ext.ux.form.HtmlEditor.Word', {}),
        Ext.create('Ext.ux.form.HtmlEditor.FindAndReplace', {}),
        Ext.create('Ext.ux.form.HtmlEditor.UndoRedo', {}),
        Ext.create('Ext.ux.form.HtmlEditor.Divider', {}),
        Ext.create('Ext.ux.form.HtmlEditor.Table', {}),
        Ext.create('Ext.ux.form.HtmlEditor.HR', {}),
        Ext.create('Ext.ux.form.HtmlEditor.SpecialCharacters', {}),
        Ext.create('Ext.ux.form.HtmlEditor.HeadingMenu', {}),
        Ext.create('Ext.ux.form.HtmlEditor.IndentOutdent', {}),
        Ext.create('Ext.ux.form.HtmlEditor.SubSuperScript', {}),
        Ext.create('Ext.ux.form.HtmlEditor.RemoveFormat', {})
]
*/






/*
                 plugins      : [
                             Ext.create('Ext.ux.DataView.DragSelector', {}),
                             Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'media_name'})
                           ],

                                    plugins : [

                                  Ext.create('Ext.ux.form.HtmlEditor.Word',{})
]
*/

                 //               new Ext.ux.form.HtmlEditor.Word(),  
                   //             new Ext.ux.form.HtmlEditor.Divider(),  
                    //            new Ext.ux.form.HtmlEditor.Table(),  
                     //           new Ext.ux.form.HtmlEditor.HR(),  
                    //            new Ext.ux.form.HtmlEditor.IndentOutdent(),  
                   //             new Ext.ux.form.HtmlEditor.SubSuperScript(),  
                   //             new Ext.ux.form.HtmlEditor.RemoveFormat() 
 //                               ]
                              }
                            ]
                          });

    
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
    *  Modal window to hold email detail
    ****/
    var w_email_detail = Ext.create('Ext.Window', {
                           id             : 'w_email_detail',
                           title          : 'Email Editor',
                           height         : 700,
                           animateTarget  : Ext.getCmp('ge_tb_b_create'),
                           width          : 775,
                           resizable      : true,
                           draggable      : true,
                           modal          : false,
                           closeAction    : 'destroy',
                           focusOnToFront : false,
                           layout         : {
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
    *  Open the window
    ****/
    w_email_detail.show();

};
Ext.QuickTips.init();
Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath('Ext.ux.Form.HtmlEditor', 'plugins/html_editor');
Ext.Loader.setPath('Ext.ux.DataView', 'plugins/DataView/');

Ext.onReady(f_test);


