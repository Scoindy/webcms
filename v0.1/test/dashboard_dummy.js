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
function f_dashboard_dummy() {

  /****
  *  Dashboard panel
  ****/
  return Ext.define('indigo.p_dashboard', {
                      extend : 'Ext.Panel',
                      alias  : 'widget.p_dashboard',
                      title  : 'Dashboard',
                      layout : {
                        type  : 'vbox',
                        align : 'stretch',
                        pack  : 'start'
                      }
                    });

};
