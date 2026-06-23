// script.js：集中放置頁面狀態與互動函式。

let state = { persona: '', progress: 0 };
let perspectiveChecklistState = {};

let bbIndex = 0;
let sg = { ...sgInit };
let sgIndex = 0;

function setClock(){const d=new Date();const p=n=>String(n).padStart(2,'0');document.getElementById('sysTime').textContent=`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`}
    setClock();setInterval(setClock,1000);

    function createLandingGreetings(){
      const layer=document.getElementById('landingHelloLayer');
      if(!layer) return;
      layer.innerHTML='';
      const items=[
        {text:'สวัสดี',cls:'is-indigo',size:60,left:14,top:8},{text:'Bonjour',cls:'is-violet',size:24,left:34,top:7},{text:'Hello',cls:'is-blue',size:54,left:78,top:8},{text:'Halo',cls:'is-amber',size:22,left:90,top:9},
        {text:'Xin chào',cls:'is-blue',size:32,left:10,top:26},{text:'你好',cls:'is-violet',size:46,left:89,top:28},{text:'Hello',cls:'is-slate',size:24,left:10,top:44},{text:'ជំរាបសួរ',cls:'is-slate',size:18,left:90,top:46},
        {text:'Halo',cls:'is-amber',size:20,left:10,top:63},{text:'Xin chào',cls:'is-indigo',size:34,left:89,top:65},{text:'你好',cls:'is-blue',size:44,left:12,top:82},{text:'Bonjour',cls:'is-slate',size:18,left:31,top:94},
        {text:'Hello',cls:'is-blue',size:64,left:52,top:95},{text:'សួស្តី',cls:'is-indigo',size:26,left:73,top:94},{text:'Halo',cls:'is-amber',size:22,left:89,top:83}
      ];
      items.forEach((it,i)=>{const el=document.createElement('span');el.className=`hello ${it.cls}`;el.textContent=it.text;el.style.fontSize=`${it.size}px`;el.style.left=`${it.left}%`;el.style.top=`${it.top}%`;el.style.animationDuration=`${4.2+(i%5)*.4}s`;el.style.animationDelay=`${(i%6)*.18}s`;layer.appendChild(el);});
    }

    function updateProgress(n){state.progress=n;document.getElementById('systemProgressBar').style.width=`${n}%`;document.getElementById('progressPercent').textContent=`${n}%`}

    function unlockNext(id){
      const el=document.getElementById(id);
      if(el){el.classList.remove('locked');el.classList.add('unlocked');el.scrollIntoView({behavior:'smooth',block:'start'});}
      if(id==='chapter2') updateProgress(50);
      if(id==='chapter3') updateProgress(75);
      if(id==='chapter4'){ updateProgress(100); renderEnding(); }
    }

    function continueAfterBlackboard(){
      const chapter2=document.getElementById('chapter2');
      if(chapter2){
        chapter2.classList.remove('locked');
        chapter2.classList.add('unlocked');
        updateProgress(50);
        chapter2.scrollIntoView({behavior:'smooth',block:'start'});
      }
    }

    function selectPersona(p){
      state.persona=p;
      document.getElementById('currentPersonaDisplay').textContent=personaData[p]||'GUEST';
      document.getElementById('sidebar').style.display='block';
      document.getElementById('personaSection').classList.add('hidden');
      renderPerspectiveModules();
      renderRoleIntro();
      const intro=document.getElementById('roleIntroSection');
      if(intro){
        intro.classList.remove('locked');
        intro.classList.add('unlocked');
        intro.scrollIntoView({behavior:'smooth',block:'start'});
      }
      updateProgress(10);
    }

    function renderRoleIntro(){
      const data=(typeof identityData !== 'undefined') ? identityData[state.persona] : null;
      const el=document.getElementById('roleIntroCard');
      if(!el || !data) return;
      const portraitHtml = data.portrait ? `<img src="${encodeURI(data.portrait)}" alt="${htmlEscape(data.title || '角色肖像')}" class="role-intro-portrait" />` : '';
      el.innerHTML=`
        <div class="role-intro-top">
          <div class="role-intro-main">
            <div class="persona-kicker">${htmlEscape(data.tag || 'ROLE PROFILE')}</div>
            <h2 class="role-intro-title">${htmlEscape(data.title)}</h2>
          </div>
          <div class="role-intro-side">
            ${portraitHtml}
            <div class="persona-badge">${htmlEscape(personaData[state.persona] || 'GUEST')}</div>
          </div>
        </div>
        <div class="role-intro-meta">${htmlEscape(data.meta || '')}</div>
        <p class="role-intro-text">${htmlEscape(data.text || '')}</p>
        <p class="role-intro-prompt">${htmlEscape(data.prompt || '')}</p>
        <button onclick="startArticle()" class="sys-button bg-blue-900 text-white px-8 py-3 font-bold text-sm tracking-wide">進入報導</button>
      `;
    }

    function startArticle(){
      const intro=document.getElementById('roleIntroSection');
      if(intro){ intro.classList.remove('unlocked'); intro.classList.add('locked'); }
      unlockNext('chapter1');
      updateProgress(25);
    }

    function showPersonaQuiz(){
      const narrative=document.getElementById('chapter1Narrative');
      if(narrative){
        narrative.classList.remove('hidden');
        narrative.scrollIntoView({behavior:'smooth',block:'start'});
      }
    }


    function htmlEscape(str){
      return String(str ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    }

    function renderPerspectiveModules(){
      const data = (typeof perspectiveInteractions !== 'undefined') ? perspectiveInteractions[state.persona] : null;
      if(!data) return;
      perspectiveChecklistState = {};
      renderPerspectiveChoice('personaCheckpoint1', data.entry, 'entry');
      renderPerspectiveChoice('personaCheckpoint3', data.policy, 'policy');
      const bbModule=document.getElementById('bbModule');
      if(bbModule) bbModule.classList.add('hidden');
      const ch4Wrap=document.getElementById('chapter4LoadWrap');
      if(ch4Wrap){ ch4Wrap.classList.add('hidden'); ch4Wrap.dataset.ready='false'; }
    }

    function renderPerspectiveChoice(containerId, item, key){
      const el=document.getElementById(containerId);
      if(!el || !item) return;
      el.className = (containerId === 'personaCheckpoint3' ? 'persona-card mt-6 hidden' : 'persona-card my-8');
      el.dataset.perspectiveModule = key;
      el.innerHTML = `
        <div class="persona-card-top">
          <div>
            <div class="persona-kicker">${htmlEscape(item.tag || 'PERSONA VIEW')}</div>
            <h3 class="persona-title">${htmlEscape(item.title)}</h3>
          </div>
          <div class="persona-badge">${htmlEscape(personaData[state.persona] || 'GUEST')}</div>
        </div>
        <p class="persona-prompt">${htmlEscape(item.prompt)}</p>
        <div class="persona-options">
          ${item.options.map((opt, idx)=>`<button type="button" class="persona-option" onclick="selectPerspectiveOption('${key}', ${idx})"><span>${htmlEscape(opt.label)}</span></button>`).join('')}
        </div>
        <div class="persona-feedback hidden" data-perspective-feedback="${key}"></div>
      `;
    }

    function selectPerspectiveOption(key, index){
      const data = perspectiveInteractions[state.persona]?.[key];
      if(!data || !data.options[index]) return;
      const root=document.querySelector(`[data-perspective-module="${key}"]`);
      if(!root) return;
      root.querySelectorAll('.persona-option').forEach((btn,i)=>{
        btn.classList.toggle('selected', i===index);
      });
      const feedback=root.querySelector(`[data-perspective-feedback="${key}"]`);
      feedback.innerHTML = `<strong>視角回饋：</strong>${htmlEscape(data.options[index].feedback)}`;
      feedback.classList.remove('hidden');
      if(key === 'entry') revealBlackboardModule();
      if(key === 'policy') revealChapter4LoadButton();
    }

    function revealBlackboardModule(){
      const module=document.getElementById('bbModule');
      if(!module) return;
      module.classList.remove('hidden');
      setTimeout(()=>module.scrollIntoView({behavior:'smooth',block:'start'}), 120);
    }

    function togglePolicyPanel(details){
      const checkpoint=document.getElementById('personaCheckpoint3');
      const wrap=document.getElementById('chapter4LoadWrap');
      if(checkpoint) checkpoint.classList.toggle('hidden', !details.open);
      if(wrap) wrap.classList.toggle('hidden', !(details.open && wrap.dataset.ready === 'true'));
    }

    function revealChapter4LoadButton(){
      const wrap=document.getElementById('chapter4LoadWrap');
      const details=document.getElementById('policyDetails');
      if(!wrap) return;
      wrap.dataset.ready='true';
      if(!details || details.open){
        wrap.classList.remove('hidden');
        setTimeout(()=>wrap.scrollIntoView({behavior:'smooth',block:'center'}), 120);
      }
    }

    function renderPerspectiveChecklist(containerId, item, key){
      const el=document.getElementById(containerId);
      if(!el || !item) return;
      perspectiveChecklistState[key] = new Set();
      el.className='persona-card my-8';
      el.dataset.perspectiveChecklist = key;
      el.innerHTML = `
        <div class="persona-card-top">
          <div>
            <div class="persona-kicker">${htmlEscape(item.tag || 'TOOLBOX')}</div>
            <h3 class="persona-title">${htmlEscape(item.title)}</h3>
          </div>
          <div class="persona-badge">${htmlEscape(personaData[state.persona] || 'GUEST')}</div>
        </div>
        <p class="persona-prompt">${htmlEscape(item.prompt)}</p>
        <div class="persona-checklist">
          ${item.items.map((txt, idx)=>`<button type="button" class="persona-check" onclick="togglePerspectiveChecklist('${key}', ${idx})"><span class="persona-check-box">□</span><span>${htmlEscape(txt)}</span></button>`).join('')}
        </div>
        <div class="persona-feedback hidden" data-perspective-check-feedback="${key}">${htmlEscape(item.done)}</div>
      `;
    }

    function togglePerspectiveChecklist(key, index){
      const data=perspectiveInteractions[state.persona]?.[key];
      if(!data) return;
      if(!perspectiveChecklistState[key]) perspectiveChecklistState[key]=new Set();
      const set=perspectiveChecklistState[key];
      if(set.has(index)) set.delete(index); else set.add(index);
      const root=document.querySelector(`[data-perspective-checklist="${key}"]`);
      if(!root) return;
      root.querySelectorAll('.persona-check').forEach((btn,i)=>{
        const active=set.has(i);
        btn.classList.toggle('checked', active);
        const box=btn.querySelector('.persona-check-box');
        if(box) box.textContent = active ? '✓' : '□';
      });
      const feedback=root.querySelector(`[data-perspective-check-feedback="${key}"]`);
      if(set.size === data.items.length){
        feedback.classList.remove('hidden');
      }else{
        feedback.classList.add('hidden');
      }
    }

    function clearPerspectiveModules(){
      ['personaCheckpoint1','personaCheckpoint2','personaCheckpoint3'].forEach(id=>{
        const el=document.getElementById(id);
        if(el){ el.innerHTML=''; el.className = id==='personaCheckpoint3' ? 'mt-6 hidden' : 'persona-card my-8'; }
      });
      perspectiveChecklistState = {};
    }

    function submitQuiz(item){
      const wrap=document.getElementById('quizContent');
      [...wrap.children].forEach(b=>b.disabled=true);
      document.getElementById('quizFeedbackText').textContent=item.f;
      document.getElementById('quizResult').classList.remove('hidden');
    }

    function submitCountryQuiz(correct,btn){
      const content=document.getElementById('countryQuizContent');
      const buttons=content.querySelectorAll('.country-option');
      const correctBtn=content.querySelector('.correct-country-option');
      buttons.forEach(b=>b.disabled=true);
      if(correct){
        content.classList.add('bg-green-100');
        btn.classList.remove('bg-white');
        btn.classList.add('bg-green-500','text-white');
        document.getElementById('countryQuizFeedbackText').innerHTML='<strong>系統確認正確：</strong> 目前跨轉生來臺前居住國最多的是越南。';
      }else{
        content.classList.add('bg-red-100');
        btn.classList.remove('bg-white');
        btn.classList.add('bg-red-500','text-white');
        correctBtn.classList.remove('bg-white');
        correctBtn.classList.add('bg-green-500','text-white');
        document.getElementById('countryQuizFeedbackText').innerHTML='<strong>系統分析偏差：</strong> 正確答案是「越南」。';
      }
      document.getElementById('countryQuizResult').classList.remove('hidden');
      document.getElementById('countryCharts').classList.remove('hidden');
      renderCountryCharts();
    }

    function polarToCartesian(cx,cy,r,a){const rad=(a-90)*Math.PI/180;return{x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)}}
    function describeArc(cx,cy,r,s,e){const start=polarToCartesian(cx,cy,r,e);const end=polarToCartesian(cx,cy,r,s);const laf=e-s<=180?'0':'1';return`M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${laf} 0 ${end.x} ${end.y} Z`}
    function renderPieChart(containerId,data,theme={}){
      const el=document.getElementById(containerId);
      if(!el||!Array.isArray(data)) return;
      const width=460,height=300,cx=230,cy=150,r=90,labelR=136,total=data.reduce((s,x)=>s+x.value,0);
      const ns='http://www.w3.org/2000/svg';
      const svg=document.createElementNS(ns,'svg');
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      svg.classList.add('pie');
      let cur=0;
      data.forEach(item=>{
        const angle=item.value/total*360;const s=cur,e=cur+angle,m=s+angle/2;
        const g=document.createElementNS(ns,'g');
        const p=document.createElementNS(ns,'path');
        p.setAttribute('d',describeArc(cx,cy,r,s,e));
        p.setAttribute('fill',item.color);
        p.setAttribute('class','slice');
        if(theme.strokeColor) p.setAttribute('stroke', theme.strokeColor);
        const dx=Math.cos((m-90)*Math.PI/180)*12,dy=Math.sin((m-90)*Math.PI/180)*12;
        p.addEventListener('mouseenter',()=>{p.classList.add('active');p.setAttribute('transform',`translate(${dx.toFixed(2)} ${dy.toFixed(2)})`)});
        p.addEventListener('mouseleave',()=>{p.classList.remove('active');p.removeAttribute('transform')});
        const lp=polarToCartesian(cx,cy,labelR,m);
        const line=document.createElementNS(ns,'line');
        line.setAttribute('x1',polarToCartesian(cx,cy,r+4,m).x);
        line.setAttribute('y1',polarToCartesian(cx,cy,r+4,m).y);
        line.setAttribute('x2',lp.x);line.setAttribute('y2',lp.y);line.setAttribute('class','labelline');
        if(theme.lineColor) line.setAttribute('stroke', theme.lineColor);
        const txt=document.createElementNS(ns,'text');
        txt.setAttribute('x',lp.x);txt.setAttribute('y',lp.y);txt.setAttribute('class','label');
        txt.setAttribute('text-anchor',lp.x>cx?'start':'end');txt.setAttribute('dominant-baseline','middle');
        if(theme.labelColor) txt.setAttribute('fill', theme.labelColor);
        txt.textContent=`${item.label} ${item.value}%`;
        g.appendChild(p);g.appendChild(line);g.appendChild(txt);svg.appendChild(g);cur+=angle;
      });
      el.innerHTML='';el.appendChild(svg);
    }
    function renderCountryCharts(){renderPieChart('beforeCountryChart',beforeCountryData)}
    function renderStatCharts(){
      renderPieChart('statBeforeCountryChart', beforeCountryData);
      renderPieChart('afterCountyChart', afterCountyData, { labelColor:'#9a3412', lineColor:'#f59e0b', strokeColor:'#7c2d12' });
      renderNativeOriginDonutChart();
      renderTop3OriginByLevelChart();
      renderLevelTrendChart();
    }

    function initSim(){
      const data=simData[state.persona];
      if(!data) return;
      document.getElementById('simQuestionText').textContent=data.q;
      const box=document.getElementById('simContent');
      box.innerHTML='';
      document.getElementById('simFeedback').classList.add('hidden');
      data.a.forEach((t,i)=>{
        const b=document.createElement('button');
        b.className='w-full sys-button bg-gray-900 border border-green-400 p-3 hover:bg-green-400 hover:text-black transition';
        b.textContent=t;
        b.onclick=()=>playSim(i+1);
        box.appendChild(b);
      });
    }

    function playSim(choice){
      const map={
        student:{1:'你試圖溝通，但語言缺口讓每個手勢都顯得支離破碎。',2:'你把困難吞回肚子裡，最後只剩沉默。'},
        teacher:{1:'統一考卷看似公平，對跨轉生卻可能等於直接宣告失敗。',2:'調整評量雖然麻煩，卻是讓學生真正進入學習的第一步。'},
        supporter:{1:'當你被迫概括承受，非華語專業的壓力很快就會把熱情磨光。',2:'明確分工，才能讓你成為語言與文化橋樑，而不是替代正規華語教學的補丁。'}
      };
      document.getElementById('simResultText').textContent=map[state.persona][choice];
      const area=document.getElementById('personaAnalysisArea');
      const txt=comments[state.persona]||'';
      area.textContent=txt;
      area.style.display=txt?'block':'none';
      document.getElementById('simPersonaText').textContent=txt;
      document.getElementById('simFeedback').classList.remove('hidden');
    }

    function scrollToChapter2Quiz(){document.getElementById('chapter2QuizSection').scrollIntoView({behavior:'smooth',block:'start'})}
    function submitChapter2Quiz(correct,btn){
      const wrap=document.getElementById('chapter2QuizContent');
      const buttons=wrap.querySelectorAll('.chapter2-option');
      const right=wrap.querySelector('.correct-chapter2-option');
      buttons.forEach(b=>b.disabled=true);
      if(correct){
        btn.classList.add('bg-green-500','text-white');
        document.getElementById('chapter2QuizFeedbackText').innerHTML='<strong>系統確認正確：</strong> 關鍵不在是否會學生母語，而在具備華語教學專業，才能設計適性教學。';
      }else{
        btn.classList.add('bg-red-500','text-white');
        right.classList.add('bg-green-500','text-white');
        document.getElementById('chapter2QuizFeedbackText').innerHTML='<strong>系統分析偏差：</strong> 正確答案是「具備華語教學專業，以設計適性教學」。';
      }
      document.getElementById('chapter2QuizResult').classList.remove('hidden');
    }

    let bbConnections = {};
    let bbSelectedSource = null;
    let bbSubmitted = false;
    const bbTargetOrder = [2, 0, 3, 1];

    function bbCleanTranslation(text){
      return String(text || '').replace(/^中文翻譯[：:]/, '').trim();
    }

    function bbShowIntro(){
      document.getElementById('bb-start').classList.add('hidden');
      document.getElementById('bb-intro').classList.remove('hidden');
      document.getElementById('bb-intro').scrollIntoView({behavior:'smooth', block:'start'});
    }

    function bbStartGame(){
      document.getElementById('bb-start').classList.add('hidden');
      const bbIntro = document.getElementById('bb-intro');
      if(bbIntro) bbIntro.classList.add('hidden');
      document.getElementById('bb-shell').classList.remove('hidden');
      document.getElementById('bbGame').classList.remove('hidden');
      document.getElementById('bbSummary').classList.add('hidden');
      bbConnections = {};
      bbSelectedSource = null;
      bbSubmitted = false;
      bbRenderMatchGame();
    }

    function bbRenderMatchGame(){
      const sourceWrap = document.getElementById('bbSourceList');
      const targetWrap = document.getElementById('bbTargetList');
      const submitBtn = document.getElementById('bbSubmit');
      sourceWrap.innerHTML = '';
      targetWrap.innerHTML = '';
      submitBtn.disabled = true;
      bbScenarios.forEach((item, index) => {
        const source = document.createElement('button');
        source.type = 'button';
        source.className = 'bb-match-card bb-source-card';
        source.draggable = true;
        source.dataset.id = String(index);
        source.innerHTML = '<span class="bb-language-tag">' + item.language + '</span><span>' + item.original + '</span>';
        source.addEventListener('dragstart', (event) => {
          event.dataTransfer.setData('text/plain', String(index));
          source.classList.add('dragging');
        });
        source.addEventListener('dragend', () => source.classList.remove('dragging'));
        source.addEventListener('click', () => bbSelectSource(index));
        sourceWrap.appendChild(source);
      });

      bbTargetOrder.map(i => ({...bbScenarios[i], id: i})).forEach((item) => {
        const target = document.createElement('button');
        target.type = 'button';
        target.className = 'bb-match-card bb-target-card';
        target.dataset.id = String(item.id);
        target.innerHTML = '<span>' + bbCleanTranslation(item.translation) + '</span>';
        target.addEventListener('dragover', (event) => {
          event.preventDefault();
          target.classList.add('drop-ready');
        });
        target.addEventListener('dragleave', () => target.classList.remove('drop-ready'));
        target.addEventListener('drop', (event) => {
          event.preventDefault();
          target.classList.remove('drop-ready');
          const sourceId = Number(event.dataTransfer.getData('text/plain'));
          if(!Number.isNaN(sourceId)) bbConnect(sourceId, Number(target.dataset.id));
        });
        target.addEventListener('click', () => {
          if(bbSelectedSource !== null) bbConnect(bbSelectedSource, Number(target.dataset.id));
        });
        targetWrap.appendChild(target);
      });
      window.setTimeout(bbDrawLines, 0);
    }

    function bbSelectSource(sourceId){
      if(bbSubmitted) return;
      bbSelectedSource = sourceId;
      document.querySelectorAll('.bb-source-card').forEach(card => card.classList.toggle('selected', Number(card.dataset.id) === sourceId));
      document.getElementById('bbMatchHint').textContent = '已選取左側句子，請點選右側對應的中文翻譯。';
    }

    function bbConnect(sourceId, targetId){
      if(bbSubmitted) return;
      Object.keys(bbConnections).forEach(key => {
        if(bbConnections[key] === targetId && Number(key) !== sourceId) delete bbConnections[key];
      });
      bbConnections[sourceId] = targetId;
      bbSelectedSource = null;
      document.getElementById('bbMatchHint').textContent = '已建立連線。四條線都連完後，就可以送出答案。';
      bbUpdateCards();
      bbDrawLines();
    }

    function bbUpdateCards(){
      document.querySelectorAll('.bb-source-card').forEach(card => {
        const id = Number(card.dataset.id);
        card.classList.toggle('selected', bbSelectedSource === id);
        card.classList.toggle('connected', Object.prototype.hasOwnProperty.call(bbConnections, id));
        card.classList.remove('correct','wrong');
      });
      document.querySelectorAll('.bb-target-card').forEach(card => {
        const id = Number(card.dataset.id);
        const used = Object.values(bbConnections).includes(id);
        card.classList.toggle('connected', used);
        card.classList.remove('correct','wrong','drop-ready');
      });
      const count = Object.keys(bbConnections).length;
      document.getElementById('bbSubmit').disabled = count !== bbScenarios.length;
    }

    function bbDrawLines(showResult=false){
      const board = document.getElementById('bbMatchBoard');
      const svg = document.getElementById('bbLines');
      if(!board || !svg) return;
      const rect = board.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + rect.width + ' ' + rect.height);
      svg.innerHTML = '';
      Object.entries(bbConnections).forEach(([sourceId, targetId]) => {
        const source = document.querySelector('.bb-source-card[data-id="' + sourceId + '"]');
        const target = document.querySelector('.bb-target-card[data-id="' + targetId + '"]');
        if(!source || !target) return;
        const s = source.getBoundingClientRect();
        const t = target.getBoundingClientRect();
        const x1 = s.right - rect.left;
        const y1 = s.top + s.height / 2 - rect.top;
        const x2 = t.left - rect.left;
        const y2 = t.top + t.height / 2 - rect.top;
        const mid = Math.max(40, (x2 - x1) / 2);
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + mid) + ' ' + y1 + ', ' + (x2 - mid) + ' ' + y2 + ', ' + x2 + ' ' + y2);
        path.setAttribute('class', 'bb-line ' + (showResult ? (Number(sourceId) === Number(targetId) ? 'correct' : 'wrong') : 'pending'));
        svg.appendChild(path);
      });
    }

    function bbSubmitMatch(){
      if(Object.keys(bbConnections).length !== bbScenarios.length) return;
      bbSubmitted = true;
      let correctCount = 0;
      document.querySelectorAll('.bb-source-card').forEach(card => {
        const sourceId = Number(card.dataset.id);
        const ok = bbConnections[sourceId] === sourceId;
        if(ok) correctCount += 1;
        card.classList.add(ok ? 'correct' : 'wrong');
      });
      document.querySelectorAll('.bb-target-card').forEach(card => {
        const targetId = Number(card.dataset.id);
        const matchedSource = Number(Object.keys(bbConnections).find(k => bbConnections[k] === targetId));
        const ok = matchedSource === targetId;
        card.classList.add(ok ? 'correct' : 'wrong');
      });
      bbDrawLines(true);
      window.setTimeout(() => bbShowResult(correctCount), 650);
    }

    function bbShowResult(correctCount){
      document.getElementById('bbGame').classList.add('hidden');
      document.getElementById('bbSummary').classList.remove('hidden');
      document.getElementById('bbScoreText').innerHTML = correctCount === bbScenarios.length
        ? '<strong>全部配對正確。</strong> 看得到文字，也找到意思了。'
        : '<strong>你配對正確 ' + correctCount + ' / ' + bbScenarios.length + ' 題。</strong> 下方是四句話的完整原文與中文翻譯。';
      const list = document.getElementById('bbResultList');
      list.innerHTML = bbScenarios.map((item, index) => {
        const userTarget = bbConnections[index];
        const ok = userTarget === index;
        return '<div class="bb-result-item ' + (ok ? 'correct' : 'wrong') + '">' +
          '<div class="bb-result-status">' + (ok ? '✓ 配對正確' : '✕ 正確對照') + '</div>' +
          '<div class="bb-result-original"><span>' + item.language + '</span>' + item.original + '</div>' +
          '<div class="bb-result-translation">中文翻譯：' + bbCleanTranslation(item.translation) + '</div>' +
        '</div>';
      }).join('');
    }

    function bbRestart(){
      bbConnections = {};
      bbSelectedSource = null;
      bbSubmitted = false;
      document.getElementById('bb-start').classList.remove('hidden');
      if(document.getElementById('bb-intro')) document.getElementById('bb-intro').classList.add('hidden');
      document.getElementById('bb-shell').classList.add('hidden');
      if(document.getElementById('bbGame')) document.getElementById('bbGame').classList.remove('hidden');
      if(document.getElementById('bbSummary')) document.getElementById('bbSummary').classList.add('hidden');
    }

    window.addEventListener('resize', () => {
      if(!document.getElementById('bb-shell')?.classList.contains('hidden')) bbDrawLines(bbSubmitted);
    });

    function sgShowIntro(){document.getElementById('sgStart').classList.add('hidden');document.getElementById('sgIntro').classList.remove('hidden');document.getElementById('sgIntro').scrollIntoView({behavior:'smooth',block:'start'})}
    function sgStartGame(){document.getElementById('sgStart').classList.add('hidden');const intro=document.getElementById('sgIntro');if(intro) intro.classList.add('hidden');document.getElementById('sgResult').classList.add('hidden');document.getElementById('sgGame').classList.remove('hidden');sg={...sgInit};sgIndex=0;sgRender();sgUpdateUI()}
    function sgUpdateUI(){
      let emergency=false,gameOver=false;
      ['student','professional','energy','admin'].forEach(k=>{
        document.getElementById('sgVal-'+k).textContent=`${sg[k]}%`;
        document.getElementById('sgBar-'+k).style.width=`${Math.max(0,Math.min(100,sg[k]))}%`;
        const card=document.getElementById('sgStat-'+k);
        if(sg[k]<35){card.classList.add('sg-shake');emergency=true}else card.classList.remove('sg-shake');
        if(sg[k]<=0) gameOver=true;
      });
      document.getElementById('sgBlock').classList.toggle('sg-emergency',emergency);
      if(gameOver){sgEnd(false);return true}
      return false;
    }
    function sgRender(){
      if(sgIndex>=sgStages.length){sgEnd(true);return}
      const s=sgStages[sgIndex];
      document.getElementById('sgStageNum').textContent=sgIndex+1;
      document.getElementById('sgStageTitle').textContent=s.title;
      document.getElementById('sgStageDesc').textContent=s.desc;
      document.getElementById('sgStageIcon').className=`fas ${s.icon} text-xl opacity-60`;
      const wrap=document.getElementById('sgOptions');
      wrap.innerHTML='';
      s.options.forEach(o=>{const b=document.createElement('button');b.className='sg-option';b.innerHTML=`<span class="font-bold text-slate-900 text-[15px]">${o.text}</span>`;b.onclick=()=>sgChoose(o);wrap.appendChild(b)});
    }
    function sgChoose(o){
      Object.keys(o.impact).forEach(k=>sg[k]=Math.min(100,Math.max(-5,sg[k]+o.impact[k])));
      if(sgUpdateUI()) return;
      document.getElementById('sgCard').innerHTML=`<div class="p-10 text-center bg-slate-50 sg-frame flex flex-col justify-center"><div class="inline-block text-[10px] font-mono tracking-[0.18em] text-blue-900 bg-blue-50 border border-blue-900 px-3 py-1 mb-5">SYSTEM FEEDBACK</div><p class="text-2xl font-black text-slate-800 mb-8 leading-tight">${o.feedback}</p><button onclick="sgNext()" class="sys-button bg-blue-900 text-white px-8 py-3 font-bold text-sm tracking-wide">繼續前進</button></div>`;
    }
    function sgNext(){
      sgIndex++;
      document.getElementById('sgCard').innerHTML=`<div class="sg-head"><div class="flex justify-between items-center mb-2"><span class="text-[11px] font-mono font-black opacity-80 tracking-[0.2em]">MONTH <span id="sgStageNum"></span> / ${sgStages.length}</span><i id="sgStageIcon" class="fas fa-school text-xl opacity-60"></i></div><h3 id="sgStageTitle" class="text-2xl font-black"></h3></div><div class="p-7 sg-scroll"><p id="sgStageDesc" class="text-slate-700 mb-6 leading-relaxed text-base font-medium"></p><div id="sgOptions" class="grid grid-cols-1 md:grid-cols-2 gap-5"></div></div>`;
      sgRender();
    }
    function sgEnd(win){
      document.getElementById('sgGame').classList.add('hidden');
      document.getElementById('sgBlock').classList.remove('sg-emergency');
      document.getElementById('sgResult').classList.remove('hidden');
      document.getElementById('sgResIcon').textContent=win?'🎖️':'🥀';
      document.getElementById('sgResTitle').textContent=win?'奇蹟的守護者':'計畫終結：被遺忘的黑板';
      document.getElementById('sgResDesc').textContent=win?'在重重致命扣分的現實下，你竟然成功走完了這段路。你保住了學生的學習光火，也讓專業師資在貧瘠的土壤中扎根。':'指標歸零。你的決策雖可能出自好意，但現實的殘酷最終擊垮了這座橋樑。';
      document.getElementById('sgResStats').innerHTML=`<div class="p-4 bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0_rgba(31,41,55,0.12)]"><div class="text-[11px] text-blue-700 font-mono font-black mb-1">學生收穫</div><div class="text-3xl font-black">${Math.max(0,sg.student)}%</div></div><div class="p-4 bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0_rgba(31,41,55,0.12)]"><div class="text-[11px] text-violet-700 font-mono font-black mb-1">教學專業</div><div class="text-3xl font-black">${Math.max(0,sg.professional)}%</div></div><div class="p-4 bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0_rgba(31,41,55,0.12)]"><div class="text-[11px] text-orange-700 font-mono font-black mb-1">教學熱忱</div><div class="text-3xl font-black">${Math.max(0,sg.energy)}%</div></div><div class="p-4 bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0_rgba(31,41,55,0.12)]"><div class="text-[11px] text-green-700 font-mono font-black mb-1">行政穩定</div><div class="text-3xl font-black">${Math.max(0,sg.admin)}%</div></div>`;
      document.getElementById('sgResActions').innerHTML=win?`<button onclick="sgRevealReading()" class="sys-button bg-white text-blue-900 px-8 py-3 font-bold text-sm tracking-wide">繼續閱讀</button>`:`<button onclick="sgStartGame()" class="sys-button bg-blue-900 text-white px-8 py-3 font-bold text-sm tracking-wide">重新啟動計畫</button><button onclick="sgRevealReading()" class="sys-button bg-white text-blue-900 px-8 py-3 font-bold text-sm tracking-wide">繼續閱讀</button>`;
    }
    function sgRevealReading(){document.getElementById('sgReading').classList.remove('hidden');document.getElementById('sgReadingAnchor').scrollIntoView({behavior:'smooth',block:'start'})}


    
    
