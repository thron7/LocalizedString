/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Thomas Herchenroeder (thron7)

************************************************************************ */

/**
 * This class represents a string that can contain literal and
 * translateable parts. It can be composed with other objects of the
 * same type or with literal strings, and can be re-translated into
 * different languages.
 */
qx.Class.define("locale.ComposableLocalizedString",
{
  extend : Object,

  /*
   * new locale.ComposableLocalizedString(['foo']); or
   * new locale.ComposableLocalizedString([['foo', ['one', 'two']]]); or
   * new locale.ComposableLocalizedString(['foo', ['bar',['one','two']], 'baz']);
   */
  construct : function (arrFragments) {
    /*
     * _fragments = 
     * [ 
     *   'foo',
     *   [<msgid>, [<translation_args>]],
     *   'bar',
     *   ...
     * ]    
     */
    this._fragments = arrFragments;
  },

  members : {

    toString : function (){
      var str = [];
      var frags = this._fragments;
      for (var i=0; i<frags.length; i++) {
        if (typeof(frags[i]) === 'string') {
          str.push(frags[i])
        } else {
          str.push(frags[i][0]);  // just use the msgid
        }
      }
      return str.join("");
    },

    before : function (elem) {
      if (elem instanceof locale.ComposableLocalizedString) {
        return new locale.ComposableLocalizedString(elem._fragments.concat(this._fragments))
      } else {
        return new locale.ComposableLocalizedString([elem].concat(this._fragments))
      }
    },

    after : function (elem) {
      if (elem instanceof locale.ComposableLocalizedString) {
        return new locale.ComposableLocalizedString(this._fragments.concat(elem._fragments))
      } else {
        return new locale.ComposableLocalizedString(this._fragments.concat([elem]))
      }
    },

    translate : function () {
      var str = [];
      var frags = this._fragments;
      for (var i=0; i<frags.length; i++) {
        if (typeof(frags[i]) === 'string') {
          str.push(frags[i])
        } else { // [msgid, args]
          str.push(qx.locale.Manager.getInstance().translate(
            frags[i][0], frags[i][1]));
        }
        return str.join("");
      }
    }
  }
});

