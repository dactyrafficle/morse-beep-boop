

let container = document.getElementById('container');

// I use a lib for Morse encoding, didn't tested it too much though
// https://github.com/Syncthetic/MorseCode/
const morse = Object.create(MorseCode);


// Raffi: create the audio context object
const ctx = new (window.AudioContext || window.webkitAudioContext)(); // so this is standard piece of code. not sure what it does.

(async function initMorseData() {  //'<-- is async just him being explicit? [nope: he used async + await] wtf is that?
  // our AudioBuffers objects
  const [short, long] = await fetchBuffers();

  // btn.onclick = e => {
  btn.addEventListener('click', function(e) {
    let time = 0; // a simple time counter
		var text = inp.value;
    const sequence = morse.encode(text);
		console.log(text);
		
		container.innerHTML = '';
		//let table = document.createElement('table');
    //table.classList.add('mytables');
    //container.appendChild(table);
    for (let i = 0; i < text.length; i++) {
      
			let tr = document.createElement('tr');
      container.appendChild(tr);
      
      (function() {
        let td = document.createElement('td');
        td.innerHTML = text[i];
        tr.appendChild(td);
			})();
      
      (function() {
        let td = document.createElement('td');
        td.innerHTML = morse.encode(text[i]);
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
  btn.disabled = false
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