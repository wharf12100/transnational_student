// data.js：集中放置題庫、角色資料與模擬遊戲設定。

const personaData = {
      student: '跨國銜轉生 (STU-2026)',
      teacher: '一般正式老師 (TEA-REG)',
      supporter: '華語扶助教師 (AID-LAN)'
    };

    const identityData = {
      student: {
        tag: 'ROLE PROFILE / STUDENT',
        title: '你是：跨國銜轉生「曉曉」',
        meta: '11 歲｜越南返臺｜國小五年級重新銜接',
        portrait: './portrait-student.png',
        text: '你在越南生活多年，回到臺灣後進入陌生的教室。黑板上的字你看得見，卻不一定讀得懂；老師和同學說話很快，你常常來不及理解，也不知道該怎麼開口問。你並非不努力，只是連「怎麼說出自己的困難」都需要重新學。',
        prompt: '接下來的報導將從你的視角出發，看見語言落差如何變成校園生活中的每一道門檻。'
      },
      teacher: {
        tag: 'ROLE PROFILE / HOMEROOM TEACHER',
        title: '你是：一般正式老師「林老師」',
        meta: '國小高年級導師｜班上第一次接到跨轉生',
        portrait: './portrait-teacher.png',
        text: '你熟悉班級經營，也明白每個孩子都需要被照顧；但當一名幾乎沒有中文基礎的學生進入班級，你很快發現，原本的教材、評量與教學進度都不一定適用。你想幫忙，卻也在全班進度、行政流程與有限的上課時數之間被拉扯。',
        prompt: '接下來的報導將從你的視角出發，看見正式老師如何在「照顧個別學生」與「維持班級進度」之間尋求平衡。'
      },
      supporter: {
        tag: 'ROLE PROFILE / LANGUAGE SUPPORT',
        title: '你是：華語扶助教師「阮老師」',
        meta: '新住民語教學支援老師｜非華語教學專業｜臨時受邀協助跨轉生',
        portrait: './portrait-language-support.png',
        text: '你來自越南，原本在學校教授新住民語，熟悉學生的母語與文化背景，也願意陪孩子慢慢適應臺灣校園。但你並不是受過完整訓練的華語教師，沒有對外華語教學專業，卻常被期待同時翻譯、陪伴、溝通，甚至接手跨轉生的所有學習進度。',
        prompt: '接下來的報導將從你的視角出發，看見「願意幫忙」如何在制度不清楚時，變成受到「過度期待」的壓力。'
      }
    };

    const perspectiveInteractions = {
      student: {
        entry: { tag: 'STUDENT VIEW / FILE_01-B', title: '入學第一天，你最想先確認什麼？', prompt: '你看得見黑板、聽得到老師，卻不確定自己能不能跟上。系統請你選擇一個求助方式。', options: [
          { label: '把不懂的地方先寫下來，交給老師或同學看', feedback: '這會把「我不知道怎麼問」變成可被看見的訊號；但前提是現場有人願意停下來讀懂你。' },
          { label: '先安靜觀察，下課再找比較熟的人求助', feedback: '這比較安全，卻也容易讓老師誤以為你只是分心。跨轉生的沉默，常常就是這樣被制度誤讀。' }
        ]},
        policy: { tag: 'POLICY LENS / STUDENT', title: '三種解方中，你最先需要哪一種？', prompt: '從學生視角看，最急迫的不是制度名目，而是每天真的有人接住問題。', options: [
          { label: '穩定的華語扶助老師', feedback: '對學生而言，穩定比一次性協助更重要；不用每次重新解釋自己的困境，學習才可能累積。' },
          { label: '能翻譯情緒與校園規則的人', feedback: '跨轉生需要的不只是字詞翻譯，也包括有人協助理解「學校怎麼運作」。' },
          { label: '年齡相近的陪伴者', feedback: '志工或學長姊能降低求助門檻，但仍需要與正式支援銜接，不能只靠善意撐場。' }
        ]}
      },
      teacher: {
        entry: { tag: 'TEACHER VIEW / FILE_01-B', title: '班上出現跨轉生，你會先檢查什麼？', prompt: '學生坐在教室裡，但未必真正進入課程。你要先判斷哪個環節正在卡住。', options: [
          { label: '確認他是否聽得懂課堂指令與評量題目', feedback: '這能避免把「看不懂題目」誤判成「學科能力差」。跨轉生需要先被看見語言門檻。' },
          { label: '先觀察他和同學互動是否順利', feedback: '同儕互動很重要，但若課堂語言完全卡住，學生仍可能在每一節課裡持續掉隊。' }
        ]},
        policy: { tag: 'POLICY LENS / TEACHER', title: '三種解方中，哪一種最能減輕教學現場壓力？', prompt: '從正式老師視角看，支援必須能進入班級日常，而不是只停在公文或口號。', options: [
          { label: '退休教師培訓成華語扶助專才', feedback: '這能補足教學經驗與華語專業，也能讓導師有固定協作對象。' },
          { label: '教支老師補強華語教學能力', feedback: '教支老師熟悉學生文化背景，但若缺乏華語教學訓練，仍容易變成情感補位。' },
          { label: '大學生志工陪伴學習', feedback: '志工能提供陪伴與彈性，但正式老師仍需要制度化的教學支援，否則只是多一層臨時補丁。' }
        ]}
      },
      supporter: {
        entry: { tag: 'AID TEACHER VIEW / FILE_01-B', title: '被請去支援跨轉生時，你會先問什麼？', prompt: '你可能懂學生的母語，也能陪他走進校園；但這不代表你應該獨自承擔全部華語與課業進度。', options: [
          { label: '先確認自己負責翻譯、陪伴，還是華語教學', feedback: '這一步很關鍵。角色界線清楚，華語扶助教師才不會被默默變成「全部都要會」的人。' },
          { label: '先問學生最害怕哪一堂課', feedback: '這能快速靠近學生的真實困境，但仍需要和導師協作，才能處理課程與評量問題。' }
        ]},
        policy: { tag: 'POLICY LENS / AID TEACHER', title: '三種解方中，哪一種最能避免你被過度消耗？', prompt: '從華語扶助教師視角看，問題不是願不願意幫，而是幫到哪裡、誰來共同承擔。', options: [
          { label: '退休教師承接主要華語教學', feedback: '這能讓你回到文化橋樑與溝通支援的位置，而不是被迫扛起完整華語課程。' },
          { label: '教支老師華語能力培訓', feedback: '培訓能增加能力，但若沒有待遇與職責調整，只會變成更多期待壓到同一群人身上。' },
          { label: '大學生志工加入陪伴', feedback: '志工能分擔陪伴量，但仍需要正式教師與行政端確認責任邊界。' }
        ]}
      }
    };

    const beforeCountryData = [
      { label: '越南', value: 40.7, color: '#312e81' },
      { label: '菲律賓', value: 8.6, color: '#4338ca' },
      { label: '美國', value: 8.5, color: '#4f46e5' },
      { label: '印尼', value: 6.5, color: '#6366f1' },
      { label: '中國', value: 3.8, color: '#7c3aed' },
      { label: '泰國', value: 3.3, color: '#8b5cf6' },
      { label: '日本', value: 3.0, color: '#a78bfa' },
      { label: '緬甸', value: 2.1, color: '#c4b5fd' },
      { label: '其他', value: 23.4, color: '#ddd6fe' }
    ];



    const afterCountyData = [
      { label: '高雄市', value: 21.0, color: '#9a3412' },
      { label: '台北市', value: 19.9, color: '#c2410c' },
      { label: '新北市', value: 17.8, color: '#ea580c' },
      { label: '桃園市', value: 13.8, color: '#f97316' },
      { label: '台南市', value: 6.5, color: '#fb923c' },
      { label: '台中市', value: 4.6, color: '#fdba74' },
      { label: '彰化縣', value: 2.4, color: '#fed7aa' },
      { label: '其他', value: 13.9, color: '#ffedd5' }
    ];

    const quizData = {
      student: {
        q: '當你在課堂上完全聽不懂老師在說什麼時，你最真實的心理狀態是？',
        a: [
          { t: '覺得老師教太快，想舉手反應', c: false, f: '事實上，跨轉生常因語言能力不足而不敢舉手，即便想反應也缺乏對應詞彙。' },
          { t: '覺得孤單、想回母國，最後對自己說「算了」', c: true, f: '這正是達達與王宜靜的共同心聲：「我就只能一個人消化」。' }
        ]
      },
      teacher: {
        q: '在班級有跨轉生時，導師面臨最急迫的專業挑戰是？',
        a: [
          { t: '不知道如何針對無中文基礎者調整評量與進度', c: true, f: '如報導所述，導師難以單獨為學生調整授課方式，導致學生第一份考卷常掛零。' },
          { t: '被學生投訴考卷太難', c: false, f: '考卷難易度是針對全班，但跨轉生是完全看不懂，挑戰在於根本無法進入評量。' }
        ]
      },
      admin: {
        q: '雖然教育局設有明確 SOP 與「習得會議」，行政端最大挑戰是？',
        a: [
          { t: '預算過多導致審核公文堆積', c: false, f: '並非預算過多，而是人力媒合的前置作業困難。' },
          { t: '雖有經費補助，但第一線媒合華語師資困難，常導致支援斷層', c: true, f: '專案教師直言：「寫計畫不難，但前置找人會卡住。」' }
        ]
      },
      supporter: {
        q: '若正式老師因進度壓力直接把教材塞給你時，你最真實的感受是？',
        a: [
          { t: '感到專業被否定，且擔心自己無法獨自負擔學生的所有進度', c: true, f: '孫雅雯提到，這讓教支老師感到被「丟包」，且教支老師主要角色應是語言橋樑。' },
          { t: '非常高興，因為這樣可以完全照自己的方式教課', c: false, f: '缺乏與導師的教學分工，會讓教支老師面臨巨大的風險。' }
        ]
      }
    };

    const simData = {
      student: {
        q: '你坐在教室，黑板上的公式像天書。你想問老師什麼是「分母」，但你不知道這個詞怎麼說。',
        a: ['選項 A: 努力比手畫腳嘗試溝通', '選項 B: 在課本畫畫並對自己說「算了」']
      },
      teacher: {
        q: '班上銜轉生連注音都看不懂，但教學進度已到古文欣賞。下週就是段考，你該如何處理他的考卷？',
        a: ['選項 A: 照發全班統一考卷，讓他盡力寫', '選項 B: 嘗試為他微調評量內容或額外標註注音']
      },
      supporter: {
        q: '導師將一疊華語課本塞給你，說：「老師，這孩子就交給你了，他完全聽不懂課。」你知道自己熟悉學生母語，卻不是華語教學專業。',
        a: ['選項 A: 概括承受，即便自己並未受過專業華語教學訓練', '選項 B: 與導師溝通教學分工，明確自己的支援定位']
      }
    };

    const comments = {
      student: '',
      teacher: '👉 系統視角分析：若專業人力能真正入班協作，導師便不再需要於課綱與輔導之間孤立無援地拉扯。',
      supporter: '👉 系統視角分析：當華語教學專業、班級導師與語言文化支援有明確分工，華語扶助教師才能發揮橋樑優勢，而不是被迫補上整套制度缺口。'
    };

    const endingData = {
      student: {
        title: '跨轉生視角：不是只有中文不好，而是整個校園都像未翻譯的規則。',
        text: ['跨轉生的困境不只是「中文不好」，', '若整個系統假設每個學生都能自然而然地跟上進度，', '把語言落差視為個人適應問題，', '學生就能牙一咬，把困難吞回肚子裡。'],
        cta: '當學生說不出自己的困難，制度就必須先學會辨認沉默。'
      },
      teacher: {
        title: '正式老師視角：不是老師不願意，而是制度沒把工具放到教室裡。',
        text: ['跨轉生進入班級後，導師面對的不只是多照顧一名學生，而是原有教材、評量與課堂節奏全都需要重新調整。', '若華語扶助、行政流程與專業諮詢無法穩定進入日常教學，正式老師只能在全班進度與個別需求之間獨自拉扯。'],
        cta: '讓老師有支援，學生才不會只剩下「自己適應」。'
      },
      supporter: {
        title: '華語扶助教師視角：你可以成為橋樑，但不能被當成整座制度。',
        text: ['新住民語教學支援老師熟悉學生的母語與文化，不等於具備完整華語教學專業。', '當翻譯、陪伴、溝通、華語教學與課業補救都被壓到同一個人身上，善意就會變成消耗，橋樑也可能被迫成為補洞的人。'],
        cta: '真正的支持不是把責任交給最願意幫忙的人，而是讓每個角色都有清楚邊界與合理保障。'
      }
    };

    const bbScenarios = [
  {
    language: '印尼文',
    plain: 'Menyeberang jalan harus menggunakan zebra cross agar aman.',
    original: 'Menyeberang jalan harus menggunakan zebra cross agar aman.',
    translation: '中文翻譯：穿越馬路必須使用斑馬線才安全。',
    options: ['A. 穿越馬路要走斑馬線', 'B. 毛毛蟲會羽化成蝴蝶', 'C. 游泳前要先做熱身', 'D. 資源回收能減少垃圾量'],
    answer: 0
  },
  {
    language: '越南文',
    plain: 'Sâu bướm biến thành bướm sau quá trình biến thái.',
    original: 'Sâu bướm biến thành bướm sau quá trình biến thái.',
    translation: '中文翻譯：毛毛蟲經過變態過程後變成蝴蝶。',
    options: ['A. 游泳前要先做熱身', 'B. 毛毛蟲會羽化成蝴蝶', 'C. 資源回收能減少垃圾量', 'D. 穿越馬路要走斑馬線'],
    answer: 1
  },
  {
    language: '泰文',
    plain: 'ควรอบอุ่นร่างกายก่อนว่ายน้ำทุกครั้ง',
    original: 'ควรอบอุ่นร่างกายก่อนว่ายน้ำทุกครั้ง',
    translation: '中文翻譯：每次游泳前都應先做熱身。',
    options: ['A. 資源回收能減少垃圾量', 'B. 穿越馬路要走斑馬線', 'C. 游泳前要先做熱身', 'D. 毛毛蟲會羽化成蝴蝶'],
    answer: 2
  },
  {
    language: '日文',
    plain: 'リサイクルをすると、ごみの量を減らすことができます。',
    original: 'リサイクルをすると、ごみの量を減らすことができます。',
    translation: '中文翻譯：做好資源回收可以減少垃圾量。',
    options: ['A. 毛毛蟲會羽化成蝴蝶', 'B. 游泳前要先做熱身', 'C. 穿越馬路要走斑馬線', 'D. 資源回收能減少垃圾量'],
    answer: 3
  }
];



    const nativeOriginMainData = [
      { label: '大陸地區', value: 11.6, percent: 43.7, color: '#b7a9d6' },
      { label: '越南', value: 9.3, percent: 35.2, color: '#c3dc91' },
      { label: '印尼', value: 2.1, percent: 7.8, color: '#62d0d4' },
      { label: '其他', value: 3.5, percent: 13.3, color: '#f7c0b5' }
    ];

    const nativeOriginOtherData = [
      { label: '菲律賓', text: '6,594人(2.5%)', color: '#e8e47b' },
      { label: '泰國', text: '4,906人(1.9%)', color: '#e3ebfb' },
      { label: '柬埔寨', text: '3,640人(1.4%)', color: '#e7f4df' },
      { label: '馬來西亞', text: '3,531人(1.3%)', color: '#efefef' },
      { label: '緬甸', text: '2,723人(1.0%)', color: '#cfcfcf' },
      { label: '其他', text: '1.4萬人(5.2%)', color: '#f1aaa4', tall: true }
    ];

    const top3OriginByLevelData = [
      { level: '幼兒園', mainland: 0.7, mainlandPct: 32.7, vietnam: 0.8, vietnamPct: 36.9, indonesia: 0.1, indonesiaPct: 5.0 },
      { level: '國小', mainland: 3.0, mainlandPct: 43.9, vietnam: 2.2, vietnamPct: 32.7, indonesia: 0.5, indonesiaPct: 7.1 },
      { level: '國中', mainland: 1.7, mainlandPct: 47.5, vietnam: 1.1, vietnamPct: 31.6, indonesia: 0.3, indonesiaPct: 7.7 },
      { level: '高級中等學校', mainland: 2.4, mainlandPct: 46.4, vietnam: 1.8, vietnamPct: 34.6, indonesia: 0.4, indonesiaPct: 7.7 },
      { level: '大專校院', mainland: 3.9, mainlandPct: 43.0, vietnam: 3.5, vietnamPct: 38.5, indonesia: 0.8, indonesiaPct: 8.9 }
    ];

    const levelTrendData = [
      { year: '108', total: 31.2, ratio: 7.4, kindergarten: 2.6, elementary: 9.1, junior: 6.2, senior: 8.0, college: 5.2 },
      { year: '109', total: 30.5, ratio: 7.3, kindergarten: 2.3, elementary: 8.2, junior: 5.6, senior: 7.7, college: 6.7 },
      { year: '110', total: 29.6, ratio: 7.2, kindergarten: 2.1, elementary: 7.6, junior: 4.8, senior: 7.2, college: 7.9 },
      { year: '111', total: 28.5, ratio: 7.0, kindergarten: 2.0, elementary: 7.2, junior: 4.2, senior: 6.5, college: 8.6 },
      { year: '112', total: 28.1, ratio: 7.0, kindergarten: 2.3, elementary: 7.2, junior: 4.0, senior: 5.5, college: 9.1 },
      { year: '113', total: 26.5, ratio: 6.7, kindergarten: 2.1, elementary: 6.8, junior: 3.6, senior: 5.1, college: 9.0 }
    ];

