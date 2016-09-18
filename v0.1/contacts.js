/*******************************************************************************
* Indigo
********************************************************************************
* Name          : contacts.js
* Description   : manages contacts grid
* Author        : Scott Walkinshaw
* Date          : 4th June 2011
* Parameters    : 
* Comments      : all filter ID is prepended to all ID's so contacts grid
*                 can exist twice

  Ext.Msg.alert('Status', 'test');
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 04 Jun 11 | Initial issue                                     *
*******************************************************************************/
function f_contacts (
          p_filseg_id,
          p_type
         ) {

  /****
  *  Function to handle grid double-click
  *
  *  p_grid - the grid called from   Ext.view.View (also grids)
  *  p_record - the record that belongs to the item  Ext.data.Model
  *  p_item   - the item's element   HTMLElement
  *  p_index  - index into the item NUMBER
  *  p_object  - the event object OBJECT
  *
  *  options - not sure maybe put function to call to make
  *            this a generic handler? e.g. function to call
  ****/
  function f_contact (
             p_grid,
             p_record,
             p_item,
             p_index,
             p_object,
             p_label_store
           ) {

    /****
    *  Default p_index if empty
    ****/
    if (!p_index) p_index = '0';

    /****
    *  Stick the labels in a simple array
    * 
    *  The first element is dummy label
    *  to keep the array elements in line
    *  with the profile fields numbering
    ****/
    var v_label = p_label_store.collect('field_label');

    /****
    *  Get the store used by the grid then
    *  get the record at the index from the store
    ****/
    var rec      = p_grid.getStore().getAt(p_index);

    /****
    *  Misc variables
    ****/
    var v_hidden = false;

    /****
    *  Form panel to hold profile data
    ****/
    var fp_profile =  Ext.create('Ext.form.Panel', {
                        xtype       : 'form',
                        id          : 'fp_profile'+p_filseg_id,
                        autoScroll  : true,
                        fieldDefaults: {
                          labelAlign : 'left',
                          labelWidth : 90
                        },
                        frame       : true,
                        items       : [
                          {
                            xtype          : 'fieldset',
                            checkboxToggle : false,
                            title          : 'Contact',
                            defaultType    : 'displayfield',
                            collapsed      : false,
                            layout         : 'anchor',
                            defaults       : {
                              anchor     : '100%',
                              width      : 200,
                              labelWidth : 150,
                              readOnly   : true,
                              hidden     : false
                            },
                            items : [
                              {
                                xtype      : 'hiddenfield',
                                id         : 'fpc_tf0'+p_filseg_id,
                                fieldLabel : 'Contact ID',
                                value      : rec.get('contact_id'),
                                name       : 'contact_id'
                              },
                              {
                                id         : 'fpc_tf1'+p_filseg_id,
                                fieldLabel : 'Contact ID',
                                value      : rec.get('contact_id')
                              },
                              {
                                id         : 'fpc_tf2'+p_filseg_id,
                                fieldLabel : 'Client ID',
                                value      : rec.get('client_id'),
                                name       : 'client_id'
                              },
                              {
                                id         : 'fpc_tf3'+p_filseg_id,
                                fieldLabel : 'Full Name',
                                value      : rec.get('full_name'),
                                name       : 'full_name'
                              },
                              {
                                xtype          : 'checkbox',
                                id             : 'fpc_tf5'+p_filseg_id,
                                fieldLabel     : 'Subscribed - Email',
                                inputValue     : 1,
                                checked        : rec.get('email_permission'),
                                uncheckedValue : 0,
                                name           : 'email_permission',
                                readOnly       : false,
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }

                              },
                              {
                                xtype      : 'textfield',
                                id         : 'fpc_tf4'+p_filseg_id,
                                fieldLabel : 'Email Address',
                                value      : rec.get('email_address'),
                                name       : 'email_address',
                                readOnly   : false,
                                allowBlank : false,
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                }
                              },
                            ]
                          },
                          {
                            xtype         : 'fieldset',
                            id            : 'fpc_fs_audit',
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
                                    id         : 'fpc_audit1',
                                    hidden     : v_hidden,
                                    flex       : 1,
                                    fieldLabel : 'Created By',
                                    value      : rec.get('created_by')
                                  },
                                  {
                                    xtype      : 'displayfield',
                                    id         : 'fpc_audit2',
                                    hidden     : v_hidden,
                                    flex       : 1,
                                    fieldLabel : 'Modified By',
                                    value      : rec.get('modified_by')
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
                                    id         : 'fpc_audit3',
                                    hidden     : v_hidden,
                                    flex       : 1,
                                    fieldLabel : 'Created Date',
                                    value      : rec.get('created_date')
                                  },
                                  {
                                    xtype      : 'displayfield',
                                    id         : 'fpc_audit4',
                                    hidden     : v_hidden,
                                    flex       : 1,
                                    fieldLabel : 'Modified Date',
                                    value      : rec.get('modified_date')
                                  },
                                ]
                              }
                            ]
                          },
                          {
                            xtype          :'fieldset',
                            checkboxToggle : false,
                            title          : 'Profile Fields',
                            defaultType    : 'textfield',
                            collapsed      : false,
                            layout         : 'anchor',
                            defaults       : {
                              anchor     : '98%',  // specifies how wide the fieldset is in relation to the panel
                              labelWidth : 150,    // consider trying to right-justify labels
//                              labelPad   : 20,
                              width      : 150,
                              readOnly   : false,
                              hidden     : false
                            },
                            items : [
                              {
                                id         : 'fpp_tf1'+p_filseg_id,
                                fieldLabel : v_label[1],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_01'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf2'+p_filseg_id,
                                fieldLabel : v_label[2],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_02'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf3'+p_filseg_id,
                                fieldLabel : v_label[3],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_03'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf4'+p_filseg_id,
                                fieldLabel : v_label[4],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_04'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf5'+p_filseg_id,
                                fieldLabel : v_label[5],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_05'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf6'+p_filseg_id,
                                fieldLabel : v_label[6],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_06'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf7'+p_filseg_id,
                                fieldLabel : v_label[7],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_07'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf8'+p_filseg_id,
                                fieldLabel : v_label[8],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_08'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf9'+p_filseg_id,
                                fieldLabel : v_label[9],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_09'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf10'+p_filseg_id,
                                fieldLabel : v_label[10],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_10'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf11'+p_filseg_id,
                                fieldLabel : v_label[11],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_11'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf12'+p_filseg_id,
                                fieldLabel : v_label[12],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_12'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf13'+p_filseg_id,
                                fieldLabel : v_label[13],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_13'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf14'+p_filseg_id,
                                fieldLabel : v_label[14],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_14'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              },
                              {
                                id         : 'fpp_tf15'+p_filseg_id,
                                fieldLabel : v_label[15],
                                name       : 'profile_field[]',
                                value      : rec.get('profile_field_15'),
                                listeners : {
                                  change : function() {
                                             f_validate_form (
                                               'fp_profile'+p_filseg_id,
                                               'cp_b_save'
                                             )
                                           }
                                    }
                              }
                            ],
                          },
                        ],
                        dockedItems: [
                          {
                            xtype       : 'toolbar',
                            id          : 'cp_t_bottom',
                            name        : 'cp_t_bottom',
                            dock        : 'bottom',
                            border      : true,
                            layout      : {
                              pack: 'center'
                            },
                            items: [
                              {
                                xtype     : 'button',
                                id        : 'cp_b_save',
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
                                  *  Submit the form for an update
                                  ****/
                                  if (Ext.getCmp('fpc_tf1'+p_filseg_id).value) {

                                    f_submit_form (
                                      'U',
                                      'w_profile'+p_filseg_id,
                                      'g_contacts',
                                      'fp_profile'+p_filseg_id,
                                      'contact_maintenance.php',
                                       '',
                                      '',
                                      'Y'
                                    );
                                  } else {
                                    f_submit_form (
                                      'U',
                                      'w_profile'+p_filseg_id,
                                      'g_contacts',
                                      'fp_profile'+p_filseg_id,
                                      'contact_maintenance.php',
                                       '',
                                      '',
                                      'Y'
                                    );
                                  };

                                  /****
                                  *  And disable the save button until something has changed
                                  ****/
                                  Ext.getCmp('cp_b_save').disable(true);
                                }
                              },
                              {
                                xtype     : 'button',
                                id        : 'cp_b_delete',
                                width     : 80,
                                disabled  : false,
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
                                    'w_profile'+p_filseg_id,
                                    'g_contacts',
                                    'fp_profile'+p_filseg_id,
                                    'contact_maintenance.php',
                                    '',
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
    *  Modal window to hold contact profile data
    ****/
    var w_profile = Ext.create('Ext.Window', {
                      id          : 'w_profile'+p_filseg_id,
                      name        : 'w_profile'+p_filseg_id,
                      title       : rec.get('full_name'),
                      height      : 600,
                      width       : 550,
                      resizable   : true,
                      draggable   : true,
                      modal       : true,
                      closeAction : 'destroy',
                      layout      : 'fit',
                      frame       : false,
                      listeners : {
                        beforeclose : function() {
                                        store.loadPage(store.currentPage);
                                    }
                      },
                      items       : [fp_profile]
                    });

    /****
    *  Open the window
    ****/
    w_profile.show();
  };

  /****
  *  Contact model
  *  NOTE: names of elements must be the
  *        same as database column names
  ****/
  Ext.define('indigo.contact_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'contact_id',         type : 'int'    }, 
      { name : 'client_id',          type : 'string' }, 
      { name : 'full_name',          type : 'string' }, 
      { name : 'email_address',      type : 'string' },
      { name : 'email_permission',   type : 'int'    },
      { name : 'created_by',         type : 'string' },
      { name : 'created_date',       type : 'string' },
      { name : 'modified_by',        type : 'string' },
      { name : 'modified_date',      type : 'string' },
      { name : 'profile_field_01',   type : 'string' },
      { name : 'profile_field_02',   type : 'string' },
      { name : 'profile_field_03',   type : 'string' },
      { name : 'profile_field_04',   type : 'string' },
      { name : 'profile_field_05',   type : 'string' },
      { name : 'profile_field_06',   type : 'string' },
      { name : 'profile_field_07',   type : 'string' },
      { name : 'profile_field_08',   type : 'string' },
      { name : 'profile_field_09',   type : 'string' },
      { name : 'profile_field_10',   type : 'string' },
      { name : 'profile_field_11',   type : 'string' },
      { name : 'profile_field_12',   type : 'string' },
      { name : 'profile_field_13',   type : 'string' },
      { name : 'profile_field_14',   type : 'string' },
      { name : 'profile_field_15',   type : 'string' },
    ]
  });

  /****
  *  Contact store
  ****/
  var store = Ext.create('Ext.data.Store', {
                model           : 'indigo.contact_model',
                clearOnPageLoad : true,
                autoLoad        : true,
                pageSize        : 20,
                proxy           : {
                  type          : 'ajax',
                  url           : 'fetch_contacts.php',
                  actionMethods : {
                    create  : 'POST',
                    read    : 'POST',
                    update  : 'POST',
                    destroy : 'POST'
                  },
                  reader        : {
                    id            : 'term',
                    type          : 'json',
                    root          : 'results',
                    totalProperty : 'total'
                  },
                  extraParams     : {
                    filseg_id : p_filseg_id,
                    type      : p_type
                  }
                },
                extraParams     : {
                  search : ''
                }
              });

  /****
  *  Profile label model
  ****/
  Ext.define('indigo.profile_label_model', {
    extend: 'Ext.data.Model',
    fields: [
//      { name : 'field_id',    type : 'int'    },
      { name : 'field_label', type : 'string' }
    ]
  });

  /****
  *  Profile label store
  *
  *  Tried looping through the array right after load
*
  *  but need a loop back as async
  ****/
  var s_profile_label = Ext.create('Ext.data.Store', {
                          model           : 'indigo.profile_label_model',
                          clearOnPageLoad : true,
                          autoLoad        : true,
                          pageSize        : 256,
                          proxy           : {
                            type          : 'ajax',
                            url           : 'fetch_profile_labels.php',
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
  *  Contact search model
  ****/
  Ext.define('indigo.contact_search_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'field_id',    type : 'int'    },
      { name : 'field_label', type : 'string' },
      { name : 'view_column', type : 'string' }
    ]
  });

  /****
  *  Contact search store
  ****/
  var s_contact_search = Ext.create('Ext.data.Store', {
                           model           : 'indigo.contact_search_model',
                           clearOnPageLoad : true,
                           autoLoad        : true,
                           pageSize        : 256,
                           proxy           : {
                             type          : 'ajax',
                             url           : 'fetch_contact_search.php',
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

/*
  if ( p_filseg_id > 0 ) {
    store.loadPage(1);
  };
*/

  /****
  *  Contacts grid
  ****/
  return Ext.define('indigo.g_contacts', {
           extend         : 'Ext.grid.Panel',
           id             : 'g_contacts'+p_filseg_id,
           alias          : 'widget.g_contacts',
           title          : 'Contacts',
           store          : store,
           trackMouseOver : true,
           layout         : 'fit',
           loadMask       : true,
           enableHdMenu   : true,
           stripeRows     : true,
           autoRender     : true,
           autoShow       : true,
           listeners      : {

             /****
             *  Not 100% sure this is the best 
             *  way to hook in an extra parameter
             ****/
             itemdblclick : function ( 
                              p_grid,
                              p_record,
                              p_item,
                              p_index,
                              p_object
                            ) {

                              f_contact (
                                p_grid,
                                p_record,
                                p_item,
                                p_index,
                                p_object,
                                s_profile_label
                              )
                             }

           },
           columns        : [ 
             {
               id        : 'gc_c1'+p_filseg_id,
               text      : 'Contact ID',
               width     : 80,
               sortable  : true,
               dataIndex : 'contact_id' 
             },
             {
               id        : 'gc_c2'+p_filseg_id,
               text      : 'Client ID',
               width     : 80,
               sortable  : true,
               dataIndex : 'client_id' 
             }, 
             {
               id        : 'gc_c3'+p_filseg_id,
               text      : 'Name',
               width     : 150,
               sortable  : true,
               dataIndex : 'full_name'
             }, 
             {
               id        : 'gc_c4'+p_filseg_id,
               text      : 'Email Address',
               flex      : 1,
               sortable  : true,
               dataIndex : 'email_address'
             }
           ],
           dockedItems    : [
             {
               xtype       : 'pagingtoolbar',
               id          : 'pt_bottom'+p_filseg_id,
               name        : 'pt_bottom'+p_filseg_id,
               store       : store,
               dock        : 'bottom',
               displayInfo : true,
               displayMsg  : 'Displaying rows {0} - {1} of {2}',
               emptyMsg    : "No data to display",
               pageSize    : 20
             }, 
             {
               xtype       : 'toolbar',
               id          : 't_top'+p_filseg_id,
               dock        : 'top',
               items: [ 
                 {
                   xtype   : 'button',
                   id      : 'gc_btn_search'+p_filseg_id,
                   name    : 'gc_search'+p_filseg_id,
                   text    : 'Search',
                   icon    : 'icons/search_blue_16.png',
                   cls     : 'x-btn-text-icon',
                   handler : function() {

                     /****
                     *  Send the search string to the PHP code
                     *  NOTE: this must happen after the grid has been rendered
                     ****/
                     store.on('beforeload', function() {
                       store.getProxy().extraParams.search = Ext.getCmp('gc_search'+p_filseg_id).value;
                       store.getProxy().extraParams.filter = Ext.getCmp('gc_search_combo'+p_filseg_id).value;
                     });
                     store.loadPage(1);
                   }
                 },
                 {
                   xtype     : 'textfield',  // add a listener to search when user hits enter
                   id        : 'gc_search'+p_filseg_id,
                   emptyText : 'enter search term'
                 }, 
                 {
                   xtype          : 'combobox',
                   id             : 'gc_search_combo'+p_filseg_id,
                   name           : 'gc_search_combo'+p_filseg_id,
                   store          : s_contact_search,
                   valueField     : 'view_column',
                   displayField   : 'field_label',
                   value          : 'field_label',
                   typeAhead      : true,
                   queryMode      : 'local',  // this prevents the store being loaded > once
                   forceSelection : true,
                   emptyText      : 'select'
                 }
/*
                 {
                   xtype : 'tbspacer', 
                   id    : 'gc_tb_spacer'+p_filseg_id,
                   width : 180
                 },
                 {
                   xtype   : 'button',
                   id      : 'gc_filter_button'+p_filseg_id,
                   text    : 'Filters',
                   iconCls : 'filter',
                   menu    : {
                     id :'cfm'+p_filseg_id,
                     xtype: 'menu',
                     showSeparator: false,
                     forceLayout: true,
                     width:  100,
                     items: [
                       {
                         id    : 'cfmi1'+p_filseg_id,
                         xtype : 'menuitem',
                         width   : 75,
                         text    : 'Create',
//                         handler : f_create_contact_filter
                       },
                       {
                         id    : 'cfmi2'+p_filseg_id,
                         xtype : 'menuitem',
                         width   : 75,
                         text    : 'Select',
  //                     handler : f_select_contact_filter
                       }
                     ]
                   }
                 }
*/
               ]
             }
           ]
         });

};
