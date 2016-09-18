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

    insertImage: function(img) {



//        this.cmp.insertAtCursor('<img src="'+this.basePath+'?'+this.urlSizeVars[0]+'='+img.Width+'&'+this.urlSizeVars[1]+'='+img.Height+'&id='+img.ID+'" title="'+img.Name+'" alt="'+img.Name+'">');
        this.cmp.insertAtCursor('<img src="'+img.Url+'">');
    },






    /****
    *  Own code here
    ****/
    selectImage: function(p_this) {
var v_url;



  /****
  *  Media model
function f() {
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
scope       : this,

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

/*
var img = {
 *         Width: 100,
 *         Height: 100,
 *         ID: 123,
 *         Title: 'My Image'
 *      };
*/



                                      /****
                                      *  This is an ExtJS bug - or at least a documentation bug
                                      *  the selection change listener is supposed to pass 
                                      *  the data view but it's passing the model
                                      ****/
                                      var record = viewmodel.getSelection();
  var img = {
        Width: record[0].data.width,
        Height: record[0].data.height,
        ID:  record[0].data.media_id,
        Name:  record[0].data.media_name,
        Url:  record[0].data.url
      }
    //    this.cmp.insertAtCursor('<img src="'+v_img.Url+'">');

    v_url = record[0].data.url;
//return(v_url);

//Ext.Msg.alert(v_scott);

        Ext.getCmp('fp_ed_body').insertAtCursor('<img src="'+img.Url+'">');

//this.ExecCmd('insertImage', v_img);
//this.cmp.relayCmd('insertImage', v_img);
//                                      t_p_gallery_detail.overwrite(p_gallery_detail.body, record[0].data);
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
                      scope         : this.selectImage,
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


 // this.insertImage(f());

//Ext.Msg.alert('test1');
//return('http://indigo.com/images/datamine_logo.jpg');

//  var v = f();


  },

    onRender: function() {
        var btn = this.cmp.getToolbar().add({
            iconCls     : 'x-edit-image',
            handler     : this.selectImage,
            scope       : this,
            tooltip     : {
                title : this.langTitle
            },
            overflowText: this.langTitle
        });
    }

});
