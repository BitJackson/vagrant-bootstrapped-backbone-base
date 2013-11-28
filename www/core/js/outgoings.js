// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Outgoings Model

  // Our basic **Outgoings** model has `title` & `cost` attributes.
  var Outgoing = Backbone.Model.extend({

    // Default attributes for the todo item.
    defaults: function() {
      return {
        title: "Outgoing title...",
        cost: "Outgoing Cost..."
      };
    }
  });

  // Outgoings Collection
  // ---------------

  // The collection of outgoings is backed by *localStorage* instead of a remote
  // server.
  var OutgoingList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Outgoing,

    // Save all of the todo items under the `"outgoings-backbone"` namespace.
    localStorage: new Backbone.LocalStorage("outgoings-backbone"),

    // Todos are sorted by their original insertion order.
    comparator: 'cost'

  });

  // Create our global collection of **Todos**.
  var Outgoings = new OutgoingList;

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  var OutgoingsView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    // The OutgoingsView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Outgoing** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the titles of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.input = this.$('.edit');
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({title: value});
        this.model.save({cost: value});
        this.$el.removeClass("editing");
      }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#outgoings"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-outgoing":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },

    // At initialization we bind to the relevant events on the `Outgoings`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {

      this.input = this.$("#new-outgoing");
      this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Outgoings, 'add', this.addOne);
      this.listenTo(Outgoings, 'reset', this.addAll);
      this.listenTo(Outgoings, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');

      Outgoings.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      if (Outgoings.length) {
        this.main.show();
        this.footer.show();
      } else {
        this.main.hide();
        this.footer.hide();
      }
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(outgoing) {
      console.log(outgoing);
      var view = new OutgoingsView({model: outgoing});
      this.$("#outgoings-list").append(view.render().el);
    },

    // Add all items in the **Outgoings** collection at once.
    addAll: function() {
      Outgoings.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **Outgoing** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      // Creating the outgoings object list in an array the values to be added
      Outgoings.create({title: this.input.val(), cost: $('.outgoing-cost').val()});
      this.input.val('');
    },

    // Clear all done Outgoing items, destroying their models.
    clearCompleted: function() {
      _.invoke(Outgoings.done(), 'destroy');
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Outgoings.each(function (outgoing) { outgoing.save({'done': done}); });
    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});