const sgInit = { student: 100, professional: 100, energy: 100, admin: 100 };
const sgStages = [
      {
        title: '誰的責任？黑板前的孤島',
        desc: '11歲的跨轉生達達剛入學，完全不懂華語。校方行政為了省麻煩，直接建議讓他在教室「自然習得」，不安排額外課程。你怎麼做？',
        icon: 'fa-island-tropical',
        options: [
          { text: '聽從行政建議：相信環境的力量，不額外增加各方負擔。', impact: { student: -55, professional: -30, energy: 0, admin: 20 }, feedback: '達達在教室坐了一個月，一個字都沒學會，且開始出現嚴重的拒學傾向。' },
          { text: '強力爭取開班：要求依法申請銜轉計畫，儘管行政手續繁瑣。', impact: { student: 10, professional: 20, energy: -5, admin: -45 }, feedback: '開班成功，但行政處室對你充滿敵意，核銷文件被反覆刁難。' },
          { text: '尋找替代役輔導：請校內役男每天帶他讀繪本。', impact: { student: 15, professional: -40, energy: 10, admin: -15 }, feedback: '役男退伍後支援立即斷層，達達再度淪為「被遺忘的孩子」。' },
          { text: '拜託退休老師：動用私人人情請退休老師回校幫忙。', impact: { student: 20, professional: 10, energy: -35, admin: 0 }, feedback: '教學穩定了，但你欠下巨大的人情債，且老師體力不堪負荷。' }
        ]
      },
      {
        title: '專業師資的崩潰邊緣',
        desc: '跨轉計畫需要具證照的華語師資，但因鐘點費過低且路途遙遠，全區唯一有證照的老師決定離職去補習班。你如何挽留？',
        icon: 'fa-user-tie',
        options: [
          { text: '動之以情：強調學生的受教權，請求老師基於使命感留下來。', impact: { student: 0, professional: -15, energy: -60, admin: 10 }, feedback: '老師冷淡表示：「使命感不能付房租。」隨後遞出辭呈。' },
          { text: '挪用預算津貼：私下將其他雜支項目轉為老師的「研發津貼」。', impact: { student: 15, professional: 20, energy: 25, admin: -55 }, feedback: '留住了老師，但校長在行政會議上因違規疑慮將你罵到狗血淋頭。' },
          { text: '找教支老師代打：請懂學生母語的老師兼任。', impact: { student: 5, professional: -50, energy: -20, admin: 10 }, feedback: '老師反映中文文法太難教，達達的發音開始出現嚴重偏差。' },
          { text: '增加行政工作：要求老師帶更多學生以增加鐘點數。', impact: { student: -20, professional: 15, energy: -50, admin: 15 }, feedback: '老師體力透支，在課堂上直接暈倒，計畫被迫停擺兩週。' }
        ]
      },
      {
        title: '行政迷霧：消失的補助',
        desc: '縣市政府窗口換人，新任承辦人推翻之前的口頭承諾，認定某些教材費不符規格，要求學校自行吸收已支出的五萬元。怎麼辦？',
        icon: 'fa-cloud',
        options: [
          { text: '自行籌措經費：發起校內義賣或拜託家長會出錢補洞。', impact: { student: -10, professional: 0, energy: -20, admin: -50 }, feedback: '錢湊到了，但行政人員對此項目的「風險性」產生極度恐懼。' },
          { text: '放棄補助：直接停課，直到經費爭議解決為止。', impact: { student: -65, professional: -20, energy: -15, admin: 30 }, feedback: '達達在黃金銜接期被迫中斷學習，之前的努力幾乎化為烏有。' },
          { text: '向上級投訴：向教育部或媒體反映基層承辦人的刁難行為。', impact: { student: 0, professional: 10, energy: 10, admin: -70 }, feedback: '經費火速撥放，但該縣市承辦人從此處處針對你們學校。' },
          { text: '請求專業團隊介入：請高師大專案辦公室出面協調政策解釋。', impact: { student: 10, professional: 15, energy: 10, admin: -20 }, feedback: '專業團隊擋下了不合理的審核，但行政溝通耗費了你兩個月的精力。' }
        ]
      },
      {
        title: '零分考卷的打擊',
        desc: '達達在原班的國語測驗拿到 0 分，他在課堂上開始撕毀課本。導師反映這影響了班級秩序。你該如何介入？',
        icon: 'fa-heart-crack',
        options: [
          { text: '改採替代評量：要求原班導師不給分數，改以質性觀察。', impact: { student: 30, professional: -20, energy: 10, admin: -45 }, feedback: '達達壓力減輕，但其他學生家長集體寫信抗議成績不公。' },
          { text: '加強課後輔導：每天放學後留校兩小時強制補課。', impact: { student: -45, professional: 25, energy: -20, admin: 10 }, feedback: '識字量提升，但達達對學校產生了生理性的嘔吐反應。' },
          { text: '安排母語夥伴：找同鄉學長陪讀，舒緩情緒而非專注學術。', impact: { student: 40, professional: -35, energy: 15, admin: 5 }, feedback: '達達情緒穩定了，但期末考依然交白卷，專業學習進度停滯。' },
          { text: '無視個別差異：強調所有學生標準一致。', impact: { student: -70, professional: 10, energy: -10, admin: 30 }, feedback: '達達完全放棄學習，開始在課堂中搞破壞，最終被迫轉學。' }
        ]
      },
      {
        title: '最後的馬拉松：永續',
        desc: '計畫結束了。你必須決定這套體系的未來。面對不斷湧入的新孩子，你的最終願景是？',
        icon: 'fa-infinity',
        options: [
          { text: '拼命推動月薪制：要求國家編列正式華語教師員額。', impact: { student: 20, professional: 40, energy: 30, admin: -80 }, feedback: '你犧牲了平步青雲的機會，但為臺灣教育史留下了制度基石。' },
          { text: '退守行政防線：建立極其嚴密的標準作業流程。', impact: { student: -40, professional: 10, energy: 10, admin: 60 }, feedback: '行政再也不會出錯，但計畫從此失去了靈魂。' },
          { text: '全面數位化：用 AI 取代所有教支老師。', impact: { student: -30, professional: 25, energy: 20, admin: 40 }, feedback: '成本極低，但無數個達達在螢幕前依然感到孤單。' },
          { text: '社區權限下放：將經費全數撥給民間協會。', impact: { student: 25, professional: -50, energy: 20, admin: 20 }, feedback: '充滿人情味但教學毫無標準，銜轉教育退回了雜牌軍時代。' }
        ]
      }
    ];
