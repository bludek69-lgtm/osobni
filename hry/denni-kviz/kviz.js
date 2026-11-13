// Denní kvíz Cestovatel69 – logika hry.
// Potřebuje: questions.js (pole QUESTIONS) a v HTML prvky #app, #meta, #partner, #toast.
(function(){
  var PER_DAY = 5;
  var START = "2026-11-13";          // den č. 1
  var KEY = "kviz69_v1";

  // ---- datum v Praze, aby měli všichni stejný kvíz ----
  function pragueDate(d){
    return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Prague",year:"numeric",month:"2-digit",day:"2-digit"}).format(d||new Date());
  }
  function dayDiff(a,b){ return Math.round((Date.parse(b+"T00:00:00Z")-Date.parse(a+"T00:00:00Z"))/86400000); }
  var today = pragueDate();
  var dayNo = dayDiff(START,today)+1;

  // ---- deterministický náhodný generátor podle data ----
  function hash(s){ var h=2166136261; for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);} return h>>>0; }
  function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; var t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
  function shuffle(arr,r){ var a=arr.slice(); for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;} return a; }

  // Otázky se berou z „balíčku“: celá banka zamíchaná podle cyklu, aby se neopakovaly dřív, než se vystřídají všechny.
  function questionsFor(n){
    var total = QUESTIONS.length, perCycle = Math.floor(total/PER_DAY);
    var idx = Math.max(0,n-1), cycle = Math.floor(idx/perCycle), pos = idx%perCycle;
    var order = shuffle(QUESTIONS.map(function(_,i){return i;}), rng(hash("cyklus-"+cycle)));
    return order.slice(pos*PER_DAY, pos*PER_DAY+PER_DAY).map(function(qi,k){
      var q = QUESTIONS[qi];
      var opts = shuffle([q[2]].concat(q[3]), rng(hash(today+"-"+k)));
      return {cat:q[0], text:q[1], correct:q[2], opts:opts};
    });
  }
  var todays = questionsFor(dayNo);

  // ---- uložení stavu (bezpečně, když localStorage nefunguje) ----
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }
  var state = load();
  state.days = state.days||{};
  var mine = state.days[today] || (state.days[today] = {answers:[]});

  var app = document.getElementById("app");
  document.getElementById("meta").innerHTML = "Kvíz č. "+dayNo+"<br>"+today.split("-").reverse().join(". ").replace(/^0/,"");

  function el(tag,cls,txt){ var e=document.createElement(tag); if(cls)e.className=cls; if(txt!=null)e.textContent=txt; return e; }

  function progress(cur){
    var p=el("div","progress");
    for(var i=0;i<PER_DAY;i++){
      var s=el("span"); var a=mine.answers[i];
      if(a!=null) s.className = a===todays[i].correct ? "ok":"bad"; else if(i===cur) s.className="cur";
      p.appendChild(s);
    }
    return p;
  }

  function renderQuestion(){
    var i = mine.answers.length;
    if(i>=PER_DAY) return renderResult();
    var q = todays[i];
    app.innerHTML="";
    var c=el("div","card");
    c.appendChild(progress(i));
    c.appendChild(el("div","cat",q.cat+" · "+(i+1)+"/"+PER_DAY));
    c.appendChild(el("p","q",q.text));
    var box=el("div","opts");
    q.opts.forEach(function(o){
      var b=el("button","opt",o);
      b.type="button";
      b.onclick=function(){
        mine.answers.push(o); save();
        Array.prototype.forEach.call(box.children,function(x){
          x.disabled=true;
          if(x.textContent===q.correct) x.classList.add("ok");
          else if(x===b) x.classList.add("bad");
        });
        var next=el("button","btn", i+1<PER_DAY ? "Další otázka →" : "Zobrazit výsledek");
        next.type="button";
        next.onclick=function(){ if(i+1>=PER_DAY) finish(); else renderQuestion(); };
        var r=el("div","row"); r.appendChild(next); c.appendChild(r);
        c.replaceChild(progress(i), c.firstChild);
        next.focus();
      };
      box.appendChild(b);
    });
    c.appendChild(box);
    app.appendChild(c);
  }

  function score(){ return mine.answers.filter(function(a,i){return a===todays[i].correct;}).length; }

  function finish(){
    if(!mine.done){
      mine.done=true; mine.score=score();
      var y = pragueDate(new Date(Date.now()-86400000));
      state.streak = (state.last===y) ? (state.streak||0)+1 : 1;
      state.last = today;
      state.best = Math.max(state.best||0, state.streak);
      state.played = (state.played||0)+1;
      state.total = (state.total||0)+mine.score;
      save();
    }
    renderResult();
  }

  function grid(){ return mine.answers.map(function(a,i){return a===todays[i].correct?"🟩":"🟥";}).join(""); }

  function shareText(){
    return "🚌 Denní kvíz Cestovatel69 #"+dayNo+"\n"+grid()+" "+score()+"/"+PER_DAY+"\n"+location.href.split("#")[0];
  }

  function toast(t){ var e=document.getElementById("toast"); e.textContent=t; e.classList.add("show"); setTimeout(function(){e.classList.remove("show");},1800); }

  function renderResult(){
    if(!mine.done) return finish();
    var s=score();
    app.innerHTML="";
    var c=el("div","card");
    c.appendChild(progress(-1));
    var msg = s===5?"Perfektní! Jsi profík 🏆": s>=3?"Dobrá práce! 👍":"Zítra to dáš líp 💪";
    c.appendChild(el("div","cat","Dnešní výsledek"));
    c.appendChild(el("div","big",s+" / "+PER_DAY));
    c.appendChild(el("p",null,msg));
    c.appendChild(el("div","grid",grid()));

    var st=el("div","stats");
    [["Série dní",state.streak||0],["Nejdelší série",state.best||0],["Odehráno",state.played||0]].forEach(function(x){
      var d=el("div"); d.appendChild(el("b",null,String(x[1]))); d.appendChild(el("small",null,x[0])); st.appendChild(d);
    });
    c.appendChild(st);

    var r=el("div","row");
    var sh=el("button","btn","Sdílet výsledek");
    sh.type="button";
    sh.onclick=function(){
      var t=shareText();
      if(navigator.share){ navigator.share({text:t}).catch(function(){}); }
      else if(navigator.clipboard){ navigator.clipboard.writeText(t).then(function(){toast("Zkopírováno – vlož kamarádům");},function(){toast("Kopírování se nepovedlo");}); }
    };
    r.appendChild(sh);
    c.appendChild(r);

    var cd=el("p","muted"); c.appendChild(cd);
    (function tick(){
      var parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Prague",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).format(new Date()).split(":").map(Number);
      var left=86400-(parts[0]*3600+parts[1]*60+parts[2]);
      var h=Math.floor(left/3600), m=Math.floor(left%3600/60), sec=left%60;
      cd.textContent="Další kvíz za "+h+" h "+String(m).padStart(2,"0")+" min "+String(sec).padStart(2,"0")+" s";
      if(left<=1){ setTimeout(function(){location.reload();},1500); return; }
      setTimeout(tick,1000);
    })();

    app.appendChild(c);
    var p=document.getElementById("partner"); if(p) p.hidden=false;
  }

  renderQuestion();
})();
