/*******************************************************************************
* Indigo
********************************************************************************
* Name          : contact_filter.js
* Description   : contact filter functionality
* Author        : Scott Walkinshaw
* Date          : 4th June 2011
* Parameters    : 
* Comments      : 
  Ext.Msg.alert('Status', 'test');
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 04 Jun 11 | Initial issue                                     *
*******************************************************************************/
function f_contact_filters() {

  /****
  *  Filter operator model
  ****/
  Ext.define('indigo.filter_operator_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'operator_id', type : 'int'    },
      { name : 'operator',    type : 'string' }
    ]
  });

  /****
  *  Filter operator store
  ****/
  var s_filter_operator = Ext.create('Ext.data.Store', {
                            model           : 'indigo.filter_operator_model',
                            clearOnPageLoad : true,
                            autoLoad        : true,
                            pageSize        : 256,
                            proxy           : {
                              type          : 'ajax',
                              url           : 'fetch_filter_operators.php',
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
  *  Contact filter model
  ****/
  Ext.define('indigo.contact_filter_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'field_id',    type : 'int'    },
      { name : 'field_label', type : 'string' },
      { name : 'view_column', type : 'string' }
    ]
  });

  /****
  *  Contact filter store
  ****/
  var s_contact_filter = Ext.create('Ext.data.Store', {
                           model           : 'indigo.contact_filter_model',
                           clearOnPageLoad : true,
                           autoLoad        : true,
                           pageSize        : 256,
                           proxy           : {
                             type          : 'ajax',
                             url           : 'fetch_contact_filters.php',
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
  *  Form panel to hold profile data
  ****/
  var fp_c_filter =  Ext.create('Ext.form.Panel', {
                       xtype         : 'form',
                       id            : 'fp_c_filter',
                       frame         : true,
                       fieldDefaults: {
                         labelAlign : 'top',
                         labelWidth : 100,
                         labelStyle : 'font-weight:bold'
                       },
                       items:       [
                         {
                           xtype         : 'fieldcontainer',
                           layout        : 'hbox',
                           defaultType   : 'textfield',
                           fieldDefaults : {
                             labelAlign     : 'top',
                             labelSeparator : ' '
                           },
                           items: [
                             {
                               xtype          : 'combobox',
                               id             : 'fpcf1',
                               store          : s_contact_filter,
                               fieldLabel     : 'Profile Field',
                               labelStyle     : 'font-weight:bold;padding:0',
                               valueField     : 'view_column',
                               displayField   : 'field_label',
                               value          : 'field_label',
                               typeAhead      : true,
                               queryMode      : 'local',  // this prevents the store being loaded > once
                               forceSelection : true,
			       margins: '0 0 0 5'
                             },
                             {
                               xtype          : 'combobox',
                               id             : 'fpcf2',
                               width          : 85,
                               store          : s_filter_operator,
                               fieldLabel     : 'Operator',
                               labelStyle     : 'font-weight:bold;padding:0',
                               valueField     : 'operator',
                               displayField   : 'operator',
                               value          : 'operator',
                               typeAhead      : true,
                               queryMode      : 'local',  // this prevents the store being loaded > once
                               forceSelection : true,
			       margins: '0 0 0 5'
                             },
                             {
                               id : 'fpcf3',
                               flex: 2,
                               fieldLabel: 'Value',
                               labelStyle: 'font-weight:bold;padding:0',
                               allowBlank: false,
                               margins: '0 0 0 5'
                             }
                           ]
                         }
                       ],
                       dockedItems: [
                         {
                           xtype       : 'toolbar',
                           id          : 'ua_t_bottom',
                           name        : 'ua_t_bottom',
                           dock        : 'bottom',
                           layout      : {
                             pack: 'center'
                           },
                           items: [
                             {
                               xtype    : 'button',
                               id       : 'cfb_count',
                               width    : 80,
                               height   : 30,
//                             formBind : true,
                               disabled : true,
                               frame    : true,
                               border   : true,
                               type     : 'submit',
                               text     : 'Count',
                               icon     : 'icons/calc_blue_24.png',
                               cls      : 'x-btn-text-icon',
/*
                               handler  : function() {
                                            f_submit('-', v_action)
                                          }
*/
                             }
                           ]
                         }
                       ]
                     });
/*, {
                            xtype   : 'button',
                            id      : 'b_delete',
                            name    : 'b_delete',
                            width   : 80,
                            height  : 30,
                            frame   : true,
                            border  : true,
                            type    : 'submit',
                            text    : 'Delete',
                            icon    : 'icons/web2_blue/24x24/Trash.png',
                            cls     : 'x-btn-text-icon',
                            hidden  : v_hidden_dl,
                            handler : function() {
                                        f_submit('-', 'D')
                                      }

                          }, {
                            xtype   : 'button',
                            id      : 'b_clear',
                            name    : 'b_clear',
                            width   : 80,
                            height  : 30,
                            type    : 'reset',
                            text    : 'Clear',
                            icon    : 'icons/web2_blue/24x24/Back.png',
                            cls     : 'x-btn-text-icon',
                            hidden  : v_hidden_cl,
                            handler : function() {
                                         f_reset_form('f_user');
                                       }
                          }]
*/



  /****
  *  Modal window to hold contact profile data
  ****/
  var w_filter = Ext.create('Ext.Window', {
                   id          : 'w_create_filter',
                   title       : 'Create Filter',
                   height      : 400,
                   width       : 500,
                   resizable   : false,
                   draggable   : true,
                   modal       : true,
                   closeAction : 'destroy',
                   layout      : 'fit',
                   frame       : false,
                   items       : [fp_c_filter]
                 });
  /****
  *  Open the window
  ****/
  w_filter.show();

};


