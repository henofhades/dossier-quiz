
// definitive script: selection, navigation, audio, result
function play(id){ try{ const a=document.getElementById(id); if(a){ a.currentTime=0; a.play(); } }catch(e){} }
function selectOpt(qid, idx, el){
  try{ localStorage.setItem('dossier_q_'+qid, idx); }catch(e){}
  const opts = document.querySelectorAll('.opt');
  opts.forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  play('click');
}
function goTo(href){ play('click'); window.location=href; }
function initPage(qid){
  const s = localStorage.getItem('dossier_q_'+qid);
  if(s){
    const n = parseInt(s);
    const opts = document.querySelectorAll('.opt');
    if(opts[n-1]) opts[n-1].classList.add('selected');
  }
  const amb = document.getElementById('amb');
  if(amb){ amb.loop=true; amb.volume=0.18; amb.play().catch(()=>{}); }
}
function computeResult(){
  let total = 0;
  for(let i=1;i<=15;i++){
    total += parseInt(localStorage.getItem('dossier_q_'+i) || 0);
  }
  let role='Unità Non Classificata', note='Valutazione inconcludente.';
  if(total>=50){ role='Operatore Alfa'; note='Disciplina estrema e capacità di esecuzione.'; }
  else if(total>=35){ role='Funzionario Gamma'; note='Affidabile e metodico.'; }
  else { role='Unità Beta'; note='Tendenza all’indipendenza.'; }
  document.getElementById('res-role').innerText=role;
  document.getElementById('res-note').innerText=note;
  document.getElementById('res-score').innerText=total;
  play('stamp');
}
