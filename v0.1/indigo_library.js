/*******************************************************************************
* Indigo
********************************************************************************
* Name          : indigo_library.js
* Description   : javascript library functions
* Author        : Scott Walkinshaw
* Date          : 31st December 2011
* Parameters    :
* Comments      : 
  Ext.Msg.alert('Status', 'test');
********************************************************************************
*
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 31 Dec 11 | Initial issue                                     *
*******************************************************************************/

  /****
  *  Function    : f_validate_form
  *  Description : is called when a form field is changed
  *                and determines whether the form is valid
  ****/
  function f_validate_form (
             p_form,
             p_button1,
             p_button2,
             p_button3
           ) {

    /****
    *  Check if form has been rendered yet
    ****/
    if ( Ext.getCmp(p_form) != undefined ) {

      /****
      *  Toggle enabling/disabling of buttons
      ****/
      if ( Ext.getCmp(p_form).getForm().isValid() == true ) {

        if ( Ext.getCmp(p_button1) != undefined ) {
          Ext.getCmp(p_button1).enable(true);
        }
        if ( Ext.getCmp(p_button2) != undefined ) {
          Ext.getCmp(p_button2).enable(true);
        }
        if ( Ext.getCmp(p_button3) != undefined ) {
          Ext.getCmp(p_button4).enable(true);
        }
      } else {
        if ( Ext.getCmp(p_button1) != undefined ) {
          Ext.getCmp(p_button1).disable(true);
        }
        if ( Ext.getCmp(p_button2) != undefined ) {
          Ext.getCmp(p_button2).disable(true);
        }
        if ( Ext.getCmp(p_button3) != undefined ) {
          Ext.getCmp(p_button4).disable(true);
        }
      };
    };
  };

  /****
  *  Function    : f_render_image
  *  Description : wraps html round a URL to render image
  ****/
  function f_render_image (
             p_url
            ) {
    return '<div align="center"> <img src="' + p_url + '"></div>';
  };


  /****
  *  Function    : f_submit_form
  *  Description : saves a form
  *  Notes       : action are:
  *                  I - Insert
  *                  U - Update
  *                  D - Delete
  *                  C - Count
  *                  R - Run
  *                  S - Create segment from filter
  *                  T - Send a test email
  *                  L - Live send
  ****/
  function f_submit_form (
             p_action,
             p_win,
             p_grid,
             p_form,
             p_php,
             p_id,
             p_callback,
             p_check
           ) {

    /****
    *  Get form values
    ****/
    var form = Ext.getCmp(p_form).getForm();
    
    /****
    *  Confirm save and recursively call function
    ****/
    if ( p_check == 'Y' ) {
      if ( p_action == 'U' ) {

        Ext.Msg.show ({
          title         : 'Confirm',
          msg           : 'Are you sure you want to save changes?',
          modal         : true,
          buttons       : Ext.Msg.YESNO,
          fn            : function (btn) {
                            f_submit_form(p_action, p_win, p_grid, p_form, p_php, p_id, p_callback, btn)
                          },
          icon          : Ext.MessageBox.QUESTION
//            animateTarget : 'b_save'
        });
      };

      /****
      *  Confirm delete and recursively call function
      ****/
      if ( p_action == 'D' ) {

        Ext.MessageBox.show ({
          title         : 'Confirm',
          msg           : 'Are you sure you want to delete record?',
          modal         : true,
          buttons       : Ext.Msg.YESNO,
          fn            : function (btn) {
                              f_submit_form(p_action, p_win, p_grid, p_form, p_php, p_id, p_callback, btn)
                            },
            icon        : Ext.MessageBox.QUESTION
//            animateTarget : 'b_delete'
        });
      }

      /****
      *  Confirm delete and recursively call function
      ****/
      if ( p_action == 'L' ) {

        Ext.MessageBox.show ({
          title         : 'Warning',
          msg           : 'Live emails will be sent! Are you sure you want to proceed?',
          modal         : true,
          buttons       : Ext.Msg.YESNO,
          fn            : function (btn) {
                              f_submit_form(p_action, p_win, p_grid, p_form, p_php, p_id, p_callback, btn)
                            },
            icon        : Ext.MessageBox.WARNING
//            animateTarget : 'b_delete'
        });
      }
    };

    /****
    *  This looks a bit funny but a value of 'yes' means
    *  is has passed the check, a value of 'N' means don't check
    ****/
    if ( p_check == 'yes' || p_check == 'N' ) {

      /****
      *  Work out if we're dealing with a filter or a
      *  segment so we can pass the type to the callback
      ****/
      if ( p_php == 'filter_maintenance.php' ) {
        var v_type = 'F';
      } else {
        var v_type = 'S';
      };

      /****
      *  Submit form
      ****/
      form.submit ({
        clientValidation : false,
        submitEmptyText  : false,
        url              : p_php,
        waitMsg          : 'Working. . .',
        success          : function(form, action) {

          /****
          *  Record saved message box
          ****/
          if ( p_action == 'I' || p_action == 'U' || p_action == 'S' ) {

            Ext.MessageBox.show ({
              title   : 'Status',
              msg     : 'Record Saved',
              modal   : true,
              buttons : Ext.Msg.OK,
              icon    : Ext.MessageBox.INFO
            });

          };

          /****
          *  Insert specific tasks
          *  1. save the newly created ID
          *  2. reload store
          ****/
          if ( p_action == 'I' ) {
            Ext.getCmp(p_id).setValue(action.result.new_id);

            /****
            *  Reload store
            Ext.getCmp(p_grid).getStore().loadPage(1);
            ****/

            /****
            *  Refocus the window 
            Ext.getCmp('p_win').focus();
            ****/

          };

          /****
          *  Update specific tasks
          *  1. reload store
          ****/
          if ( p_action == 'U' ) {
            /****
            *  Reload store
          Ext.getCmp(p_grid).getStore().loadPage(1);
            ****/


//       callback :  function(records, options, success) {

   
            /****
            *  Refocus the window 
            Ext.getCmp(p_win).focus();
          }
});
	    ****/
};
          /****
          *  Test specific tasks
          ****/
          if ( p_action == 'L' ) {

            Ext.MessageBox.show ({
              title   : 'Status',
              msg     : 'Live Send Started',
              modal   : true,
              buttons : Ext.Msg.OK,
              icon    : Ext.MessageBox.INFO
            });
          };

          
          /****
          *  Test specific tasks
          ****/
          if ( p_action == 'T' ) {

            Ext.MessageBox.show ({
              title   : 'Status',
              msg     : 'Test Email Sent',
              modal   : true,
              buttons : Ext.Msg.OK,
              icon    : Ext.MessageBox.INFO
            });
          };

          /****
          *  View specific tasks
          ****/
          if ( p_action == 'V' ) {
            Ext.getCmp(p_id).setValue(action.result.string);

            /****
            *  Call the callback function
            p_callback (
              'Y'
            );
            ****/

            /****
            *  Pop open an window for the html
            ****/
            var w_view_email2 = Ext.create('Ext.Window', {
                                 id          : 'w_view_email2',
                                 title       : 'Email View',
                                 height      : 600,
                                 width       : 900,
                                 resizable   : true,
                                 draggable   : true,
                                 modal       : true,
                                 closeAction : 'destroy',
                                 frame       : false,
                                 layout      : {
                                   type  : 'fit',
                                   align : 'stretch'
                                 },
                                 items : [
                                   {
                                     xtype  : 'box',
                                     
                                     autoEl : {
//                                       tag  : 'a',
//                                       html : '<iframe src="http://indigo.com/views/test.htm" width="885" height="565"> </iframe>'
                                       html : '<iframe src="http://indigo.com/views/'+Ext.getCmp('fp_ed16').value+'" style="border:0" width="885" height="565"> </iframe>'
                                     }
                                   }
                                 ]
                              });
      
             w_view_email2.show();
      
          };

          /****
          *  Count specific tasks
          ****/
          if ( p_action == 'C' ) {

            Ext.MessageBox.show ({
              title   : 'Status',
              msg     : 'Record count ['+action.result.count+']',
              modal   : true,
              buttons : Ext.Msg.OK,
              icon    : Ext.MessageBox.INFO
            });
          };

          /****
          *  Run specific tasks
          *  1. call callback function if required
          ****/
          if (p_action == 'R') {

            /****
            *  Call the callback function
            ****/
            p_callback (
              action.result.new_id,
              v_type
            );
          }

          /****
          *  Delete specific tasks
          ****/
          if (p_action == 'D') {

            Ext.MessageBox.show ({
              title   : 'Status',
              msg     : 'Record Deleted',
              modal   : true,
              buttons : Ext.Msg.OK,
              icon    : Ext.MessageBox.INFO
            });
         
            /****
            *  Close window
            ****/
            Ext.getCmp(p_win).close();
 
            /****
            *  Reload store
            ****/
            Ext.getCmp(p_grid).getStore().loadPage(1);
          };
       },
       failure: function(form, action) {

        /****
        *  todo...
        *  put error codes and messages into a store
        *  so we can display a nice error if know what's wrong
        ****/
        if ( action.result.error_code == '2' ) {
          var v_message = 'Please choose a unique name';
          var v_icon    = Ext.MessageBox.WARNING;
          var v_title   = 'Warning';
        } else {
          var v_message = action.result.error;
          var v_icon    = Ext.MessageBox.ERROR;
          var v_title   = 'Error';
        }
        Ext.MessageBox.show ({
          title   : v_title,
          msg     : 'Fatal error '+action.result.response, // v_message,
          modal   : true,
          buttons : Ext.Msg.OK,
          icon    : v_icon
        });
       },
       params           : {
         action : p_action
       }
      });
    };
  };

  /****
  *  Function    : f_filseg_details
  *  Description : creates a new filter or manages an existing filter or segment
  *  Notes       : the structure of the create filter panel
  *                looks like this to allow the add fieldcontainer
  *                functionality to work:
  *
  *                  fieldset - filter
  *                  fieldset - rules
  *                    fieldcontainer  
  *                      fieldcontainer - labels
  *                      fieldcontainer - rule fields
  *                   
  *                all ID's are appended with p_type, a filter and a segment detail
  &                panel should not be rendered at the same time but just future-proofing
  ****/
  function f_filseg_detail (
             p_type,
             p_grid,
             p_record,
             p_item,
             p_index,
             p_object
           ) {

    /****
    *  Function   : f_filseg_contacts
    *  Descripton : displays filtered / segmented contacts
    *  Notes      : this function is called from the f_submit_form success callback
    *
    *  define as variable so we can pass to another function
    *  when you do this you need to define function before
    *  variable is used - duh
    ****/
    var v_ffc = function f_filseg_contacts (
                           p_filseg_id, 
                           p_type
                         ) {

      /****
      *  Call the contacts grid with the filter ID
      ****/
      g_filseg_contacts = f_contacts (
        p_filseg_id,
        p_type
      );

      /****
      *  Panel to hold the grid
      ****/
      Ext.define('indigo.p_filseg_contacts', {
                 extend     : 'Ext.panel.Panel',
                 id         : 'p_filseg_contacts',
                 alias      : 'widget.p_filseg_contacts',
                 region     : 'center',
                 layout     : 'card',
                 animate    : true,
                 margins    : '0 0 0 0', // top right bottom left
                 activeItem : 0,
                 border     : false,
                                 items       : [g_filseg_contacts]
/*
                 items      : [
                   {
                     xtype : 'g_filseg_contacts'
                   }
*/
        });

      /****
      *  Modal window
      ****/
      if ( p_type == 'F' ) {
        var v_name  = Ext.getCmp('fp_fd2'+p_type).value;
        var v_title = 'Filter:' +v_name;
      } else {
        var v_name  = Ext.getCmp('fp_fd2'+p_type).value;
        var v_title = 'Segment:' +v_name;
      };

      var w_filseg_contacts = Ext.create('Ext.Window', {
                                id          : 'w_filseg_contacts',
                                title       : v_title,
                                height      : 600,
                                width       : 650,
                                resizable   : false,
                                draggable   : true,
                                modal       : true,
                                closeAction : 'destroy',
                                layout      : 'fit',
                                frame       : false,
                                items      : [
                                  {
                                    xtype : 'p_filseg_contacts'
                                  }
                                ]
  //                              items       : [p_filtered_contacts]
                             });
      /****
      *  Open the window
      ****/
      w_filseg_contacts.show();

    };

    /****
    *  Common variables
    ****/
    var v_filseg_id = 0;

    /****
    *  Are we dealing with a filter or a segment?
    *
    *  v_filseg_id is the filter or segment ID
    *  v_name is used for labelling windows and fields
    ****/
    if ( p_type == 'F' ) {
      v_name        = 'Filter';
      v_php         = 'filter_maintenance.php';
      v_rules_php   = 'fetch_filter_rules.php';
      v_grid        = 'g_filters';
      v_form        = 'fp_filter';
      v_tt_contacts = 'Display filtered contacts';
    } else {
      v_name        = 'Segment';
      v_php         = 'segment_maintenance.php',
      v_rules_php   = 'fetch_segment_rules.php';
      v_grid        = 'g_segments';
      v_form        = 'fp_segment';
      v_tt_contacts = 'Display contacts in segment';
    };

    /****
    *  First we've got to do some specific tasks
    *  if we're looking at an existing record
    ****/
    if (p_grid) {
      var v_action = 'U';

      /****
      *  Get the store used by the grid then
      *  get the record at the index from the store
      ****/
      var rec = p_grid.getStore().getAt(p_index);

      /****
      *  Get the filter or segment ID
      ****/
      if ( p_type == 'F' ) {
        v_filseg_id = rec.get('filter_id');
      } else {
        v_filseg_id = rec.get('segment_id');
      };

      /****
      *  Misc variables
      ****/
      if (!p_index) p_index = '0';
      var v_hidden = false;

      /****
      *  Filter rules model
      ****/
      Ext.define('indigo.filter_rules_model', {
        extend: 'Ext.data.Model',
        fields: [
          { name : 'filter_id',      type : 'int'    },
          { name : 'filter_rule_id', type : 'int'    },
          { name : 'and_or',         type : 'string' },
          { name : 'profile_field',  type : 'string' },
          { name : 'operator',       type : 'string' },
          { name : 'value',          type : 'string' }
        ]
      });

      /****
      *  Filter rule store - pass in the filter or segment ID
      ****/
      var s_filter_rules = Ext.create('Ext.data.Store', {
                             model           : 'indigo.filter_rules_model',
                             clearOnPageLoad : true,
                             autoLoad        : false,
                             pageSize        : 20,
                             proxy           : {
                               type          : 'ajax',
                               url           : v_rules_php,
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
                                 filseg_id : v_filseg_id
                               }
                             }
                           });

    } else {
      var v_action = 'I';
      var v_hidden = true;
    }   

    /****
    *  Variable to hold number of rules
    ****/
    var v_rules = 0;

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
    *  Filter/Segment  operator store
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
    *  And/Or data
    ****/
    var and_or_data = [ 
          {
            'label' : 'AND',
            'value' : 'AND'
          }, {
            'label' : 'OR',
            'value' : 'OR'
          }
        ];

    /****
    *  And/Or model
    ****/
    Ext.regModel('and_or_model', {
      fields: [ 
        {
          name : 'label',
          type : 'string'
        },
        {
          name : 'value',
         type : 'string'
        }
      ]
    });

    /****
    *  And/Or store
    ****/
    var s_and_or = Ext.create('Ext.data.Store', {
                     model : 'and_or_model',
                     data  : and_or_data
                   });


    /****
    *  Form panel to hold filter/segment details
    ****/
    var fp_filseg_detail = Ext.create('Ext.form.Panel', {
                             xtype         : 'form',
                             id            : v_form,
                             frame         : true,
                             autoScroll    : true,
                             layoutConfig  : {
                               trackLabels : true,
                             },
                             items:       [
                           {
                             xtype         : 'fieldset',
                             id            : 'fs_filseg'+p_type,
                             title         : v_name,
                             layout        : 'anchor',
                             defaultType   : 'textfield',
                             fieldDefaults : {
                               labelAlign     : 'left',
                               labelSeparator : ':'
                             },
                             items: [
                               {
                                 xtype      : 'hiddenfield',
                                 id         : 'fp_fd1'+p_type,
                                 name       : 'filseg_id',
                                 width      : 200,
                                 readOnly   : true
                               },
                               {
                                 xtype      : 'textfield',
                                 id         : 'fp_fd2'+p_type,
                                 name       : 'filseg_name',
                                 width      : 500,
                                 readOnly   : false,
                                 allowBlank : false,
                                 maxLength  : 32,
                                 fieldLabel : v_name + ' Name',
                                 listeners : {
                                   change : f_validate_filseg
                                 }
                               },
                               {
                                 xtype      : 'textarea',
                                 id         : 'fp_fd3'+p_type,
                                 name       : 'description',
                                 width      : 500,
                                 height     : 100,
                                 readOnly   : false,
                                 allowBlank : true,
                                 maxLength  : 256,
                                 fieldLabel : 'Description',
                                 listeners : {
                                   change : f_validate_filseg
                                 }
                               },
/*
                               {
                                 xtype      : 'displayfield',
                                 id         : 'fp_fd4'+p_type,
                                 fieldLabel : 'Created Date',
                                 hidden     : v_hidden,
                               },
                               {
                                 xtype      : 'displayfield',
                                 id         : 'fp_fd5'+p_type,
                                 fieldLabel : 'Created By',
                                 hidden     : v_hidden,
                               },
                               {
                                 xtype      : 'displayfield',
                                 id         : 'fp_fd6'+p_type,
                                 fieldLabel : 'Modified Date',
                                 hidden     : v_hidden,
                               },
                               {
                                 xtype      : 'displayfield',
                                 id         : 'fp_fd7'+p_type,
                                 fieldLabel : 'Modified By',
                                 hidden     : v_hidden,
                               },
                               {
                                 xtype      : 'hiddenfield',
                                 id         : 'fp_fd8'+p_type,
                                 name       : 'run_filter_id',
                                 width      : 200,
                                 readOnly   : true
                               }
*/
                             ]
                           },
                           {
                             xtype         : 'fieldset',
                             id            : 'fp_md_fda'+p_type,
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
                                     id         : 'fp_fd_cb'+p_type,
                                     hidden     : v_hidden,
                                     flex       : 1,
                                     fieldLabel : 'Created By'
                                   },
                                   {
                                     xtype      : 'displayfield',
                                     id         : 'fp_fd_mb'+p_type,
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
                                     id         : 'fp_fd_cd'+p_type,
                                     hidden     : v_hidden,
                                     flex       : 1,
                                     fieldLabel : 'Created Date',
                                   },
                                   {
                                     xtype      : 'displayfield',
                                     id         : 'fp_fd_md'+p_type,
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
                             id            : 'fs_rules'+p_type,
                             title         : v_name + ' Rules',
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
                                         value : 'And / Or',
                                         width : 85
                                       },
                                       {
                                         xtype : 'displayfield',
                                         value : 'Profile Field',
                                         flex  : 1.5
                                       },
                                       {
                                         xtype : 'splitter'
                                       }, 
                                       {
                                         xtype : 'displayfield',
                                         value : 'Operator',
                                         flex  : 1
                                       },
                                       {
                                         xtype : 'splitter'
                                       },
                                       {
                                         xtype : 'displayfield',
                                         value : 'Value',
                                         flex  : 2
                                       },
                                       {
                                         xtype: 'splitter'
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
                                  id     : 'cf_rows'+p_type,
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
                                     id      : 'cfb_add'+p_type,
                                     disabled : true,
                                     width   : 75,
                                     text    : 'Add',
                                     icon    : 'icons/plus_blue_16.png',
                                     cls     : 'x-btn-text-icon',
                                     handler : function() {
                                                 f_add_rule();
                                               }
                                   }
                                 ]
                               }
                             ]
                           }
                         ],
                         dockedItems: [
                           {
                             xtype       : 'toolbar',
                             id          : 'ua_t_bottom'+p_type,
                             name        : 'ua_t_bottom',
                             dock        : 'bottom',
                             layout      : {
                               pack: 'center'
                             },
                             items: [
                               {
                                 xtype     : 'button',
                                 id        : 'cfb_count'+p_type,
                                 width     : 80,
                                 disabled  : false,
                                 frame     : true,
                                 border    : true,
                                 type      : 'submit',
                                 scale     : 'medium',
                                 text      : 'Count',
                                 tooltip   : 'Count contacts',
                                 icon      : 'icons/calc_blue_24.png',
                                 iconAlign : 'top',
                                 cls       : 'x-btn-text-icon',
                                 handler   : function() {

                                   /****
                                   *  Submit the form
                                   ****/
                                   f_submit_form (
                                     'C',
                                     'f_filseg_detail',
                                     v_grid,
                                     v_form,
                                     v_php,
                                     'fp_fd1'+p_type,
                                     '',
                                     'N'
                                   );
                                 }
                               },
                               {
                                 xtype     : 'button',
                                 id        : 'cfb_run'+p_type,
                                 width     : 80,
                                 disabled  : false,
                                 frame     : true,
                                 border    : true,
                                 type      : 'submit',
                                 scale     : 'medium',
                                 iconAlign : 'top',
                                 text      : 'Contacts',
                                 tooltip   : v_tt_contacts,
                                 icon      : 'icons/user_blue_24.png',
                                 cls       : 'x-btn-text-icon',
                                 handler   : function() {

                                   /****
                                   *  Submit the form and call
                                   *  f_filtered_contacts during the submit callback
                                   ****/
                                   f_submit_form (
                                     'R',
                                     'w_filseg_detail',
                                     v_grid,
                                     v_form,
                                     v_php,
                                     'fp_fd8'+p_type,
                                     v_ffc,
                                     'N' 
                                   );
                                 }
                               },
                               {
                                 xtype     : 'button',
                                 id        : 'cfb_save'+p_type,
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
                                   if (Ext.getCmp('fp_fd1'+p_type).value) { 

                                     f_submit_form (
                                       'U',
                                       'w_filseg_detail',
                                       v_grid,
                                       v_form,
                                       v_php,
                                       'fp_fd1'+p_type,
                                       '',
                                       'Y'
                                     );
                                   } else {
                                     f_submit_form (
                                       'I',
                                       'w_filseg_detail',
                                       v_grid,
                                       v_form,
                                       v_php,
                                       'fp_fd1'+p_type,
                                       '',
                                       'N' 
                                     );
                                   };

                                   /****
                                   *  Enable the delete button once saved
                                   ****/
                                   Ext.getCmp('cfb_delete'+p_type).enable(true);
                                 }
                               },
                               {
                                 xtype     : 'button',
                                 id        : 'cfb_delete'+p_type,
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
                                     'w_filseg_detail',
                                     v_grid,
                                     v_form,
                                     v_php,
                                      'fp_fd1'+p_type,
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
    *  If we're dealing with a filter
    *  add the create segment button
    ****/
    if ( p_type == 'F' ) {

      Ext.getCmp('ua_t_bottom'+p_type).add([{
        xtype     : 'button',
        id        : 'cfb_segment'+p_type,
        width     : 80,
        disabled  : true,
        frame     : true,
        border    : true,
        type      : 'submit',
        scale     : 'medium',
        text      : 'Segment',
        tooltip   : 'Create a segment from this filter',
        icon      : 'icons/stats_blue_24.png',
        iconAlign : 'top',
        cls       : 'x-btn-text-icon',
        handler   : function() {

          f_submit_form (
            'S',
            'w_filseg_detail',
            v_grid,
            v_form,
            v_php,
            'fp_fd1'+p_type,
            '',
            'N' 
          );
        }
      }]);
    };


    /****
    *  Function    : f_validate_filseg
    *  Description : is called when a form field is changed
    *                and determines whether the form is valid
    ****/
    function f_validate_filseg (
               p_event
             ) {

      /****
      *  Toggle enabling of save and segment (filters only)
      *  buttons depending on form validity
      ****/
      if ( Ext.getCmp(v_form).getForm().isValid() == true ) {
        Ext.getCmp('cfb_save'+p_type).enable(true);
   
        if ( p_type == 'F' ) {
          Ext.getCmp('cfb_segment'+p_type).enable(true);
        };
        
        /****
        *  Maximum of 5 rules
        ****/
        if ( v_rules < 5 ) {
          Ext.getCmp('cfb_add'+p_type).enable(true);
        };

      } else {
        Ext.getCmp('cfb_add'+p_type).disable(true);
        Ext.getCmp('cfb_save'+p_type).disable(true);
        if ( p_type == 'F' ) {
          Ext.getCmp('cfb_segment'+p_type).disable(true);
        }
      }
    };

    /****
    *  Function    : f_add_rule
    *  Description : adds rule to the filter
    *  Notes       : if we're adding a fieldcontainer for
    *                and existing rule populate the fields
    *
    *  obj and e passed in from the handler
    ****/
    function f_add_rule (
               p_first,
               p_and_or,
               p_profile_field,
               p_operator,
               p_value
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
      *  Add a fieldcontainer into fieldcontainer cf_rows
      ****/
      Ext.getCmp(v_form).down('#cf_rows'+p_type).add([{
        xtype       : 'fieldcontainer',
        height      : 22,
        layout      : 'hbox',
        autoDestroy : true,
        layoutConfig : {
          trackLabels  : true,
        },
        defaultType : 'textfield',
        items : [
          {
            xtype          : 'combobox',
            name           : 'and_or[]',
            width          : 75,
            store          : s_and_or,
            disabled       : v_disabled,
            valueField     : 'value',
            displayField   : 'label',
            value          : p_and_or,
            typeAhead      : true,
            queryMode      : 'local',
            forceSelection : true,
            allowBlank     : false,
            listeners      : {
              change   : f_validate_filseg
            }
          },
          {
            xtype: 'splitter'
          }, 
          {
            xtype          : 'combobox',
            name           : 'profile_field[]',
            flex           : 1.5,
            store          : s_contact_filter,
            valueField     : 'view_column',
            displayField   : 'field_label',
            value          : p_profile_field,
            typeAhead      : true,
            queryMode      : 'local',
            forceSelection : true,
            allowBlank     : false,
            listeners      : {
              change : f_validate_filseg
            }
          },
          {
            xtype: 'splitter'
          }, 
          {
            xtype          : 'combobox',
            name           : 'operator[]',
            flex           : 1,
            store          : s_filter_operator,
            valueField     : 'operator',
            displayField   : 'operator',
            value          : p_operator,
            typeAhead      : true,
            queryMode      : 'local',
            forceSelection : true,
            allowBlank     : false,
            listeners      : {
              change : f_validate_filseg
            }
          },
          {
            xtype: 'splitter'
          },
          {
            name       : 'value[]',
            value      : p_value,
            allowBlank : false,
            flex       : 2,
            listeners  : {
              change   : f_validate_filseg
            }
          }, 
          {
            xtype : 'splitter'
          },
          {
            xtype    : 'button',
            name     : 'fp_cr_delete[]',
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
      Ext.getCmp('cfb_save'+p_type).disable(true);

      /****
      *  If it's an existing filter or segment
      *  enable the add button
      ****/
      if (p_operator) {
        Ext.getCmp('cfb_add'+p_type).enable(true);
      } else {;
        Ext.getCmp('cfb_add'+p_type).disable(true);
      }

      /****
      *  Increment number of rules
      ****/
      v_rules++;

      /****
      *  Revalidate the form to enable the buttons
      if ( v_action == 'U' ) {
        f_validate_filseg();
      }
      ****/

    };

    /****
    *  Function    : f_delete_rule
    *  Description : deletes a rule from the filter
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
       var cr = p_button.up('#cf_rows'+p_type);

       /****
       *  Firstly remove and destroy the items in the fieldcontainer
       *  if you don't do this first then the items are not removed
       *  correctly from the form and their values are visible when submitting
       *
       *  This took me 6 fucking hours to work out...
       ****/
       p_button.up('fieldcontainer').removeAll(true);

       /****
       *  Then remove the fieldcontainer itself
       ****/
       cr.remove(fc).id;

       /****
       *  Decrement number of rules
       ****/
       v_rules--;

       /****
       *  Revalidate the form to enable the buttons
       ****/
       f_validate_filseg();
    };
  
    /****
    *  Modal window to hold filter / segment detail
    ****/
    var w_filseg_detail = Ext.create('Ext.Window', {
                            id          : 'w_filseg_detail',
                            title       : v_name,
                            height      : 600,
                            width       : 600,
                            resizable   : false,
                            draggable   : true,
                            modal       : true,
                            closeAction : 'destroy',
                            layout      : 'fit',
                            frame       : false,
                            items       : [fp_filseg_detail]
                         });
    /****
    *  Open the window & add the first rule set
    ****/
    w_filseg_detail.show();

    /****
    *  If we are dealing with an existing
    *  filter populate the fields
    ****/
    if ( v_action == 'U' ) {

      if ( p_type == 'F' ) { 

        Ext.getCmp('fp_fd1'+p_type).setValue(rec.get('filter_id'));
        Ext.getCmp('fp_fd2'+p_type).setValue(rec.get('filter_name'));

      } else {
        Ext.getCmp('fp_fd1'+p_type).setValue(rec.get('segment_id'));
        Ext.getCmp('fp_fd2'+p_type).setValue(rec.get('segment_name'));
      };

      Ext.getCmp('fp_fd3'+p_type).setValue(rec.get('description'));

      /****
      *  Audit trail fields
      ****/
      Ext.getCmp('fp_fd_cd'+p_type).setValue(rec.get('created_date'));
      Ext.getCmp('fp_fd_cb'+p_type).setValue(rec.get('created_by'));
      Ext.getCmp('fp_fd_md'+p_type).setValue(rec.get('modified_date'));
      Ext.getCmp('fp_fd_mb'+p_type).setValue(rec.get('modified_by'));

      /****
      *  Also enable the delete button
      ****/
      Ext.getCmp('cfb_delete'+p_type).enable(true);

    };

    /****
    *  Add an empty rule field container
    *  if we're creating a new filter
    ****/
    if ( v_action == 'I' ) {
      f_add_rule('Y');
    } else {

      /****
      *  Load the filter rules store with a callback
      *  so the rules can be added after the AJAX call completes
      ****/
      s_filter_rules.load ({
        callback :  function(records, options, success) {

          /****
          *  Add a fieldcontainer for each
          *  rule and populate the fields
          ****/
          var v_i = 1;
          s_filter_rules.each (
            function (record) {

              if ( v_i == 1 ) {
                f_add_rule (
                  'Y',
                  'AND',
                  record.get('profile_field'),
                  record.get('operator'),
                  record.get('value')
                )
                v_i++;
              } else {
                f_add_rule (
                  'N',
                  record.get('and_or'),
                  record.get('profile_field'),
                  record.get('operator'),
                  record.get('value')
                )
              }
            }
          )

          /****
          *  Set the add button active here
          f_validate_filseg();
//          Ext.getCmp('cfb_add'+p_type).enable(true);
          ****/

        }
      });
    }
  };