function renderNativeOriginDonutChart(){
      const el=document.getElementById('nativeOriginDonutChart');
      if(!el) return;

      const rankedData = [
        { rank: 1, name: '大陸地區', value: '11.6萬人', pct: 43.7 },
        { rank: 2, name: '越南', value: '9.3萬人', pct: 35.2 },
        { rank: 3, name: '印尼', value: '2.1萬人', pct: 7.8 },
        { rank: 4, name: '菲律賓', value: '6,594人', pct: 2.5 },
        { rank: 5, name: '泰國', value: '4,906人', pct: 1.9 },
        { rank: 6, name: '柬埔寨', value: '3,640人', pct: 1.4 },
        { rank: 7, name: '馬來西亞', value: '3,531人', pct: 1.3 },
        { rank: 8, name: '緬甸', value: '2,723人', pct: 1.0 }
      ];
      const other = { name: '其他', value: '1.4萬人', pct: 5.2 };

      const renderBar = (item, isOther=false) => `
        <div class="origin-bar-item${isOther ? ' is-other' : ''}" tabindex="0">
          <div class="origin-bar-head">
            <div class="origin-bar-label-wrap">
              ${isOther ? '' : `<span class="origin-bar-rank">${item.rank}.</span>`}
              <span class="origin-bar-label${isOther ? ' no-rank' : ''}">${item.name}</span>
            </div>
            <div class="origin-bar-value">${item.value}（${item.pct}%）</div>
          </div>
          <div class="origin-bar-track" aria-hidden="true">
            <div class="origin-bar-fill" style="width:${item.pct}%;"></div>
          </div>
        </div>`;

      el.innerHTML = `
        <div class="origin-bars-card">
          <div class="origin-rank-title-wrap">
            <div class="origin-rank-title">113 學年新住民子女學生數</div>
            <div class="origin-rank-subtitle">按父（母）原生地區或國家分</div>
          </div>
          <div class="origin-bars-list">
            ${rankedData.map(item => renderBar(item)).join('')}
            ${renderBar(other, true)}
          </div>
        </div>`;
    }

    function describeDonutArc(cx,cy,rOuter,rInner,startDeg,endDeg){
      const startOuter=polarRaw(cx,cy,rOuter,startDeg);
      const endOuter=polarRaw(cx,cy,rOuter,endDeg);
      const startInner=polarRaw(cx,cy,rInner,endDeg);
      const endInner=polarRaw(cx,cy,rInner,startDeg);
      const laf=endDeg-startDeg>180?1:0;
      return `M ${startOuter.x} ${startOuter.y} A ${rOuter} ${rOuter} 0 ${laf} 1 ${endOuter.x} ${endOuter.y} L ${startInner.x} ${startInner.y} A ${rInner} ${rInner} 0 ${laf} 0 ${endInner.x} ${endInner.y} Z`;
    }
    function polarRaw(cx,cy,r,deg){const rad=deg*Math.PI/180;return{x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)}}

    
    function renderTop3OriginByLevelChart(){
      const el=document.getElementById('top3OriginByLevelChart');
      if(!el) return;
      const ns='http://www.w3.org/2000/svg';
      const width=980,height=500,margin={l:60,r:44,t:104,b:92},chartW=width-margin.l-margin.r,chartH=292,max=4.2;
      const svg=document.createElementNS(ns,'svg');
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      svg.classList.add('stat-svg');

      const bg=document.createElementNS(ns,'rect');
      bg.setAttribute('x',20);bg.setAttribute('y',12);bg.setAttribute('width',width-40);bg.setAttribute('height',34);bg.setAttribute('fill','#f6e7bd');
      svg.appendChild(bg);
      const title=document.createElementNS(ns,'text');
      title.setAttribute('x',width/2);title.setAttribute('y',36);title.setAttribute('text-anchor','middle');title.setAttribute('class','stat-title');
      title.textContent='113 學年各級學校新住民子女學生數—按父(母)前 3 大原生地區或國家分';
      svg.appendChild(title);
      const unit=document.createElementNS(ns,'text');
      unit.setAttribute('x',width-40);unit.setAttribute('y',70);unit.setAttribute('text-anchor','end');unit.setAttribute('class','stat-unit rounded-body');
      unit.textContent='單位：萬人';svg.appendChild(unit);

      const legend=[['大陸地區','#cfb66b'],['越南','#e4c98d'],['印尼','#f1dec0']];
      legend.forEach((l,i)=>{
        const x=430+i*120,y=108;
        const rect=document.createElementNS(ns,'rect');
        rect.setAttribute('x',x);rect.setAttribute('y',y-10);rect.setAttribute('width',10);rect.setAttribute('height',10);rect.setAttribute('fill',l[1]);
        svg.appendChild(rect);
        const t=document.createElementNS(ns,'text');
        t.setAttribute('x',x+16);t.setAttribute('y',y);t.setAttribute('class','stat-legend-muted rounded-body');t.textContent=l[0];
        svg.appendChild(t);
      });

      const axisY=margin.t+chartH;
      const axis=document.createElementNS(ns,'line');
      axis.setAttribute('x1',margin.l);axis.setAttribute('y1',axisY);axis.setAttribute('x2',width-margin.r);axis.setAttribute('y2',axisY);
      axis.setAttribute('stroke','#73624a');axis.setAttribute('stroke-width','2.5');svg.appendChild(axis);

      const groupW=chartW/top3OriginByLevelData.length, barW=30, gap=10;
      top3OriginByLevelData.forEach((d,i)=>{
        const cxg=margin.l+groupW*i+groupW/2;
        const bars=[
          ['mainland',d.mainland,d.mainlandPct,'#cfb66b'],
          ['vietnam',d.vietnam,d.vietnamPct,'#e4c98d'],
          ['indonesia',d.indonesia,d.indonesiaPct,'#f1dec0']
        ];
        bars.forEach((b,j)=>{
          const x=cxg-(barW*3+gap*2)/2+j*(barW+gap);
          const h=b[1]/max*chartH;
          const y=axisY-h;
          const rect=document.createElementNS(ns,'rect');
          rect.setAttribute('x',x);rect.setAttribute('y',y);rect.setAttribute('width',barW);rect.setAttribute('height',h);rect.setAttribute('fill',b[3]);
          rect.setAttribute('stroke','#f3efe6');rect.setAttribute('stroke-width','1');
          svg.appendChild(rect);
          const tx=document.createElementNS(ns,'text');
          tx.setAttribute('x',x+barW/2);tx.setAttribute('y',y-10);tx.setAttribute('text-anchor','middle');tx.setAttribute('class','bar-label-muted rounded-body');
          tx.innerHTML=`<tspan x="${x+barW/2}" dy="0">${b[1].toFixed(1)}</tspan><tspan x="${x+barW/2}" dy="20">(${b[2].toFixed(1)}%)</tspan>`;
          svg.appendChild(tx);
        });
        const lx=document.createElementNS(ns,'text');
        lx.setAttribute('x',cxg);lx.setAttribute('y',axisY+34);lx.setAttribute('text-anchor','middle');lx.setAttribute('class','axis-label-muted rounded-body');
        lx.textContent=d.level;svg.appendChild(lx);
      });
      const note=document.createElementNS(ns,'text');
      note.setAttribute('x',margin.l);note.setAttribute('y',height-26);note.setAttribute('class','stat-note rounded-body');
      note.textContent='說明：括弧內數據為該父(母)原生地區或國家之學生數占比。';
      svg.appendChild(note);
      el.innerHTML='';el.appendChild(svg);
    }


    
    function renderLevelTrendChart(){
      const el=document.getElementById('levelTrendChart');
      if(!el) return;
      const ns='http://www.w3.org/2000/svg';
      const width=700,height=400,margin={l:58,r:138,t:92,b:58},chartW=width-margin.l-margin.r,chartH=250,totalMax=50,ratioMax=8;
      const svg=document.createElementNS(ns,'svg');
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      svg.classList.add('stat-svg');

      const accent='#7d6a4d', axis='#5b5b5b', lineColor='#b98939';
      const x0=margin.l,y0=margin.t+chartH;

      const leftTitle=document.createElementNS(ns,'text');
      leftTitle.setAttribute('x',x0);
      leftTitle.setAttribute('y',64);
      leftTitle.setAttribute('text-anchor','start');
      leftTitle.setAttribute('class','left-axis-title-muted rounded-body');
      leftTitle.textContent='新住民子女學生數（萬人）';
      svg.appendChild(leftTitle);

      const rightTitle=document.createElementNS(ns,'text');
      rightTitle.setAttribute('x',x0+chartW);
      rightTitle.setAttribute('y',64);
      rightTitle.setAttribute('text-anchor','end');
      rightTitle.setAttribute('class','right-axis-title-muted rounded-body');
      rightTitle.textContent='占學生總數比率(%)';
      svg.appendChild(rightTitle);

      const leftAxis=document.createElementNS(ns,'line');leftAxis.setAttribute('x1',x0);leftAxis.setAttribute('y1',margin.t);leftAxis.setAttribute('x2',x0);leftAxis.setAttribute('y2',y0);leftAxis.setAttribute('stroke',axis);leftAxis.setAttribute('stroke-width','2.5');svg.appendChild(leftAxis);
      const bottom=document.createElementNS(ns,'line');bottom.setAttribute('x1',x0);bottom.setAttribute('y1',y0);bottom.setAttribute('x2',x0+chartW);bottom.setAttribute('y2',y0);bottom.setAttribute('stroke',axis);bottom.setAttribute('stroke-width','2.5');svg.appendChild(bottom);
      const rightAxis=document.createElementNS(ns,'line');rightAxis.setAttribute('x1',x0+chartW);rightAxis.setAttribute('y1',margin.t);rightAxis.setAttribute('x2',x0+chartW);rightAxis.setAttribute('y2',y0);rightAxis.setAttribute('stroke',accent);rightAxis.setAttribute('stroke-width','2.5');svg.appendChild(rightAxis);

      [0,10,20,30,40,50].forEach(v=>{
        const y=y0-v/totalMax*chartH;
        const t=document.createElementNS(ns,'text');t.setAttribute('x',x0-20);t.setAttribute('y',y+5);t.setAttribute('text-anchor','end');t.setAttribute('class','left-axis-num-muted rounded-body');t.textContent=v;svg.appendChild(t);
        const tick=document.createElementNS(ns,'line');tick.setAttribute('x1',x0-6);tick.setAttribute('y1',y);tick.setAttribute('x2',x0);tick.setAttribute('y2',y);tick.setAttribute('stroke',axis);tick.setAttribute('stroke-width','2');svg.appendChild(tick);
      });
      [0,2,4,6,8].forEach(v=>{
        const y=y0-v/ratioMax*chartH;
        const t=document.createElementNS(ns,'text');t.setAttribute('x',x0+chartW+18);t.setAttribute('y',y+5);t.setAttribute('class','right-axis-num-muted rounded-body');t.textContent=v;svg.appendChild(t);
        const tick=document.createElementNS(ns,'line');tick.setAttribute('x1',x0+chartW);tick.setAttribute('y1',y);tick.setAttribute('x2',x0+chartW+6);tick.setAttribute('y2',y);tick.setAttribute('stroke',accent);tick.setAttribute('stroke-width','2');svg.appendChild(tick);
      });

      const stackKeys=[
        ['kindergarten','幼兒園','#d7d2c7'],
        ['elementary','國小','#cfc9bb'],
        ['junior','國中','#c2b8a5'],
        ['senior','高級中等學校','#d8c071'],
        ['college','大專校院','#a7a19a']
      ];
      const groupW=chartW/levelTrendData.length, barW=44;
      const linePts=[];
      levelTrendData.forEach((d,i)=>{
        const x=x0+groupW*i+groupW/2;
        let currentY=y0;
        stackKeys.forEach(k=>{
          const h=d[k[0]]/totalMax*chartH;
          const rect=document.createElementNS(ns,'rect');
          rect.setAttribute('x',x-barW/2);rect.setAttribute('y',currentY-h);rect.setAttribute('width',barW);rect.setAttribute('height',h);rect.setAttribute('fill',k[2]);
          rect.setAttribute('stroke','#f5f2eb');rect.setAttribute('stroke-width','1');
          svg.appendChild(rect);
          currentY-=h;
        });
        const totalY=y0-d.total/totalMax*chartH;
        const total=document.createElementNS(ns,'text');total.setAttribute('x',x);total.setAttribute('y',totalY-14);total.setAttribute('text-anchor','middle');total.setAttribute('class','total-label-muted rounded-body');total.textContent=d.total.toFixed(1);svg.appendChild(total);
        const year=document.createElementNS(ns,'text');year.setAttribute('x',x);year.setAttribute('y',y0+34);year.setAttribute('text-anchor','middle');year.setAttribute('class','axis-label-dark rounded-body');year.textContent=d.year;svg.appendChild(year);
        const ratioY=y0-d.ratio/ratioMax*chartH;
        linePts.push([x,ratioY,d.ratio]);
      });

      const poly=document.createElementNS(ns,'polyline');
      poly.setAttribute('points',linePts.map(p=>`${p[0]},${p[1]}`).join(' '));
      poly.setAttribute('fill','none');poly.setAttribute('stroke',lineColor);poly.setAttribute('stroke-width','4');svg.appendChild(poly);
      linePts.forEach(p=>{
        const c=document.createElementNS(ns,'circle');c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);c.setAttribute('r','7');c.setAttribute('fill','#fff');c.setAttribute('stroke',lineColor);c.setAttribute('stroke-width','4');svg.appendChild(c);
        const t=document.createElementNS(ns,'text');t.setAttribute('x',p[0]);t.setAttribute('y',p[1]-20);t.setAttribute('text-anchor','middle');t.setAttribute('class','ratio-label-muted rounded-body');t.textContent=p[2].toFixed(1);svg.appendChild(t);
      });

      const lx=596,ly=110;
      stackKeys.slice().reverse().forEach((k,i)=>{
        const y=ly+i*34;
        const line=document.createElementNS(ns,'line');line.setAttribute('x1',lx);line.setAttribute('y1',y);line.setAttribute('x2',lx+42);line.setAttribute('y2',y);line.setAttribute('stroke',k[2]);line.setAttribute('stroke-width','11');svg.appendChild(line);
        const t=document.createElementNS(ns,'text');t.setAttribute('x',lx+55);t.setAttribute('y',y+8);t.setAttribute('class','stat-legend-muted rounded-body');t.textContent=k[1];svg.appendChild(t);
      });
      const yLine=ly+5*34+12;
      const legendLine=document.createElementNS(ns,'line');legendLine.setAttribute('x1',lx);legendLine.setAttribute('y1',yLine);legendLine.setAttribute('x2',lx+42);legendLine.setAttribute('y2',yLine);legendLine.setAttribute('stroke',lineColor);legendLine.setAttribute('stroke-width','4');svg.appendChild(legendLine);
      const lc=document.createElementNS(ns,'circle');lc.setAttribute('cx',lx+21);lc.setAttribute('cy',yLine);lc.setAttribute('r','7');lc.setAttribute('fill','#fff');lc.setAttribute('stroke',lineColor);lc.setAttribute('stroke-width','4');svg.appendChild(lc);
      const lt=document.createElementNS(ns,'text');lt.setAttribute('x',lx+55);lt.setAttribute('y',yLine+8);lt.setAttribute('class','stat-legend-muted rounded-body');lt.textContent='占學生總數比率';svg.appendChild(lt);

      el.innerHTML=`<div class="level-trend-title-wrap origin-rank-title-wrap"><div class="level-trend-html-title origin-rank-title">各級學校新住民子女學生數</div></div>`;
      el.appendChild(svg);
    }


    function renderEnding(){const d=endingData[state.persona];if(!d) return;const titleEl=document.getElementById('endingTitle');titleEl.textContent=d.title||'';titleEl.style.display=d.title?'block':'none';document.getElementById('endingText').innerHTML=d.text.map(x=>`<p>${x}</p>`).join('');const ctaEl=document.getElementById('ctaText');ctaEl.textContent=d.cta||'';ctaEl.style.display=d.cta?'block':'none';}

    function showModal(type){
      const modal=document.getElementById('modal');
      const flowSteps=[
        '入學申請（家長、監護人申請）',
        '專業評估（多面向能力與需求分析）',
        '習得會議（專家、校方、家長共同制定量身計畫）',
        '編班作業（依評估結果妥善安排）',
        '適性輔導（持續性語言與生活支持）',
        '持續追蹤（定期評估、動態調整）'
      ];
      const flowHTML=`
        <div class="flow-chart">
          ${flowSteps.map((step,idx)=>`
            <div class="flow-step">
              <div class="flow-index">${String(idx+1).padStart(2,'0')}</div>
              <div class="flow-label">${step}</div>
            </div>
            ${idx<flowSteps.length-1?'<div class="flow-arrow">↓</div>':''}
          `).join('')}
        </div>
        <div class="mt-3 text-[10px] leading-relaxed text-gray-500 text-right">圖表製作／ 黃律齊　資料來源／ 台北市中山區濱江國民小學校長吳勝學</div>
        <div class="mt-5 bg-blue-50 border-l-4 border-blue-700 p-4 text-sm leading-relaxed text-slate-700">依教育部國民及學前教育署規定，跨轉生缺乏基礎華語表達溝通能力者可申請「華語文學習扶助課程」，每班最高可獲244節免費的扶助課程（上、下學期至多各72節、暑假80節、寒假20節），112學年度共計439名學生申請。</div>`;
      const views={
        case:{t:'個案心情（模擬）',b:`<div class="case-mood-list"><div class="mood-card">
          <div class="mood-name">宇薇<span>（從越南返台）</span></div>
          <p class="mood-foreign">Khi giáo viên hỏi tôi, tôi chỉ nghe hiểu được vài từ. Dù các bạn trong lớp không cười tôi, nhưng tôi vẫn cảm thấy rất xấu hổ.</p>
          <p class="mood-zh">老師問我問題的時候，我只聽懂幾個字，雖然同學沒有笑我，但我還是覺得很丟臉。</p>
        </div><div class="mood-card">
          <div class="mood-name">伯仲<span>（從緬甸返台）</span></div>
          <p class="mood-foreign">အရင်က ကိုယ့်နိုင်ငံမှာ ကျောင်းစာအမှတ်တွေ မဆိုးပါဘူး။ ဒါပေမဲ့ ဒီကိုရောက်လာပြီးနောက် ရုတ်တရက် ဘာမှမလုပ်တတ်တဲ့လူတစ်ယောက်လို ဖြစ်သွားပြီး၊ အဲဒါကြောင့် အရမ်းအဆင်မပြေဖြစ်နေပါတယ်။</p>
          <p class="mood-zh">我以前在自己的國家成績不差，但來到這裡以後，突然變成什麼都不會的人，這讓我很不適應。</p>
        </div><div class="mood-card">
          <div class="mood-name">英屹<span>（從法國返台）</span></div>
          <p class="mood-foreign">Ce matin, un camarade de classe m’a spontanément accompagné à la coopérative scolaire. Même si je ne comprenais pas très bien ce qu’il disait, j’ai quand même ressenti une certaine chaleur dans mon cœur.</p>
          <p class="mood-zh">早上有同學主動帶我去福利社，我雖然聽不太懂他說什麼，但還是覺得心裡暖暖的。</p>
        </div><div class="mood-card">
          <div class="mood-name">佳薇<span>（從泰國返台）</span></div>
          <p class="mood-foreign">วันนี้ในที่สุดก็มีเพื่อนร่วมชั้นมาคุยกับฉันตอนพักหลังเลิกเรียน แต่ฉันฟังไม่เข้าใจว่าเขาพูดอะไร จึงไม่รู้จะตอบอย่างไร เขาดูเหมือนจะไม่ค่อยพอใจเพราะเรื่องนี้ ฉันจึงรู้สึกจนใจมาก</p>
          <p class="mood-zh">今天終於有同學在下課的時候跟我說話，但我聽不懂他說什麼，所以也無從回應，他好像因此不太開心，我覺得很無奈。</p>
        </div><div class="mood-card">
          <div class="mood-name">子恩<span>（從柬埔寨返台）</span></div>
          <p class="mood-foreign">ខ្ញុំសង្ឃឹមថាមិត្តរួមថ្នាក់មិនសួរខ្ញុំតែថា «អ្នកមកពីណា?» ប៉ុណ្ណោះទេ ប៉ុន្តែក៏អាចសួរខ្ញុំថាខ្ញុំចូលចិត្តអ្វី និងសាលាចាស់របស់ខ្ញុំមានលក្ខណៈយ៉ាងដូចម្តេចផងដែរ។</p>
          <p class="mood-zh">我希望同學不要只問我「你是哪裡人」，也可以問我喜歡什麼、以前的學校是什麼樣子。</p>
        </div><div class="mood-card">
          <div class="mood-name">巧芸<span>（從越南返台）</span></div>
          <p class="mood-foreign">Sự đồng hành của giáo viên tiếng Hoa rất quan trọng đối với tôi.</p>
          <p class="mood-zh">華語老師的陪伴對我而言很重要。</p>
        </div><div class="mood-card">
          <div class="mood-name">子靖<span>（從日本返台）</span></div>
          <p class="mood-foreign">三か月間の中国語補習授業を受けた後、私は先生が授業中に話していることを少しずつ聞き取れるようになり、とても達成感を感じました。</p>
          <p class="mood-zh">在上了三個月的華語輔導課後，我開始稍微聽得懂老師在課堂上說的話了，我覺得很有成就感。</p>
        </div><div class="mood-card">
          <div class="mood-name">綺貞<span>（從泰國返台）</span></div>
          <p class="mood-foreign">ฉันอยากมีเพื่อนมาก แต่ทุกครั้งก่อนจะอ้าปากพูด ฉันมักจะกังวลก่อนว่าจะพูดผิด สุดท้ายจึงไม่ได้พูดอะไรเลย</p>
          <p class="mood-zh">我很想交朋友，可是每次要開口前，都會先擔心自己說錯話，所以最後什麼也沒說。</p>
        </div><div class="mood-card">
          <div class="mood-name">俊霖<span>（從越南返台）</span></div>
          <p class="mood-foreign">Mỗi lần nghe hiểu trọn vẹn một câu tiếng Trung, tôi đều thầm vui trong lòng và cảm thấy hôm nay hình như mình lại tiến bộ thêm một chút.</p>
          <p class="mood-zh">每次聽懂一句完整的中文，我都會在心裡偷偷高興，覺得今天好像又前進了一點。</p>
        </div></div>`},
        stat:{t:'統計報表',b:`<div class="stat-grid">
          <div class="chart-card stat-card-uniform p-4">
            <div class="font-bold text-sm text-gray-800 text-center mb-1">跨轉生來臺前居住國</div>
            <div id="statBeforeCountryChart" class="pie-shell"></div>
            <div class="mt-3 text-[10px] leading-relaxed text-gray-500 text-right">圖表製作／ 黃律齊　資料來源／ 教育部國民及學前教育署新住民子女教育網</div>
          </div>
          <div class="chart-card stat-card-uniform p-4 bg-amber-50">
            <div class="font-bold text-sm text-gray-800 text-center mb-1">跨轉生來台後居住縣市</div>
            <div id="afterCountyChart" class="pie-shell"></div>
            <div class="mt-3 text-[10px] leading-relaxed text-gray-500 text-right">圖表製作／ 黃律齊　資料來源／ 教育部國民及學前教育署新住民子女教育網</div>
          </div>
          <div class="chart-card stat-card-uniform p-4">
            <div class="chart-scroll compact-scroll flex-1"><div id="nativeOriginDonutChart"></div></div>
            <div class="mt-3 text-[10px] leading-relaxed text-gray-500 text-right">圖表製作／ 黃律齊　資料來源／教育部全球資訊網</div>
          </div>
          <div class="chart-card stat-card-uniform p-4">
            <div class="chart-scroll compact-scroll flex-1"><div id="levelTrendChart"></div></div>
            <div class="mt-3 text-[10px] leading-relaxed text-gray-500 text-right">圖表製作／ 黃律齊　資料來源／教育部全球資訊網</div>
          </div>
        </div>`},
        teach:{t:'相關網站',b:`<div class="space-y-3 text-sm leading-relaxed">
          <p class="text-gray-600 mb-4">以下整理與新住民子女教育、跨國銜轉支持及地方教育服務相關之網站：</p>
          <ol class="list-decimal pl-5 space-y-3">
            <li><a class="text-blue-800 font-bold underline decoration-2 underline-offset-4 hover:text-blue-600" href="https://mkm.k12ea.gov.tw/" target="_blank" rel="noopener noreferrer">教育部國民及學前教育署新住民子女教育網</a></li>
            <li><a class="text-blue-800 font-bold underline decoration-2 underline-offset-4 hover:text-blue-600" href="https://www.edu.tw/News_Content.aspx?n=829446EED325AD02&amp;sms=26FB481681F7B203&amp;s=4C810A112728CC60" target="_blank" rel="noopener noreferrer">教育部全球資訊網：各級學校新住民子女就學概況</a></li>
            <li><a class="text-blue-800 font-bold underline decoration-2 underline-offset-4 hover:text-blue-600" href="https://www.newres.tp.edu.tw/" target="_blank" rel="noopener noreferrer">臺北市政府教育局新住民子女教育資訊網</a></li>
            <li><a class="text-blue-800 font-bold underline decoration-2 underline-offset-4 hover:text-blue-600" href="https://www.international-education.ntpc.edu.tw/ischool/publish_page/365/?cid=31343" target="_blank" rel="noopener noreferrer">新北市國際教育資訊網</a></li>
            <li><a class="text-blue-800 font-bold underline decoration-2 underline-offset-4 hover:text-blue-600" href="https://tynewimmigrants.tycg.gov.tw/" target="_blank" rel="noopener noreferrer">桃園市政府新住民專區</a></li>
            <li><a class="text-blue-800 font-bold underline decoration-2 underline-offset-4 hover:text-blue-600" href="https://www.tcniew.org.tw/" target="_blank" rel="noopener noreferrer">臺中市新住民教育資訊網</a></li>
            <li><a class="text-blue-800 font-bold underline decoration-2 underline-offset-4 hover:text-blue-600" href="https://tnni.tainan.gov.tw/" target="_blank" rel="noopener noreferrer">臺南市政府：新住民照顧輔導專屬網站</a></li>
            <li><a class="text-blue-800 font-bold underline decoration-2 underline-offset-4 hover:text-blue-600" href="https://www.kh.edu.tw/orgArch/departments_intro/R0/item6" target="_blank" rel="noopener noreferrer">高雄市政府教育局全球資訊網：新住民教育服務網</a></li>
          </ol>
        </div>`},
        admin_work:{t:'行政作業',b:flowHTML}
      };
      const v=views[type];
      modal.innerHTML=`<div class="modal-card"><div class="modal-top"><span>${v.t}</span><button onclick="closeModal()" class="sys-button text-white hover:text-red-400 font-bold bg-gray-700 px-3 py-1 rounded">✕</button></div><div class="modal-body-inner">${v.b}</div></div>`;
      modal.style.display='flex';
      if(type==='stat') setTimeout(renderStatCharts,0);
    }
    function closeModal(){document.getElementById('modal').style.display='none'}






    let conveyorRefreshHandles=[];

    function parseDurationToMs(value, fallbackMs){
      if(!value) return fallbackMs;
      const trimmed=String(value).trim();
      if(trimmed.endsWith('ms')) return parseFloat(trimmed) || fallbackMs;
      if(trimmed.endsWith('s')) return (parseFloat(trimmed) || (fallbackMs/1000))*1000;
      const num=parseFloat(trimmed);
      return Number.isFinite(num) ? num : fallbackMs;
    }

    function clearConveyorRefreshSchedule(){
      conveyorRefreshHandles.forEach(handle=>{
        if(handle && handle.type==='timeout') clearTimeout(handle.id);
        if(handle && handle.type==='interval') clearInterval(handle.id);
      });
      conveyorRefreshHandles=[];
    }

    function getConveyorDurations(){
      const rootStyles=getComputedStyle(document.documentElement);
      return {
        full: parseDurationToMs(rootStyles.getPropertyValue('--belt-duration'), 16000),
        fullMobile: parseDurationToMs(rootStyles.getPropertyValue('--belt-duration-mobile'), 13333)
      };
    }

    function isMobileViewport(){
      return window.matchMedia('(max-width: 768px)').matches;
    }

    function randomBetween(min,max){
      return min + Math.random()*(max-min);
    }

    function chooseWeighted(items){
      const total=items.reduce((sum,item)=>sum+item.weight,0);
      let cursor=Math.random()*total;
      for(const item of items){
        cursor -= item.weight;
        if(cursor<=0) return item.value;
      }
      return items[items.length-1].value;
    }

    function populateGroundObjects(segment){
      const nodes=[...segment.querySelectorAll('.belt-object')];
      if(!nodes.length) return;
      const mobile=isMobileViewport();
      const slotPositions=[4,12,20,29,37,46,55,64,73,82,91];
      let visibleCount=0;
      let emptyRun=0;
      let previousType='';
      nodes.forEach((node,index)=>{
        let type=chooseWeighted([
          {value:'teal', weight:34},
          {value:'lime', weight:28},
          {value:'pipe', weight:10},
          {value:'none', weight:28}
        ]);
        if(previousType==='pipe' && type==='pipe') type=Math.random()<0.5?'teal':'lime';
        if(emptyRun>=2) type=Math.random()<0.5?'teal':'lime';
        if(index===nodes.length-1 && visibleCount<5 && type==='none') type='teal';

        if(type==='none'){
          node.style.display='none';
          emptyRun += 1;
          previousType='none';
          return;
        }

        emptyRun=0;
        visibleCount += 1;
        previousType=type;
        const config = type==='pipe'
          ? {src:'./ground-pipe-purple.png', width: mobile ? randomBetween(24,31) : randomBetween(36,45), z:9}
          : type==='lime'
            ? {src:'./ground-bush-lime.png', width: mobile ? randomBetween(32,43) : randomBetween(48,62), z:8}
            : {src:'./ground-bush-teal.png', width: mobile ? randomBetween(40,56) : randomBetween(60,82), z:7};

        const jitter = type==='pipe' ? randomBetween(-1.2,1.2) : randomBetween(-1.8,1.8);
        node.src=config.src;
        node.className='belt-object';
        node.alt='';
        node.style.display='block';
        node.style.left=`${slotPositions[index] + jitter}%`;
        node.style.width=`${Math.round(config.width)}px`;
        node.style.zIndex=String(config.z);
        node.style.bottom = mobile ? 'calc(var(--floor-height) - 5px)' : 'calc(var(--floor-height) - 8px)';
      });
    }

    function populateCloudLayer(layer){
      const sizes=['cloud-small','cloud-medium','cloud-large'];
      const cloudSources=['./air-cloud-1.png','./air-cloud-2.png','./air-cloud-3.png'];
      layer.innerHTML='';
      const count=Math.random()<0.2?3:4;
      const placements=[];
      let guard=0;
      while(placements.length<count && guard<120){
        guard++;
        const cls=sizes[Math.floor(Math.random()*sizes.length)];
        const src=cloudSources[Math.floor(Math.random()*cloudSources.length)];
        const span= cls==='cloud-small' ? 12 : (cls==='cloud-large' ? 18 : 15);
        const left=4 + Math.random()*80;
        const center=left + span/2;
        const overlaps=placements.some(p=>Math.abs(center-p.center) < ((span+p.span)/2 + 0.8));
        if(overlaps) continue;
        placements.push({cls,src,left,center,span});
      }
      placements.sort((a,b)=>a.left-b.left).forEach(({cls,src,left})=>{
        const img=document.createElement('img');
        img.src=src;
        img.alt='';
        img.className=`belt-cloud-item ${cls}`;
        img.style.left=`${left}%`;
        layer.appendChild(img);
      });
    }

    function populateAirLayer(layer){
      const configs=[
        {src:'./air-bricks-question.png', cls:'variant-1', span:10},
        {src:'./air-bricks-2.png', cls:'variant-2', span:18},
        {src:'./air-bricks-3.png', cls:'variant-3', span:26}
      ];
      layer.innerHTML='';
      const count=Math.random()<0.58?1:2;
      const placements=[];
      let guard=0;
      while(placements.length<count && guard<60){
        guard++;
        const item=configs[Math.floor(Math.random()*configs.length)];
        const left=12 + Math.random()*64;
        const center=left + item.span/2;
        const overlaps=placements.some(p=>Math.abs(center-p.center) < ((item.span+p.span)/2 + 6));
        if(overlaps) continue;
        placements.push({item,left,center,span:item.span});
      }
      placements.sort((a,b)=>a.left-b.left).forEach(({item,left})=>{
        const img=document.createElement('img');
        img.src=item.src;
        img.alt='';
        img.className=`belt-air-item ${item.cls}`;
        img.style.left=`${left}%`;
        layer.appendChild(img);
      });
    }

    function populateConveyorSegment(segment){
      if(!segment) return;
      populateGroundObjects(segment);
      const cloudLayer=segment.querySelector('.belt-cloud-layer');
      const airLayer=segment.querySelector('.belt-air-layer');
      if(cloudLayer) populateCloudLayer(cloudLayer);
      if(airLayer) populateAirLayer(airLayer);
    }

    function populateClouds(){
      document.querySelectorAll('.scene-conveyor-segment').forEach(segment=>populateConveyorSegment(segment));
    }

    function populateAirBricks(){
      document.querySelectorAll('.scene-conveyor-segment').forEach(segment=>populateConveyorSegment(segment));
    }

    function scheduleContinuousConveyorRefresh(){
      clearConveyorRefreshSchedule();
      const segments=[...document.querySelectorAll('.scene-conveyor-segment')];
      if(!segments.length) return;
      const durations=getConveyorDurations();
      const full=isMobileViewport() ? durations.fullMobile : durations.full;
      const half=full/2;
      // initialize each visible/offscreen segment with different randomized content
      segments.forEach(segment=>populateConveyorSegment(segment));
      if(segments.length===1){
        const id=setInterval(()=>populateConveyorSegment(segments[0]), full);
        conveyorRefreshHandles.push({type:'interval', id});
        return;
      }
      const lead=Math.min(220, Math.max(120, full*0.012));
      const firstTimeout=setTimeout(()=>{
        populateConveyorSegment(segments[0]);
        const interval=setInterval(()=>populateConveyorSegment(segments[0]), full);
        conveyorRefreshHandles.push({type:'interval', id:interval});
      }, half + lead);
      conveyorRefreshHandles.push({type:'timeout', id:firstTimeout});

      const secondTimeout=setTimeout(()=>{
        populateConveyorSegment(segments[1]);
        const interval=setInterval(()=>populateConveyorSegment(segments[1]), full);
        conveyorRefreshHandles.push({type:'interval', id:interval});
      }, full + lead);
      conveyorRefreshHandles.push({type:'timeout', id:secondTimeout});
    }


    let smoothSceneState=null;

    function startSmoothScene(){
      stopSmoothScene();
      const overlay=document.querySelector('.homepage-scene-overlay');
      const root=document.querySelector('.scene-live-conveyor');
      if(!overlay || !root) return;
      const floor=root.querySelector('.live-floor');
      const groundLayer=root.querySelector('.live-ground-layer');
      const bookLayer=root.querySelector('.live-book-layer');
      const airLayer=root.querySelector('.live-air-layer');
      const cloudLayer=root.querySelector('.live-cloud-layer');
      if(!floor || !groundLayer || !bookLayer || !airLayer || !cloudLayer) return;
      groundLayer.innerHTML='';
      bookLayer.innerHTML='';
      airLayer.innerHTML='';
      cloudLayer.innerHTML='';

      const isMobile=()=>window.matchMedia('(max-width: 768px)').matches;
      const rand=(min,max)=>min+Math.random()*(max-min);
      const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
      const weighted=(items)=>{
        const total=items.reduce((s,it)=>s+it.weight,0);
        let n=Math.random()*total;
        for(const it of items){n-=it.weight;if(n<=0)return it.value;}
        return items[items.length-1].value;
      };
      const stage=()=>overlay.getBoundingClientRect();
      const durationMs=()=>{
        const val=getComputedStyle(document.documentElement).getPropertyValue(isMobile()?'--belt-duration-mobile':'--belt-duration').trim();
        if(val.endsWith('ms')) return parseFloat(val) || 13333;
        if(val.endsWith('s')) return (parseFloat(val) || 16)*1000;
        return 16000;
      };
      const speed=()=>Math.max(20, stage().width/(durationMs()/1000));

      const groundSources={
        teal:'./ground-bush-teal.png',
        lime:'./ground-bush-lime.png',
        pipe:'./ground-pipe-purple.png',
        book:'./ground-book.png'
      };
      const airSources=[
        {src:'./air-bricks-question.png', cls:'variant-1'},
        {src:'./air-bricks-2.png', cls:'variant-2'},
        {src:'./air-bricks-3.png', cls:'variant-3'}
      ];
      const cloudSources=['./air-cloud-1.png','./air-cloud-2.png','./air-cloud-3.png'];

      function makeImg(layer, className){
        const img=document.createElement('img');
        img.alt='';
        img.className=className;
        layer.appendChild(img);
        return img;
      }

      function resetGround(obj, minX){
        const mobile=isMobile();
        const type=weighted([
          {value:'teal', weight:42},
          {value:'lime', weight:34},
          {value:'pipe', weight:11}
        ]);
        obj.type=type;
        obj.el.src=groundSources[type];
        obj.el.className='live-obj live-ground';
        obj.w=type==='pipe' ? (mobile?rand(25,31):rand(36,45)) : type==='lime' ? (mobile?rand(34,44):rand(50,64)) : (mobile?rand(42,56):rand(62,82));
        obj.el.style.width=`${Math.round(obj.w)}px`;
        obj.el.style.zIndex=type==='pipe'?'9':type==='lime'?'8':'7';
        obj.x=minX;
      }

      function resetAir(obj, minX){
        const config=pick(airSources);
        obj.el.src=config.src;
        obj.el.className=`live-obj live-air ${config.cls}`;
        obj.w=isMobile()? (config.cls==='variant-3'?75:config.cls==='variant-2'?50:50) : (config.cls==='variant-3'?117:config.cls==='variant-2'?78:78);
        obj.x=minX;
      }

      function resetCloud(obj, minX){
        const cls=pick(['cloud-small','cloud-medium','cloud-large']);
        obj.el.src=pick(cloudSources);
        obj.el.className=`live-obj live-cloud ${cls}`;
        obj.w=isMobile()? (cls==='cloud-large'?64:cls==='cloud-medium'?56:48) : (cls==='cloud-large'?96:cls==='cloud-medium'?84:72);
        obj.el.style.bottom=`${rand(isMobile()?37:35, isMobile()?40:38).toFixed(1)}%`;
        obj.x=minX;
      }

      function resetBook(obj, minX){
        const mobile=isMobile();
        obj.type='book';
        obj.collected=false;
        obj.el.src=groundSources.book;
        obj.el.className='live-obj live-book';
        obj.w=mobile ? 14 : 22;
        obj.el.style.width=`${obj.w}px`;
        obj.el.style.opacity='1';
        obj.x=minX;
      }

      function initLine(count, gapRange, layer, className, resetFn){
        const rect=stage();
        const objects=[];
        let x=-rect.width*0.15;
        for(let i=0;i<count;i++){
          const obj={el:makeImg(layer,className), x:0, w:40};
          resetFn(obj, x);
          objects.push(obj);
          x += rand(gapRange[0], gapRange[1]);
        }
        // scatter across a longer initial world, not one repeated segment
        objects.forEach((obj,idx)=>{
          obj.x = rand(-rect.width*0.35, rect.width*2.4) + idx*3;
        });
        return objects;
      }

      function initBooksLine(count, layer, resetFn){
        const rect=stage();
        const mobile=isMobile();
        const spacing=mobile ? 29 : 43;
        const startX=-rect.width*0.18;
        const objects=[];
        for(let i=0;i<count;i++){
          const obj={el:makeImg(layer,'live-obj live-book'), x:0, w: mobile ? 14 : 22};
          resetFn(obj, startX + i*spacing);
          objects.push(obj);
        }
        return objects;
      }

      const scene={
        root,
        floor,
        startedAt:performance.now(),
        last:performance.now(),
        floorOffset:0,
        ground:initLine(18,[70,160],groundLayer,'live-obj live-ground',resetGround),
        books:initBooksLine(isMobile()?26:30, bookLayer, resetBook),
        air:initLine(8,[170,340],airLayer,'live-obj live-air',resetAir),
        clouds:initLine(12,[120,260],cloudLayer,'live-obj live-cloud',resetCloud),
        raf:0
      };
      smoothSceneState=scene;

      function recycle(objects, resetFn, gapRange){
        const rect=stage();
        let maxX=Math.max(...objects.map(o=>o.x));
        for(const obj of objects){
          if(obj.x + obj.w < -80){
            const nextX=Math.max(rect.width + rand(gapRange[0],gapRange[1]), maxX + rand(gapRange[0],gapRange[1]));
            resetFn(obj, nextX);
            maxX=Math.max(maxX,nextX);
          }
          obj.el.style.transform=`translate3d(${obj.x.toFixed(2)}px,0,0)`;
        }
      }

      function recycleBooks(objects){
        const rect=stage();
        const mobile=isMobile();
        const spacing=mobile ? 29 : 43;
        let maxX=Math.max(...objects.map(o=>o.x));
        for(const obj of objects){
          if(obj.x + obj.w < -80){
            const nextX=Math.max(rect.width + spacing, maxX + spacing);
            resetBook(obj, nextX);
            maxX=nextX;
          }
          obj.el.style.transform=`translate3d(${obj.x.toFixed(2)}px,0,0)`;
        }
      }

      function tick(now){
        if(smoothSceneState!==scene) return;
        const dt=Math.min(0.05,(now-scene.last)/1000 || 0);
        scene.last=now;
        const v=speed();
        scene.floorOffset = (scene.floorOffset - v*dt) % 2048;
        scene.floor.style.backgroundPosition=`${scene.floorOffset.toFixed(2)}px 100%`;
        for(const obj of [...scene.ground,...scene.books,...scene.air,...scene.clouds]) obj.x -= v*dt;

        const rect=stage();
        const runnerCenter=rect.width * 0.5;
        const runnerHalfWidth=isMobile() ? 16 : 22;
        for(const obj of scene.books){
          if(obj.collected) continue;
          const objLeft=obj.x;
          const objRight=obj.x + obj.w;
          if(objRight >= runnerCenter-runnerHalfWidth && objLeft <= runnerCenter+runnerHalfWidth){
            obj.collected=true;
            obj.el.style.opacity='0';
            obj.el.style.transition='opacity 0.08s linear';
            obj.w=0;
            obj.x = -200;
          }
        }

        recycle(scene.ground, resetGround, [65,150]);
        recycleBooks(scene.books);
        recycle(scene.air, resetAir, [180,360]);
        recycle(scene.clouds, resetCloud, [110,240]);
        scene.raf=requestAnimationFrame(tick);
      }
      scene.raf=requestAnimationFrame(tick);
    }

    function stopSmoothScene(){
      if(smoothSceneState && smoothSceneState.raf) cancelAnimationFrame(smoothSceneState.raf);
      smoothSceneState=null;
    }

    function selfTests(){
      console.assert(typeof selectPersona === 'function', 'selectPersona should be defined');
      console.assert(Array.isArray(beforeCountryData), 'beforeCountryData should be an array');
      console.assert(Array.isArray(afterCountyData), 'afterCountyData should be an array');
      console.assert(beforeCountryData.length > 0, 'beforeCountryData should not be empty');
      console.assert(typeof renderCountryCharts === 'function', 'renderCountryCharts should be defined');
      console.assert(typeof showPersonaQuiz === 'function', 'showPersonaQuiz should be defined');
      console.assert(typeof bbStartGame === 'function', 'bbStartGame should be defined');
      console.assert(typeof sgStartGame === 'function', 'sgStartGame should be defined');
      console.assert(typeof renderPerspectiveModules === 'function', 'renderPerspectiveModules should be defined');
    }

    function resetStory(){
      state={persona:'',progress:0};
      document.getElementById('sidebar').style.display='none';
      document.getElementById('currentPersonaDisplay').textContent='GUEST';
      document.querySelectorAll('#articleContent section').forEach(s=>{s.classList.remove('unlocked');s.classList.add('locked')});
      document.getElementById('personaSection').classList.remove('hidden');
      const intro=document.getElementById('roleIntroSection');
      if(intro){ intro.classList.remove('unlocked'); intro.classList.add('locked'); }
      const roleCard=document.getElementById('roleIntroCard');
      if(roleCard) roleCard.innerHTML='';
      document.getElementById('chapter1Narrative').classList.add('hidden');
      clearPerspectiveModules();
      const quizSection=document.getElementById('quizSection');
      if(quizSection) quizSection.classList.add('hidden');
      document.getElementById('countryQuizResult').classList.add('hidden');
      document.getElementById('countryCharts').classList.add('hidden');
      document.getElementById('countryQuizContent').className='grid gap-2 transition-colors duration-300';
      document.querySelectorAll('.country-option').forEach(b=>{b.disabled=false;b.className='sys-button bg-white p-3 text-xs text-left country-option'+(b.classList.contains('correct-country-option')?' correct-country-option':'')});
      document.getElementById('chapter2QuizResult').classList.add('hidden');
      document.querySelectorAll('.chapter2-option').forEach(b=>{b.disabled=false;b.classList.remove('bg-green-500','bg-red-500','text-white')});
      document.getElementById('sgReading').classList.add('hidden');
      if(document.getElementById('sgIntro')) document.getElementById('sgIntro').classList.add('hidden');
      if(document.getElementById('sgStart')) document.getElementById('sgStart').classList.remove('hidden');
      document.getElementById('sgStart').classList.remove('hidden');
      document.getElementById('sgGame').classList.add('hidden');
      document.getElementById('sgResult').classList.add('hidden');
      bbRestart();
      updateProgress(0);
      window.scrollTo({top:0,behavior:'smooth'});
    }

    function initPage(){
      createLandingGreetings();
      startSmoothScene();
      selfTests();
      resetStory();
      document.getElementById('personaSection').classList.remove('hidden');
    }

    window.addEventListener('resize', ()=>{
      startSmoothScene();
    });

    document.addEventListener('visibilitychange', ()=>{
      if(document.hidden) return;
      startSmoothScene();
    });

    initPage();
