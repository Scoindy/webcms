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
function f_dashboard (
           p_records,
           p_contacts_chart
         ) {

  /****
  *  There will only be 1 record in p_records
  var v_record = p_records[0];
  ****/


      /****
      *  Contacts pie chart
      ****/
      var c_contacts = Ext.create('Ext.chart.Chart', {
                         animate      : true,
                         shadow       : true,
                         store        : p_contacts_chart,
//                         insetPadding : 25,  // margins from the parent container
                         legend: {
                           position : 'right'
                         },
                         series       : [{
                           type         : 'pie',
                           field        : 'count',
                           showInLegend : true,
                           donut        : 35,  // size of hole
                           colorSet     : [
                             '#33CC33',
                             '#FF3300',
                             '#0066FF',
                             '#FF9933',
                             '#FF33CC'
                           ],
                           highlight : {
                             segment : {
                               margin : 10
                             }
                           },
                           tips : {
                             trackMouse: true,
                             width: 160,
                             height: 28,
                             renderer: function(storeItem, item) {
                               var total = 0;
                               s_contacts_chart.each (
                                 function(rec) {
                                  total += rec.get('count');
                                 }
                               );
                               var v_pct = Math.round(storeItem.get('count') / total * 100);
                               this.setTitle(storeItem.get('status') + ': ' + storeItem.get('count') + ' (' + v_pct + '%)');
                             }
                           },
/*
                           label : {
                             field    : 'status',
                             display  : 'rotate',
                             contrast : true,
                             font     : '10px Arial'
                           }
*/
                         }]
                       });



      /****
      *  South panel
      ****/
      Ext.define('indigo.p_db_south', {
                    extend : 'Ext.Panel',
                    alias  : 'widget.p_db_south',
//                    title  : 'Dashboard',
                    region  : 'south',
                    frame   : true,
                    height  : 100
                 });

    
      /****
      *  Data panel
      ****/
      Ext.define('indigo.p_data', {
                   extend     : 'Ext.panel.Panel',
                   id         : 'p_data',
                   xtype      : 'form',
                   alias      : 'widget.p_data',
                   region     : 'center',
//                   width      : 200,
                   frame      : true,
                   border     : false,
           layout: {
                            type  :'vbox',
                            align :'stretch'
                          },
/*
                   defaults   : {
                     anchor     : '100%',
                     flex       : 1,
                     labelWidth : 250,
                     readOnly   : true,
                     hidden     : false
                   },
*/
                   items      : [
                     {
                       xtype          : 'panel',
                       id             : 'db_c_panel',
                       height   : 200,
                       title    : 'test',
                       items : [c_contacts]
/*
                         {
                           xtype          : 'fieldset',
                           id             : 'pd_fs_contacts',
                           title          : 'Contacts',
                           checkboxToggle : false,
                           collapsed      : false,
                           layout         : 'anchor',
                           defaultType    : 'displayfield',
                           fieldDefaults  : {
                             labelAlign     : 'left',
                             labelSeparator : ':'
                           },
                           items: [
                             {
                               id         : 'pd_fsc_1',
                               fieldLabel : 'Total Contacts',
                               value      : v_record.get('contact_total')
                             },
                             {
                               id         : 'pd_fsc_2',
                               fieldLabel : 'Subscribed',
                               value      : v_record.get('contact_subscribed')
                             },
                             {
                               id         : 'pd_fsc_3',
                               fieldLabel : 'Subscribed',
                               value      : v_record.get('contact_unsubscribed')
                             }
                           ]
                         }
                       ]
                     },
                     {
                       xtype          : 'panel',
                       id             : 'db_c_panel2',
                       height   : 200,
                       title    : 'test',
                       items : [c_contacts]
                     }
*/
/*
                     {
                       xtype          : 'fieldset',
                       id             : 'pd_fs_segments',
                       title          : 'Segments',
                       checkboxToggle : false,
                       collapsed      : false,
                       layout         : 'anchor',
                       defaultType    : 'displayfield',
                       fieldDefaults  : {
                         labelAlign     : 'left',
                         labelSeparator : ':'
                       },
                       items: [
                         {
                           id         : 'pd_fsc_2',
                           fieldLabel : 'Total Segments',
                           value      : v_record.get('segment_count')
                         }
                       ]
                     },
                     {
                       xtype          : 'fieldset',
                       id             : 'pd_fs_campaigns',
                       title          : 'Campaigns',
                       checkboxToggle : false,
                       collapsed      : false,
                       layout         : 'anchor',
                       defaultType    : 'displayfield',
                       fieldDefaults  : {
                         labelAlign     : 'left',
                         labelSeparator : ':'
                       },
                       items: [
                         {
                           id         : 'pd_fsc_3',
                           fieldLabel : 'Total Campaigns',
                           value      : v_record.get('campaign_count')
                         }
                       ]
                     }
*/
                   ]
                 });


  /****
  *  Campaign reports model
  ****/
  Ext.define('indigo.db_campaign_model', {
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
  *  Campaign reports store
  ****/
  var s_db_campaigns = Ext.create('Ext.data.Store', {
                     model           : 'indigo.db_campaign_model',
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
                }
              });



    /****
    *  East Panel - campaign grid
    ****/
//    var g_db_campaigns = Ext.create('Ext.grid.Panel', {
Ext.define('indigo.g_db_campaigns', {
           extend         : 'Ext.grid.Panel',

                           xtype          : 'grid',
                           id             : 'g_db_campaigns',
                           alias          : 'widget.g_db_campaigns',
                           title          : 'Recently Edited Campaigns',
                           store          : s_db_campaigns,
                           region         : 'east',
                           width          : 450,
                           trackMouseOver : true,
//                          layout         : 'fit',
                          loadMask       : true,
                          enableHdMenu   : true,
                          stripeRows     : true,
//                          autoRender     : true,  // do not autorender if grid is in another component
                          autoShow       : true,
/*
                          listeners      : {
                            itemdblclick : function() {
                                             f_contacts();  // pass in the store like we do for filseg!!! store will have to be superset of contacts store union v_cr_emails
                                           }
                          },
*/
        columns        : [
             {
               id        : 'gdb_c1',
               text      : 'Campaign ID',
               width     : 80,
               sortable  : true,
               dataIndex : 'campaign_id'
             },
             {
               id        : 'gdb_c2',
               text      : 'Campaign Name',
               width     : 150,
               sortable  : true,
               dataIndex : 'campaign_name'
             },
             {
               id        : 'gdb_c3',
               text      : 'Campaign Type',
               width     : 100,
               sortable  : true,
               dataIndex : 'campaign_type'
             },
             {
               id        : 'gdb_c4',
               text      : 'Status',
               flex      : 1,
               sortable  : true,
               dataIndex : 'campaign_status'
             },
/*
             {
               id        : 'gcrm_c5',
               text      : 'Start Date',
               width     : 100,
               sortable  : true,
               dataIndex : 'start_date'
             },
             {
               id        : 'gsrm_c5',
               text      : 'End Date',
               flex      : 1,
               sortable  : true,
               dataIndex : 'end_date'
             }
*/

                          ]
                        });
    
      /****
      *  Logo panel
      ****/
      var v_url = f_render_image('images/datamine_logo_600.jpg');
      Ext.define('indigo.p_logo', {
                   extend     : 'Ext.panel.Panel',
                   id         : 'p_logo',
                   xtype      : 'form',
                   alias      : 'widget.p_logo',
                   region     : 'north',
                   frame      : true,
                   border     : false,
                   height     : 105,
                   items      : [ 
                     {
                       xtype    : 'component',
                       id       : 'pl_spacer1',
                       height   : 10
                     },
                     {
                       xtype    : 'component',
                       id       : 'pl_image',
                       flex     : 1,
                       readOnly : true,
                       html     : v_url
                     },
                     {
                       xtype    : 'component',
                       id       : 'pl_spacer2',
                       height   : 10
                     },
                   ]
                 });

      /****
      *  Dashboard panel
      ****/
      Ext.define('indigo.p_dashboard', {
                    extend : 'Ext.Panel',
                    alias  : 'widget.p_dashboard',
                    title  : 'Dashboard',
                    layout : {
                      type  : 'border',
                      align : 'stretch',
                      pack  : 'start'
                    },
                   items  : [
                     {
                       xtype : 'p_logo'
                     },
                     {
                       xtype : 'p_data'
                     },
                     {
                       xtype : 'g_db_campaigns'
                     },
                     {
                       xtype : 'p_db_south'
                     }
                   ]
                 });
};
