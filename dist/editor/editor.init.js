// Create an editable field.
var myField = new goog.editor.Field('editMe')
myField.usesIframe(false)

// Create and register all of the editing plugins you want to use.
myField.registerPlugin(new goog.editor.plugins.BasicTextFormatter())
myField.registerPlugin(new goog.editor.plugins.RemoveFormatting())
myField.registerPlugin(new goog.editor.plugins.ListTabHandler())
myField.registerPlugin(new goog.editor.plugins.SpacesTabHandler())
myField.registerPlugin(new goog.editor.plugins.EnterHandler())
myField.registerPlugin(new goog.editor.plugins.HeaderFormatter())
myField.registerPlugin(new goog.editor.plugins.LinkDialogPlugin())
myField.registerPlugin(new goog.editor.plugins.LinkBubble())

// Specify the buttons to add to the toolbar, using built in default buttons.
var buttons = [
  goog.editor.Command.BOLD,
  goog.editor.Command.ITALIC,
  goog.editor.Command.UNDERLINE,
  goog.editor.Command.REMOVE_FORMAT,
  goog.editor.Command.FONT_COLOR,
  goog.editor.Command.BACKGROUND_COLOR,
  goog.editor.Command.LINK,
  goog.editor.Command.JUSTIFY_LEFT,
  goog.editor.Command.JUSTIFY_CENTER,
  goog.editor.Command.JUSTIFY_RIGHT,
  goog.editor.Command.UNORDERED_LIST,
  goog.editor.Command.ORDERED_LIST,
  goog.editor.Command.OUTDENT,
  goog.editor.Command.INDENT
]
var myToolbar = goog.ui.editor.DefaultToolbar.makeToolbar(buttons, goog.dom.getElement('toolbar'))
var myToolbarController = new goog.ui.editor.ToolbarController(myField, myToolbar)
myField.makeEditable()

// Events handlers
function onUpdateFieldContents() {
  try {
    window.parent.postMessage({ type: 'editor.update', message: myField.getCleanContents() }, '*')
  } catch (err) {
    console.error(err)
  }
}
goog.events.listen(myField, goog.editor.Field.EventType.DELAYEDCHANGE, onUpdateFieldContents)

function onPopulateFieldContents(e) {
  if (e && e.data && e.data.type === 'editor.populate') {
    var sanitizer = new goog.html.sanitizer.HtmlSanitizer.Builder()
      .allowCssStyles()
      .inlineStyleRules()
      .withCustomNetworkRequestUrlPolicy(goog.html.SafeUrl.sanitize)
      .build()
    var innerHTML = sanitizer.sanitize(e.data.message)
    myField.setSafeHtml(false, innerHTML)
  }
}

// addEventListener support for IE8
function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false)
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, eventHandler)
  }
}

bindEvent(window, 'message', onPopulateFieldContents)
window.parent.postMessage({ type: 'editor.ready', message: 'ready' })
