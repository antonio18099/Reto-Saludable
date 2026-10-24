// Edita este arreglo para cambiar preguntas, opciones y recompensas.
const QUESTIONS = [
 {category:"VITAMINAS",question:"¿Cuál de estas frutas destaca por su contenido de vitamina C?",hint:"Piensa en una fruta tropical.",options:["Banano","Guayaba","Aguacate","Coco"],correct:1,reward:2,explanation:"La guayaba es una excelente fuente de vitamina C, importante para el funcionamiento normal del sistema inmunitario."},
 {category:"ALIMENTACIÓN EQUILIBRADA",question:"¿Cuál es una buena forma de tener una alimentación variada?",hint:"La variedad de alimentos importa.",options:["Comer siempre lo mismo","Evitar todas las frutas","Incluir alimentos de distintos grupos","Comer solo ensaladas"],correct:2,reward:1,explanation:"Combinar alimentos de distintos grupos ayuda a obtener una variedad de nutrientes."},
 {category:"MINERALES",question:"¿Qué mineral contribuye al mantenimiento de huesos y dientes?",hint:"Está presente en lácteos y algunos vegetales.",options:["Calcio","Sodio","Yodo","Hierro"],correct:0,reward:2,explanation:"El calcio contribuye al mantenimiento de huesos y dientes."},
 {category:"FRUTAS Y VERDURAS",question:"¿Qué beneficio aportan las frutas y verduras variadas?",hint:"Aportan fibra, vitaminas y otros nutrientes.",options:["Reemplazan el agua","Aportan fibra y diversos nutrientes","Siempre contienen mucha sal","Hacen innecesarios otros alimentos"],correct:1,reward:1,explanation:"Las frutas y verduras aportan fibra, vitaminas, minerales y otros compuestos beneficiosos."},
 {category:"HIDRATACIÓN",question:"¿Qué bebida es una buena opción habitual para hidratarse?",hint:"Busca la opción más sencilla.",options:["Bebida energética","Gaseosa azucarada","Agua","Jarabe"],correct:2,reward:2,explanation:"El agua es una opción recomendada para hidratarse durante el día."},
 {category:"PROTEÍNAS",question:"¿Cuál de estos alimentos puede aportar proteínas?",hint:"Hay fuentes animales y vegetales.",options:["Lentejas","Caramelo","Aceite","Azúcar"],correct:0,reward:1,explanation:"Las lentejas son fuente vegetal de proteína y también aportan fibra."},
 {category:"HÁBITOS SALUDABLES",question:"¿Qué hábito ayuda a prevenir la contaminación de alimentos?",hint:"Piensa en lo que haces antes de cocinar.",options:["Usar una tabla sucia","Dejar comida cocida al sol","Lavarse las manos antes de preparar alimentos","Probar comida en mal estado"],correct:2,reward:2,explanation:"Lavarse las manos y mantener limpios los utensilios ayuda a prevenir la contaminación."},
 {category:"AZÚCARES",question:"¿Qué elección suele ayudar a reducir los azúcares añadidos?",hint:"Piensa en una bebida sin azúcar añadida.",options:["Gaseosa regular","Agua en lugar de una bebida azucarada","Bebida energética azucarada","Té muy azucarado"],correct:1,reward:3,explanation:"Elegir agua en lugar de bebidas azucaradas puede ayudar a reducir el consumo de azúcares añadidos."}
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
 $("#category").textContent=q.category;$("#question").textContent=q.question;$("#hint").textContent=q.hint;
 $("#questionNumber").textContent=`${String(state.index+1).padStart(2,"0")} / ${String(QUESTIONS.length).padStart(2,"0")}`;
 $("#progressText").textContent=`Pregunta ${state.index+1} de ${QUESTIONS.length}`;
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
 $("#resultText").textContent=`Conseguiste ${state.score} fichas y descubriste ${count} de 8 piezas. ${count===8?"¡Completaste todo el rompecabezas!":"Puedes volver a jugar para descubrir las piezas que faltan."}`;
 $("#result").showModal();
}
function restart(){
 state.index=0;state.selected=null;state.answered=false;state.score=0;state.revealed=new Set();state.pieceOrder=[0,1,2,3,4,5,6,7].sort(()=>Math.random()-.5);state.finished=false;
 $("#score").textContent="0";makePuzzle();updatePuzzle();$("#result").close();renderQuestion();
}
submitBtn.addEventListener("click",submitAnswer);nextBtn.addEventListener("click",nextQuestion);
$("#restart").addEventListener("click",restart);$("#playAgain").addEventListener("click",restart);
restart();
