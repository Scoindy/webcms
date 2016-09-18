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
  *  Media model
  ****/
  Ext.define('indigo.media_model', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'media_id',        type : 'int'},
      { name : 'media_name',      type : 'string'},
      { name : 'description',     type : 'string'},
      { name : 'media_type_id',   type : 'string'},
      { name : 'media_type',      type : 'string'},
      { name : 'url',             type : 'string'},
      { name : 'thumbnail_url',   type : 'string'},
      { name : 'filename',        type : 'string'},
      { name : 'mime_type',       type : 'string'},
      { name : 'size',            type : 'string'},
      { name : 'width',           type : 'string'},
      { name : 'height',          type : 'string'},
      { name : 'created_by',      type : 'string'},
      { name : 'created_date',    type : 'string'},
      { name : 'modified_by',     type : 'string'},
      { name : 'modified_date',   type : 'string'}
    ]
  });

  /****
  *  Media store
  ****/
  var s_media = Ext.create('Ext.data.Store', {
        model           : 'indigo.media_model',
        clearOnPageLoad : true,
        autoLoad        : true,
        proxy           : {
          type            : 'ajax',
          url             : 'fetch_media.php',
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
    *  Data view tpl
    ****/
    var t_dv_gallery = new Ext.XTemplate (
                               '<tpl for=".">',
                                 '<div class="thumb-wrap" id="{media_id}">',
                                 '<div class="thumb"><img src="{thumbnail_url}" title="{media_name}"></div>',
                                 '<span class="x-editable">{filename}</span></div>',
                               '</tpl>',
                             '<div class="x-clear"></div>'
                           );

    /****
    *  Image detail tpl
    ****/
    var t_p_gallery_detail = new Ext.XTemplate (
                                   '<div class="details">',
                                     '<tpl for=".">',
                                       '<img src="{thumbnail_url}"><div class="details-info">',
                                       '<b>Name:</b>',
                                       '<span>{media_name}</span>',
                                       '<b>Description:</b>',
                                       '<span>{description}</span>',
                                       '<b>Filename:</b>',
                                       '<span>{filename}</span>',
                                       '<b>Size (KB):</b>',
                                       '<span>{size}</span>',
                                       '<b>Height:</b>',
                                       '<span>{height}</span>',
                                       '<b>Width:</b>',
                                       '<span>{width}</span>',
                                       '<b>Created By:</b>',
                                       '<span>{created_by}</span>',
                                       '<b>Created Date:</b>',
                                       '<span>{created_date}</span>',
                                       '<b>Modified By:</b>',
                                       '<span>{modified_by}</span>',
                                       '<b>Modified Date:</b>',
                                       '<span>{modified_date}</span>',
                                       '<span><a href="{url}" target="_blank">view original</a></span></div>',
                                     '</tpl>',
                                   '</div>'
                                 );


    /****
    *  Gallery data view
    ****/
    var dv_gallery = new Ext.DataView ({
                           autoScroll   : true,
                           store        : s_media,
                           tpl          : t_dv_gallery,
                           autoHeight   : true,
//                           height       : 400,  
                           multiSelect  : false,
                           overClass    : 'x-view-over', 
                           itemSelector : 'div.thumb-wrap',
                           emptyText    : 'No images to display',
                           style        : 'border:1px solid #99BBE8; border-top-width: 0',
                           plugins      : [
                            Ext.create('Ext.ux.DataView.DragSelector', {}),
                            Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'media_name'})
                           ],
                           listeners    : {
                             selectionchange : {
                               fn : function(viewmodel, array) {

                                      /****
                                      *  This is an ExtJS bug - or at least a documentation bug
                                      *  the selection change listener is supposed to pass 
                                      *  the data view but it's passing the model
                                      ****/
                                      var record = viewmodel.getSelection();
                                      t_p_gallery_detail.overwrite(p_gallery_detail.body, record[0].data);
                                    }
                             }
                           }
                         });

    /****
    *  Gallery panel
    ****/
    var p_gallery = new Ext.Panel({
                          id         : 'p_gallery',  // this is the div
                          region     : 'center',
                          title      : 'Images',
                          style      : 'margin : 10 10 10 10',
//                          frame      : true,
//                          width      : 300,
//                          height     : 200,
                          autoHeight : true,
                          autoScroll : true,
                          items      : [dv_gallery]
                        });

    /****
    *  Galery detail panel
    ****/
    var p_gallery_detail = new Ext.Panel ({
                             id     : 'p_gallery_detail',
                             title  : 'Image Detail',
                             style    : 'margin : 10 10 10 10',  // top right bottom left
                             frame  : true,
                             region : 'east',
                             width  : 200,
//                             height : 255,
                             tpl    : t_p_gallery_detail
                           });

    /****
    *  Gallery window
    ****/
    var w_gallery = Ext.create('Ext.Window', {
                      id          : 'w_gallery',
                      title       : 'Media Gallery',
                      layout      : 'border',
                      width       : 875,
                      height      : 500,
                      resizable   : false,
                      draggable   : true,
                      modal       : true,
                      closeAction : 'destroy',
                      frame       : false,
                      items       : [p_gallery, p_gallery_detail]
                   });
    /****
    *  Open the window & add the first rule set
    ****/
    w_gallery.show();

};

Ext.Loader.setConfig({enabled:true});
Ext.Loader.setPath('Ext.ux.DataView', 'plugins/DataView/');
Ext.onReady(f_test);

