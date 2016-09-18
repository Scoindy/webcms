/**
 * @author Shea Frederick - http://www.vinylfox.com
 * @contributor vizcano - http://www.extjs.com/forum/member.php?u=23512
 * @class Ext.ux.form.HtmlEditor.UndoRedo
 * @extends Ext.ux.form.HtmlEditor.MidasCommand
 * <p>A plugin that creates undo and redo buttons on the HtmlEditor. Incomplete.</p>
 *
 * ExtJS4 adaptation by René Bartholomay <rene.bartholomay@gmx.de>
 */
Ext.define('Ext.ux.form.HtmlEditor.UndoRedo', {
    extend: 'Ext.ux.form.HtmlEditor.MidasCommand',
    // private
    midasBtns: ['|', {
        cmd: 'undo',
        tooltip: {
            text: 'Undo'
        },
        overflowText: 'Undo'
    }, {
        cmd: 'redo',
        tooltip: {
            text: 'Redo'
        },
        overflowText: 'Redo'
    }]
});
