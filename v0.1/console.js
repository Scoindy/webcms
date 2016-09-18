/*******************************************************************************
* Indigo
********************************************************************************
* Name          : console.js
* Description   : renders the Indigo console 
* Author        : Scott Walkinshaw
* Date          : 3rd June 2011
* Parameters    : 
* Comments      :
  Ext.Msg.alert('test1');
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 03 Jun 06 | Initial issue                                     *
*******************************************************************************/
Ext.QuickTips.init();
Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath('Ext.ux.DataView', 'plugins/DataView/');

function f_console() {

  /****
  *  Load functions
  f_dashboard_dummy();
  ****/
  f_contacts(0);
  f_filters();
  f_segments();
  f_emails();
  f_campaigns();
  f_media();
  f_users();
//  f_dashboard();
  f_campaign_reports();
//  f_substitution();

  /****
  *  Dashboard model
  Ext.define('indigo.dashboard_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'logo_url',             type : 'string' },
      { name : 'contact_total',        type : 'string' },
      { name : 'contact_subscribed',   type : 'string' },
      { name : 'contact_unsubscribed', type : 'string' },
      { name : 'segment_count',        type : 'string' },
      { name : 'campaign_count',       type : 'string' }
    ]
  });
  ****/

  /****
  *  Dashboard store
  var s_dashboard = Ext.create('Ext.data.Store', {
                      model           : 'indigo.dashboard_model',
                      clearOnPageLoad : true,
                      autoLoad        : false,
                      pageSize        : 20,
                      proxy           : {
                        type          : 'ajax',
                        url           : 'fetch_dashboard.php',
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
                        }
                      }
                    });
  ****/

  /****
  *  Contacts chart model
  ****/
  var m_contacts_chart = Ext.define('indigo.contacts_chart_model', {
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
  var s_contacts_chart = Ext.create('Ext.data.Store', {
                model           : 'indigo.contacts_chart_model',
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
  *  Load the dashboard store with a callback
  *  so console is not generated until load complete
  s_dashboard.load ({
  ****/

  s_contacts_chart.load ({
    callback :  function(records, options, success) {

      f_dashboard(records, s_contacts_chart);

      /****
      *  Centre content panel
      ****/
      Ext.define('indigo.p_content', {
                   extend     : 'Ext.panel.Panel',
                   id         : 'p_content',
                   name       : 'p_menu',
                   alias      : 'widget.p_content',
                   region     : 'center',
                   layout     : 'card',
                   border     : true,
                   animate    : true,
                   activeItem : 0,
                   border     : false,
                   items      : [
                     { 
                       xtype : 'p_dashboard'
                     },
                     {
                       xtype : 'g_contacts'
                     },
                     {
                       xtype : 'g_filters'
                     },
                     {
                       xtype : 'g_segments'
                     },
                     {
                       xtype : 'g_emails'
                     },
                     {
                       xtype : 'g_campaigns'
                     },
                     {
                       xtype : 'g_media'
                     },
                     {
                       xtype : 'g_campaign_reports'
                     },
                     {
                       xtype : 'g_users'
                     },
                   ]
                });
    
      /****
      *  Menu
      ****/
      Ext.define('indigo.p_menu', {
                   extend         : 'Ext.panel.Panel',
                   id             : 'p_menu',
                   name           : 'p_menu',
                   alias          : 'widget.p_menu',
                   title          : 'Menu',
                   trackMouseOver : true,
                   enableHdMenu   : true,
                   bodyPadding    : 7,
                   region         : 'west',
                   frame          : true,
                   border         : false,
                   width          : 150,
                   split          : false,
                   collapsible    : true,
                   items: [
                   {
                     xtype   : 'button',
                     width   : 125,
                     scale   : 'large',
                     text    : 'Dashboard',
                     icon    : 'icons/table_orange_32.png',
                     cls     : 'x-btn-text-icon',
                     handler : function() {
                                 Ext.getCmp('p_content').layout.setActiveItem(0)
                               }
                   }, 
                   {
                      xtype   : 'button',
                      width   : 125,
                      scale   : 'large',
                      text    : 'Contacts',
                      icon    : 'icons/users_orange_32.png',
                      cls     : 'x-btn-text-icon',
                      tooltip : 'Contact Management',
                      handler : function() {
                                  Ext.getCmp('p_content').layout.setActiveItem(1)
                                }
                    },
                    {
                      xtype   : 'button',
                      width   : 125,
                      scale   : 'large',
                      text    : 'Filters',
                      icon    : 'icons/dots_orange_32.png',
                      cls     : 'x-btn-text-icon',
                      tooltip : 'Manage Contact Filters',
                      handler : function() {
                                  Ext.getCmp('p_content').layout.setActiveItem(2)
                                }
                    },
                    {
                      xtype   : 'button',
                      width   : 125,
                      scale   : 'large',
                      text    : 'Segments',
                      icon    : 'icons/stats_orange_32.png',
                      cls     : 'x-btn-text-icon',
                      tooltip : 'Manage Campaign Segments',
                      handler : function() {
                                  Ext.getCmp('p_content').layout.setActiveItem(3)
                                }
                    },
                    {
                      xtype   : 'button',
                      width   : 125,
                      scale   : 'large',
                      text    : 'Emails',
                      icon    : 'icons/mail_orange_32.png',
                      cls     : 'x-btn-text-icon',
                      tooltip : 'Create Campaign Emails',
                      handler : function() {
                                  Ext.getCmp('p_content').layout.setActiveItem(4)
                                }
                    },
                    {
                      xtype   : 'button',
                      width   : 125,
                      scale   : 'large',
                      text    : 'Campaigns',
                      icon    : 'icons/discuss_orange_32.png',
                      cls     : 'x-btn-text-icon',
                      tooltip : 'Campaign Management',
                      handler : function() {
                                  Ext.getCmp('p_content').layout.setActiveItem(5)
                                }
                    },
                    {
                      xtype   : 'button',
                      width   : 125,
                      scale   : 'large',
                      text    : 'Media Library',
                      icon    : 'icons/ipod_orange_32.png',
                      cls     : 'x-btn-text-icon',
                      tooltip : 'Upload and Manage Media',
                      handler : function() {
                                  Ext.getCmp('p_content').layout.setActiveItem(6)
                                }
                    },
                    {
                      xtype   : 'button',
                      width   : 125,
                      scale   : 'large',
                      text    : 'Reports',
                      icon    : 'icons/stats3_orange_32.png',
                      cls     : 'x-btn-text-icon',
                      tooltip : 'Drill Into Campaigns',
                      menu     : {
                        plain  : true,
                        items : [
                          {
                            text    : 'Campaign Reports',
                            handler : function() {
                                        Ext.getCmp('p_content').layout.setActiveItem(7)
                                      }
                          }
                        ]
                      }
                    },
                    {
                      xtype   : 'button',
                      width   : 125,
                      scale   : 'large',
                      text    : 'Settings',
                      icon    : 'icons/gear_orange_32.png',
                      cls     : 'x-btn-text-icon',
                      menu     : {
                        plain  : true,
                        items : [
                          {
                            text    : 'Users',
                            handler : function() {
                                        Ext.getCmp('p_content').layout.setActiveItem(8)
                                      }
                          },
                          {
                            text    : 'Substitution Fields',
/*
                            handler : function() {
                                        Ext.getCmp('p_content').layout.setActiveItem(9)
                                      }
*/
                          },
                        ]
                      }
                    }
                  ]
                });
    
      /****
      *  Status bar
      Ext.define('indigo.p_statusbar', {
                   extend         : 'Ext.ux.StatusBar',
                   id             : 'sb_console',
                   name           : 'sb_console',
                   alias          : 'widget.sb_console',
                   items: [
                     {
                       xtype      : 'displayfield',
                       id         : 'db_c_build',
                       fieldLabel : 'Build 0.2a'
                     }
                  ]
                });
      ****/
    
      /****
      *  Console window
      ****/
      var w_console = new Ext.Window ({
                        title       : 'Indigo Console v0.2a',
                        id          : 'console',
                        layout      : 'border',
                        width       : 800,
                        height      : 600,
                        resizable   : true,
                        draggable   : true,
                        modal       : true,
/*
                        dockedItems : [ 
                          {
                            xtype  : 'toolbar',
                            id     : 'wc_tb',
                            dock   : 'bottom',
                            height : 30,
                            items  : [
                              {
                                xtype : 'tbspacer',
                                id    : 'wc_tb_spacer1',
                                width : 5
                              },
                              { 
                                xtype : 'displayfield',
                                id    : 'wc_tb_build',
                                value : '<b>Build:0.2a</b>' 
                              }
                            ]
                          }
                        ],
*/
                        items : [
                          {
                            xtype : 'p_menu'
                          }, 
                          {
                            xtype : 'p_content'
                          }
                        ]
                      });
    
      /****
      *  Display the console window
      ****/
      w_console.show();
    }
  });
}

Ext.onReady(f_console);
