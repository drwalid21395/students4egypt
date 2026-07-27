document.addEventListener("DOMContentLoaded",function(){
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

function showToast(msg,dur){
dur=dur||3000;
var c=$("#toast-container");
if(!c){c=document.createElement("div");c.id="toast-container";document.body.appendChild(c)}
var t=document.createElement("div");t.className="toast";t.textContent=msg;c.appendChild(t);
setTimeout(function(){if(t.parentNode)t.remove()},dur);
}

function formatNum(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}

// Main Tabs
var mainTabs=$$(".main-tab"),pages=$$(".page");
function switchPage(id){
pages.forEach(function(p){p.classList.remove("active")});
mainTabs.forEach(function(t){t.classList.remove("active")});
var pg=$("#"+id);if(pg)pg.classList.add("active");
var tb=$$(".main-tab[data-page='"+id+"']");if(tb[0])tb[0].classList.add("active");
window.scrollTo({top:0,behavior:"smooth"});
try{localStorage.setItem("activePage",id)}catch(e){}
}
window.switchPage=switchPage;
mainTabs.forEach(function(t){t.addEventListener("click",function(){switchPage(t.dataset.page)})});
try{var saved=localStorage.getItem("activePage");if(saved&&$("#"+saved))switchPage(saved)}catch(e){}

// Sub Tabs
$$(".sub-tabs").forEach(function(st){
st.addEventListener("click",function(e){
var btn=e.target;if(!btn.classList.contains("sub-tab"))return;
var page=btn.closest(".page");if(!page)return;
page.querySelectorAll(".sub-tab").forEach(function(b){b.classList.remove("active")});
page.querySelectorAll(".sub-tab-content").forEach(function(c){c.classList.remove("active")});
btn.classList.add("active");
var content=$("#"+btn.dataset.subtab);if(content)content.classList.add("active");
});
});

// Hamburger
var hamburger=$("#hamburger");
if(hamburger)hamburger.addEventListener("click",function(){$("#mainTabs").classList.toggle("mobile-open")});

// Header shadow + scroll top
var scrollTopBtn=$(".scroll-top");
window.addEventListener("scroll",function(){
var h=$("#siteHeader");if(h)h.classList.toggle("scrolled",window.scrollY>50);
if(scrollTopBtn)scrollTopBtn.classList.toggle("visible",window.scrollY>400);
});
if(scrollTopBtn)scrollTopBtn.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"})});

// Hero Slider
var currentSlide=0,slides=$$(".hero-slide"),dots=$$(".hero-dot");
function showSlide(n){
slides.forEach(function(s){s.classList.remove("active")});
dots.forEach(function(d){d.classList.remove("active")});
currentSlide=(n+slides.length)%slides.length;
if(slides[currentSlide])slides[currentSlide].classList.add("active");
if(dots[currentSlide])dots[currentSlide].classList.add("active");
}
dots.forEach(function(d){d.addEventListener("click",function(){showSlide(parseInt(d.dataset.slide))})});
var prev=$(".hero-prev"),next=$(".hero-next");
if(prev)prev.addEventListener("click",function(){showSlide(currentSlide-1)});
if(next)next.addEventListener("click",function(){showSlide(currentSlide+1)});
setInterval(function(){showSlide(currentSlide+1)},5000);

// Counter Animation
var statsObs=new IntersectionObserver(function(entries){
entries.forEach(function(e){
if(e.isIntersecting){
e.target.querySelectorAll(".stat-number").forEach(function(n){
var target=parseInt(n.dataset.target),current=0,step=Math.ceil(target/60);
var timer=setInterval(function(){
current+=step;if(current>=target){current=target;clearInterval(timer)}
n.textContent=formatNum(current);
},30);
});
statsObs.unobserve(e.target);
}
});
},{threshold:0.3});
var statsSec=$(".stats-section");if(statsSec)statsObs.observe(statsSec);

// Countdown
var targetDate=new Date("2026-08-28T10:00:00").getTime();
function updateCountdown(){
var now=Date.now(),diff=targetDate-now;
if(diff<=0)return;
var d=Math.floor(diff/864e5),h=Math.floor(diff%864e5/36e5),m=Math.floor(diff%36e5/6e4),s=Math.floor(diff%6e4/1e3);
var pad=function(n){return n<10?"0"+n:""+n};
var dd=$("#cd-days"),hh=$("#cd-hours"),mm=$("#cd-minutes"),ss=$("#cd-seconds");
if(dd)dd.textContent=pad(d);if(hh)hh.textContent=pad(h);if(mm)mm.textContent=pad(m);if(ss)ss.textContent=pad(s);
}
setInterval(updateCountdown,1000);updateCountdown();

// Calendar
var calYear=2026,calMonth=6;
var eventDates=[28,30,1,5,10,15];
var monthNames=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
function renderCalendar(){
var grid=$("#calGrid");if(!grid)return;grid.innerHTML="";
var cm=$("#calMonth");if(cm)cm.textContent=monthNames[calMonth]+" "+calYear;
var firstDay=new Date(calYear,calMonth,1).getDay();
var daysInMonth=new Date(calYear,calMonth+1,0).getDate();
var today=new Date();
for(var i=0;i<firstDay;i++){var empty=document.createElement("div");empty.className="cal-day empty";grid.appendChild(empty)}
for(var d=1;d<=daysInMonth;d++){
var day=document.createElement("div");day.className="cal-day";day.textContent=d;
if(d===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear())day.classList.add("today");
if(eventDates.indexOf(d)!==-1)day.classList.add("has-event");
grid.appendChild(day);
}
}
renderCalendar();
var calPrev=$("#calPrev"),calNext=$("#calNext");
if(calPrev)calPrev.addEventListener("click",function(){calMonth--;if(calMonth<0){calMonth=11;calYear--}renderCalendar()});
if(calNext)calNext.addEventListener("click",function(){calMonth++;if(calMonth>11){calMonth=0;calYear++}renderCalendar()});

// Opportunities Filter
$$(".filter-btn[data-filter]").forEach(function(btn){
btn.addEventListener("click",function(){
var parent=btn.closest(".page")||document;
parent.querySelectorAll(".filter-btn[data-filter]").forEach(function(b){b.classList.remove("active")});
btn.classList.add("active");
var filter=btn.dataset.filter;
parent.querySelectorAll(".opp-card").forEach(function(card){
card.style.display=(filter==="all"||card.dataset.type===filter)?"":"none";
});
});
});

// Gallery Filter
$$(".filter-btn[data-gfilter]").forEach(function(btn){
btn.addEventListener("click",function(){
var parent=btn.closest(".sub-tab-content")||document;
parent.querySelectorAll(".filter-btn[data-gfilter]").forEach(function(b){b.classList.remove("active")});
btn.classList.add("active");
var filter=btn.dataset.gfilter;
parent.querySelectorAll(".gallery-item").forEach(function(item){
item.style.display=(filter==="all"||item.dataset.gtype===filter)?"":"none";
});
});
});

// Library Filter
$$(".filter-btn[data-libfilter]").forEach(function(btn){
btn.addEventListener("click",function(){
var parent=btn.closest(".sub-tab-content")||document;
parent.querySelectorAll(".filter-btn[data-libfilter]").forEach(function(b){b.classList.remove("active")});
btn.classList.add("active");
var filter=btn.dataset.libfilter;
parent.querySelectorAll(".lib-item").forEach(function(item){
item.style.display=(filter==="all"||item.dataset.libtype===filter)?"":"none";
});
});
});

// Library Search
var libSearch=$("#libSearch");
if(libSearch)libSearch.addEventListener("input",function(){
var q=this.value.toLowerCase();
$$(".lib-item").forEach(function(item){
item.style.display=item.textContent.toLowerCase().indexOf(q)!==-1?"":"none";
});
});

// Ideas Voting
document.addEventListener("click",function(e){
var btn=e.target.closest(".vote-up,.vote-down");
if(!btn)return;
var countEl=btn.parentNode.querySelector(".vote-count");
if(!countEl)return;
var val=parseInt(countEl.textContent)||0;
countEl.textContent=btn.classList.contains("vote-up")?val+1:Math.max(0,val-1);
countEl.style.transform="scale(1.3)";
setTimeout(function(){countEl.style.transform=""},200);
});

// Form Submissions
var joinForm=$("#joinForm");
if(joinForm)joinForm.addEventListener("submit",function(e){
e.preventDefault();showToast("تم إرسال طلب الانضمام بنجاح!");this.reset();
});
var ideaForm=$("#ideaForm");
if(ideaForm)ideaForm.addEventListener("submit",function(e){
e.preventDefault();showToast("تم إرسال الفكرة بنجاح!");this.reset();
});

// Activity Registration
$$(".register-btn").forEach(function(btn){
btn.addEventListener("click",function(){
var name=btn.dataset.activity||"هذا النشاط";
showToast("تم التسجيل في "+name+" بنجاح!");
});
});

// Newsletter Toggles
$$(".toggle input").forEach(function(cb){
cb.addEventListener("change",function(){
showToast(this.checked?"تم تفعيل الإشعار":"تم تعطيل الإreibung");
});
});

// Font Size Controls
var fontUp=$("#fontUp"),fontDown=$("#fontDown"),contrastBtn=$("#contrastBtn"),readBtn=$("#readBtn"),resetBtn=$("#resetBtn");
var currentSize=100;
if(fontUp)fontUp.addEventListener("click",function(){currentSize=Math.min(150,currentSize+10);document.body.style.fontSize=currentSize+"%"});
if(fontDown)fontDown.addEventListener("click",function(){currentSize=Math.max(70,currentSize-10);document.body.style.fontSize=currentSize+"%"});
if(contrastBtn)contrastBtn.addEventListener("click",function(){document.body.classList.toggle("high-contrast");showToast("تم تغيير التباين")});
if(readBtn)readBtn.addEventListener("click",function(){
if("speechSynthesis" in window){var u=new SpeechSynthesisUtterance(document.body.innerText);u.lang="ar-EG";u.rate=0.9;window.speechSynthesis.speak(u);showToast("جاري قراءة الصفحة...")}else{showToast("المتصفح لا يدعم القراءة الصوتية")};
});
if(resetBtn)resetBtn.addEventListener("click",function(){currentSize=100;document.body.style.fontSize="";document.body.classList.remove("high-contrast");showToast("تم إعادة الضبط")});

// Language Toggle with Full Translation
var langBtn=$("#langToggle");
var isEnglish=false;
var translations={
"طلاب من أجل مصر":"Students for Egypt",
"جامعة الفيوم":"Fayoum University",
"الرئيسية":"Home",
"من نحن":"About Us",
"الأنشطة":"Activities",
"الإنجازات":"Achievements",
"بنك فرص":"Opportunities Bank",
"المكتبة والمعرض":"Library & Gallery",
"الأدوات":"Tools",
"حسابي":"My Account",
"بوابة طلاب من أجل مصر":"Students for Egypt Portal",
"نعمل معًا لبناء مستقبل أفضل لمصرنا الحبيبة":"Working together to build a better future for our beloved Egypt",
"سجّل الآن":"Register Now",
"تعرّف علينا":"Learn About Us",
"طلاب من أجل مصر":"Students for Egypt",
"نحتفي بكل إنجاز ونخلد كل لحظة مشرفة":"We celebrate every achievement and commemorate every proud moment",
"إنجازاتنا":"Our Achievements",
"مستقبلك يبدأ هنا":"Your future starts here",
"فرص لا حدود لها تنتظرك":"Limitless opportunities await you",
"بنك الفرص":"Opportunities Bank",
"المكتبة":"Library",
"رسالة رئيس الجامعة":"University President's Message",
"يسعدني أن أرحب بكم في بوابة طلاب من أجل مصر – جامعة الفيوم، وهي منصة تفاعلية متكاملة تهدف إلى تمكين الطلاب من المشاركة الفعالة في خدمة المجتمع.":"I am delighted to welcome you to the Students for Egypt Portal – Fayoum University, an integrated interactive platform aimed at empowering students to actively participate in serving the community.",
"نؤمن بأن الشباب المصري هو الركيزة الأساسية للتنمية، وأن جامعة الفيوم لها دور محوري في صقل مواهب طلابها.":"We believe that Egyptian youth are the cornerstone of development, and Fayoum University plays a pivotal role in shaping the talents of its students.",
"رئيس جامعة الفيوم":"President of Fayoum University",
"أ.د. ياسر مجدي حتاته":"Prof. Dr. Yasser Magdy Hatatah",
"رسالة قائد الأسرة":"Family Leader's Message",
"أهلاً بكم في عائلة طلاب من أجل مصر. نحن هنا لنكون يدًا واحدة في خدمة مصرنا الغالية ولنساهم معًا في تحقيق رؤية مصر 2030.":"Welcome to the Students for Egypt family. We are here to unite in serving our beloved Egypt and contribute to achieving Egypt Vision 2030.",
"أسرة طلاب من أجل مصر ليست مجرد تنظيم طلابي، بل هي عائلة متماسكة تجمعها القيم والمبادئ المشتركة.":"The Students for Egypt family is not just a student organization, but a cohesive family united by shared values and principles.",
"قائد أسرة طلاب من أجل مصر":"Leader of Students for Egypt Family",
"آخر الأخبار":"Latest News",
"إنطلاق حملة \"نظف حرمك\" بجامعة الفيوم":"Launch of Clean Your Campus campaign at Fayoum University",
"انطلقت اليوم حملة نظف حرمك بمشاركة أكثر من 150 طالب وطالبة.":"Today, the Clean Your Campus campaign was launched with the participation of more than 150 students.",
"الأسرة تحصل على جائزة أفضل فريق طلابي":"The family wins the Best Student Team Award",
"حصلت الأسرة على جائزة أفضل فريق طلابي على مستوى الجمهورية.":"The family won the Best Student Team Award at the national level.",
"المؤتمر السنوي \"الشباب ورؤية مصر 2030\"":"Annual Conference: Youth and Egypt Vision 2030",
"ينظّم المؤتمر السنوي الأول بعنوان \"الشباب ورؤية مصر 2030\".":"The first annual conference titled Youth and Egypt Vision 2030 is being organized.",
"حملة التبرع بالدم التعاونية":"Cooperative Blood Donation Campaign",
"نجحت الأسرة في تنظيم حملة تبرع بالدم وتبرع أكثر من 200 طالب.":"The family successfully organized a blood donation campaign with over 200 students donating.",
"آخر الفعاليات":"Latest Events",
"ورشة \"القيادة الشبابية\"":"Youth Leadership Workshop",
"قاعة المؤتمرات – كلية التجارة":"Conference Hall – Faculty of Commerce",
"10:00 صباحًا":"10:00 AM",
"قادم":"Upcoming",
"يوم التنظيف العام للحرم":"Campus General Cleanup Day",
"الحرم الجامعي بالكامل":"Entire Campus",
"8:00 صباحًا":"8:00 AM",
"يوم التطوع المجتمعي":"Community Volunteering Day",
"مقر الأسرة":"Family Headquarters",
"9:00 صباحًا":"9:00 AM",
"ورشة بناء السيرة الذاتية":"CV Building Workshop",
"صالة الاجتماعات":"Meeting Hall",
"2:00 مساءً":"2:00 PM",
"أسرتنا بالأرقام":"Our Family in Numbers",
"عضو في الأسرة":"Family Members",
"كلية مشاركة":"Participating Faculties",
"ساعة تطوع":"Volunteer Hours",
"نشاط منجز":"Completed Activities",
"جائزة وتكريم":"Awards & Honors",
"طالب وافد":"International Students",
"النشاط القادم":"Next Activity",
"مؤتمر الابتكار والتكنولوجيا 2026":"Innovation & Technology Conference 2026",
"القاعة الكبرى – المبنى الرئيسي – جامعة الفيوم":"Grand Hall – Main Building – Fayoum University",
"يوم":"Days",
"ساعة":"Hours",
"دقيقة":"Minutes",
"ثانية":"Seconds",
"نبذة عامة":"General Overview",
"الرؤية والرسالة":"Vision & Mission",
"الأهداف":"Goals",
"القيم":"Values",
"الهيكل التنظيمي":"Organizational Structure",
"اللجان":"Committees",
"الأسرة طلاب من أجل مصر – جامعة الفيوم":"Students for Egypt Family – Fayoum University",
"الريادة في إعداد قيادات طلابية واعية ومبتكرة، قادرة على الإسهام في بناء مجتمع جامعي متميز، وتعزيز قيم الانتماء والمواطنة والتنمية المستدامة.":"Leadership in preparing aware and innovative student leaders capable of contributing to building a distinguished university community and enhancing values of belonging, citizenship, and sustainable development.",
"توفير بيئة جامعية محفزة تُمكّن الطلاب من المشاركة الفاعلة في الأنشطة والمبادرات، وتنمي مهاراتهم القيادية والإبداعية، وتدعم العمل التطوعي والمسؤولية المجتمعية، مع إتاحة الفرص لجميع الطلاب دون تمييز.":"Providing a stimulating university environment that enables students to actively participate in activities and initiatives, develop their leadership and creative skills, support volunteering and community responsibility, and provide opportunities for all students without discrimination.",
"الرؤية":"Vision",
"الرسالة":"Mission",
"تنمية روح الانتماء والولاء للوطن":"Developing the spirit of belonging and loyalty to the homeland",
"إعداد قيادات طلابية قادرة على تحمل المسؤولية":"Preparing student leaders capable of bearing responsibility",
"تنمية مهارات القيادة والعمل الجماعي":"Developing leadership and teamwork skills",
"دعم الابتكار والإبداع وريادة الأعمال":"Supporting innovation, creativity, and entrepreneurship",
"تشجيع العمل التطوعي وخدمة المجتمع":"Encouraging volunteering and community service",
"دمج الطلاب الوافدين وذوي الإعاقة":"Integrating international students and people with disabilities",
"اكتشاف ورعاية الموهوبين":"Discovering and nurturing talented students",
"تعزيز التواصل بين الطلاب وإدارة الجامعة":"Enhancing communication between students and university administration",
"تمثيل الجامعة بصورة مشرفة":"Representing the university with distinction",
"الانتماء":"Belonging",
"المسؤولية":"Responsibility",
"العمل الجماعي":"Teamwork",
"الاحترام المتبادل":"Mutual Respect",
"الإبداع والابتكار":"Creativity & Innovation",
"الشفافية":"Transparency",
"النزاهة":"Integrity",
"التميز":"Excellence",
"التطوع":"Volunteering",
"المساواة وتكافؤ فرص":"Equality & Equal Opportunities",
"الشمول ودمج جميع الطلاب":"Inclusion & Integration of All Students",
"أن نكون الأسرة الطلابية الرائدة في مصر والعالم العربي في بناء جيل منظّم مبدع ومساهم فعّال في بناء المجتمع.":"To be the leading student family in Egypt and the Arab world in building an organized, creative, and active generation contributing to community building.",
"تمكين الطلاب من خلال البرامج التدريبية والأنشطة المجتمعية والمبادرات التطوعية لبناء مهاراتهم وتعزيز انتمائهم الوطني.":"Empowering students through training programs, community activities, and volunteer initiatives to build their skills and enhance their national belonging.",
"التقويم":"Calendar",
"الأحد":"Sun","الإثنين":"Mon","الثلاثاء":"Tue","الأربعاء":"Wed","الخميس":"Thu","الجمعة":"Fri","السبت":"Sat",
"يوليو 2026":"July 2026","أغسطس":"August",
"نائب القائد":"Deputy Leader","السكرتير":"Secretary","أمين المالية":"Treasurer",
"القيادة العامة":"General Leadership","البحث العلمي":"Scientific Research","الإعلام":"Media","العلاقات":"Relations",
"اللجنة: الأنشطة والفعاليات":"Committee: Activities & Events",
"تاريخ الانضمام: 1 سبتمبر 2025":"Join Date: September 1, 2025",
"كلية الهندسة – قسم الحاسبات":"Faculty of Engineering – CS Dept.",
"ملعب الجامعة":"University Stadium","المكتبة المركزية":"Central Library",
"مكتب رعاية الطلاب":"Student Care Office",
"أماكن الأنشطة":"Activity Locations","القاعات":"Halls","الملاعب":"Stadiums","مكاتب رعاية الطلاب":"Student Care Offices",
"الأفكار المقدمة":"Submitted Ideas",
"الأنشطة والفعاليات":"Activities & Events",
"تابع وسجّل في أنشطتنا المتنوعة":"Follow and register for our diverse activities",
"نفخر بكل إنجاز حققناه معًا":"We are proud of every achievement we made together",
"اكتشف فرصك القادمة":"Discover your upcoming opportunities",
"خدمات متنوعة لتجربة متكاملة":"Diverse services for an integrated experience",
"إدارة ملفك الشخصي ونقاطك":"Manage your profile and points",
"ركن الوافدين":"International Students Corner",
"بنك الأفكار":"Ideas Bank",
"الخريطة":"Map",
"ذوو الإعاقة":"People with Disabilities",
"نظام النقاط":"Points System",
"السفراء":"Ambassadors",
"إدارة الموقع":"Site Administration",
"أكثر الكليات مشاركة":"Most Participating Faculties","رسم بياني تفاعلي":"Interactive Chart",
"إجراءات سريعة":"Quick Actions","إجمالي الأعضاء":"Total Members",
"روابط سريعة":"Quick Links",
"تسجيل الخروج":"Logout",
"تصنيف":"Category","تقنية":"Technology",
"المكتبة والمعرض":"Library & Gallery",
"مصادر معرفية ومحتوى بصري متنوع":"Diverse knowledge sources and visual content",
"صور":"Photos","بث مباشر":"Live Broadcast",
"فيديو – 45 دقيقة":"Video – 45 min","كتاب – 320 صفحة":"Book – 320 pages","دورة – 12 وحدة":"Course – 12 units",
" PDF – ":"PDF – "," KB":"KB"," MB":"MB",
"15 يونيو 2026":"June 15, 2026","10 يونيو 2026":"June 10, 2026","1 يونيو 2026":"June 1, 2026",
"15 أغسطس 2026":"Aug 15, 2026","1 أغسطس 2026":"Aug 1, 2026","20 أغسطس 2026":"Aug 20, 2026",
"سبتمبر 2026":"Sep 2026","أكتوبر 2026":"Oct 2026",
"منحة":"Scholarship","تدريب":"Training","مسابقة":"Competition",
"اكتب النص هنا...":"Type text here...",
"العربية":"Arabic","English":"English","Français":"French","Türkçe":"Turkish",
"المساعد الذكي":"AI Assistant","متاح دائماً لمساعدتك":"Always available to help you",
"مرحباً! أنا المساعد الذكي لبوابة طلاب من أجل مصر. كيف يمكنني مساعدتك؟":"Hello! I'm the AI assistant for Students for Egypt Portal. How can I help you?",
"اكتب سؤالك هنا...":"Type your question here...",
"إدارة ملفك الشخصي ونقاطك":"Manage your profile and points",
"الدورة التدريبية":"Training Course",
"11:00 صباحًا":"11:00 AM",
"24":"24",
"خريطة جامعة الفيوم التفاعلية":"Fayoum University Interactive Map",
"أماكن الإقامة":"Accommodation",
"دليل الجامعة":"University Guide",
"الخدمات":"Services",
"خريطة الجامعة":"University Map",
"خريطة تفاعلية":"Interactive Map",
"الأمن والأمان":"Security & Safety",
"أكثر الكليات مشاركة":"Most Participating Faculties",
"الأنشطة القادمة":"Upcoming Activities",
"الأنشطة السابقة":"Past Activities",
"الانضمام للأسرة":"Join the Family",
"مؤتمر الابتكار والتكنولوجيا":"Innovation & Technology Conference",
"القاعة الكبرى":"Grand Hall",
"مؤتمر":"Conference",
"يوم التطوع المجتمعي":"Community Volunteering Day",
"تطوع":"Volunteer",
"ورشة بناء السيرة الذاتية":"CV Building Workshop",
"ورشة":"Workshop",
"دورة التدريب على البرمجة":"Programming Training Course",
"معامل الحاسب":"Computer Lab",
"دورة":"Course",
"حملة إزالة النفايات":"Waste Removal Campaign",
"محاضرة التوعية الصحية":"Health Awareness Lecture",
"بطولة كرة القدم":"Football Championship",
"ورشة السيرة الذاتية":"CV Workshop",
"شروط العضوية":"Membership Conditions",
"أن يكون طالباً مسجلاً في جامعة الفيوم":"Must be a registered student at Fayoum University",
"الحصول على تقدير جيد فما فوق":"Must have a grade of Good or above",
"الإخلاص والالتزام":"Loyalty and commitment",
"عدم وجود مخالفات أخلاقية":"No ethical violations",
"الحضور الفعال في الاجتماعات":"Active attendance at meetings",
"مزايا الانضمام":"Benefits of Joining",
"شهادات رسمية معتمدة":"Official certified certificates",
"تدريب وتطوير مهارات مجاناً":"Free training and skill development",
"فرص تطوع محلية ودولية":"Local and international volunteer opportunities",
"تكريم سنوي للأعضاء المتميزين":"Annual honoring of outstanding members",
"استمارة التسجيل":"Registration Form",
"الاسم الكامل":"Full Name",
"البريد الإلكتروني":"Email",
"رقم الجلوس":"Seat Number",
"رقم الهاتف":"Phone Number",
"الكلية":"Faculty",
"الفرقة":"Year",
"اللجنة المطلوبة":"Desired Committee",
"لماذا تريد الانضمام":"Why do you want to join",
"أوافق على الشروط والأحكام":"I agree to the terms and conditions",
"إرسال طلب الانضمام":"Submit Join Request",
"الجوائز":"Awards",
"المبادرات":"Initiatives",
"أعداد المشاركين":"Participants Count",
"ساعات التطوع":"Volunteer Hours",
"قصص النجاح":"Success Stories",
"جائزة أفضل أسرة طلابية":"Best Student Family Award",
"الجامعة العربية المفتوحة – 2026":"Arab Open University – 2026",
"المركز الثاني في مسابقة الابتكار":"Second Place in Innovation Competition",
"وزارة التعليم العالي – 2025":"Ministry of Higher Education – 2025",
"شهادة التميز في الخدمة المجتمعية":"Excellence in Community Service Certificate",
"محافظة الفيوم – 2025":"Fayoum Governorate – 2025",
"أفضل مبادرة تطوعية":"Best Volunteer Initiative",
"المبادرة الوطنية – 2026":"National Initiative – 2026",
"مبادرة القراءة للجميع":"Reading for All Initiative",
"توفير كتب لأكثر من 500 طالب.":"Providing books for more than 500 students.",
"مبادرة الصحة للقرى":"Health for Villages Initiative",
"حملات توعية صحية في 20 قرية.":"Health awareness campaigns in 20 villages.",
"مبادرة تدريب الشباب":"Youth Training Initiative",
"تدريب 200 شاب على الحاسب والإنترنت.":"Training 200 young people on computers and internet.",
"عضو نشط":"Active Members",
"مشارك في الأنشطة":"Activity Participants",
"طالب وافد":"International Students",
"ساعة تطوع":"Volunteer Hours",
"خدمة مجتمعية":"Community Service",
"تعليم":"Education",
"صحة":"Health",
"بيئة":"Environment",
"سارة أحمد":"Sara Ahmed",
"كلية الطب":"Faculty of Medicine",
"الأسرة غيّرت حياتي. تعلّمت أن أخدم مجتمعي.":"The family changed my life. I learned to serve my community.",
"محمد علي":"Mohamed Ali",
"كلية الهندسة":"Faculty of Engineering",
"من خلال المبادرات الابتكارية، تمكّنت من تنفيذ مشروع يخدم مجتمعنا.":"Through innovative initiatives, I was able to implement a project that serves our community.",
"فاطمة حسن":"Fatma Hassan",
"كلية الآداب":"Faculty of Arts",
"التطوع مع الأسرة علّمني أن العمل الجماعي هو مفتاح النجاح.":"Volunteering with the family taught me that teamwork is the key to success.",
" Filter":false,
"الكل":"All",
"منح":"Scholarships",
"تدريبات":"Training",
"مسابقات":"Competitions",
"مؤتمرات":"Conferences",
"وظائف":"Jobs",
"الاستاذ الدكتور ياسر مجدي حتاته":"Prof. Dr. Yasser Magdy Hatatah",
"رئيس الجامعة":"University President",
"منحة إيراسموس+":"Erasmus+ Scholarship",
"منحة كاملة للدراسة في أوروبا لطلاب الماجستير.":"Full scholarship for master's students to study in Europe.",
"دورة الذكاء الاصطناعي":"AI Course",
"دورة شاملة في أساسيات الذكاء الاصطناعي لمدة 3 أشهر.":"Comprehensive course in AI fundamentals for 3 months.",
"مسابقة الابتكار والريادة":"Innovation & Entrepreneurship Competition",
"مسابقة وطنية لابتكار الحلول التقنية.":"National competition for innovative tech solutions.",
"المؤتمر الدولي للتنمية المستدامة":"International Conference on Sustainable Development",
"مؤتمر دولي يناقش التنمية المستدامة.":"International conference discussing sustainable development.",
"برنامج تطوعي دولي":"International Volunteer Program",
"فرصة للتطوع في مشاريع مجتمعية دولية.":"Opportunity to volunteer in international community projects.",
"مطلوب مهندسين برمجيات":"Software Engineers Needed",
"شركة تقنية تبحث عن مهندسين حديثي التخرج.":"Tech company seeking recent graduates.",
"قدّم الآن":"Apply Now",
"معرض الصور":"Photo Gallery",
"النشرة الإخبارية":"Newsletter",
"ابحث في المكتبة...":"Search the library...",
"لائحات":"Regulations",
"كتب":"Books",
"دورات":"Courses",
"فيديوهات":"Videos",
"أدلة":"Guides",
"دليل الطالب الجديد 2026":"New Student Guide 2026",
"دورة مهارات التواصل":"Communication Skills Course",
"القيادة والإدارة":"Leadership & Management",
"دورة أساسيات البرمجة":"Programming Basics Course",
"دليل التطوع الدولي":"International Volunteering Guide",
"نظام النقاط والتكريم":"Points & Recognition System",
"تحميل":"Download",
"مشاهدة":"Watch",
"ابدأ":"Start",
"مؤتمر الابتكار 2026":"Innovation Conference 2026",
"فيديو تعريفي بالأسرة":"Family Introduction Video",
"حملة التطوع بالقرى":"Village Volunteering Campaign",
"بث مباشر – ندوة":"Live Broadcast – Seminar",
"حفل التكريم السنوي":"Annual Honoring Ceremony",
"تقرير الأنشطة التطوعية":"Volunteer Activities Report",
"مباشر":"Live",
"اختر طريقة الإشعارات":"Choose Notification Method",
"إشعارات داخل الموقع":"In-site Notifications",
"بريد إلكتروني":"Email",
"واتساب":"WhatsApp",
"رسائل SMS":"SMS Messages",
"Push Notifications":"Push Notifications",
"ذوو الإعاقة":"People with Disabilities",
"ركن الوافدين":"International Students Corner",
"بنك الأفكار":"Ideas Bank",
"الخريطة":"Map",
"المساعد الذكي":"AI Assistant",
"الخدمات المقدمة":"Provided Services",
"خدمات دمامل متكاملة تشمل التأهيل والتدريب.":"Comprehensive support services including rehabilitation and training.",
"الأنشطة الدامجة":"Inclusive Activities",
"أنشطة شاملة ومتاحة للجميع.":"Activities accessible to everyone.",
"المواد بصيغة صوتية":"Audio Format Materials",
"جميع المواد التعليمية متاحة بصيغة صوتية.":"All educational materials available in audio format.",
"تكبير الخط":"Font Enlargement",
"إمكانية تكبير وتصغير النصوص.":"Ability to enlarge and reduce text.",
"توافق مع قارئ الشاشة":"Screen Reader Compatible",
"الموقع متوافق مع جميع برامج قارئ الشاشة.":"The website is compatible with all screen reader programs.",
"فيديوهات بلغة الإشارة":"Sign Language Videos",
"جميع المحتوى متوفر بلغة الإشارة المصرية.":"All content available in Egyptian Sign Language.",
"أدوات إمكانية الوصول":"Accessibility Tools",
"تكبير":"Enlarge",
"تصغير":"Reduce",
"تباين عالي":"High Contrast",
"قراءة":"Read",
"إعادة ضبط":"Reset",
"مترجم فوري":"Instant Translator",
"اماكن الإقامة":"Accommodation",
"سكني الطلاب – حرم الجامعة":"Student Housing – Campus",
"سكن بنات الجامعة":"University Women's Residence",
"شقق فندقية بالقرب من الجامعة":"Hotel apartments near the university",
"دليل الجامعة":"University Guide",
"موقع الجامعة على الخريطة":"University location on map",
"الكليات والأقسام":"Faculties and Departments",
"المكتبات العامة":"Public Libraries",
"الخدمات":"Services",
"خدمات النقل":"Transportation services",
"الخدمات الصحية":"Health services",
"البنوك وصرافات الأموال":"Banks and ATMs",
"خريطة الجامعة":"University Map",
"خريطة تفاعلية":"Interactive Map",
"اقترح فكرة":"Suggest an Idea",
"عنوان الفكرة":"Idea Title",
"وصف الفكرة":"Idea Description",
"التصنيف":"Category",
"تطوير مجتمعي":"Community Development",
"إرسال الفكرة":"Submit Idea",
"الأفكار المقدمة":"Submitted Ideas",
"مبادرة زراعة الأشجار في الحرم":"Tree Planting Initiative on Campus",
"زراعة 500 شجرة لتحسين البيئة.":"Planting 500 trees to improve the environment.",
"تم التنفيذ":"Implemented",
"تطبيق موبايل لخدمات الطلاب":"Mobile App for Student Services",
"تطبيق ذكي لجميع الخدمات الأكاديمية.":"Smart app for all academic services.",
"قيد المراجعة":"Under Review",
"مكتبة متنقلة للقرى":"Mobile Library for Villages",
"مكتبة متنقلة لخدمة الطلاب في القرى.":"Mobile library to serve students in villages.",
"خريطة جامعة الفيوم التفاعلية":"Fayoum University Interactive Map",
"الملف الشخصي":"My Profile",
"نظام النقاط":"Points System",
"السفراء":"Ambassadors",
"إدارة الموقع":"Site Administration",
"أحمد محمد علي":"Ahmed Mohamed Ali",
"كلية الهندسة":"Faculty of Engineering",
"قائد الأسرة":"Family Leader",
"نائب القائد":"Deputy Leader",
"السكرتير":"Secretary",
"أمين المالية":"Treasurer",
"البحث العلمي":"Scientific Research",
"الإعلام":"Media",
"العلاقات":"Relations",
"قاعة المؤتمرات – كلية التجارة":"Conference Hall – Faculty of Commerce",
"اللجنة: الأنشطة والفعاليات":"Committee: Activities & Events",
"تاريخ الانضمام: 1 سبتمبر 2025":"Join Date: September 1, 2025",
"كلية الهندسة – قسم الحاسبات":"Faculty of Engineering – CS Dept.",
"ملعب الجامعة":"University Stadium",
"المكتبة المركزية":"Central Library",
"مكتب رعاية الطلاب":"Student Care Office",
"أماكن الأنشطة":"Activity Locations",
"القاعات":"Halls",
"الملاعب":"Stadiums",
"مكاتب رعاية الطلاب":"Student Care Offices",
"الأفكار المقدمة":"Submitted Ideas",
"أكثر الكليات مشاركة":"Most Participating Faculties",
"رسم بياني تفاعلي":"Interactive Chart",
"إجراءات سريعة":"Quick Actions",
"إجمالي الأعضاء":"Total Members",
"روابط سريعة":"Quick Links",
"تسجيل الخروج":"Logout",
"تصنيف":"Category",
"تقنية":"Technology",
"التقويم":"Calendar",
"الأحد":"Sun","الإثنين":"Mon","الثلاثاء":"Tue","الأربعاء":"Wed","الخميس":"Thu","الجمعة":"Fri","السبت":"Sat",
"يوليو 2026":"July 2026","أغسطس":"August",
"11:00 صباحًا":"11:00 AM",
"15 أغسطس 2026":"Aug 15, 2026","أوروبا":"Europe",
"1 أغسطس 2026":"Aug 1, 2026","20 أغسطس 2026":"Aug 20, 2026",
"سبتمبر 2026":"Sep 2026","أكتوبر 2026":"Oct 2026",
"منحة":"Scholarship","تدريب":"Training","مسابقة":"Competition",
"اكتب النص هنا...":"Type text here...",
"العربية":"Arabic",
"المساعد الذكي":"AI Assistant",
"متاح دائماً لمساعدتك":"Always available to help you",
"مرحباً! أنا المساعد الذكي لبوابة طلاب من أجل مصر. كيف يمكنني مساعدتك؟":"Hello! I'm the AI assistant for Students for Egypt Portal. How can I help you?",
"اكتب سؤالك هنا...":"Type your question here...",
"إدارة ملفك الشخصي ونقاطك":"Manage your profile and points",
"خريطة جامعة الفيوم التفاعلية":"Fayoum University Interactive Map",
"أماكن الإقامة":"Accommodation",
"دليل الجامعة":"University Guide",
"الخدمات":"Services",
"خريطة الجامعة":"University Map",
"خريطة تفاعلية":"Interactive Map",
"النشرة الإخبارية":"Newsletter",
"المكتبة والمعرض":"Library & Gallery",
"مصادر معرفية ومحتوى بصري متنوع":"Diverse knowledge sources and visual content",
"صور":"Photos","بث مباشر":"Live Broadcast",
"فيديو – 45 دقيقة":"Video – 45 min","كتاب – 320 صفحة":"Book – 320 pages","دورة – 12 وحدة":"Course – 12 units",
"15 يونيو 2026":"June 15, 2026","10 يونيو 2026":"June 10, 2026","1 يونيو 2026":"June 1, 2026",
" PDF ":"PDF "," KB ":"KB "," MB ":"MB ",
"نشاط شاركت به":"Activities Participated",
"ساعة تطوع":"Volunteer Hours",
"شهادات حصلت عليها":"Certificates Earned",
"نقطة":"Points",
"ترتيبك على لوحة الشرف":"Your Leaderboard Rank",
"من أصل 2,500 عضو":"Out of 2,500 members",
"احصل على نقاط":"Earn Points",
"حضور نشاط":"Attend Activity",
"الفوز بمسابقة":"Win Competition",
"اقتراح فكرة":"Suggest Idea",
"دعوة طالب جديد":"Invite New Student",
"استبدل النقاط":"Redeem Points",
"شهادة تقدير":"Certificate of Appreciation",
"هدايا متنوعة":"Various Gifts",
"أولوية في الرحلات":"Priority in Trips",
"تكريم رسمي":"Official Recognition",
"لوحة الشرف":"Leaderboard",
"أفضل عضو":"Best Member",
"أفضل متطوع":"Best Volunteer",
"أفضل منظم":"Best Organizer",
"أفضل مصور":"Best Photographer",
"أفضل قائد":"Best Leader",
"كلية التجارة":"Faculty of Commerce",
"كلية الحقوق":"Faculty of Law",
"كلية التربية":"Faculty of Education",
"كلية الطب":"Faculty of Medicine",
"كلية العلوم":"Faculty of Science",
"كلية الزراعة":"Faculty of Agriculture",
"كلية الحاسبات":"Faculty of Computer Science",
"الأولى":"First",
"الثانية":"Second",
"الثالثة":"Third",
"الرابعة":"Fourth",
"الخامسة":"Fifth",
"لجنة الأنشطة":"Activities Committee",
"لجنة التطوع":"Volunteer Committee",
"لجنة البحث العلمي":"Research Committee",
"لجنة الإعلام":"Media Committee",
"لجنة العلاقات":"Relations Committee",
"لجنة الرياضة":"Sports Committee",
"اختر الكلية":"Choose Faculty",
"اختر الفرقة":"Choose Year",
"اختر اللجنة":"Choose Committee",
"تسجيل الدخول – الإدارة":"Admin Login",
"اسم المستخدم":"Username",
"كلمة المرور":"Password",
"دخول":"Login",
"إجراءات سريعة":"Quick Actions",
"إرسال إشعار عام":"Send General Notification",
"واتساب جماعي":"Bulk WhatsApp",
"بريد إلكتروني جماعي":"Bulk Email",
"رفع صور":"Upload Photos",
"إضافة نشاط":"Add Activity",
"استخراج تقارير":"Generate Reports",
"أكثر الكليات مشاركة":"Most Participating Faculties",
"إجمالي الأعضاء":"Total Members",
"نشاط منجز":"Completed Activities",
"ساعة تطوع":"Volunteer Hours",
"تسجيل الخروج":"Logout",
"-rofiصطلحات":"Terms",
"تواصل معنا":"Contact Us",
"تابعنا":"Follow Us",
"جامعة الفيوم – الفيوم – مصر":"Fayoum University – Fayoum – Egypt",
"الأحد – الخميس: 9 صباحًا – 5 مساءً":"Sunday – Thursday: 9 AM – 5 PM",
"© 2026 بوابة طلاب من أجل مصر – جامعة الفيوم. جميع الحقوق محفوظة.":"© 2026 Students for Egypt Portal – Fayoum University. All rights reserved.",
"أسرة طلاب من أجل مصر – جامعة الفيوم. نسعى لبناء جيل واعٍ ملتزم قادر على المساهمة في التنمية المستدامة.":"Students for Egypt Family – Fayoum University. We strive to build a conscious, committed generation capable of contributing to sustainable development.",
"تواصل معنا":"Contact Us",
"روابط سريعة":"Quick Links",
"الأماكن":"Locations",
"كيف أسجل":"How to register",
"اللجان":"Committees",
"الشهادات":"Certificates",
"الأسئلة الشائعة":"FAQ"
};
function translatePage(){
var sortedKeys=Object.keys(translations).filter(function(k){return translations[k]!==false}).sort(function(a,b){return b.length-a.length});
var allElements=document.querySelectorAll("*");
allElements.forEach(function(el){
if(el.dataset.origHtml===undefined)el.dataset.origHtml=el.innerHTML;
});
allElements.forEach(function(el){
if(!el.children||el.children.length===0||el.tagName==="BUTTON"||el.tagName==="A"||el.tagName==="SPAN"||el.tagName==="LABEL"||el.tagName==="LI"||el.tagName==="OPTION"||el.tagName==="P"||el.tagName.match(/^H[1-6]$/)||el.classList.contains("opp-badge")||el.classList.contains("img-placeholder")||el.classList.contains("nl-card")||el.classList.contains("news-cat")){
if(isEnglish){
var html=el.dataset.origHtml;
for(var i=0;i<sortedKeys.length;i++){
html=splitAndReplace(html,sortedKeys[i],translations[sortedKeys[i]]);
}
el.innerHTML=html;
}else{
el.innerHTML=el.dataset.origHtml;
}
}
});
}
function splitAndReplace(html,ar,en){
if(html.indexOf(ar)===-1)return html;
var parts=html.split(ar);
var result=parts[0];
for(var i=1;i<parts.length;i++){
var before=result.charAt(result.length-1);
var after=parts[i].charAt(0);
var isWordChar=function(c){return c&&(/[a-zA-Z\u0600-\u06FF]/.test(c))};
if(isWordChar(before)||isWordChar(after)){
result+=ar+parts[i];
}else{
result+=en+parts[i];
}
}
return result;
}
if(langBtn)langBtn.addEventListener("click",function(){
var html=document.documentElement;isEnglish=!isEnglish;
html.dir=isEnglish?"ltr":"rtl";
html.lang=isEnglish?"en":"ar";
langBtn.innerHTML=isEnglish?'<i class="fas fa-globe"></i> AR':'<i class="fas fa-globe"></i> EN';
translatePage();
showToast(isEnglish?"Switched to English":"تم التبديل إلى العربية");
});

// Dark Mode Toggle
var darkToggle=$("#darkToggle");
if(darkToggle){
var savedDark=localStorage.getItem("darkMode")==="true";
if(savedDark){document.body.classList.add("dark-mode");darkToggle.innerHTML='<i class="fas fa-sun"></i>'}
darkToggle.addEventListener("click",function(){
var isDark=document.body.classList.toggle("dark-mode");
localStorage.setItem("darkMode",isDark);
darkToggle.innerHTML=isDark?'<i class="fas fa-sun"></i>':'<i class="fas fa-moon"></i>';
showToast(isDark?"الوضع الليلي مفعّل":"الوضع النهاري مفعّل");
});
}

// Accessibility Toggle
var a11yBtn=$("#a11yToggle");
if(a11yBtn)a11yBtn.addEventListener("click",function(){switchPage("page-tools")});

// Translator Mock
var trBtn=$("#trBtn");
if(trBtn)trBtn.addEventListener("click",function(){
var input=$("#trInput"),output=$("#trOutput");
if(!input||!output)return;
var dict={"مرحبا":"Hello","السلام عليكم":"Peace be upon you","شكرا":"Thank you","من فضلك":"Please","نعم":"Yes","لا":"No","كيف حالك":"How are you","صباح الخير":"Good morning","مساء الخير":"Good evening","جامعة الفيوم":"Fayoum University","طالب":"Student","نشاط":"Activity","تطوع":"Volunteer","سجل":"Register","شهادة":"Certificate"};
var text=input.value.trim();var result=[];
text.split(" ").forEach(function(w){result.push(dict[w]||w)});
output.value=result.join(" ");
});

// Admin Login
var adminForm=$("#adminLoginForm");
if(adminForm)adminForm.addEventListener("submit",function(e){
e.preventDefault();
var user=$("#adminUser"),pass=$("#adminPass");
if(user&&pass&&user.value==="admin"&&pass.value==="admin123"){
$("#adminLogin").style.display="none";$("#adminDashboard").style.display="block";
showToast("مرحباً بك في لوحة التحكم");
}else showToast("بيانات الدخول غير صحيحة");
});

// AI Chat
var chatInput=$("#chatInput"),chatSend=$("#chatSend"),chatMessages=$("#chatMessages");
var responses={
"الأنشطة":"تقدم الأسرة أكثر من 50 نشاط سنوياً تشملWORKSHOPS والمؤتمرات والحملات التطوعية. تصفح تبويب الأنشطة للاطلاع على الجدول الكامل.",
"كيف أسجل":"يمكنك التسجيل من خلال تبويب الأنشطة ثم قسم الانضمام. املأ استمارة التسجيل وستتلقى تأكيداً على بريدك الإلكتروني.",
"الأماكن":"تُقام الفعاليات في قاعات الجامعة المختلفة وقاعة المؤتمرات الكبرى والمقر الرئيسي للأسرة. تجد الخريطة التفاعلية في تبويب الأدوات.",
"اللجان":"لدينا 6 لجان: الأنشطة، التطوع، البحث العلمي، الإعلام، العلاقات العامة، والرياضة. كل لجنة لها اختصاصاتها ومسؤولياتها.",
"الشهادات":"تحصل على شهادات معتمدة عند إتمام الأنشطة والتطوع. يمكنك استخراج شهادتك من صفحة حسابك الشخصي.",
"الأسئلة الشائعة":"1- كيف أسجل؟ من تبويب الأنشطة\n2- كيف أحصل على شهادة؟ من حسابي الشخصي\n3- ما هي اللجان؟ 6 لجان متنوعة\n4- كيف أسجل نشاطاً؟ بضغطة زر في الأنشطة القادمة"
};
function sendChat(){
if(!chatInput||!chatMessages)return;
var q=chatInput.value.trim();if(!q)return;
chatMessages.innerHTML+='<div class="chat-msg user"><div class="msg-avatar"><i class="fas fa-user"></i></div><div class="msg-bubble">'+q+'</div></div>';
chatInput.value="";
var typing=document.createElement("div");typing.className="typing-dots";typing.innerHTML="<span></span><span></span><span></span>";
chatMessages.appendChild(typing);chatMessages.scrollTop=chatMessages.scrollHeight;
setTimeout(function(){
chatMessages.removeChild(typing);
var answer="أعتذر، لم أفهم سؤالك. جرّب: الأنشطة، التسجيل، الأماكن، اللجان، الشهادات، أو الأسئلة الشائعة.";
var key=Object.keys(responses).find(function(k){return q.indexOf(k)!==-1});
if(key)answer=responses[key];
chatMessages.innerHTML+='<div class="chat-msg assistant"><div class="msg-avatar"><i class="fas fa-robot"></i></div><div class="msg-bubble">'+answer+'</div></div>';
chatMessages.scrollTop=chatMessages.scrollHeight;
},1000);
}
if(chatSend)chatSend.addEventListener("click",sendChat);
if(chatInput)chatInput.addEventListener("keypress",function(e){if(e.key==="Enter")sendChat()});

$$(".suggestion-chip").forEach(function(chip){
chip.addEventListener("click",function(){
if(chatInput)chatInput.value=chip.dataset.q||chip.textContent;
sendChat();
});
});

});
