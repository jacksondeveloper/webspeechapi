import { Template } from 'meteor/templating';
import './main.html';
import { Paragraph } from '../imports/api/paragraph/paragraph.js';

var recognizing = false;
var recognition;
var final_transcript = '';
var initialId = '';

Template.board.helpers({
  paragraphs(){
    //return Session.get('final_span')
    paragraphs = Paragraph.find({}); 
    return paragraphs;
  },
});

Template.board.events({
  'click #start_button': function(){
    console.log("recording")

    // recog.start()
    if (recognizing) {
      recognition.stop();
      return;
    }
    // recognition.lang = select_dialect.value;
    recognition.start();
   }
});

Template.board.onCreated(function(){
  // Removendo resultados antigos
  Meteor.call('board.removeall', function(err, response){
    console.log('Err: ' + err + ' Response: ' + response);
  });
  
  // Gera um objeto no banco para ser atualizado sempre ao falar
  if (initialId == ''){
     initialId = Paragraph.insert({text : ''});
     console.log("id inicial: " + initialId);
  }
     
});

Template.board.onRendered(function(){
 
  
  if (!('webkitSpeechRecognition' in window)) {
       console.log('upgrade')
     } else {

       recognition = new webkitSpeechRecognition();
       recognition.lang = 'pt-BR';
       recognition.continuous = true;
       recognition.interimResults = true;
       Session.set('final_span','')
       final_transcript='';

       recognition.onstart = function() {
         Session.set('listening',true)
         recognizing = true;
         console.log('started')
       }

       recognition.onresult = function(event) {
            for (var i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
              }
            }
            // Atualiza valor falado no banco
            Paragraph.update(initialId, {text: final_transcript});            
       }

       recognition.onerror = function(event) {
         console.log('on error', event)
       }

       recognition.onend = function(){
         console.log('ended')
       }
     }
});