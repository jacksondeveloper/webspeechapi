import { Meteor } from 'meteor/meteor';
import { Paragraph } from '../imports/api/paragraph/paragraph.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  // Remove todos os resultados salvos
  'board.removeall'(){
    return Paragraph.remove({});
  }
});
