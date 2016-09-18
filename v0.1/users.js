/*******************************************************************************
* Indigo
********************************************************************************
* Name          : users.js
* Description   : Indigo user management
* Author        : Scott Walkinshaw
* Date          : 5th August 2011
* Parameters    : 
* Comments      :

  Ext.Msg.alert('Status', 'test');

********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 05 Aug 11 | Initial issue                                     *
*******************************************************************************/
function f_users() {

  /****
  *  Function    : f_user_detail
  *  Description : functionality to modify/create users
  ****/
  function f_user_detail (
             p_grid,
             p_record,
             p_item,
             p_index,
             p_object
           ) {

    /****
    *  Misc variables
    ****/
    var v_form = 'fp_user_detail';
    var v_php  = 'user_maintenance.php';

    /****
    *  Creating or modifying?
    ****/
    if (p_grid) {

      /****
      *  Get the store used by the grid then
      *  get the record at the index from the store
      ****/
      var v_record   = p_grid.getStore().getAt(p_index);

      var v_action       = 'U';
      var v_hidden       = false;
      var v_disabled     = false;
      var v_record       = p_grid.getStore().getAt(p_index);;
      var v_media_id     = v_record.get('user_id');
      var v_title        = v_record.get('username');
      var v_readonly     = true;
      var v_load         = false;
      var v_disable_user = true;

      var v_hidden_pw   = false;
      var v_hidden_cl   = true;
      var v_hidden_dl   = false;
      var v_disabled_pw = true;
      var v_height_fs   = 100;

    } else {

      var v_action       = 'I';
      var v_disabled     = true;
      var v_hidden       = true;
      var v_readonly     = false;
      var v_load         = true;
      var v_title        = 'New User';
      var v_disable_user = false;

      var v_hidden_pw   = true;
      var v_hidden_cl   = false;
      var v_hidden_dl   = true;
      var v_disabled_pw = false;
      var v_height_fs   = 90;
    };

    /****
    *  Form panel
    ****/
    var fp_user_detail = Ext.create('Ext.form.Panel', {
                    xtype         : 'form',
                    id            : 'fp_user_detail',
                    autoScroll    : true,
                    frame         : true,
                    bodyPadding   : 10,
                    fieldDefaults : {
                      labelAlign  : 'left',
                      labelWidth  : 110
                    },
                    items       : [ 
                      {
                        xtype      : 'hiddenfield',
                        id         : 'fp_ud1',
                        name       : 'user_id',
                        width      : 200,
                        readOnly   : true
                      },
                      {
                        xtype      : 'hiddenfield',
                        id         : 'fp_ud2',
                        name       : 'full_name',
                        width      : 200,
                        readOnly   : true
                      },
                      {
                        xtype         : 'fieldcontainer',
                        height        : 44,
                        layout        : 'hbox',
                        fieldDefaults : {
                          labelAlign     : 'top',
                          labelWidth     : 80,
                          labelSeparator : ':'
                        },
                        items: [
                          {
                            xtype      : 'textfield',
                            id         : 'fp_ud3',
                            name       : 'username',
                            flex       : 1,
                            fieldLabel : 'Username',
                            readOnly   : false,
                            allowBlank : false,
                            disabled   : v_disable_user,
                            maxLength  : 32
                          },
                          {
                            xtype : 'splitter',
                            width : 30, 
                          },
                          {
                            xtype      : 'textfield',
                            id         : 'fp_ud6',
                            name       : 'email',
                            flex       : 1,
                            vtype      : 'email',
                            fieldLabel : 'Email',
                            readOnly   : false,
                            allowBlank : true,
                            maxLength  : 64,
                            listeners  : {
                              change : function() {
                                         f_validate_form (
                                           'fp_user_detail',
                                           'ud_b_save'
                                         )
                                       }
                            }
                          }, 
                        ]
                      },
                      {
                        xtype         : 'fieldcontainer',
                        height        : 44,
                        layout        : 'hbox',
                        fieldDefaults : {
                          labelAlign     : 'top',
                          labelWidth     : 80,
                          labelSeparator : ':'
                        },
                        items: [
                          {
                            xtype      : 'textfield',
                            id         : 'fp_ud4',
                            name       : 'first_name',
                            flex       : 1,
                            fieldLabel : 'First Name',
                            readOnly   : false,
                            allowBlank : false,
                            maxLength  : 32,
                            listeners  : {
                              change : function() {
                                         f_validate_form (
                                           'fp_user_detail',
                                           'ud_b_save'
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
                            id         : 'fp_ud5',
                            name       : 'last_name',
                            flex       : 1,
                            fieldLabel : 'Last Name',
                            readOnly   : false,
                            allowBlank : false,
                            maxLength  : 32,
                            listeners  : {
                              change : function() {
                                         f_validate_form (
                                           'fp_user_detail',
                                           'ud_b_save'
                                         )
                                       }
                            }
                          } 
                        ]
                      },
                      {
                        xtype         : 'fieldcontainer',
                        height        : 45,
                        layout        : 'hbox',
                        fieldDefaults : {
                          labelAlign     : 'top',
                          labelWidth     : 80,
                          labelSeparator : ':'
                        },
                        items: [
                          {
                            xtype          : 'combobox',
                            id             : 'fp_ud7',
                            name           : 'role_id',
                            flex           : 1,
                            store          : s_user_roles,
                            fieldLabel     : 'Role',
                            valueField     : 'user_role_id',
                            displayField   : 'user_role',
                            value          : 'user_role',
                            queryMode      : 'local',
                            allowBlank     : true, // false,
                            forceSelection : true,
                            emptyText      : 'select',
/*
                        listeners  : {
                          change : function() {
                                     f_validate_form (
                                       'fp_user_detail',
                                       'ud_b_save'
                                     )
                                   }
                        }
*/
                          }, 
                          {
                            xtype : 'splitter',
                            width : 30, 
                          },
                          {
                            xtype          : 'combobox',
                            id             : 'fp_ud8',
                            name           : 'status_id',
                            flex           : 1,
                            store          : s_user_status,
                            fieldLabel     : 'Status',
                            valueField     : 'user_status_id',
                            displayField   : 'user_status',
                            value          : 'user_status',
                            queryMode      : 'local',
                            allowBlank     : true, // false,
                            forceSelection : true,
                            emptyText      : 'select',
/*
                        listeners  : {
                          change : function() {
                                     f_validate_form (
                                       'fp_user_detail',
                                       'ud_b_save'
                                     )
                                   }
                        }
*/
                          }
                        ]
                      },
                      {
                        xtype       : 'fieldset',
                        collapsible : false,
                        height      : v_height_fs,
                        title       : 'Password',
                        layout      : 'anchor',
                        items : [
                          {
                            xtype         : 'fieldcontainer',
                            height        : 46,
                            layout        : 'hbox',
                            fieldDefaults : {
                              labelAlign     : 'top',
                              labelWidth     : 80,
                              labelSeparator : ':'
                            },
                            items : [
                              {
                                xtype      : 'textfield',
                                id         : 'password1',
                                name       : 'password1',
                                flex       : 1,
  //                              style      : 'margin-top:15px',
                                inputType  : 'password',
                                fieldLabel : 'Password',
                                allowBlank : false,
                                readOnly   : false,
                                minLength  : 6, 
                                maxLength  : 16, 
                                disabled   : v_disabled_pw,
                                listeners  : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_user_detail',
                                               'ud_b_save'
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
                                id         : 'password2',
                                name       : 'password2',
                                flex       : 1,
                                inputType  : 'password',
                                fieldLabel : 'Repeat Password',
                                allowBlank : false,
                                readOnly   : false,
                                disabled   : v_disabled_pw,
                                listeners  : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_user_detail',
                                               'ud_b_save'
	        			     )
                                           }
                                },
                                validator : function(value) {
                                              var p1 = this.previousSibling('[name=password1]');
                                              return (value === p1.getValue()) ? true : 'Passwords do not match.'
                                            }
                              }
                            ]
                          },
                          {
                            xtype: 'container',
                            style: 'text-align:center',
                            items: [
                              {
                                xtype    : 'button',
                                id       : 'fp_ud_password',
                                width    : 120,
                                disabled : false,
                                scale    : 'small',
                                type     : 'submit',
                                text     : 'Change Password',
                                icon     : 'icons/lock_blue_16.png',
                                cls      : 'x-btn-text-icon',
                                hidden   : v_hidden_pw,
                                handler  : function() {
                                             Ext.getCmp('password1').setDisabled(false);
                                             Ext.getCmp('password2').setDisabled(false);
/*
                                             Ext.getCmp('password1').setValue('');
                                             Ext.getCmp('password2').setValue('');
*/
                                           }

                              }
                            ]
                          }
                        ]
                      },
                      {
                        xtype         : 'fieldset',
                        id            : 'fp_ud_fs2',
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
                                id         : 'fp_ud9',
                                hidden     : v_hidden,
                                flex       : 1,
                                fieldLabel : 'Created By'
                              },
                              {
                                xtype      : 'displayfield',
                                id         : 'fp_ud10',
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
                                id         : 'fp_ud11',
                                hidden     : v_hidden,
                                flex       : 1,
                                fieldLabel : 'Created Date',
                              },
                              {
                                xtype      : 'displayfield',
                                id         : 'fp_ud12',
                                hidden     : v_hidden,
                                flex       : 1,
                                fieldLabel : 'Modified Date',
                              }
                            ]
                          }
                        ]
                      }
                    ],
                    dockedItems : [
                      {
                        xtype       : 'toolbar',
                        id          : 'fp_ud_t_bottom',
                        dock        : 'bottom',
                        layout      : {
                          pack: 'center' 
                        }, 
                        items : [
                          {
                            xtype     : 'button',
                            id        : 'ud_b_save',
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
                            handler  : function() {

                              /****
                              *  Submit the form for an insert or update
                              ****/
                              if (Ext.getCmp('fp_ud1').value) {

                                f_submit_form (
                                  'U',
                                  'w_user_detail',
                                  'g_users',
                                  'fp_user_detail',
                                   v_php,
                                  'fp_ud1',
                                  '',
                                  'Y'
                                );
                              } else {
                                f_submit_form (
                                  'I',
                                  'w_user_detail',
                                  'g_users',
                                  'fp_user_detail',
                                  v_php,
                                  'fp_ud1',
                                  '',
                                  'N'
                                );
                              };

                              /****
                              *  Enable the delete button once saved
                              ****/
                              Ext.getCmp('ud_b_delete').enable(true);

                              /****
                              *  And disbale the save button until something has changed
                              ****/
                              Ext.getCmp('ud_b_save').disable(true);
                            }

                          }, 
                          {
                            xtype     : 'button',
                            id        : 'ud_b_delete',
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
                                'w_user_detail',
                                'g_users',
                                'fp_user_detail',
                                v_php,
                                 'fp_ud1',
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
    *  If we are dealing with an existing
    *  user populate the form fields
    ****/
    if ( v_action == 'U' ) {

      Ext.getCmp('fp_ud1').setValue(v_record.get('user_id'));
      Ext.getCmp('fp_ud2').setValue(v_record.get('full_name'));
      Ext.getCmp('fp_ud3').setValue(v_record.get('username'));
      Ext.getCmp('fp_ud4').setValue(v_record.get('first_name'));
      Ext.getCmp('fp_ud5').setValue(v_record.get('last_name'))
      Ext.getCmp('fp_ud6').setValue(v_record.get('email'));
      Ext.getCmp('fp_ud7').setValue(v_record.get('user_role_id'));
      Ext.getCmp('fp_ud8').setValue(v_record.get('user_status_id'));

      /****
      *  Audit trail fields
      ****/
      Ext.getCmp('fp_ud9').setValue(v_record.get('created_by'));
      Ext.getCmp('fp_ud10').setValue(v_record.get('modified_by'));
      Ext.getCmp('fp_ud11').setValue(v_record.get('created_date'));
      Ext.getCmp('fp_ud12').setValue(v_record.get('modified_date'));

      /****
      *  Enable the delete button
      ****/
      Ext.getCmp('ud_b_delete').enable(true);

      /****
      *  Disable the save button - setting the
      *  fields above here will have validated the form
      ****/
      Ext.getCmp('ud_b_save').disable(true);

    };

    /****
    *  Modal widow to hold user form
    ****/
    var w_user_detail = Ext.create('Ext.Window', {
                          id          : 'w_user_detail',
                          title       : v_title,
                          height      : 500,
                          width       : 550,
                          resizable   : false,
                          draggable   : true,
                          modal       : true,
                          closeAction : 'destroy',
                          layout      : 'fit',
       listeners : {
                        beforeclose : function() {
                                        s_users.loadPage(store.currentPage);
                                    }
                      },
                          items       : [fp_user_detail]
                        });


    /****
    *  Open window
    ****/
    w_user_detail.show();

  };

  /****
  *  Indigo user model
  ****/
  Ext.define('indigo.user_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'user_id',         type : 'int'}, 
      { name : 'first_name',      type : 'string'}, 
      { name : 'last_name',       type : 'string'}, 
      { name : 'full_name',       type : 'string'}, 
      { name : 'username',        type : 'string'}, 
      { name : 'email',           type : 'string'},
      { name : 'user_role_id',    type : 'int'},
      { name : 'user_role',       type : 'string'},
      { name : 'user_status_id',  type : 'int'},
      { name : 'user_status',     type : 'string'},
      { name : 'created_by',      type : 'string'},
      { name : 'created_date',    type : 'string'},
      { name : 'modified_by',     type : 'string'},
      { name : 'modified_date',   type : 'string'}
    ]
  });

  /****
  *  Indigo user roles model
  ****/
  Ext.define('indigo.user_roles_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'user_role_id', type : 'int'}, 
      { name : 'user_role',    type : 'string'}
    ]
  });

  /****
  *  Indigo user status model
  ****/
  Ext.define('indigo.user_status_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'user_status_id', type : 'int'}, 
      { name : 'user_status',    type : 'string'}
    ]
  });

  /****
  *  User store
  ****/
  var s_users = Ext.create('Ext.data.Store', {
                 model           : 'indigo.user_model',
                 clearOnPageLoad : true,
                 autoLoad        : true,
                 proxy           : {
                   type          : 'ajax',
                   url           : 'fetch_users.php',
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
  *  User role store
  ****/
  var s_user_roles = Ext.create('Ext.data.Store', {
                      model           : 'indigo.user_roles_model',
                      clearOnPageLoad : true,
                      autoLoad        : true,
                      proxy           : {
                        type          : 'ajax',
                        url           : 'fetch_user_roles.php',
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
                    }
                  });

  /****
  *  User status store
  ****/
  var s_user_status = Ext.create('Ext.data.Store', {
                        model           : 'indigo.user_status_model',
                        clearOnPageLoad : true,
                        autoLoad        : true,
                        proxy           : {
                          type          : 'ajax',
                          url           : 'fetch_user_status.php',
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
                      }
                    });

  /****
  *  User grid
  ****/
  return Ext.define('indigo.g_users', {
           extend         : 'Ext.grid.Panel',
           id             : 'g_users',
           alias          : 'widget.g_users',
           title          : 'Users',
           store          : s_users,
           trackMouseOver : true,
           loadMask       : true,
           enableHdMenu   : true,
           autoRender     : true,
           autoShow       : true,
           layout         : 'fit',
           stripeRows     : true,
           listeners      : {
             itemdblclick : f_user_detail
           },
           columns        : [ 
             {
               id        : 'gu_c1',
               text      : 'Name',
               width     : 120,
               sortable  : true,
               dataIndex : 'full_name'
             },
             {
               id        : 'gu_c2',
               text      : 'Username',
               width     : 100,
               sortable  : true,
               dataIndex : 'username'
             }, 
             {
               id        : 'gu_c3',
               text      : 'Role',
               width     : 100,
               sortable  : true,
               dataIndex : 'user_role'
             }, 
             {
               id        : 'gu_c4',
               text      : 'Status',
               width     : 60,
               sortable  : true,
               dataIndex : 'user_status'
             },
             {
               id        : 'gu_c5',
               text      : 'Created Date',
               flex      : 1,
               sortable  : true,
               dataIndex : 'created_date'
             }
           ], 
           dockedItems    : [{
             xtype       : 'pagingtoolbar',
             id          : 'pt_bottom2',
             name        : 'pt_bottom2',
             store       : s_users,
             dock        : 'bottom',
             displayInfo : true,
             displayMsg  : 'Displaying rows {0} - {1} of {2}',
             emptyMsg    : "No data to display",
             pageSize    : 25
           }, {
             xtype       : 'toolbar',
             id          : 'ut_top',
             name        : 'ut_top',
             dock        : 'top',
             items: [{
               xtype   : 'button',
               id      : 'b_add',
               text    : 'Create',
               icon    : 'icons/plus_blue_16.png',
               cls     : 'x-btn-text-icon',
               handler : function() { 
                           f_user_detail()
                         }
             }]
           }]
         });
};
