/*******************************************************************************
* Indigo
********************************************************************************
* Name          : campaign_reports.js
* Description   : handles campaign campaign_reports
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
function f_campaign_reports() {

 
  function f_cr_view_email (
             p_contact_id,
             p_ce_id
           ) {

   
   Ext.Ajax.request({
      url : 'email_view.php',
      params : {
        ce_id : p_ce_id,
        contact_id : p_contact_id
      },
      method: 'POST',
      success: function ( result, request ) { 

        /****
        *  Put some login in here to check if result.responsetext = 'ERROR'
        ****/

        /****
        *  Pop open an window for the html
        ****/
        var w_cr_view_email = Ext.create('Ext.Window', {
                             id          : 'w_cr_view_email',
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
                                   html : '<iframe src="http://indigo.com/views/'+result.responseText+'" style="border:0" width="885" height="565"> </iframe>'
                                 }
                               }
                             ]
                          });

         w_cr_view_email.show();
      },

      /****
      *  Not sure when it would fall in here?
      *  if the PHP didn't exist?
      *****/
      failure: function ( result, request) { 
        Ext.MessageBox.alert('Failed', result.responseText); 
      } 
   });
  };


  /****
  *  Function    : f_cr_email_type
  *  Description : reloads store for selected campaign email status
  ****/
  function f_cr_email_status (
             p_item,
             p_checked
           ) {

    /****
    *  Change the grid title
    Ext.getCmp('gp_cr_detail2').setTitle('Campaigns : ' + p_item.text);
    ****/

    /****
    *  Load selected segment type
    ****/
    Ext.getCmp('gp_cr_detail2').getStore().getProxy().extraParams.status = p_item.text;
    Ext.getCmp('gp_cr_detail2').getStore().loadPage(1);
  };

  /****
  *  Function    : f_campaign_type_cr
  *  Description : reloads store for selected campaign type
  ****/
  function f_campaign_type_cr (
             p_item,
             p_checked
           ) {

    /****
    *  Change the grid title
    ****/
    Ext.getCmp('g_campaign_reports').setTitle('Campaigns : ' + p_item.text);

    /****
    *  Load campaigns with selected status
    ****/
    Ext.getCmp('g_campaign_reports').getStore().getProxy().extraParams.status = p_item.text;
    Ext.getCmp('g_campaign_reports').getStore().loadPage(1);
  };


  /****
  *  Function    : f_campaign_report_detail
  *  Description : reports for a particular campaign
  ****/
  function f_campaign_report_detail (
             p_grid,
             p_record,
             p_item,
             p_index,
             p_object
           ) {

    /****
    *  Misc initialisation
    ****/
    var v_record = p_grid.getStore().getAt(p_index);
    var v_title  = 'Campaign : ' + v_record.get('campaign_name');

    /****
    *  Campaign summary chart model
    ****/
    Ext.define('indigo.cr_summary_chart', {
      extend: 'Ext.data.Model',
      fields: [
        { name : 'campaign_email_id', type : 'int' }, 
        { name : 'total',             type : 'int' }, 
        { name : 'sent',              type : 'int' },
        { name : 'accepted',          type : 'int' },
        { name : 'bounced',           type : 'int' },
        { name : 'rendered',          type : 'int' }
      ]
    });

    /****
    *  Campaign summary chart store
    ****/
    var s_cr_summary_chart = Ext.create('Ext.data.Store', {
                               model           : 'indigo.cr_summary_chart',
                               clearOnPageLoad : true,
                               autoLoad        : true,
                               proxy           : {
                               type            : 'ajax',
                               url             : 'fetch_cr_summary_chart.php',
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
                              },
                              extraParams     : {
                                ce_id     : v_record.get('campaign_email_id')
                              }
                            },
                          });

    /****
    *  Campaign email model
    ****/
    Ext.define('indigo.cr_email_model', {
      extend: 'Ext.data.Model',
      fields: [
        { name : 'campaign_email_id', type : 'int'    }, 
        { name : 'contact_id',        type : 'int'    }, 
        { name : 'full_name',         type : 'string' },
        { name : 'email_address',     type : 'string' },
        { name : 'email_status',      type : 'string' },
        { name : 'status_datetime',   type : 'string' }
      ]
    });


    /****
    *  Campaign email reports store
    ****/
    var s_cr_emails = Ext.create('Ext.data.Store', {
                        model           : 'indigo.cr_email_model',
                        clearOnPageLoad : true,
                        autoLoad        : true,
                        proxy           : {
                        type            : 'ajax',
                        url             : 'fetch_cr_emails.php',
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
                       },
                       extraParams     : {
                         ce_id     : v_record.get('campaign_email_id')
                       }
                     },
                   });


  s_cr_summary_chart.load ({
    callback :  function(records, options, success) {


    /****
    *  Chart variables
    ****/
    var v_total    = records[0].get('total');
    var v_sent     = records[0].get('sent');
    var v_accepted = records[0].get('accepted');
    var v_bounced  = records[0].get('bounced');
    var v_rendered = records[0].get('rendered');

    /****
    *  Sent gauage
    ****/
    var c_sent = Ext.create('Ext.chart.Chart', {
                   xtype        : 'chart',
                   style        : 'background:#fff',
                   store        : s_cr_summary_chart,
                   insetPadding : 25,
                   flex         : 1,
                   animate: {
                     easing   : 'elasticIn',
                     duration : 1000
                   },
                   axes : [
                     {
                       type     : 'gauge',
                       position : 'gauge',
                       minimum  : 0,
                       maximum  : v_total,
                       steps    : 10,
                       margin   : 7
                     }
                   ],
                   series: [
                     {
                       type     : 'gauge',
                       field    : 'sent',
                       donut    : 50,
                       colorSet : [
                         '#0BB719', // fg colour
                         '#ddd'     // bg colour
                       ]
                     }
                   ]
                 });

    /****
    *  Accepted gauage
    ****/
    var c_accepted = Ext.create('Ext.chart.Chart', {
                       xtype        : 'chart',
                       style        : 'background:#fff',
                       store        : s_cr_summary_chart,
                       insetPadding : 25,
                       flex         : 1,
                       animate: {
                         easing   : 'elasticIn',
                         duration : 1000
                       },
                       axes : [
                         {
                           type     : 'gauge',
                           position : 'gauge',
                           minimum  : 0,
                           maximum  : v_total,
                           steps    : 10,
                           margin   : 7
                         }
                       ],
                       series: [
                         {
                           type     : 'gauge',
                           field    : 'accepted',
                           donut    : 50,
                           colorSet : [
                             '#0A0AD3',
                             '#ddd'
                           ]
                         }
                       ]
                     });

    /****
    *  Rendered gauage
    ****/
    var c_rendered = Ext.create('Ext.chart.Chart', {
                       xtype        : 'chart',
                       style        : 'background:#fff',
                       store        : s_cr_summary_chart,
                       insetPadding : 25,
                       flex         : 1,
                       animate: {
                         easing   : 'elasticIn',
                         duration : 1000
                       },
                       axes : [
                         {
                           type     : 'gauge',
                           position : 'gauge',
                           minimum  : 0,
                           maximum  : v_total,
                           steps    : 10,
                           margin   : 7
                         }
                       ],
                       series: [
                         {
                           type     : 'gauge',
                           field    : 'rendered',
                           donut    : 50,
                           colorSet : [
                             '#EFF751',
                             '#ddd'
                           ]
                         }
                       ]
                     });

    /****
    *  Bounced gauage
    ****/
    var c_bounced = Ext.create('Ext.chart.Chart', {
                       xtype        : 'chart',
                       style        : 'background:#fff',
                       store        : s_cr_summary_chart,
                       insetPadding : 25,
                       flex         : 1,
                       animate: {
                         easing   : 'elasticIn',
                         duration : 1000
                       },
                       axes : [
                         {
                           type     : 'gauge',
                           position : 'gauge',
                           minimum  : 0,
                           maximum  : v_total,
                           steps    : 10,
                           margin   : 7
                         }
                       ],
                       series: [
                         {
                           type     : 'gauge',
                           field    : 'bounced',
                           donut    : 50,
                           colorSet : [
                             '#B70C40',
                             '#ddd'
                           ]
                         }
                       ]
                     });



    /****
    *  First tab - summary data
    ****/
    var fp_cr_detail1 = Ext.create('Ext.form.Panel', {
                          xtype         : 'form',
                          id            : 'fp_cr_detail1',
                          title         : 'Summary',
                          autoScroll    : true,
                          frame         : false,
                          layout: {
                            type  :'vbox',
                            align :'stretch'
                          },
                          fieldDefaults : {
                            labelAlign  : 'left',
                            labelWidth  : 120
                          },
                          items : [
                            {
                              xtype      : 'panel',
                              id         : 'fpcr_sum1',
                              height     : 120,
                              frame      : true,
                              items      : [
                                {
                                  xtype      : 'displayfield',
                                  id         : 'fpcr_s1_1',
                                  width      : 400,
                                  fieldLabel : 'Campaign Name',
                                  readOnly   : true,
                                  value      : v_record.get('campaign_name')
                                },
                                {
                                  xtype      : 'displayfield',
                                  id         : 'fpcr_s1_2',
                                  width      : 400,
                                  fieldLabel : 'Description',
                                  readOnly   : true,
                                  value      : v_record.get('description')
                                },
                                {
                                  xtype      : 'displayfield',
                                  id         : 'fpcr_s1_3',
                                  width      : 200,
                                  fieldLabel : 'Start Date',
                                  readOnly   : true,
                                  value      : v_record.get('start_date')
                                },
                                {
                                  xtype      : 'displayfield',
                                  id         : 'fpcr_s1_4',
                                  width      : 200,
                                  fieldLabel : 'End Date',
                                  readOnly   : true,
                                  value      : v_record.get('end_date')
                                }
                              ]
                            },
                            {
                              xtype      : 'panel',
                              flex       : 1, //height     : 150,
                              frame      : false,
                              layout: {
                                type  : 'hbox',
                                pack  : 'start',
                                align : 'stretch' // this stretches the child panels to the height of this panel
                              },
                              items      : [
                                {
                                  xtype  : 'panel',
                                  id     : 'fpcr_hbox1',
                                  title  : 'Sent',
                                  layout : 'fit',
                                  flex   : 1,
                                  frame  : false,
                                  items  : [c_sent]
                                },
                                {
                                  xtype  : 'panel',
                                  id     : 'fpcr_hbox2',
                                  title  : 'Accepted',
                                  layout : 'fit',
                                  flex   : 1,
                                  frame  : false,
                                  items  : [c_accepted]
                                },
                              ]
                            },
                            {
                              xtype      : 'panel',
                              id         : 'fpcr_vbox2',
                              flex       : 1, //height     : 150,
                              frame      : false,
                              layout: {
                                type  : 'hbox',
                                pack  : 'start',
                                align : 'stretch' // this stretches the child panels to the height of this panel
                              },
                              items      : [
                                {
                                  xtype  : 'panel',
                                  id     : 'fpcr_hbox3',
                                  title  : 'Bounced',
                                  layout : 'fit',
                                  flex   : 1,
                                  items  : [c_bounced]
                                },
                                {
                                  xtype  : 'panel',
                                  id     : 'fpcr_hbox4',
                                  title  : 'Rendered',
                                  layout : 'fit',
                                  flex   : 1,
                                  frame  : false,
                                  items  : [c_rendered]
                                }
                              ]
                            }
                          ]
                        });

    /****
    *  Second tab - email grid
    ****/
    var gp_cr_detail2 = Ext.create('Ext.grid.Panel', {
                          xtype          : 'grid',
                          id             : 'gp_cr_detail2',
                          title          : 'Emails',
                          store          : s_cr_emails,
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
                              id        : 'cr_c1',
                              text      : 'Contact ID',
                              width     : 80,
                              sortable  : true,
                              dataIndex : 'contact_id',
                            }, 
                            {
                              id        : 'cr_c2',
                              text      : 'Name',
                              width     : 100,
                              sortable  : true,
                              dataIndex : 'full_name'
                            }, 
                            {
                              id        : 'cr_c3',
                              text      : 'Email Address',
                              width     : 100,
                              sortable  : true,
                              dataIndex : 'email_address'
                            }, 
                            {
                              id        : 'cr_c4',
                              text      : 'Status',
                              width     : 75,
                              sortable  : true,
                              dataIndex : 'email_status'
                            }, 
                            {
                              id        : 'cr_c5',
                              text      : 'Status Time',
                              flex      : 1,
                              sortable  : true,
                              dataIndex : 'status_datetime'
                            }, 
                            {
                               xtype : 'actioncolumn',
                               width : 20,
                              items : [
                                {
                                  icon    : 'icons/mail_orange_16.png',
                                  tooltip : 'View email',
                                  handler: function(grid, rowIndex, colIndex) {
                                    var v_record = grid.getStore().getAt(rowIndex);

                                    v_contact_id = v_record.get('contact_id');
                                    v_ce_id      = v_record.get('campaign_email_id');

                                      f_cr_view_email (
                                        v_contact_id,
                                        v_ce_id
                                      )
                                  }
                                }
                              ]
/*
                              width     : 20,
                                  cls      : 'x-btn-text-icon',
*/
                            }
                          ],
                          dockedItems    : [
                            {
                              xtype       : 'pagingtoolbar',
                              id          : 'cre_bottom',
                              store       : s_cr_emails,
                              dock        : 'bottom',
                              displayInfo : true,
                              displayMsg  : 'Displaying rows {0} - {1} of {2}',
                              emptyMsg    : "No data to display",
                              pageSize    : 25
                            },
                            {
                              xtype       : 'toolbar',
                              id          : 'cre_top',
                              dock        : 'top',
                              items: [
                                {
                                  xtype    : 'button',
                                  text     : 'Status',
                                  icon     : 'icons/info2_blue_16.png',
                                  cls      : 'x-btn-text-icon',
                                  menu     : {
                                    defaults : {
                                      checked : false,
                                      group   : 'email_status'  // radio buttons
                                    },
                                    items : [
                                      {
                                        text         : 'All',
                                        checked      : true,
                                        checkHandler : f_cr_email_status
                                      },
                                      {
                                        text         : 'Sent',
                                        checkHandler : f_cr_email_status
                                      },
                                      {
                                        text         : 'Bounced',
                                        checkHandler : f_cr_email_status
                                      },
                                      {
                                        text         : 'Accepted',
                                        checkHandler : f_cr_email_status
                                      },
                                      {
                                        text         : 'Rendered',
                                        checkHandler : f_cr_email_status
                                      },
                                    ]
                                  }
                                }
                              ]
                            }
                          ]
                        });



  
    /****
    *  Tab panel - do I have to nest like this?
    ****/
    var tp_cr_detail = Ext.create('Ext.tab.Panel', {
/*
                         xtype         : 'form',
                         id            : 'tp_cr_detail',
                         autoScroll    : true,
                         frame         : true,
                         autoHeight    : true,
                         plain         : true,
                         bodyPadding   : 1,
                         fieldDefaults : {
                           labelAlign  : 'left',
                           labelWidth  : 110
                         },
                         items       : [
                           {
*/
                             xtype      : 'tabpanel',
                             id         : 'blah',
                             plain      : true,
                             activeTab  : 0,
                             autoHeight : true,
                             frame      : true,
                             defaults  : {
                               bodyPadding : 0,
                               closable    : false,
                               layout : 'fit',
                             },
                             items      : [fp_cr_detail1, gp_cr_detail2]
/*
                           }
                         ]
*/
                       });

    
    /****
    *  Modal widow to hold campaign report
    ****/
    var w_cr_detail = Ext.create('Ext.Window', {
                        id          : 'w_user_detail',
                        title       : v_title,
                        height      : 500,
                        width       : 550,
                        resizable   : false,
                        draggable   : true,
                        modal       : true,
                        closeAction : 'destroy',
                        layout      : 'fit',
                        items       : [tp_cr_detail]
                      });


    /****
    *  Open window
    ****/
    w_cr_detail.show();
 


}
});






  };


  


  /****
  *  Campaign reports model
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
  *  Campaign reports store
  ****/
  var s_campaign_reports = Ext.create('Ext.data.Store', {
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
                }
              });


  /****
  *  Campaign grid
  ****/
  return Ext.define('indigo.g_campaign_reports', {
           extend         : 'Ext.grid.Panel',
           id             : 'g_campaign_reports',
           alias          : 'widget.g_campaign_reports',
           title          : 'Campaign Reports',
           store          : s_campaign_reports,
           trackMouseOver : true,
           layout         : 'fit',
           loadMask       : true,
           enableHdMenu   : true,
           stripeRows     : true,
           autoRender     : true,
           autoShow       : true,
           listeners      : {
             itemdblclick : f_campaign_report_detail
           },
           columns        : [
             {
               id        : 'gcrm_c1',
               text      : 'Campaign ID',
               width     : 80,
               sortable  : true,
               dataIndex : 'campaign_id' 
             }, 
             {
               id        : 'gcrm_c2',
               text      : 'Campaign Name',
               width     : 150,
               sortable  : true,
               dataIndex : 'campaign_name'
             },
             {
               id        : 'gcrm_c3',
               text      : 'Campaign Type',
               width     : 100,
               sortable  : true,
               dataIndex : 'campaign_type'
             },
             {
               id        : 'gcrm_c4',
               text      : 'Status',
               width     : 100,
               sortable  : true,
               dataIndex : 'campaign_status'
             },
             {
               id        : 'gcrm_c5',
               text      : 'Start Date',
               width     : 100,
               sortable  : true,
               dataIndex : 'start_date'
             },
             {
               id        : 'gsrm_c6',
               text      : 'End Date',
               flex      : 1,
               sortable  : true,
               dataIndex : 'end_date'
             }
           ],
           dockedItems    : [
             {
               xtype       : 'pagingtoolbar',
               id          : 'gcrmt_bottom',
               name        : 'gcrmt_bottom',
               store       : s_campaign_reports,
               dock        : 'bottom',
               displayInfo : true,
               displayMsg  : 'Displaying rows {0} - {1} of {2}',
                emptyMsg    : "No data to display",
                pageSize    : 25
             },
             {     
               xtype       : 'toolbar',
               id          : 'gcrmt_top',
               name        : 'gcrmt_top',
               dock        : 'top',
               items: [ 
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
                          checkHandler : f_campaign_type_cr
                       },
                       {
                         text         : 'Active',
                           checkHandler : f_campaign_type_cr
                       }, 
                       {
                         text         : 'Expired',
                           checkHandler : f_campaign_type_cr
                       },
                       {
                         text         : 'Sent',
                           checkHandler : f_campaign_type_cr
                       }
                     ]
                   }
                 }
               ]
             }
           ]
         });

};
