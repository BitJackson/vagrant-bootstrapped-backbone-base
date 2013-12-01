define([
  'underscore',
  'backbone',
], function(_, Backbone) {

  var BudgitemModel = Backbone.Model.extend({

		defaults : {
      query : "unknown"
    },  

    initialize: function( options ) {
			this.query = options.query; 
		},

		url : function() {
      return 'https://api.github.com/users/' + this.query;
    },
	    
    parse : function(res) { 
      // because of jsonp 
      return res.data;
    }

  });

	return BudgitemModel;

});
