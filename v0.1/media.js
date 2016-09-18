/*******************************************************************************
* Indigo
********************************************************************************
* Name          : media.js
* Description   : media management functions
* Author        : Scott Walkinshaw
* Date          : 8th January 2012
* Parameters    : 
* Comments      :

  Ext.Msg.alert('Status', 'test');


********************************************************************************
*                                                                          
********************************************************************************
* File Modification History                                                    *
********************************************************************************
* Inits | Vers | Date      | Description                                       *
* SW    | 1.0  | 08 Jan 12 | Initial issue                                     *
*******************************************************************************/
function f_media() {

  /****
  *  Workaround for bug EXTJSIV-3416
  ****/
  Ext.form.field.File.override({
    extractFileInput: function() {
      var me = this,
          fileInput = me.fileInputEl.dom,
          clone = fileInput.cloneNode(true);

      fileInput.parentNode.replaceChild(clone, fileInput);
      me.fileInputEl = Ext.get(clone);
      return fileInput;
    }
  });

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
//                          width      : 200,
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
                      items         : [p_gallery, p_gallery_detail]
                   });
    /****
    *  Open the window & add the first rule set
    ****/
    w_gallery.show();

  };

  /****
  *  Function     : f_view_media
  *  Description : views media in a new window
  ****/
  function f_view_media (
             p_action
           ) {

    if ( p_action == 'P' ) {

      /****
      *  Submit form
      ****/
      Ext.getCmp('fp_media_detail').getForm().submit ({
        clientValidation : false,
        submitEmptyText  : false,
        url              : 'media_preview.php',
        waitMsg          : 'Generating preview',
        success : function(form, action) {

          /****
          *  Display the image
          *  no id for the window so it can be dynamically resized
          ****/
          var w_view_media = Ext.create('Ext.Window', {
//                             id            : 'w_view_media',
                               title         : 'Preview : '+action.result.filename,
                               width         : Number(action.result.width) + Number(45),
                               height        : Number(action.result.height) + Number(25),
                               animateTarget : Ext.getCmp('md_b_view'),
                               resizable     : true,
                               draggable     : true,
                               modal         : true,
                               closeAction   : 'destroy',
                               frame         : false,
                               layout        : {
                                 type  : 'fit',
                                 align : 'stretch'
                               },
                               items : [
                                 {

                                   /****
                                   *  Panel to pad against
                                   ****/
                                   xtype   : 'panel',
                                   layout      : {
                                     type  : 'fit',
                                     align : 'stretch'
                                   },
                                   items : [
                                     {
                                       xtype   : 'panel',
                                       border  : false,
                                       padding : '5 5 5 5',
                                       html    : f_render_image(action.result.url)
                                     }
                                   ]
                                 }
                               ]
                            });

          w_view_media.show();

        },
        failure: function(form, action) {

          Ext.MessageBox.show ({
            title   : 'Status',
            msg     : 'Nothing to preview',
            modal   : true,
            buttons : Ext.Msg.OK,
            icon    : Ext.MessageBox.INFO
          });

        }
      });

    } else {


      /****
      *  Display the (already saved) image
      *  no id for the window so it can be dynamically resized
      ****/
      var w_view_media = Ext.create('Ext.Window', {
                           title         : 'View : '+Ext.getCmp('fp_md2').value,
                           width         : Number(Ext.getCmp('fp_md8').value) + Number(25),
                           height        : Number(Ext.getCmp('fp_md9').value) + Number(45),
                           animateTarget : Ext.getCmp('md_b_view'),
                           resizable     : true,
                           draggable     : true,
                           modal         : true,
                           closeAction   : 'destroy',
                           frame         : false,
                           layout        : {
                             type  : 'fit',
                             align : 'stretch'
                           },
                           items : [
                             {

                               /****
                               *  Panel to pad against
                               ****/
                               xtype   : 'panel',
                               layout      : {
                                 type  : 'fit',
                                 align : 'stretch'
                               },
                               items : [
                                 {
                                   xtype   : 'panel',
                                   border  : false,
                                   padding : '5 5 5 5',
                                   html    : f_render_image(Ext.getCmp('fp_md14').value)
                                 }
                               ]
                             }
                           ]
                        });

      w_view_media.show();
    }
  };


  /****
  *  Function    : f_media_type
  *  Description : reloads store for selected media type
  ****/

  function f_media_type (
             p_item,
             p_checked
           ) {

       /****
       *  Change the grid title
       ****/
       Ext.getCmp('g_media').setTitle('Media : ' + p_item.text);

       /****
       *  Load selected media type
       ****/
       Ext.getCmp('g_media').getStore().getProxy().extraParams.type = p_item.text;
       Ext.getCmp('g_media').getStore().loadPage(1);
  };

  /****
  *  Function    : f_media_detail
  *  Description : functionality to modify/create media objects
  ****/
  function f_media_detail (
             p_grid,
             p_record,
             p_item,
             p_index,
             p_object
           ) {

    /****
    *  Misc variables
    ****/
    var v_form = 'fp_media_detail';
    var v_php  = 'media_maintenance.php';

    /****
    *  Creating or modifying?
    ****/
    if (p_grid) {

      /****
      *  Get the store used by the grid then
      *  get the record at the index from the store
      ****/
      var v_record   = p_grid.getStore().getAt(p_index);

      var v_action     = 'U';
      var v_hidden     = false;
      var v_disabled   = false;
      var v_record     = p_grid.getStore().getAt(p_index);;
      var v_media_id   = v_record.get('media_id');
      var v_title      = v_record.get('media_name');
      var v_readonly   = true;
      var v_load       = false;
      var v_media_type = 'displayfield';
      var v_filefield  = 'displayfield';
      var v_height     = 400;
      var v_view_type  = 'V';
      var v_view_text  = 'View';

    } else {
      var v_action     = 'I';
      var v_disabled   = true;
      var v_hidden     = true;
      var v_readonly   = false;
      var v_load       = true;
      var v_title      = 'New Media Object';
      var v_media_id   = 0;
      var v_media_type = 'combobox';
      var v_filefield  = 'filefield';
      var v_height     = 275;
      var v_view_type  = 'P';
      var v_view_text  = 'Preview';

    };

    /****
    *  Media types model
    ****/
    Ext.define('indigo.media_types_model', {
      extend: 'Ext.data.Model',
      fields: [
        { name : 'media_type_id', type : 'int'},
        { name : 'media_type',    type : 'string'}
      ]
    });

    /****
    *  Email store
    ****/
    var s_media_types = Ext.create('Ext.data.Store', {
          model           : 'indigo.media_types_model',
          clearOnPageLoad : true,
          autoLoad        : v_load,
          proxy           : {
            type            : 'ajax',
            url             : 'fetch_media_types.php',
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
    *  Form panel to hold media details
    ****/
    var fp_media_detail = Ext.create('Ext.form.Panel', {
                            xtype         : 'form',
                            id            : 'fp_media_detail',
                            alias         : 'widget.fp_media_detail',
                            layout        : {
                              type  : 'vbox',
                              align : 'stretch'
                            },
                            frame : true,
//                            flex  : 1,
                            items : [
                              {
                                xtype         : 'fieldset',
                                id            : 'fp_md_fs1',
                                title         : 'Details',
                                layout        : 'anchor',
                                defaultType   : 'textfield',
                                flex          : 1,
                                fieldDefaults : {
                                  labelAlign     : 'left',
                                  labelWidth     : 90,
                                  labelSeparator : ':'
                                },
                                items: [
                                  {
                                    xtype      : 'hiddenfield',
                                    id         : 'fp_md1',
                                    name       : 'media_id',
                                    width      : 400,
                                    readOnly   : true
                                  },
                                  {
                                    xtype      : 'textfield',
                                    id         : 'fp_md2',
                                    name       : 'media_name',
                                    width      : 400,
                                    readOnly   : false,
                                    allowBlank : false,
                                    maxLength  : 32,
                                    fieldLabel : 'Object Name',
                                    listeners : {
                                      change : function() {
                                                 f_validate_form (
                                                   'fp_media_detail',
                                                   'md_b_save'
                                                 )
                                               }
                                    }
                                  },
                                  {
                                    xtype      : 'textarea',
                                    id         : 'fp_md3',
                                    name       : 'description',
                                    width      : 400,
                                    height     : 50,
                                    readOnly   : false,
                                    allowBlank : true,
                                    maxLength  : 256,
                                    fieldLabel : 'Description',
                                    listeners : {
                                      change : function() {
                                                 f_validate_form (
                                                   'fp_media_detail',
                                                   'md_b_save'
                                                 )
                                               }
                                    }
                                  },
                                  {
                                    xtype          : 'hiddenfield',
                                    id             : 'fp_md4',
                                    name           : 'media_type',
                                    width          : 200,
                                    store          : s_media_types,
                                    fieldLabel     : 'Media Type',
                                    valueField     : 'media_type_id',
                                    displayField   : 'media_type',
                                    value          : '1', // media_type
                                    queryMode      : 'local',
                                    allowBlank     : false,
                                    forceSelection : false,
                                    emptyText      : 'Image',
                                    readOnly       : v_readonly,
                                    listeners : {
                                      change : function() {
                                                 f_validate_form (
                                                   'fp_media_detail',
                                                   'md_b_save'
                                                 )
                                               }
                                    }
                                  },
                                  {
                                    xtype        :  v_filefield,
                                    id           : 'fp_md5',
                                    name         : 'filename',
                                    emptyText    : 'select a file',
                                    fieldLabel   : 'File',
                                    buttonText   : '',
                                    width        : 300,
                                    readOnly     : v_readonly,
                                    allowBlank   : false,
                                    buttonConfig : {
                                      icon : 'icons/folder2_blue_16.png'
                                    },
                                    listeners    : {
                                      change : function() {
                                                 f_validate_form (
                                                   'fp_media_detail',
                                                   'md_b_save'
                                                 )

                                                 /****
                                                 *  Enable the view button
                                                 ****/
                                                 Ext.getCmp('md_b_view').enable(true);
                                               }
                                       
                                                
                                    }
                                  },
/*
                                  {
                                    xtype      : 'displayfield',
                                    id         : 'fp_md5',
                                    name       : 'Filename',
                                    hidden     : v_hidden,
                                    fieldLabel : 'Filename'
                                  },
*/
                                  {
                                    xtype  : 'fieldcontainer',
                                    height : 20,
                                    layout : 'hbox',
                                    items: [
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_md6',
                                        name       : 'mime_type',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Mime Type',
                                      },
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_md8',
                                        name       : 'width',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Width'
                                      },
                                    ]
                                  },
                                  {
                                    xtype  : 'fieldcontainer',
                                    height : 20,
                                    layout : 'hbox',
                                    items: [
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_md7',
                                        name       : 'size_kb',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Size KB',
                                      },
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_md9',
                                        name       : 'height',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Height'
                                      },
                                    ]
                                  }
                                ]
                              },  // end of first fieldset
                              {
                                xtype         : 'fieldset',
                                id            : 'fp_md_fs2',
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
                                        id         : 'fp_md10',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Created By'
                                      },
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_md11',
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
                                        id         : 'fp_md12',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Created Date',
                                      },
                                      {
                                        xtype      : 'displayfield',
                                        id         : 'fp_md13',
                                        hidden     : v_hidden,
                                        flex       : 1,
                                        fieldLabel : 'Modified Date',
                                      },
                                    ]
                                  },
                                  {
                                    xtype      : 'hiddenfield',
                                    id         : 'fp_md14',
                                    hidden     : v_hidden,
                                  },
                                ]
                              }
                            ],
                            dockedItems: [
                              {
                                xtype       : 'toolbar',
                                id          : 'md_t_bottom',
                                name        : 'md_t_bottom',
                                dock        : 'bottom',
                                layout      : {
                                  pack: 'center'
                                },
                                items: [
                                  {
                                    xtype     : 'button',
                                    id        : 'md_b_view',
                                    width     : 80,
                                    disabled  : true,
                                    frame     : true,
                                    border    : true,
                                    type      : 'submit',
                                    scale     : 'medium',
                                    text      : v_view_text,
                                    icon      : 'icons/movie_blue_24.png',
                                    iconAlign : 'top',
                                    cls       : 'x-btn-text-icon',
                                    handler   : function() {
                                      f_view_media (
                                        v_view_type
                                      )
                                    }
                                  },
                                  {
                                    xtype     : 'button',
                                    id        : 'md_b_save',
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
                                      if (Ext.getCmp('fp_md1').value) {
   
                                        f_submit_form (
                                          'U',
                                          'w_media_detail',
                                          'g_media',
                                          'fp_media_detail',
                                          v_php,
                                          'fp_md1',
                                          '',
                                          'Y'
                                        );
                                      } else {
                                        f_submit_form (
                                          'I',
                                          'w_media_detail',
                                          'g_media',
                                          'fp_media_detail',
                                          v_php,
                                          'fp_md1',
                                          '',
                                          'N'
                                        );

//                                        w_media_detail.close(); 

                                      };
 
                                      /****
                                      *  Enable the delete and view buttons once saved
                                      ****/
                                      Ext.getCmp('md_b_view').enable(true);
                                      Ext.getCmp('md_b_delete').enable(true);

                                      /****
                                      *  And disbale the save button until something has changed
                                      ****/
                                      Ext.getCmp('md_b_save').disable(true);
                                    }
                                  },
                                  {
                                    xtype     : 'button',
                                    id        : 'md_b_delete',
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
                                        'w_media_detail',
                                        'g_media',
                                        'fp_media_detail',
                                        v_php,
                                         'fp_md1',
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
    *  If we are dealing with an existing
    *  media object populate the for,
    ****/
    if ( v_action == 'U' ) {

      Ext.getCmp('fp_md1').setValue(v_record.get('media_id'));
      Ext.getCmp('fp_md2').setValue(v_record.get('media_name'));
      Ext.getCmp('fp_md3').setValue(v_record.get('description'));
      Ext.getCmp('fp_md4').setValue(v_record.get('media_type'));
      Ext.getCmp('fp_md5').setValue(v_record.get('filename'))
      Ext.getCmp('fp_md6').setValue(v_record.get('mime_type'));
      Ext.getCmp('fp_md7').setValue(v_record.get('size'));
      Ext.getCmp('fp_md8').setValue(v_record.get('width'));
      Ext.getCmp('fp_md9').setValue(v_record.get('height'));
      Ext.getCmp('fp_md10').setValue(v_record.get('created_by'));
      Ext.getCmp('fp_md11').setValue(v_record.get('modified_by'));
      Ext.getCmp('fp_md12').setValue(v_record.get('created_date'));
      Ext.getCmp('fp_md13').setValue(v_record.get('modified_date'));
      Ext.getCmp('fp_md14').setValue(v_record.get('url'));

      /****
      *  Enable the delete button
      ****/
      Ext.getCmp('md_b_delete').enable(true);


      /****
      *  Load the stores we need callbacks for
      ****/
      s_media_types.load ({
        callback :  function(records, options, success) {

          Ext.getCmp('fp_md4').setValue(v_record.get('media_type_id'));

          /****
          *  Disable the save button - setting the 
          *  fields above here will have validated the form
          ****/
          Ext.getCmp('md_b_save').disable(true);
        }
      });
    };
    
    /****
    *  Modal window to hold media object details
    *
    *  OK this is interesting....
    *  in order for the window to be dynamically sized each
    *  time it's opened I need to not specify an ID...
    ****/
    var w_media_detail = Ext.create('Ext.Window', {
//                           id          : 'w_media_detail',
                           title       : v_title,
                           height      : v_height,
                           width       : 500,
                           resizable   : false,
                           draggable   : true,
                           modal       : true,
                           closeAction : 'destroy',
                           layout      : 'fit',
                           frame       : false,
                           listeners : {
                              beforeclose : function() {
                                              s_media.loadPage(s_media.currentPage);
                                            }
                           },
                           items       : [fp_media_detail]
                        });
    /****
    *  Open the window & add the first rule set
    ****/
    w_media_detail.show();

  };

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
        pageSize        : 100,
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
  *  media grid
  ****/
  return Ext.define('indigo.g_media', {
           extend         : 'Ext.grid.Panel',
           id             : 'g_media',
           alias          : 'widget.g_media',
           title          : 'Media Library',
           store          : s_media,
           trackMouseOver : true,
           layout         : 'fit',
           loadMask       : true,
           enableHdMenu   : true,
           stripeRows     : true,
           autoRender     : true,
           autoShow       : true,
           listeners      : {
             itemdblclick : f_media_detail
           },
           columns        : [
             {
               id        : 'gm_c1',
               text      : 'Object ID',
               width     : 70,
               sortable  : true,
               dataIndex : 'media_id' 
             }, 
             {
               id        : 'gm_c2',
               text      : 'Object Name',
               width     : 120,
               sortable  : true,
               dataIndex : 'media_name'
             },
             {
               id        : 'gm_c3',
               text      : 'Media Type',
               width     : 70,
               sortable  : true,
               dataIndex : 'media_type'
             },
             {
               id        : 'gm_c4',
               text      : 'Filename',
               width     : 120,
               sortable  : true,
               dataIndex : 'filename'
             },
             {
               id        : 'gm_c5',
               text      : 'Date Created',
               width     : 120,
               sortable  : true,
               dataIndex : 'created_date'
             },
             {
               id        : 'gm_c6',
               text      : 'Created By',
               flex      : 1,
               sortable  : true,
               dataIndex : 'created_by'
             },
           ],
           dockedItems    : [
             {
               xtype       : 'pagingtoolbar',
               id          : 'gm_spt_bottom',
               name        : 'gm_pt_bottom',
               store       : s_media,
               dock        : 'bottom',
               displayInfo : true,
               displayMsg  : 'Displaying rows {0} - {1} of {2}',
               emptyMsg    : "No data to display",
               pageSize    : 25
             },
             {     
               xtype       : 'toolbar',
               id          : 'gm_st_top',
               name        : 'gm_st_top',
               dock        : 'top',
               items: [ 
           {
              xtype   : 'button',
              id      : 'gm_tb_b_create',
              text    : 'Add',
              tooltip : 'Add item to library',
              icon    : 'icons/plus_blue_16.png',
              cls     : 'x-btn-text-icon',
              handler : function() {
                f_media_detail()
              }
            },
            {
              xtype : 'tbspacer',
              id    : 'gm_tb_sspacer',
              width : 10
            },
            {
              xtype   : 'button',
              id      : 'gm_tb_b_gallery',
              text    : 'Gallery',
              tooltip : 'Image gallery',
              icon    : 'icons/ipod_blue_16.png',
              cls     : 'x-btn-text-icon',
              handler : function() {
                f_gallery()
              }
            },

/*
            {
              xtype    : 'button',
              text     : 'Type',
              icon     : 'icons/ipod_blue_16.png',
              cls      : 'x-btn-text-icon',
              menu     : {
                defaults : {
                  checked : false,
                  group   : 'media_type'  // radio buttons
                },
                items : [
                  {
                    text         : 'All',
                    checked      : true,
                    checkHandler : f_media_type
                  },
                  {
                    text         : 'Images',
                    checkHandler : f_media_type
                  }, 
                  {
                    text         : 'Video',
                    checkHandler : f_media_type
                  }
                ]
              }
            }
*/
          ]
        }
      ]
    });

};
