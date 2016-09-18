/*******************************************************************************
* Indigo
********************************************************************************
* Name          : campaigns.js
* Description   : handles campaign campaigns
* Author        : Scott Walkinshaw
* Date          : 3rd January 2012
* Parameters    : 
* Comments      :
  Ext.Msg.alert('test1');

********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 03 Jan 12 | Initial issue                                     *
*******************************************************************************/
function f_campaigns() {

  /****
  *  Function    : f_campaign_type
  *  Description : reloads store for selected campaign type
  ****/
  function f_campaign_type (
             p_item,
             p_checked
           ) {

    /****
    *  Change the grid title
    ****/
    Ext.getCmp('g_campaigns').setTitle('Campaigns : ' + p_item.text);

    /****
    *  Load selected segment type
    ****/
    Ext.getCmp('g_campaigns').getStore().getProxy().extraParams.status = p_item.text;
    Ext.getCmp('g_campaigns').getStore().loadPage(1);
  };

  /****
  *  Function    : f_campaign_detail
  *  Description : functionality to modify/create campaigns
  ****/
  function f_campaign_detail (
             p_grid,
             p_record,
             p_item,
             p_index,
             p_object
           ) {

    /****
    *  Creating or modifying?
    ****/
    if (p_grid) {
      var v_action   = 'U';
      var v_hidden   = false;
      var v_record   = p_grid.getStore().getAt(p_index);;
      var v_campaign_id = v_record.get('campaign_id');

      var v_readonly = true;
      var v_load     = false;
    } else {
      var v_action   = 'I';
      var v_hidden   = true;
      var v_readonly = false;
      var v_load     = true;
      var v_campaign_id = 0;
    };

    /****
    *  Variable to hold number of segments
    ****/
    var v_segments = 0;

    /****
    *  Campaign type model
    ****/
    Ext.define('indigo.campaign_type_model', {
      extend: 'Ext.data.Model',
      fields: [
        { name : 'campaign_type_id', type : 'int'    },
        { name : 'campaign_type',    type : 'string' }
      ]
    });

    /****
    *  Campaign type store
    ****/
    var s_campaign_type = Ext.create('Ext.data.Store', {
                            model           : 'indigo.campaign_type_model',
                            clearOnPageLoad : true,
                            autoLoad        : v_load,
                            pageSize        : 256,
                            proxy           : {
                              type          : 'ajax',
                              url           : 'fetch_campaign_types.php',
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
    *  Active segments model
    *  these are segments that can be added to campaigns
    ****/
    Ext.define('indigo.active_segments_model', {
      extend: 'Ext.data.Model',
      fields: [
        { name : 'segment_id',   type : 'int'    },
        { name : 'segment_name', type : 'string' }
      ]
    });

    /****
    *  Active segment store
    ****/
    var s_active_segments = Ext.create('Ext.data.Store', {
                              model           : 'indigo.active_segments_model',
                              clearOnPageLoad : true,
                              autoLoad        : true,
                              pageSize        : 256,
                              proxy           : {
                                type          : 'ajax',
                                url           : 'fetch_active_segments.php',
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
    *  Campaign segment model
    *  these are segments that have already been added to campaigns
    ****/
    Ext.define('indigo.campaign_segments_model', {
      extend: 'Ext.data.Model',
      fields: [
        { name : 'segment_id',   type : 'int'    },
        { name : 'segment_name', type : 'string' }
      ]
    });

    /****
    *  Campaign segment store
    ****/
    var s_campaign_segments = Ext.create('Ext.data.Store', {
                                model           : 'indigo.campaign_segments_model',
                                clearOnPageLoad : true,
                                autoLoad        : false,
                                pageSize        : 256,
                                proxy           : {
                                  type          : 'ajax',
                                  url           : 'fetch_campaign_segments.php',
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
                                extraParams   : {
                                  campaign_id : v_campaign_id
                                }
                              }
                            });
    /****
    *  Emails to add to campaign
    ****/
    Ext.define('indigo.campaign_emails_model', {
      extend: 'Ext.data.Model',
      fields: [
        { name : 'email_id',   type : 'int'    },
        { name : 'email_name', type : 'string' }
      ]
    });

    /****
    *  Campaign emails store
    ****/
    var s_campaign_emails = Ext.create('Ext.data.Store', {
                              model           : 'indigo.campaign_emails_model',
                              clearOnPageLoad : true,
                              autoLoad        : v_load,
                              pageSize        : 256,
                              proxy           : {
                                type          : 'ajax',
                                url           : 'fetch_campaign_emails.php',
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
    *  Custom vtype to ensure end date is after start date
    ****/
    Ext.apply(Ext.form.field.VTypes, {
      daterange: function(val, field) {
        var date = field.parseDate(val);
          if (!date) {
            return false;
          }
          if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
             var start = field.up('form').down('#' + field.startDateField);
             start.setMaxValue(date);
             start.validate();
             this.dateRangeMax = date;
          } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
             var end = field.up('form').down('#' + field.endDateField);
             end.setMinValue(date);
             end.validate();
             this.dateRangeMin = date;
          }
          return true;
        },

        daterangeText: 'Start date must be less than end date',
    });

    /****
    *  Form panel to hold campaign details
    ****/
    var fp_campaign_detail = Ext.create('Ext.form.Panel', {
                             xtype         : 'form',
                             id            : 'fp_campaign_detail',
                             frame         : true,
                             autoScroll    : true,
                             layoutConfig  : {
                               trackLabels : true,
                             },
                             items:       [
                               {
                                 xtype         : 'fieldset',
                                 id            : 'fp_cd_fs1',
                                 title         : 'Campaign',
                                 layout        : 'anchor',
                                 defaultType   : 'textfield',
                                 fieldDefaults : {
                                   labelAlign     : 'left',
                                   labelSeparator : ':'
                                 },
                                 items: [
                                   {
                                     xtype      : 'hiddenfield',
                                     id         : 'fp_cd_fs1_f1',
                                     name       : 'campaign_id',
                                     width      : 200,
                                     readOnly   : true
                                   },
                                   {
                                     xtype      : 'textfield',
                                     id         : 'fp_cd_fs1_f2',
                                     name       : 'campaign_name',
                                     width      : 500,
                                     readOnly   : false,
                                     allowBlank : false,
                                     maxLength  : 32,
                                     fieldLabel : 'Campaign Name',
                                     listeners : {
                                       change : f_validate_campaign
                                     }
                                   },
                                   {
                                     xtype      : 'textarea',
                                     id         :'fp_cd_fs1_f3',
                                     name       : 'description',
                                     width      : 500,
                                     height     : 100,
                                     readOnly   : false,
                                     allowBlank : false,
                                     maxLength  : 256,
                                     fieldLabel : 'Description',
                                     listeners : {
                                       change : f_validate_campaign
                                     }
                                   },
/*
                                   {
                                     xtype          : 'combobox',
                                     id             : 'fp_cd_fs1_f4',
                                     name           : 'campaign_type_id',
                                     width          : 200,
                                     store          : s_campaign_type,
                                     fieldLabel     : 'Campaign Type',
                                     valueField     : 'campaign_type_id',
                                     displayField   : 'campaign_type',
                                     value          : 'campaign_type',
                                     queryMode      : 'local',
                                     allowBlank     : false,
                                     forceSelection : true,
                                     emptyText      : 'select',
                                     readOnly       : v_readonly,
                                     listeners      : {
                                       change : f_validate_campaign
                                     }
                                   },
*/
                                   {
                                     xtype        : 'datefield',
                                     id           : 'fp_cd_fs1_f5',
                                     name         : 'start_date',
                                     format       : 'd/m/Y',
                                     width        : 200,
                                     fieldLabel   : 'Start Date',
                                     tooltip      : 'Campaign emails can be throttled over a period',
                                     hidden       : false,
                                     allowBlank   : false,
                                     vtype        : 'daterange',
                                     endDateField : 'fp_cd_fs1_f6',
                                     listeners      : {
                                       change : f_validate_campaign
                                     }
                                   },
                                   {
                                     xtype          : 'datefield',
                                     id             : 'fp_cd_fs1_f6',
                                     name           : 'end_date',
                                     format         : 'd/m/Y',
                                     width          : 200,
                                     fieldLabel     : 'End Date',
                                     allowBlank     : false,
                                     hidden         : false,
                                     vtype          : 'daterange',
                                     tooltip      : 'Campaign emails can be throttled over a period',
                                     startDateField : 'fp_cd_fs1_f5',
                                     listeners      : {
                                       change : f_validate_campaign
                                     }
                                   },
                                   {
                                     xtype      : 'displayfield',
                                     id         : 'fp_cd_fs1_f7',
                                     fieldLabel : 'Campaign Status',
                                     hidden     : v_hidden
                                   },
/*
                                   {
                                     xtype      : 'displayfield',
                                     id         :'fp_cd_fs1_f8',
                                     fieldLabel : 'Created Date',
                                     hidden     : v_hidden
                                   },
                                   {
                                     xtype      : 'displayfield',
                                     id         : 'fp_cd_fs1_f9',
                                     fieldLabel : 'Created By',
                                     hidden     : v_hidden
                                   },
                                   {
                                     xtype      : 'displayfield',
                                     id         : 'fp_cd_fs1_f10',
                                     fieldLabel : 'Modified Date',
                                     hidden     : v_hidden
                                   },
                                   {
                                     xtype      : 'displayfield',
                                     id         : 'fp_cd_fs1_f11',
                                     fieldLabel : 'Modified By',
                                     hidden     : v_hidden
                                   }
*/
                                 ]
                               },
                              {
                                xtype         : 'fieldset',
                                id            : 'fp_cpd_fs2',
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
                                        id         : 'fp_cd_cb',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Created By'
                                      },
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_cd_mb',
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
                                        id         : 'fp_cd_cd',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Created Date',
                                      },
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_cd_md',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Modified Date',
                                      },
                                    ]
                                  },
                                ]
                              },
                               {
                                 xtype         : 'fieldset',
                                 id            : 'fp_cd_fs3',
                                 title         : 'Email',
                                 layout        : 'anchor',
                                 layoutConfig: {
                                   trackLabels: true,
                                 },
                                 items : [
                                   {
                                     xtype          : 'combobox',
                                     id             : 'fp_cd_cb1',
                                     name           : 'email_id',
                                     width          : 250,
                                     store          : s_campaign_emails,
                                     disabled       : false,
                                     valueField     : 'email_id',
                                     displayField   : 'email_name',
                                     typeAhead      : true,
                                     queryMode      : 'local',
                                     forceSelection : true,
                                     emptyText      : 'select',
                                     allowBlank     : false,
                                     listeners      : {
                                       change   : f_validate_campaign
                                     }
                                   }
                                 ]
                               },
                               {
                                 xtype         : 'fieldset',
                                 id            : 'fp_cd_fs2',
                                 title         : 'Segments',
                                 layout        : 'anchor',
                                 layoutConfig: {
                                   trackLabels: true,
                                 },
                                 items         : [
                                   {
                                     xtype: 'fieldcontainer',
                                     layout: 'anchor',
                                     margin: '0',
                                     items: [
                                       {
                                         xtype: 'fieldcontainer',
                                         height: 20,
                                         layout: 'hbox',
                                         items: [
                                           {
                                             xtype : 'displayfield',
                                             value : 'Segment Name',
                                             width : 150
                                           },
                                           {
                                             xtype: 'displayfield',
                                             value: '',
                                             width : 75
                                           }
                                         ]
                                       }
                                     ]
                                   },
                                   {
                                      xtype  : 'fieldcontainer',
                                      layout : 'anchor',
                                      id     : 'fp_cd_segs',
                                      layoutConfig: {
                                        trackLabels: true,
                                      },
                                      margin : '0',
                                      items  : []
                                   },
                                   {
                                     xtype: 'fieldcontainer',
                                     layout: 'hbox',
                                     items: [
                                       {
                                         xtype : 'displayfield',
                                         value : '',
                                         flex  : 3
                                       },
                                       {
                                         xtype   : 'button',
                                         id      : 'fp_cd_add',
                                         width   : 75,
                                         disabled : true,
                                         text    : 'Add',
                                         icon    : 'icons/plus_blue_16.png',
                                         cls     : 'x-btn-text-icon',
                                         handler : function() {
                                                     f_add_segment('N', '');
                                                   }
                                       }
                                     ]
                                   }
                                 ]
                               },
                             ],
                             dockedItems: [
                               {
                                 xtype       : 'toolbar',
                                 id          : 'fp_cd_b_toolbar',
                                 dock        : 'bottom',
                                 layout      : {
                                   pack: 'center'
                                 },
                                 items: [
                                 {
                                   xtype     : 'button',
                                   id        : 'fp_cd_live',
                                   width     : 80,
                                   disabled  : true,
                                   frame     : true,
                                   border    : true,
                                   type      : 'submit',
                                   scale     : 'medium',
                                   text      : 'Live Send',
                                   icon      : 'icons/exclamation_red_24.png',
                                   iconAlign : 'top',
                                   cls       : 'x-btn-text-icon',
                                   tooltip   : 'Live Send',
                                   handler   : function() {

                                     f_submit_form (
                                       'L',
                                       'w_campaign_detail',
                                       'g_campaigns',
                                       'fp_campaign_detail',
                                       'live_send.php',
                                       'fp_ed1',
                                       '',
                                       'Y'
                                     );
                                   }
                                  },
                                  {
                                     xtype     : 'button',
                                     id        : 'fp_cd_save',
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
                                       if (Ext.getCmp('fp_cd_fs1_f1').value) {

                                         f_submit_form (
                                           'U',
                                           'w_campaign_detail',
                                           'g_campaigns',
                                           'fp_campaign_detail',
                                           'campaign_maintenance.php',
                                           'fp_cd_fs1_f1',
                                           '',
                                           'Y'
                                         );
                                       } else {
                                         f_submit_form (
                                           'I',
                                           'w_campaign_detail',
                                           'g_campaigns',
                                           'fp_campaign_detail',
                                           'campaign_maintenance.php',
                                           'fp_cd_fs1_f1',
                                           '',
                                           'N'
                                         );
                                       };

                                       /****
                                       *  Enable the delete and live send buttons once saved
                                       ****/
                                       Ext.getCmp('fp_cd_delete').enable(true);
                                       Ext.getCmp('fp_cd_live').enable(true);
                                     }
                                   },
                                   {
                                     xtype     : 'button',
                                     id        : 'fp_cd_delete',
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
                                         'w_campaign_detail',
                                         'g_campaigns',
                                         'fp_campaign_detail',
                                         'campaign_maintenance.php',
                                         'fp_cd_fs1_f1',
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
    *  Function    : f_validate_campaign
    *  Description : is called when a form field is changed
    *                and determines whether the form is valid
    ****/
    function f_validate_campaign (
               p_event
             ) {

      /****
      *  Toggle enabling of save/delete button
      *  buttons depending on form validity
      ****/
      if ( Ext.getCmp('fp_campaign_detail').getForm().isValid() == true ) {
        Ext.getCmp('fp_cd_save').enable(true);
        Ext.getCmp('fp_cd_delete').enable(true);

        /****
        *  Maximum of 2 segments
        ****/
        if ( v_segments < 2 ) {

            Ext.getCmp('fp_cd_add').enable(true);
          };

      } else {
        Ext.getCmp('fp_cd_save').disable(true);
        Ext.getCmp('fp_cd_delete').disable(true);
        Ext.getCmp('fp_cd_add').disable(true);
      };

    };

    /****
    *  If we are dealing with an existing
    *  campaign populate the fields
    ****/
    if ( v_action == 'U' ) {

      Ext.getCmp('fp_cd_fs1_f1').setValue(v_record.get('campaign_id'));
      Ext.getCmp('fp_cd_fs1_f2').setValue(v_record.get('campaign_name'));
      Ext.getCmp('fp_cd_fs1_f3').setValue(v_record.get('description'));
      Ext.getCmp('fp_cd_fs1_f5').setValue(v_record.get('start_date'));
      Ext.getCmp('fp_cd_fs1_f6').setValue(v_record.get('end_date'))
      Ext.getCmp('fp_cd_fs1_f7').setValue(v_record.get('campaign_status'));

      /****
      *  Audit trail fields
      ****/
      Ext.getCmp('fp_cd_cd').setValue(v_record.get('created_date'))
      Ext.getCmp('fp_cd_cb').setValue(v_record.get('created_by'))
      Ext.getCmp('fp_cd_md').setValue(v_record.get('modified_date'))
      Ext.getCmp('fp_cd_mb').setValue(v_record.get('modified_by'))

      /****
      *  Also enable the delete and live send buttons
      ****/
      Ext.getCmp('fp_cd_delete').enable(true);
      Ext.getCmp('fp_cd_live').enable(true);

      /****
      *  Load the stores we need callbacks for
      s_campaign_type.load ({
        callback :  function(records, options, success) {

          Ext.getCmp('fp_cd_fs1_f4').setValue(v_record.get('campaign_type_id'));
        }
      });
      ****/

      s_campaign_emails.load ({
        callback :  function(records, options, success) {
          Ext.getCmp('fp_cd_cb1').setValue(v_record.get('email_id'));
        }
      });
    };

    /****
    *  Function    : f_add_segment
    *  Description : adds segments to the campaign
    *  Notes       : if we're adding a fieldcontainer for
    *                and existing rule populate the fields
    *
    *  obj and e passed in from the hadler
    ****/
    function f_add_segment (
               p_first,
               p_segment_id
             ) {


      /****
      *  Check if this is the first time
      *  the function has been called, if
      *  if is we want to hide the and/or combo
      *  and the delete button
      ****/
      if ( p_first == 'Y' ) {
        var v_disabled = true;
      };

      /****
      *  Add a fieldcontainer into fieldcontainer fp_cd_segs
      ****/
      Ext.getCmp('fp_campaign_detail').down('#fp_cd_segs').add([{
        xtype        : 'fieldcontainer',
        height       : 22,
        layout       : 'hbox',
        autoDestroy  : true,
        layoutConfig : {
          trackLabels  : true,
        },
        defaultType : 'textfield',
        items : [
          {
            xtype          : 'combobox',
            name           : 'segment_id[]',
            width          : 250,
            store          : s_active_segments,
            disabled       : false,
            valueField     : 'segment_id',
            displayField   : 'segment_name',
            value          : p_segment_id,
            typeAhead      : true,
            queryMode      : 'local',
            forceSelection : true,
            emptyText      : 'select',
            allowBlank     : false,
            listeners      : {
              change   : f_validate_campaign
            }
          },
          {
            xtype : 'displayfield',
            value : '',
            flex  : 3
          },
          {
            xtype    : 'button',
            name     : 'fas_delete[]',
            width    : 75,
            disabled : v_disabled,
            text     : 'Delete',
            icon     : 'icons/cancel_red_16.png',
            cls      : 'x-btn-text-icon',
            handler  : f_delete_rule
          }

        ]
      }]);

      /****
      *  Now that a rule record has 
      *  been added disable the save button
      *  until the form has been validated again
      ****/
      Ext.getCmp('fp_cd_save').disable(true);

      /****
      *  If it's an existing campaign
      *  enable the add button otherwise disable
      ****/
      if (p_segment_id) {
        Ext.getCmp('fp_cd_add').enable(true);
      } else {
        Ext.getCmp('fp_cd_add').disable(true);
      };

      /****
      *  Increment number of segments
      ****/
      v_segments++;
    };

    /****
    *  Function    : f_delete_segment
    *  Description : deletes a segment from the campaign
    *
    *  obj and e passed in from the handler
    ****/
    function f_delete_rule (
               p_button,
               e
             ) {
       /****
       *  Get the ID of the fieldcontainer to remove
       *  and the parent fieldcontainer (cf_rows)
       ****/
       var fc = p_button.up('fieldcontainer');
       var cr = p_button.up('#fp_cd_segs');

       /****
       *  Firstly remove and destroy the items in the fieldcontainer
       *  if you don't do this first then the items are not removed
       *  correctly from the form and their values are visible when submitting
       ****/
       p_button.up('fieldcontainer').removeAll(true);

       /****
       *  Then remove the fieldcontainer itself
       ****/
       cr.remove(fc).id;

       /****
       *  Decrement number of rules
       ****/
       v_segments--;

       /****
       *  Revalidate the form to enable the buttons
       ****/
       f_validate_campaign();
    };

    /****
    *  Modal window to hold campaign detail
    ****/
    var w_campaign_detail = Ext.create('Ext.Window', {
                            id          : 'w_campaign_detail',
                            title       : 'Campaign',
                            height      : 610,
                            width       : 600,
                            resizable   : false,
                            draggable   : true,
                            modal       : true,
                            closeAction : 'destroy',
                            layout      : 'fit',
                            frame       : false,
/*
                            listeners : {
                                beforeclose : function() {
                                                s_campaigns.loadPage(s_camapigns.currentPage);
                                               }
                             },
*/
                            items       : [fp_campaign_detail]
                         });
    /****
    *  Open the window & add the first rule set
    ****/
    w_campaign_detail.show();

    /****
    *  Add an empty segment field container
    *  if we're creating a new campaign
    ****/
    if ( v_action == 'I' ) {
      f_add_segment('Y');
    } else {

      /****
      *  Load the campaign_segments store with a callback
      *  so the segments can be added after the AJAX call completes
      ****/
      s_campaign_segments.load ({
        callback :  function(records, options, success) {

          /****
          *  Add a fieldcontainer for each
          *  rule and populate the fields
          ****/
          var v_i = 1;
          s_campaign_segments.each (
            function (record) {

              if ( v_i == 1 ) {
                f_add_segment (
                  'Y',
                  record.get('segment_id')
                )
                v_i++;
              } else {
                f_add_rule (
                  'N',
                  record.get('segment_id')
                )
              }
            }
          )
        }
      });
    }
  };

  /****
  *  Campaign model
  ****/
  Ext.define('indigo.campaign_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'campaign_id',        type : 'int'}, 
      { name : 'campaign_type_id',   type : 'int'}, 
      { name : 'campaign_type',      type : 'string'}, 
      { name : 'campaign_name',      type : 'string'}, 
      { name : 'campaign_status',    type : 'string'}, 
      { name : 'campaign_email_id',  type : 'int'}, 
      { name : 'description',        type : 'string'}, 
      { name : 'start_date',         type : 'string'}, 
      { name : 'end_date',           type : 'string'}, 
      { name : 'email_id',           type : 'string'}, 
      { name : 'email_name',         type : 'string'}, 
      { name : 'created_by',         type : 'string'},
      { name : 'created_date',       type : 'string'},
      { name : 'modified_by',        type : 'string'},
      { name : 'modified_date',      type : 'string'},
    ]
  });

  /****
  *  Campaign store
  ****/
  var s_campaigns = Ext.create('Ext.data.Store', {
                     model           : 'indigo.campaign_model',
                     clearOnPageLoad : true,
                     autoLoad        : true,
                     proxy           : {
                     type            : 'ajax',
                     url             : 'fetch_campaigns.php',
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
  *  Campaign grid
  ****/
  return Ext.define('indigo.g_campaigns', {
           extend         : 'Ext.grid.Panel',
           id             : 'g_campaigns',
           alias          : 'widget.g_campaigns',
           title          : 'Campaigns',
           store          : s_campaigns,
           trackMouseOver : true,
           layout         : 'fit',
           loadMask       : true,
           enableHdMenu   : true,
           stripeRows     : true,
           autoRender     : true,
           autoShow       : true,
           listeners      : {
             itemdblclick : f_campaign_detail
           },
           columns        : [
             {
               id        : 'gcm_c1',
               text      : 'Campaign ID',
               width     : 80,
               sortable  : true,
               dataIndex : 'campaign_id' 
             }, 
             {
               id        : 'gcm_c2',
               text      : 'Campaign Name',
               width     : 150,
               sortable  : true,
               dataIndex : 'campaign_name'
             },
             {
               id        : 'gcm_c3',
               text      : 'Campaign Type',
               width     : 100,
               sortable  : true,
               dataIndex : 'campaign_type'
             },
             {
               id        : 'gcm_c4',
               text      : 'Status',
               width     : 100,
               sortable  : true,
               dataIndex : 'campaign_status'
             },
             {
               id        : 'gcm_c5',
               text      : 'Start Date',
               width     : 100,
               sortable  : true,
               dataIndex : 'start_date'
             },
             {
               id        : 'gsm_c5',
               text      : 'End Date',
               flex      : 1,
               sortable  : true,
               dataIndex : 'end_date'
             }
           ],
           dockedItems    : [
             {
               xtype       : 'pagingtoolbar',
               id          : 'gcmt_bottom',
               name        : 'gcmt_bottom',
               store       : s_campaigns,
               dock        : 'bottom',
               displayInfo : true,
               displayMsg  : 'Displaying rows {0} - {1} of {2}',
                emptyMsg    : "No data to display",
                pageSize    : 25
             },
             {     
               xtype       : 'toolbar',
               id          : 'gcmt_top',
               name        : 'gcmt_top',
               dock        : 'top',
               items: [ 
                {
                   xtype   : 'button',
                   id      : 'gcm_tb_b_create',
                   text    : 'Create',
                   icon    : 'icons/plus_blue_16.png',
                   cls     : 'x-btn-text-icon',
                   handler : function() {
                               f_campaign_detail()
                             }
                 },
                 {
                   xtype : 'tbspacer',
                   id    : 'gcm_tb_spacer',
                   width : 5
                 },
                 {
                   xtype    : 'button',
                   text     : 'Status',
                   icon     : 'icons/discuss_blue_16.png',
                   cls      : 'x-btn-text-icon',
                   menu     : {
                     defaults : {
                       checked : false,
                       group   : 'campaign_type'  // radio buttons
                     },
                     items : [
                       {
                          text         : 'All',
                          checked      : true,
                          checkHandler : f_campaign_type
                       },
                       {
                         text         : 'Active',
                         checkHandler : f_campaign_type
                       }, 
                       {
                         text         : 'Expired',
                         checkHandler : f_campaign_type
                       }
                     ]
                   }
                 }
               ]
             }
           ]
         });

};
