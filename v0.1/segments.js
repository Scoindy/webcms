/*******************************************************************************
* Indigo
********************************************************************************
* Name          : segemnts.js
* Description   : handles campaign segments
* Author        : Scott Walkinshaw
* Date          : 14th December 2011
* Parameters    : 
* Comments      :
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 14 Dec 14 | Initial issue                                     *
*******************************************************************************/
function f_segments() {

  /****
  *  Function    : f_segment_type
  *  Description : reloads store for selected segment type
  ****/
  function f_segment_type (
             p_item,
             p_checked
           ) {

       /****
       *  Change the grid title
       ****/
       Ext.getCmp('g_segments').setTitle('Segments : ' + p_item.text);

       /****
       *  Load selected segment type
       ****/
       Ext.getCmp('g_segments').getStore().getProxy().extraParams.type = p_item.text;
       Ext.getCmp('g_segments').getStore().loadPage(1);
  };

  /****
  *  Function   : f_segment_contacts
  *  Descripton : displays filtered contacts
  *  Notes      : this function is called from the f_submit_form success callback
  *
  *  define as variable so we can pass to another function
  *  when you do this you need to define function before
  *  variable is used - duh 
  ****/
  var v_fsc = function f_segment_contacts (
                         p_segment_id
                       ) {

    /****
    *  Call the contacts grid with the filter ID
    ****/
    g_segment_contacts = f_contacts (
      p_segment_id,
      'S'
    );

    /****
    *  Panel to hold the grid
    ****/
    Ext.define('indigo.p_segment_contacts', {
               extend     : 'Ext.panel.Panel',
               id         : 'p_segment_contacts',
               alias      : 'widget.p_segment_contacts',
               region     : 'center',
               layout     : 'card',
               animate    : true,
               margins    : '0 0 0 0', // top right bottom left
               activeItem : 0,
               border     : false,
                               items       : [g_filtered_contacts]
/*
               items      : [
                 {
                   xtype : 'g_filtered_contacts'
                 }
*/
      });

    /****
    *  Modal window
    ****/
    var w_segment_contacts = Ext.create('Ext.Window', {
                               id          : 'w_segment_contacts',
                               title       : 'Segment: ',// +Ext.getCmp('fp_fd2').value,
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
                                   xtype : 'p_segment_contacts'
                                 }
                               ]
//                               items       : [p_filtered_contacts]
                            });
    /****
    *  Open the window
    ****/
    w_segment_contacts.show();

  };

  /****
  *  Segment model
  ****/
  Ext.define('indigo.segment_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'segment_id',      type : 'int'}, 
      { name : 'segment_type_id', type : 'int'}, 
      { name : 'segment_type',    type : 'string'}, 
      { name : 'segment_name',    type : 'string'}, 
      { name : 'description',     type : 'string'}, 
      { name : 'created_by',      type : 'string'},
      { name : 'created_date',    type : 'string'},
      { name : 'modified_by',     type : 'string'},
      { name : 'modified_date',   type : 'string'},
//      { name : 'members',       type : 'int'}
    ]
  });

  /****
  *  Segment store
  ****/
  var s_segments = Ext.create('Ext.data.Store', {
                     model           : 'indigo.segment_model',
                     clearOnPageLoad : true,
                     autoLoad        : true,
                     proxy           : {
                     type            : 'ajax',
                     url             : 'fetch_segments.php',
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
  *  Segment grid
  ****/
  return Ext.define('indigo.g_segments', {
           extend         : 'Ext.grid.Panel',
           id             : 'g_segments',
           alias          : 'widget.g_segments',
           title          : 'Segments',
           store          : s_segments,
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

                              f_filseg_detail (
                                'S',
                                p_grid,
                                p_record,
                                p_item,
                                p_index,
                                p_object
                              )
                             }
           },
           columns        : [
             {
               id        : 'gs_c1',
               text      : 'Segment ID',
               width     : 80,
               sortable  : true,
               dataIndex : 'segment_id' 
             }, 
             {
               id        : 'gs_c2',
               text      : 'Segment Name',
               width     : 150,
               sortable  : true,
               dataIndex : 'segment_name'
             },
             {
               id        : 'gs_c3',
               text      : 'Segment Type',
               width     : 100,
               sortable  : true,
               dataIndex : 'segment_type'
             },
             {
               id        : 'gs_c4',
               text      : 'Date Created',
               width     : 150,
               sortable  : true,
               dataIndex : 'created_date'
             },
             {
               id        : 'gs_c5',
               text      : 'Created By',
               flex      : 1,
               sortable  : true,
               dataIndex : 'created_by'
             },
/*
             {
               id        : 'gs_c6',
               text      : 'Members',
               width     : 100,
               sortable  : true,
               dataIndex : 'members'
             }
*/
           ],
           dockedItems    : [
             {
               xtype       : 'pagingtoolbar',
               id          : 'spt_bottom',
               name        : 'spt_bottom',
               store       : s_segments,
               dock        : 'bottom',
               displayInfo : true,
               displayMsg  : 'Displaying rows {0} - {1} of {2}',
                emptyMsg    : "No data to display",
                pageSize    : 25
             },
             {     
               xtype       : 'toolbar',
               id          : 'st_top',
               name        : 'st_top',
               dock        : 'top',
               items: [ 
                {
                   xtype   : 'button',
                   id      : 'sg_tb_b_create',
                   text    : 'Create',
                   icon    : 'icons/plus_blue_16.png',
                   cls     : 'x-btn-text-icon',
                   handler : function() {
                               f_filseg_detail (
                                 'S'
                               )
                             }
                 },
                 {
                   xtype : 'tbspacer',
                   id    : 'sg_tb_spacer',
                   width : 5
                 },
                 {
                   xtype    : 'button',
                   text     : 'Type',
                   icon     : 'icons/stats_blue_16.png',
                   cls      : 'x-btn-text-icon',
                   menu     : {
                     defaults : {
                       checked : false,
                       group   : 'segment_type'  // radio buttons
                     },
                     items : [
                       {
                         text         : 'All',
                         checked      : true,
                         checkHandler : f_segment_type
                       },
                       {
                         text         : 'Campaign',
                         checkHandler : f_segment_type
                       }, 
                       {
                         text         : 'Upload',
                         checkHandler : f_segment_type
                       }
                     ]
                   }
                 }
               ]
             }
           ]
         });

};
