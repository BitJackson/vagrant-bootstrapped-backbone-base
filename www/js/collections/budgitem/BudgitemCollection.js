define([
  'jquery',
  'underscore',
  'backbone',
  'models/budgitem/BudgitemModel'
], function($, _, Backbone, BudgitemModel){
  var BudgitemsCollection = Backbone.Collection.extend({
    model: BudgitemModel,
    
    initialize: function(){

      //this.add([project0, project1, project2, project3, project4]);

    }

  });
 
  return BudgitemsCollection;
});
