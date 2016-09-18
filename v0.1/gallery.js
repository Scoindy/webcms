  /****
  *  Function     : f_gallery
  *  Description : 
  ****/
  function f_gallery() {

    /****
    *  Data view template
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
    *  Image detail template
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
                           multiSelect  : false,
                           overClass    : 'x-view-over', 
                           itemSelector : 'div.thumb-wrap',
                           emptyText    : 'No images to display',
                           style        : 'border:0px solid #99BBE8; border-top-width: 0',
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
                          frame      : true,
//                          width      : 300,
//                          height     : 200,
                          autoHeight : true,
                          autoScroll : true,
                          items      : [dv_gallery]
                        });

    /****
    *  Gallery detail panel
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
                      id            : 'w_gallery',
                      title         : 'Media Gallery',
                      layout        : 'border',
//                      animateTarget : Ext.getCmp('gm_tb_b_gallery'),
                      width         : 883,
                      height        : 635,
                      resizable     : false,
                      draggable     : true,
                      modal         : true,
                      closeAction   : 'destroy',
                      frame         : false,
                      items         : [p_gallery2, p_gallery_detail]
                   });
    /****
    *  Open the window & add the first rule set
    ****/
    w_gallery.show();

  };
