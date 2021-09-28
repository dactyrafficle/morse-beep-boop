

let container = document.getElementById('container');
let morse_sequence = document.getElementById('morse-sequence');

// I use a lib for Morse encoding, didn't tested it too much though
// https://github.com/Syncthetic/MorseCode/
const morse = Object.create(MorseCode);


// Raffi: create the audio context object
const ctx = new (window.AudioContext || window.webkitAudioContext)(); // so this is standard piece of code. not sure what it does.

(async function initMorseData() {  //'<-- is async just him being explicit? [nope: he used async + await] wtf is that?
  // our AudioBuffers objects
  const [short, long] = await fetchBuffers();
  
  
  // mybutton.onclick = e => {
  document.getElementById('mybutton-chars').addEventListener('click', function(e) {
    let time = 0; // a simple time counter
		var input_text = myinput.value;
    const sequence = morse.encode(input_text);
		console.log(input_text);
		
		container.innerHTML = '';
    morse_sequence.innerHTML = '';


    for (let i = 0; i < input_text.length; i++) {
      
      morse_sequence.innerHTML += morse.encode(input_text[i]) + ' ';
      
			let tr = document.createElement('tr');
      container.appendChild(tr);
      
      (function() {
        let td = document.createElement('td');
        td.classList.add('input-chars');
        td.innerHTML = input_text[i];
        tr.appendChild(td);
			})();
      
      (function() {
        let td = document.createElement('td');
        td.classList.add('morse-chars');
        td.innerHTML = morse.encode(input_text[i]);
        tr.appendChild(td);
			})();

		}
  });
  
  
  

  // mybutton.onclick = e => {
  document.getElementById('mybutton-audio').addEventListener('click', function(e) {
    let time = 0; // a simple time counter
		var input_text = myinput.value;
    const sequence = morse.encode(input_text);
		console.log(input_text);
		
		container.innerHTML = '';

    for (let i = 0; i < input_text.length; i++) {
      
			let tr = document.createElement('tr');
      container.appendChild(tr);
      
      (function() {
        let td = document.createElement('td');
        td.classList.add('input-chars');
        td.innerHTML = input_text[i];
        tr.appendChild(td);
			})();
      
      (function() {
        let td = document.createElement('td');
        td.classList.add('morse-chars');
        td.innerHTML = morse.encode(input_text[i]);
        tr.appendChild(td);
			})();

		}
		
		
    console.log(sequence); // dots and dashes as a string [this is using the library we imported]
    sequence.split('').forEach(type => {
      if(type === ' ') { // space => 0.5s of silence
        time += 0.5;
        return;
      }
      // create an AudioBufferSourceNode
      let source = ctx.createBufferSource();  //https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBufferSource makes sense sort of but not really
	  
	  
      // assign the correct AudioBuffer to it
      source.buffer = type === '-' ? long : short;
      // connect to our output audio
      source.connect(ctx.destination);
      // schedule it to start at the end of previous one
      source.start(ctx.currentTime + time);
      // increment our timer with our sample's duration
      time += source.buffer.duration;
    });
  });
  
  // ready to go
  document.getElementById('mybutton-chars').disabled = false
  document.getElementById('mybutton-audio').disabled = false
  
})()
  .catch(console.error);

function fetchBuffers() {
  // i understand this much better now
	// promise.all() of course acceps an array of promises
  return Promise.all(
    [
      'beep.mp3',
      'boop.mp3' 
    ].map(url => fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => ctx.decodeAudioData(buf))
    )  // closing map
  );  // closing promise.all()
}