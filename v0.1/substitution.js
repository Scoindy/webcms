/*******************************************************************************
* Indigo
********************************************************************************
* Name          : substitution.js
* Description   : manages default substitution variables
* Author        : Scott Walkinshaw
* Date          : 18th January 2012
* Parameters    : 
* Comments      : 

  Ext.Msg.alert('Status', 'test');
********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 18 Jan 12 | Initial issue                                     *
*******************************************************************************/
function f_substitution() {

  /****
  *  Substitution default model
  ****/
  Ext.define('indigo.substitution_default_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'field_id',             type : 'int'    },
      { name : 'field_label',          type : 'string' },
      { name : 'substitution_default', type : 'string' }
    ]
  });

  /****
  *  Substitution default store
  ****/
  var s_substitution_default = Ext.create('Ext.data.Store', {
                                 model           : 'indigo.contact_search_model',
                                 clearOnPageLoad : true,
                                 autoLoad        : false,
                                 pageSize        : 256,
                                 proxy           : {
                                   type          : 'ajax',
                                   url           : 'fetch_substitution_fields.php',
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
    *  Form panel 
    ****/
    return Ext.define('indigo.p_substitution', {
             extend : 'Ext.Panel',
             alias  : 'widget.p_substitution',
     //        xtype  : 'form',
             id     : 'p_substitution',
             title  : 'Substitution Fields',
             autoScroll  : true,
             fieldDefaults: {
               labelAlign : 'left',
               labelWidth : 90
             },
             frame       : true,
             dockedItems: [
               {
                 xtype       : 'toolbar',
                 id          : 'fpsd_t_bottom',
                 name        : 'fpsd_t_bottom',
                 dock        : 'bottom',
                 border      : true,
                 layout      : {
                   pack: 'center'
                 },
                 items: [
                   {
                     xtype     : 'button',
                     id        : 'fpsd_b_save',
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

                       f_submit_form (
                         'U',
                         '',
                         '',
                         'fp_sd',
                         'substitution_maintenance.php',
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

};
