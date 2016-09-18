/*******************************************************************************
* Indigo
********************************************************************************
* Name          : filters.js
* Description   : manages filters grid
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
function f_filters() {

  /****
  *  Filter model
  ****/
  Ext.define('indigo.filter_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'filter_id',          type : 'int'    }, 
      { name : 'filter_name',        type : 'string' }, 
      { name : 'description',        type : 'string' }, 
      { name : 'created_by',         type : 'string' },
      { name : 'created_date',       type : 'string' },
      { name : 'modified_by',        type : 'string' },
      { name : 'modified_date',      type : 'string' }
    ]
  });

  /****
  *  Filter store
  ****/
  var s_filter = Ext.create('Ext.data.Store', {
                   model           : 'indigo.filter_model',
                   clearOnPageLoad : true,
                   autoLoad        : true,
                   pageSize        : 20,
                   proxy           : {
                     type          : 'ajax',
                     url           : 'fetch_filters.php',
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
                   },
                   extraParams     : {
                     search : ''
                   }
                 });

  /****
  *  Filters grid
  ****/
  return Ext.define('indigo.g_filters', {
           extend         : 'Ext.grid.Panel',
           id             : 'g_filters',
           alias          : 'widget.g_filters',
           title          : 'Filters',
           store          : s_filter,
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
                                'F',
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
               id        : 'gf_c1',
               text      : 'Filter ID',
               width     : 80,
               sortable  : true,
               dataIndex : 'filter_id' 
             },
             {
               id        : 'gf_c2',
               text      : 'Filter Name',
               width     : 150,
               sortable  : true,
               dataIndex : 'filter_name' 
             }, 
             {
               id        : 'gf_c3',
               text      : 'Date Created',
               width     : 150,
               sortable  : true,
               dataIndex : 'created_date'
             }, 
             {
               id        : 'gf_c4',
               text      : 'Created By',
               flex      : 1,
               sortable  : true,
               dataIndex : 'created_by'
             }
           ],
           dockedItems    : [
             {
               xtype       : 'pagingtoolbar',
               id          : 'fg_pt_bottom',
               store       : s_filter,
               dock        : 'bottom',
               displayInfo : true,
               displayMsg  : 'Displaying rows {0} - {1} of {2}',
               emptyMsg    : "No data to display",
               pageSize    : 20
             },
             {
               xtype       : 'toolbar',
               id          : 'fg_tb_top',
               name        : 'fg_tb_top',
               dock        : 'top',
               items: [
                 {
                   xtype   : 'button',
                   id      : 'fg_tb_b_create',
                   text    : 'Create',
                   icon    : 'icons/plus_blue_16.png',
                   cls     : 'x-btn-text-icon',
                   handler : function() {
                               f_filseg_detail (
                                 'F'
                               )
                             }
                 }
               ]
             }
           ]
         });



};
