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

  /****
  *  Contacts chart mpdel
  ****/
  var m_contact_chart = Ext.define('indigo.contact_chart_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'chart_type', type : 'string' },
      { name : 'status',     type : 'string' },
      { name : 'count',      type : 'int'    }
    ]
  });

  /****
  *  Segment chart store
  ****/
  var s_contact_chart = Ext.create('Ext.data.Store', {
                model           : 'indigo.contact_chart_model',
                clearOnPageLoad : true,
                autoLoad        : false,
                proxy           : {
                  type          : 'ajax',
                  url           : 'fetch_dashboard_charts.php',
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
                  extraParams      : {
                    chart_type : 'C'
                  }
                }
              });


  /****
  *  Load the charts with a callback
  ****/
    s_contact_chart.load ({
    callback :  function(records, options, success) {

      /****
      *  Contacts pie chart
      ****/
      var c_contacts = Ext.create('Ext.chart.Chart', {
                         animate      : true,
                         shadow       : true,
                         store        : s_contact_chart,
                         insetPadding : 25,
                         legend: {
                           position : 'right'
                         },
                         series       : [{
                           type         : 'pie',
                           field        : 'count',
                           showInLegend : false,
                           donut : false,
                           colorSet     : [
                             '#FF3300',
                             '#33CC33',
                             '#0066FF',
                             '#FF9933',
                             '#FF33CC'
                           ],
                           highlight : {
                             segment : {
                               margin : 20
                             }
                           },
/*
                           tips : {
                             trackMouse: true,
                             width: 160,
                             height: 28,
                             renderer: function(storeItem, item) {
                               var total = 0;
                               s_segment_chart.each (
                                 function(rec) {
                                  total += rec.get('count');
                                 }
                               );
                               var v_pct = Math.round(storeItem.get('count') / total * 100);
                               this.setTitle(storeItem.get('status') + ': ' + storeItem.get('count') + ' (' + v_pct + '%)');
                             }
                           },
                           label : {
                             field    : 'status',
                             display  : 'rotate',
                             contrast : true,
                             font     : '10px Arial'
                           }
*/
                         }]
                       });

/*
        var p_segment_chart = Ext.create('Ext.Panel', {
                                extend : 'Ext.Panel',
                                id     : 'p_segment_chart',
                                alias  : 'widget.p_segment_chart',
                                layout : 'fit',
                                frame  : false,
                                border : false,
                                flex   : 2,
                                store  : s_segment_chart,
                                items  : [c_segment]
                              });
*/


        /****
        *  Panel to hold the chart
        var p__chart = Ext.create('Ext.Panel', {
                                extend : 'Ext.Panel',
                                id     : 'p_chart',
                                alias  : 'widget.p_chart',
                                layout : 'fit',
                                frame  : false,
                                border : false,
                                flex   : 2,
                                store  : s_contact_chart,
                                items  : [c_segment]
                              });
        ****/

    
      /****
      *  Data panel
      Ext.define('indigo.p_data', {
                   extend     : 'Ext.panel.Panel',
                   id         : 'p_data',
//                   xtype      : 'form',
                   alias      : 'widget.p_data',
//                   layout     : 'vbox',
                layout: {
                         type  :'hbox',
                         align :'top' // stretch
                       },

                   height     : 200,
                   frame      : true,
                   border     : false,
//                   flex : 2,
                       items:  [c_contacts]
                   items : [
                     { 
                       xtype  : 'panel',
id : 'p_chart_panel',
                       layout : 'fit',
                       flex   : 2,
                       store  : s_contact_chart,
                       items:  [c_contacts]
                     }

                       items [
                         {
                           xtype: 'fieldcontainer',
                           layout: 'fit',
                           margin: '0',
//height : 150,
                           flex : 1,

                         }
                       ]
                     }
                   ]
                 });
      ****/
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
*/
    


   /****
   *  Chart Panel
   ****/
    Ext.define('indigo.p_chart_panel', {
                          extend : 'Ext.Panel',
                          id     : 'p_chart_panel',
                          alias  : 'widget.p_chart_panel',
                          title  : 'Chart Panel',
                          layout : 'fit',
                          flex   : 1,
                          items  : [c_contacts]
                        });
   /****
   *  Contacts panel
   ****/
    Ext.define('indigo.p_contacts_panel1', {
                          extend : 'Ext.Panel',
                          id     : 'p_contacts_panel1',
                          alias  : 'widget.p_contacts_panel1',
                          title  : 'Contacts',
                          region  : 'west',
//                          height : 200,
                          width  : 200,
                        });


    Ext.define('indigo.p_hbox_panel1', {
                          extend : 'Ext.Panel',
                          id     : 'p_hbox_panel1',
                          alias  : 'widget.p_hbox_panel1',
                          title  : 'Hbox Panel1',
                          width  : 100 // flex   : 1
                        });

    Ext.define('indigo.p_hbox_panel2', {
                          extend : 'Ext.Panel',
                          id     : 'p_hbox_panel2',
                          alias  : 'widget.p_hbox_panel2',
                          title  : 'Hbox Panel2',
                          layout : 'fit',
                          flex   : 1,
                          items : [c_contacts]
                        });

    Ext.define('indigo.p_vbox_panel1', {
                          extend : 'Ext.Panel',
                          id     : 'p_vbox_panel1',
                          alias  : 'widget.p_vbox_panel1',
                          title  : 'Vbox Panel 1',
                          height : 200,
                          width  : 500
                        });

    Ext.define('indigo.p_vbox_panel2', {
                          extend : 'Ext.Panel',
                          id     : 'p_vbox_panel2',
                          alias  : 'widget.p_vbox_panel2',
                          title  : 'Vbox Panel 2 (with an Hbox layout)',
                          layout: {
                            type  : 'hbox',
                            pack  : 'start',
                            align : 'stretch' // this stretches the child panels to the height of this panel
                          },
                          height : 200,
                          width  : 500,
                          items : [
                            {
                              xtype : 'p_hbox_panel1'
                            },
                            {
                              xtype : 'p_hbox_panel2'
                            }
                          ]
                        });

   /****
   *  Contacts panel
   ****/
    Ext.define('indigo.p_panel', {
                          extend : 'Ext.Panel',
                          id     : 'p_panel',
                          alias  : 'widget.p_panel',
                          title  : 'Vbox Panel',
 //                         region : 'center',
                       layout: {
                         type  :'vbox',
                         align :'stretch'
                       },
                          items : [
                           {
                            xtype : 'p_vbox_panel1'
                          },
                           {
                            xtype : 'p_vbox_panel2'
                          }
                           ]
                        });
     

      /****
      *  Console window
      ****/
      var w_console = new Ext.Window ({
                        title       : 'Window with vbox layout',
                        id          : 'console',
                        layout      : 'vbox', // layout refers the layout of the child container NOT THIS CONTAINER
                        width       : 800,
                        height      : 600,
                        resizable   : false,
                        draggable   : true,
                        modal       : true,
                        items : [
/*
                          {
                            xtype : 'p_contacts_panel1' 
                          },
*/
                           {
                            xtype : 'p_vbox_panel1'
                          },
                           {
                            xtype : 'p_vbox_panel2'
                          }
/*
                          {
                            xtype : 'p_panel'
                          }
*/
                        ]
                      });

      /****
      *  Display the console window
      ****/
      w_console.show();

   }
  });
  
};

Ext.onReady(f_test);

