
// script.js - immersive dossier quiz engine with WebAudio sound synthesis
const QUESTIONS = [{"id": 1, "title": "Riattivazione traumatica", "text": "Durante il riposo, ricordi traumatici pre-bellici interferiscono con la lucidità. Come reagisci?", "opts": ["Sopprimo immediatamente", "Analizzo e archivio", "Ignoro i segnali", "Li trasformo in impulso operativo"]}, {"id": 2, "title": "Allarme improvviso", "text": "Un allarme improvviso segnala una minaccia sconosciuta. Cosa fai per primo?", "opts": ["Rimango immobile", "Pianifico rapidamente", "Cerco il responsabile", "Fuga tattica"]}, {"id": 3, "title": "Crollo del compagno", "text": "Un compagno crolla psicologicamente durante un pattugliamento. Come reagisci?", "opts": ["Procedo senza intervenire", "Richiedo sostituzione", "Offro supporto minimo", "Testo la sua resistenza"]}, {"id": 4, "title": "Falla nei sistemi", "text": "Una falla nei sistemi di sicurezza permette l’accesso non autorizzato a dati riservati. Come agisci?", "opts": ["Segnalo immediatamente", "Analizzo prima i danni", "Minimizzo l’accaduto", "Uso l’occasione per info"]}, {"id": 5, "title": "Addestramento", "text": "Durante un addestramento, il tuo supervisore aumenta la pressione. Come rispondi?", "opts": ["Mantengo il controllo", "Compenso con aggressività", "Subisco l’impatto", "Riduco le emozioni a zero"]}, {"id": 6, "title": "Sospetto sabotaggio", "text": "Nel tuo settore si diffonde un sospetto di sabotaggio interno. Come ti comporti?", "opts": ["Mantengo distanza", "Osservo comportamenti sospetti", "Affronto i sospetti", "Fingo collaborazione mentre indago"]}, {"id": 7, "title": "Separazione dall'unità", "text": "Durante una missione, vieni separato dall’unità. Qual è la tua priorità?", "opts": ["Rimanere nascosto", "Ricongiungimento", "Analizzare l’ambiente", "Continuare la missione da solo"]}, {"id": 8, "title": "Anomalia meccanica", "text": "Un sistema meccanizzato inizia a dare segnali anomali. Come reagisci?", "opts": ["Spengo e analizzo", "Avviso operatori", "Continuo finché possibile", "Mantengo le distanze"]}, {"id": 9, "title": "Zona contaminata", "text": "Ti viene ordinato di trasferirti in una zona contaminata temporaneamente. Qual è la tua risposta?", "opts": ["Obbedisco senza esitazioni", "Chiedo spiegazioni", "Accetto con cautela", "Cerco di evitarlo"]}, {"id": 10, "title": "Società controllata", "text": "Come affronti l'idea di una società completamente controllata e meccanizzata?", "opts": ["È l’unico modo", "Utile ma con supervisione", "Può garantire sicurezza", "Spaventosa e disumanizzante"]}, {"id": 11, "title": "Contestazione", "text": "Una squadra rivale contesta una tua decisione operativa. Come reagisci?", "opts": ["Spiego con calma", "Mantengo la posizione", "Accetto e mi adatto", "Chiedo intervento della Centrale"]}, {"id": 12, "title": "Blackout", "text": "Un blackout lascia il distretto senza energia. Qual è la tua priorità?", "opts": ["Ripristinare sistemi", "Mantenere ordine", "Capire origine", "Proteggere risorse"]}, {"id": 13, "title": "Risorse preziose", "text": "Scopri risorse preziose. La tua squadra è stremata. Cosa fai?", "opts": ["Divido equamente", "Porto alla Centrale", "Uso solo se necessario", "Tengo nascoste"]}, {"id": 14, "title": "Civile in violazione", "text": "Un civile viola il coprifuoco chiedendo aiuto. Come rispondi?", "opts": ["Aiuto e ammonisco", "Riporto alla Centrale", "Do solo l’indispensabile", "Ignoro le regole"]}, {"id": 15, "title": "Ordine vs coscienza", "text": "Come reagisci quando un ordine superiore contrasta le tue convinzioni?", "opts": ["Obbedisco", "Cerco compromesso", "Rifiuto l’ordine", "Accetto con inquietudine"]}];
const TOTAL = QUESTIONS.length;

// --- Simple WebAudio synthesizer for UI sounds ---
class SFX{constructor(){
  this.ctx = null;
}}

