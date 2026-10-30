// Edita este arreglo para cambiar preguntas, opciones y recompensas.
const QUESTIONS = [
 // NIVEL 1 — FÁCIL: reconocer alimentos y hábitos básicos.
 {level:1,difficulty:"FÁCIL",category:"VITAMINAS",question:"¿Cuál de estos alimentos es conocido por aportar vitamina C?",hint:"Es una fruta cítrica.",options:["Naranja","Arroz","Huevo","Aceite"],correct:0,reward:1,explanation:"La naranja aporta vitamina C, un nutriente que participa en el funcionamiento normal del sistema inmunitario."},
 {level:1,difficulty:"FÁCIL",category:"HIDRATACIÓN",question:"¿Cuál es la mejor opción para hidratarte durante el día?",hint:"No contiene azúcar añadida.",options:["Gaseosa","Agua","Bebida energética","Refresco en polvo"],correct:1,reward:1,explanation:"El agua es una opción adecuada para hidratarse y no aporta azúcares añadidos."},

 // NIVEL 2 — INTERMEDIO: relacionar nutrientes con sus funciones y fuentes.
 {level:2,difficulty:"INTERMEDIO",category:"MINERALES",question:"Una persona quiere fortalecer el mantenimiento de sus huesos. ¿Qué nutriente debería incluir como parte de una alimentación equilibrada?",hint:"Se encuentra en lácteos, algunas verduras y alimentos fortificados.",options:["Vitamina C","Calcio","Sodio","Azúcar"],correct:1,reward:2,explanation:"El calcio contribuye al mantenimiento de los huesos y dientes. Puede obtenerse de distintas fuentes alimentarias."},
 {level:2,difficulty:"INTERMEDIO",category:"PROTEÍNAS",question:"¿Cuál combinación ofrece una fuente vegetal de proteína y también aporta fibra?",hint:"Busca una legumbre.",options:["Lentejas con verduras","Gaseosa con galletas","Aceite con azúcar","Caramelos con jugo"],correct:0,reward:2,explanation:"Las lentejas son legumbres que aportan proteína vegetal y fibra."},
 {level:2,difficulty:"INTERMEDIO",category:"ALIMENTACIÓN EQUILIBRADA",question:"Si tu almuerzo solo contiene arroz, ¿qué opción ayudaría a hacerlo más variado?",hint:"Piensa en agregar distintos grupos de alimentos.",options:["Agregar más arroz únicamente","Acompañarlo con verduras y una fuente de proteína","Cambiar el agua por gaseosa","Eliminar todos los demás alimentos"],correct:1,reward:2,explanation:"Combinar cereales, verduras y fuentes de proteína permite una comida más variada."},

 // NIVEL 3 — DIFÍCIL: aplicar conocimientos a situaciones cotidianas.
 {level:3,difficulty:"DIFÍCIL",category:"LECTURA DE ETIQUETAS",question:"Dos bebidas tienen el mismo tamaño. En la etiqueta, la bebida A indica 18 g de azúcares añadidos y la B indica 4 g. Si buscas reducir esos azúcares, ¿cuál sería la mejor elección?",hint:"Compara la cantidad indicada, no el nombre o el color del envase.",options:["La bebida A, porque tiene más azúcar","La bebida B, porque indica menos azúcares añadidos","Cualquiera, porque el tamaño es igual","La bebida A, porque aporta más energía"],correct:1,reward:3,explanation:"Al comparar productos similares, revisar la cantidad de azúcares añadidos ayuda a tomar una decisión informada."},
 {level:3,difficulty:"DIFÍCIL",category:"SEGURIDAD ALIMENTARIA",question:"Preparaste pollo crudo y después vas a cortar una ensalada. ¿Qué debes hacer para evitar contaminación cruzada?",hint:"No basta con limpiar rápidamente la superficie.",options:["Usar la misma tabla sin lavarla","Enjuagar el pollo y seguir","Lavar bien manos, cuchillo y tabla antes de manipular la ensalada","Cortar primero la ensalada y dejar todo sin limpiar"],correct:2,reward:3,explanation:"Separar alimentos crudos y listos para consumir, además de lavar manos y utensilios, reduce el riesgo de contaminación cruzada."},
 {level:3,difficulty:"DIFÍCIL",category:"DECISIONES SALUDABLES",question:"Vas a elegir una merienda para una tarde de estudio. ¿Cuál alternativa combina mejor variedad de nutrientes?",hint:"Busca una combinación que incluya fruta y otro grupo de alimentos.",options:["Solo dulces y gaseosa","Una fruta y yogur natural sin azúcar añadida","Solo papas fritas","Una bebida energética y caramelos"],correct:1,reward:3,explanation:"Una fruta acompañada de yogur natural puede aportar fibra, vitaminas y proteína, dentro de una alimentación variada."}
];
const $=s=>document.querySelector(s);
const state={index:0,selected:null,answered:false,score:0,revealed:new Set(),pieceOrder:[],finished:false};
const optionsEl=$("#options"),feedbackEl=$("#feedback"),submitBtn=$("#submit"),nextBtn=$("#next");
const puzzle=$("#puzzle");
function makePuzzle(){
 puzzle.innerHTML="";
 for(let i=0;i<8;i++){
  const tile=document.createElement("div");tile.className="piece";tile.dataset.piece=i;
  tile.setAttribute("aria-label",`Pieza ${i+1} por descubrir`);
  const label=document.createElement("span");label.textContent=i+1;tile.appendChild(label);puzzle.appendChild(tile);
 }
}
function renderQuestion(){
 const q=QUESTIONS[state.index];state.selected=null;state.answered=false;
 $("#category").textContent=`NIVEL ${q.level} · ${q.difficulty} — ${q.category}`;$("#question").textContent=q.question;$("#hint").textContent=q.hint;
 $("#questionNumber").textContent=`${String(state.index+1).padStart(2,"0")} / ${String(QUESTIONS.length).padStart(2,"0")}`;
 $("#progressText").textContent=`Nivel ${q.level} · Pregunta ${state.index+1} de ${QUESTIONS.length}`;
 $("#progressBar").style.width=`${state.index/QUESTIONS.length*100}%`;
 feedbackEl.hidden=true;feedbackEl.className="feedback";feedbackEl.textContent="";
 submitBtn.hidden=false;submitBtn.disabled=true;nextBtn.hidden=true;optionsEl.innerHTML="";
 q.options.forEach((text,index)=>{
  const button=document.createElement("button");button.type="button";button.className="option";
  const letter=document.createElement("span");letter.className="letter";letter.textContent=String.fromCharCode(65+index);
  const label=document.createElement("span");label.className="option-label";label.textContent=text;
  button.append(letter,label);button.addEventListener("click",()=>selectOption(index));optionsEl.appendChild(button);
 });
}
function selectOption(index){
 if(state.answered)return;state.selected=index;
 [...optionsEl.children].forEach((b,i)=>{b.classList.toggle("selected",i===index);b.setAttribute("aria-pressed",String(i===index));});
 submitBtn.disabled=false;
}
function revealPiece(){
 if(state.revealed.size>=8)return;
 const pieceIndex=state.pieceOrder[state.revealed.size];state.revealed.add(pieceIndex);
 const tile=$(`[data-piece="${pieceIndex}"]`);tile.classList.add("revealed");
 const col=pieceIndex%4,row=Math.floor(pieceIndex/4);
 tile.style.backgroundPosition=`${col*100/3}% ${row*100}%`;
 tile.setAttribute("aria-label",`Pieza ${pieceIndex+1} descubierta`);
 updatePuzzle();
}
function updatePuzzle(){
 const count=state.revealed.size,percent=Math.round(count/8*100);
 $("#revealed").textContent=count;$("#percent").textContent=`${percent}%`;$("#puzzleBar").style.width=`${percent}%`;
}
function submitAnswer(){
 if(state.answered||state.selected===null)return;
 state.answered=true;const q=QUESTIONS[state.index],correct=state.selected===q.correct;
 [...optionsEl.children].forEach((button,i)=>{
  button.disabled=true;
  if(i===q.correct){button.classList.add("correct");button.querySelector(".letter").textContent="✓";}
  else if(i===state.selected){button.classList.add("incorrect");button.querySelector(".letter").textContent="×";}
 });
 feedbackEl.hidden=false;
 const title=document.createElement("strong"),explanation=document.createElement("span");
 if(correct){
  state.score+=q.reward;$("#score").textContent=state.score;feedbackEl.className="feedback good";
  title.textContent=`¡Correcto! +${q.reward} ${q.reward===1?"ficha":"fichas"} 🧩`;explanation.textContent=q.explanation;revealPiece();
 }else{
  feedbackEl.className="feedback bad";title.textContent="Esta vez no. ¡Sigue aprendiendo!";
  explanation.textContent=`La respuesta correcta era ${String.fromCharCode(65+q.correct)}. ${q.explanation}`;
 }
 feedbackEl.replaceChildren(title,explanation);submitBtn.hidden=true;nextBtn.hidden=false;
 nextBtn.innerHTML=state.index===QUESTIONS.length-1?'Ver resultado <span>→</span>':'Siguiente pregunta <span>→</span>';
}
function nextQuestion(){
 if(!state.answered)return;
 if(state.index<QUESTIONS.length-1){state.index++;renderQuestion();return;}
 finishGame();
}
function finishGame(){
 state.finished=true;$("#progressBar").style.width="100%";$("#progressText").textContent="Reto completado";
 const count=state.revealed.size;$("#celebrate").textContent=count===8?"🎉":"🌱";
 $("#resultTitle").textContent=count===8?"¡Imagen descubierta!":"¡Buen trabajo!";
 const levelReached = count >= 8 ? 3 : count >= 5 ? 2 : count >= 2 ? 1 : 0;
 $("#resultText").textContent=`Conseguiste ${state.score} fichas y descubriste ${count} de 8 piezas. ${count===8?"¡Completaste los tres niveles y todo el rompecabezas!":`Tu progreso llegó hasta el nivel ${levelReached}. ¡Vuelve a intentarlo para superar tu marca!`}`;
 $("#result").showModal();
}
function restart(){
 state.index=0;state.selected=null;state.answered=false;state.score=0;state.revealed=new Set();state.pieceOrder=[0,1,2,3,4,5,6,7].sort(()=>Math.random()-.5);state.finished=false;
 $("#score").textContent="0";makePuzzle();updatePuzzle();$("#result").close();renderQuestion();
}
submitBtn.addEventListener("click",submitAnswer);nextBtn.addEventListener("click",nextQuestion);
$("#restart").addEventListener("click",restart);$("#playAgain").addEventListener("click",restart);
restart();
