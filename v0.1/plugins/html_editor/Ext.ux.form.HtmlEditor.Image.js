/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @class Ext.ux.form.HtmlEditor.Image
 * @extends Ext.util.Observable
 * <p>A plugin that creates an image button in the HtmlEditor toolbar for inserting an image. The method to select an image must be defined by overriding the selectImage method. Supports resizing of the image after insertion.</p>
 * <p>The selectImage implementation must call insertImage after the user has selected an image, passing it a simple image object like the one below.</p>
 * <pre>
 *      var img = {
 *         Width: 100,
 *         Height: 100,
 *         ID: 123,
 *         Title: 'My Image'
 *      };
 * </pre>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 Ext.Msg.alert('test1');

 */
Ext.define('Ext.ux.form.HtmlEditor.Image', {
    extend: 'Ext.util.Observable',

    // Image language text
    langTitle   : 'Insert Image',

    urlSizeVars : ['width','height'],

    basePath    : 'image.php',

    /****
    *  Every plugins gets instantiated by using the init method in the plugin and gets passed the parent component.
    ****/
    init: function(cmp){
        this.cmp = cmp;
        this.cmp.on('render', this.onRender, this);
        this.cmp.on('initialize', this.onInit, this, {delay:100, single: true});
    },

    onEditorMouseUp : function(e){
        Ext.get(e.getTarget()).select('img').each(function(el){
            var w = el.getAttribute('width'), h = el.getAttribute('height'), src = el.getAttribute('src')+' ';
            src = src.replace(new RegExp(this.urlSizeVars[0]+'=[0-9]{1,5}([&| ])'), this.urlSizeVars[0]+'='+w+'$1');
            src = src.replace(new RegExp(this.urlSizeVars[1]+'=[0-9]{1,5}([&| ])'), this.urlSizeVars[1]+'='+h+'$1');
            el.set({src:src.replace(/\s+$/,"")});
        }, this);

    },

    onInit: function(){
        Ext.EventManager.on(this.cmp.getDoc(), {
            mouseup     : this.onEditorMouseUp,
            buffer      : 100,
            scope       : this
        });
    },

    /****
    *  Own code here
    ****/
    selectImage: function(p_this) {

  /****
  *  Media model
  ****/
  Ext.define('indigo.media_model1', {
    extend: 'Ext.data.Model',
    fields: [
      { name : 'media_id',        type : 'int'},
      { name : 'media_name',      type : 'string'},
      { name : 'description',     type : 'string'},
      { name : 'media_type_id',   type : 'string'},
      { name : 'media_type',      type : 'string'},
      { name : 'url',             type : 'string'},
      { name : 'full_url',        type : 'string'},
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
  var s_media1 = Ext.create('Ext.data.Store', {
        model           : 'indigo.media_model1',
        clearOnPageLoad : true,
        autoLoad        : true,
pageSize : 100,
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
    *  Data view template
    ****/
    var t_dv_gallery1 = new Ext.XTemplate (
                               '<tpl for=".">',
                                 '<div class="thumb-wrap" id="{media_id}">',
                                 '<div class="thumb"><img src="{thumbnail_url}" title="{media_name}"></div>',
                                 '<span class="x-editable">{filename}</span></div>',
                               '</tpl>',
                             '<div class="x-clear"></div>'
                           );

    /****
    *  Gallery data view
    ****/
    var dv_gallery1 = new Ext.DataView ({
                           autoScroll   : true,
                           store        : s_media1,
                           tpl          : t_dv_gallery1,
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
                                      var img = {
                                            width: record[0].data.width,
                                            height: record[0].data.height,
                                            id:  record[0].data.media_id,
                                            name:  record[0].data.media_name,
                                            url:  record[0].data.url
                                           }


                                       /****
                                       *  You can't insert the absolute URL here
                                       *  have to do a replace workaround in the database
                                       ****/
                                       Ext.getCmp('fp_ed_body').insertAtCursor('<img src="'+img.url+'">');

                                       /****
                                       *  Close the gallery
                                       ****/
                                       Ext.getCmp('w_gallery1').close();
 
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
                          scope      : this,
                          style      : 'margin : 10 10 10 10',
                          frame      : true,
//                          width      : 300,
//                          height     : 200,
                          autoHeight : true,
                          autoScroll : true,
                          items      : [dv_gallery1]
                        });

    /****
    *  Gallery window
    ****/
    var w_gallery1 = Ext.create('Ext.Window', {
                      id            : 'w_gallery1',
                      title         : 'Select Image',
                      layout        : 'border',
                      width         : 665,
                      height        : 635,
                      resizable     : false,
                      draggable     : true,
                      modal         : true,
                      closeAction   : 'destroy',
                      frame         : false,
                      items         : [p_gallery]
                   });
    /****
    *  Open the window & add the first rule set
    ****/
    w_gallery1.show();

  },

    onRender: function() {
        var btn = this.cmp.getToolbar().add({
            iconCls     : 'x-edit-image',
            handler     : this.selectImage,
            scope       : this,
            tooltip     : {
//                title : this.langTitle
                text : this.langTitle
            },
            overflowText: this.langTitle
        });
    }

});