SFX.prototype.init=function(){
  try{this.ctx = new (window.AudioContext||window.webkitAudioContext)();}catch(e){this.ctx=null;}
};
SFX.prototype.click=function(){
  if(!this.ctx) return;
  const o = this.ctx.createOscillator();
  const g = this.ctx.createGain();
  o.type='square'; o.frequency.setValueAtTime(800,this.ctx.currentTime);
  g.gain.setValueAtTime(0.0001,this.ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.08,this.ctx.currentTime+0.01);
  o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+0.08);
};
SFX.prototype.ambientBuzz=function(){
  if(!this.ctx) return;
  const o = this.ctx.createOscillator(), g = this.ctx.createGain();
  o.type='sawtooth'; o.frequency.value=60; g.gain.value=0.02;
  o.connect(g); g.connect(this.ctx.destination); o.start();
  setTimeout(function(){ o.stop(); }, 1200);
};
SFX.prototype.stamp=function(){
  if(!this.ctx) return;
  const o = this.ctx.createOscillator(), g=this.ctx.createGain();
  o.type='triangle'; o.frequency.value=220; g.gain.value=0.12;
  o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+0.22);
};
SFX.prototype.alarm=function(){
  if(!this.ctx) return;
  const o = this.ctx.createOscillator(), g=this.ctx.createGain();
  o.type='sine'; var t=this.ctx.currentTime;
  o.frequency.setValueAtTime(440,t); o.connect(g); g.connect(this.ctx.destination);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.08,t+0.02);
  o.start(); o.frequency.linearRampToValueAtTime(220,t+0.22);
  setTimeout(function(){o.stop();},300);
};

var sfx = new SFX();
document.addEventListener('DOMContentLoaded', function(){ sfx.init(); });

function selectOption(questionId, value, el){
  try{ localStorage.setItem('dossier_q_'+questionId, value); }catch(e){console.warn('Storage failed',e); }
  if(el){
    var parent = el.parentElement;
    parent.querySelectorAll('.opt').forEach(function(o){ o.classList.remove('selected'); });
    el.classList.add('selected');
  }
  sfx.click();
}

function initQuestionPage(qid){
  var q = QUESTIONS.find(function(x){return x.id===qid;});
  if(!q) return;
  document.getElementById('pg-title').innerText = q.title;
  document.getElementById('pg-text').innerText = q.text;
  document.getElementById('page-num').innerText = 'Pagina '+qid+' di '+TOTAL;
  var opts = document.getElementById('opts');
  opts.innerHTML='';
  q.opts.forEach(function(txt,i){
    var code = ['A','B','C','D'][i];
    var d = document.createElement('div');
    d.className='opt'; d.innerText = code + '. ' + txt;
    d.onclick = function(){ selectOption(qid, code, d); };
    var saved = localStorage.getItem('dossier_q_'+qid);
    if(saved && saved===code) d.classList.add('selected');
    opts.appendChild(d);
  });
  sfx.stamp();
}

function goTo(page){ sfx.click(); location.href = page; }

function computeResults(){
  var agg = {};
  for(var i=0;i<QUESTIONS.length;i++){
    var q = QUESTIONS[i];
    var v = localStorage.getItem('dossier_q_'+q.id);
    if(!v) continue;
    var map = {'A':4,'B':3,'C':2,'D':1};
    agg[q.id] = map[v]||0;
  }
  return agg;
}

function classify(){
  var scores = computeResults();
  var total=0; for(var k in scores) total+=scores[k];
  var role='Soggetto Non Identificato'; var narrative='Valutazione inconcludente.';
  if(total>=55){ role='Operatore Alfa'; narrative='Disciplina estrema, efficiente nel controllo e nell’esecuzione.'; }
  else if(total>=45){ role='Funzionario Gamma'; narrative='Affidabile, metodico, idoneo per ruoli di coordinamento.'; }
  else if(total>=33){ role='Analista Delta'; narrative='Analitico, prudente, adatto alla diagnostica e pianificazione.'; }
  else { role='Unità Beta'; narrative='Predilige soluzioni individuali, rischio di non conformità.'; }
  return {role:role,narrative:narrative,total:total};
}

function renderResultPage(){
  var res = classify();
  var elRole = document.getElementById('res-role');
  if(elRole) elRole.innerText = res.role;
  var elTotal = document.getElementById('res-total');
  if(elTotal) elTotal.innerText = res.total;
  var elNarr = document.getElementById('res-narrative');
  if(elNarr) elNarr.innerText = res.narrative;
  sfx.alarm();
  var cert = document.getElementById('certificate');
  if(cert) cert.value = 'Ruolo: ' + res.role + '\nPunteggio: ' + res.total + '\nValutazione: ' + res.narrative;
}

document.addEventListener('DOMContentLoaded', function(){
  var qid = parseInt(document.body.getAttribute('data-qid')||'0');
  if(qid>0) initQuestionPage(qid);
  if(document.getElementById('res-role')) renderResultPage();
});
