import{f as d,p as v,A as w,v as b}from"./index-Oju6MyWw.js";import{l as $,a as j}from"./time-04v1407Q.js";import{g as k}from"./Editable-CKgoCM7P.js";import"./maplibre-wOE1cd-g.js";const a=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),f=e=>{const s=e.trim();return/^(https?:|mailto:|tel:)/i.test(s)?a(s):"#"};function g(e){const s=e.replace(/\r\n?/g,`
`).trim();if(!s)return"";const i=l=>{let t=a(l);return t=t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,(c,m,p)=>`<a href="${f(p)}">${m}</a>`),t=t.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g,(c,m,p)=>`${m}<a href="${f(p)}">${p.replace(/^https?:\/\/(www\.)?/,"")}</a>`),t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),t=t.replace(/(^|[^*])\*([^*\n]+)\*/g,"$1<em>$2</em>"),t=t.replace(/`([^`]+)`/g,"<code>$1</code>"),t},n=[];let r=null;const o=()=>{r&&(n.push(`<ul>${r.map(l=>`<li>${i(l)}</li>`).join("")}</ul>`),r=null)};for(const l of s.split(/\n{2,}/)){const t=l.split(`
`);t.every(c=>/^\s*[-*+]\s+/.test(c))?(r=t.map(c=>c.replace(/^\s*[-*+]\s+/,"")),o()):(o(),n.push(`<p>${t.map(i).join("<br>")}</p>`))}return o(),n.join("")}const u=(e,s)=>{const i=k(e);return i?`<a href="${f(i)}">${a(s)}</a>`:a(s)},h=e=>{const s=e.filter(([,i])=>i&&i.trim());return s.length?`<dl>${s.map(([i,n])=>`<dt>${a(i)}</dt><dd>${a(n.trim())}</dd>`).join("")}</dl>`:""},x={flight:"Flight",train:"Train",bus:"Bus",ferry:"Ferry",car:"Car",taxi:"Taxi",subway:"Subway",walk:"Walk"};function z(e){const{config:s,meta:i,media:n}=e,r=i.title||s.branding||"Trip",o=s.tagline||(i.start&&i.end?`${d(i.start,s.locale,{day:"numeric",month:"long",year:"numeric"})} – ${d(i.end,s.locale,{day:"numeric",month:"long",year:"numeric"})}`:"");return`<header class="cover">
    ${n.cover?.dataUrl?`<img class="cover-photo" src="${a(n.cover.dataUrl)}" alt="">`:""}
    <h1>${a(r)}</h1>
    ${o?`<p class="cover-dates">${a(o)}</p>`:""}
    ${s.travellers?`<p class="cover-travellers">${a(s.travellers)} travelling</p>`:""}
  </header>`}function B(e,s,i){const n=e.journeyId?s.journeys.find(t=>t.id===e.journeyId):void 0,r=d(e.date,i,{weekday:"long",day:"numeric",month:"long"}),o=[];if(o.push(`<h4>${a(r)}${e.title?` — ${a(e.title)}`:""}</h4>`),n){const t=n.segments[0],c=n.segments.at(-1),m=b({depart:t?.depart,arrive:c?.arrive??c?.depart,fromTz:t?.fromTz,toTz:c?.toTz},n.date,i),p=Math.max(0,n.segments.length-1);o.push(`<p class="day-journey"><a href="#journey-${a(n.id)}">${a(n.label)}</a>${m?` · ${a(m)}`:""}${p?` · ${a(v(p,"change"))}`:""}</p>`)}e.plan?.length&&o.push(`<ul class="day-plan">${e.plan.filter(t=>t.trim()).map(t=>`<li>${a(t)}</li>`).join("")}</ul>`),e.notes?.trim()&&o.push(`<div class="note">${g(e.notes)}</div>`),e.dayTrip&&(e.getThere||e.getBack||e.lastTrainBack||e.toDo?.length)&&(o.push(h([["Getting there",e.getThere],["Getting back",e.getBack],["Last way back",e.lastTrainBack]])),e.toDo?.length&&o.push(`<ul class="day-plan">${e.toDo.filter(t=>t.trim()).map(t=>`<li>${a(t)}</li>`).join("")}</ul>`));const l=(e.places??[]).filter(t=>t.label.trim());return l.length&&o.push(`<ul class="day-places">${l.map(t=>`<li>${u(t.url||(t.placeId?t.label:void 0),t.label)}</li>`).join("")}</ul>`),`<div class="day">${o.filter(Boolean).join(`
`)}</div>`}function T(e){if(!e.legs.length)return"";const s=e.config.locale;return`<section class="group"><h2>Itinerary</h2>${e.legs.map(n=>{const r=e.days.filter(t=>t.legId===n.id).sort((t,c)=>t.date.localeCompare(c.date)),o=Math.max(0,Math.round((+new Date(n.end)-+new Date(n.start))/864e5)),l=n.start&&n.end?`${d(n.start,s,{day:"numeric",month:"short"})} – ${d(n.end,s,{day:"numeric",month:"short"})} · ${v(o,"night")}`:"";return`<section class="leg">
      <h3>${a(n.base)}${n.nameJp?` <span class="jp">${a(n.nameJp)}</span>`:""}</h3>
      ${l?`<p class="leg-range">${a(l)}</p>`:""}
      ${n.blurb?.trim()?`<div class="note">${g(n.blurb)}</div>`:""}
      ${r.map(t=>B(t,e,s)).join(`
`)||'<p class="empty">No days yet.</p>'}
    </section>`}).join(`
`)}</section>`}function M(e,s,i,n,r){const o=b(e,n,r),l=[x[e.mode]??e.mode,e.carrier,e.service].filter(Boolean).map(m=>a(m)).join(" · "),t=h([["Platform",e.mode==="flight"?void 0:e.platform],["Seat",e.seat],["Fare",e.fare],["Booking ref",i.includePrivate?e.bookingRef:void 0],["Note",e.note]]);let c="";if(s&&e.arrive&&s.depart){const m=$(s.depart)-$(e.arrive),p=m<0,y=p?m+1440:m;c=`<p class="change">${a(j(y))} to change${e.to?` at ${a(e.to)}`:""}${p?" — overnight":""}</p>`}return`<div class="segment">
    <p class="seg-head"><strong>${a(e.from||"—")}</strong> → <strong>${a(e.to||"—")}</strong>${o?` <span class="seg-times">${a(o)}</span>`:""}</p>
    ${l?`<p class="seg-meta">${l}</p>`:""}
    ${t}
  </div>${c}`}function S(e,s){if(!e.journeys.length)return"";const i=e.config.locale;return`<section class="group"><h2>Getting around</h2>${[...e.journeys].sort((o,l)=>(o.date??"").localeCompare(l.date??"")).map(o=>{const l=o.date?d(o.date,i,{weekday:"long",day:"numeric",month:"long"}):"",t=o.gmapsDirections?`<p class="seg-meta"><a href="${f(o.gmapsDirections)}">Directions in Google Maps</a></p>`:"";return`<section class="journey" id="journey-${a(o.id)}">
      <h3>${a(o.label)}</h3>
      ${l?`<p class="leg-range">${a(l)}</p>`:""}
      ${o.segments.map((c,m)=>M(c,o.segments[m+1],s,o.date,i)).join(`
`)||'<p class="empty">No legs yet.</p>'}
      ${t}
      ${o.notes?.trim()?`<div class="note">${g(o.notes)}</div>`:""}
    </section>`}).join(`
`)}</section>`}function P(e,s){if(!e.hotels.length)return"";const i=e.config.locale;return`<section class="group"><h2>Stays</h2>${e.hotels.map(r=>{const o=e.legs.find(c=>c.hotelId===r.id),l=o&&o.start&&o.end?`${d(o.start,i,{day:"numeric",month:"short"})} – ${d(o.end,i,{day:"numeric",month:"short"})}`:"",t=k(r.mapUrl||r.address);return`<section class="stay">
      <h3>${a(r.name)}${r.nameJp?` <span class="jp">${a(r.nameJp)}</span>`:""}</h3>
      ${l?`<p class="leg-range">${a(l)}</p>`:""}
      ${r.address?`<p class="stay-address">${a(r.address)}</p>`:""}
      ${r.addressJp?`<p class="stay-address jp">${a(r.addressJp)}</p>`:""}
      ${t?`<p class="seg-meta"><a href="${f(t)}">Open in Google Maps</a></p>`:""}
      ${h([["Check-in",r.checkIn],["Check-out",r.checkOut],["Wifi",s.includePrivate?r.wifi:void 0],["Door code",s.includePrivate?r.doorCode:void 0],["Phone",s.includePrivate?r.phone:void 0],["Booking ref",s.includePrivate?r.reservationRef:void 0],["Website",r.url]])}
      ${r.directions?.trim()?`<div class="note"><p class="label">Getting here</p>${g(r.directions)}</div>`:""}
      ${r.notes?.trim()?`<div class="note">${g(r.notes)}</div>`:""}
    </section>`}).join(`
`)}</section>`}function D(e){if(!e.places.length)return"";const s=t=>{const c=[t.category,t.note].filter(Boolean).map(m=>a(m.trim())).join(" — ");return`<li>${u(t.url||t.name,t.name)}${c?` <span class="place-meta">${c}</span>`:""}</li>`},i=new Map(e.places.map(t=>[t.id,t])),n=e.areas.map(t=>({name:t.name||"Untitled area",items:t.placeIds.map(c=>i.get(c)).filter(Boolean)})).filter(t=>t.items.length).sort((t,c)=>t.name.localeCompare(c.name)),r=new Set(e.areas.flatMap(t=>t.placeIds)),o=e.places.filter(t=>!r.has(t.id));return o.length&&n.push({name:n.length?"Other places":"Places",items:o}),`<section class="group"><h2>Places</h2>${n.map(t=>`<div class="place-group">
    <h3>${a(t.name)}</h3>
    <ul class="places">${[...t.items].sort((c,m)=>c.name.localeCompare(m.name)).map(s).join("")}</ul>
  </div>`).join(`
`)}</section>`}function L(e,s){const i=[];e.luggage.length&&i.push(`<div class="lb-block"><h3>Luggage</h3>${e.luggage.map(n=>`
      <div class="lb-item">
        <p class="label">${a(n.title)}${n.date?` · ${a(d(n.date,e.config.locale,{day:"numeric",month:"short"}))}`:""}</p>
        ${n.detail?.trim()?`<div class="note">${g(n.detail)}</div>`:""}
        ${n.url?`<p class="seg-meta">${u(n.url,"Map link")}</p>`:""}
      </div>`).join("")}</div>`);for(const n of e.config.lists??[])n.items.length&&i.push(`<div class="lb-block"><h3>${a(n.title||"List")}</h3><ul class="places">${n.items.map(r=>{const o=r.note?` <span class="place-meta">${a(r.note.trim())}</span>`:"";return`<li>${r.url?u(r.url,r.label||"—"):a(r.label||"—")}${o}</li>`}).join("")}</ul></div>`);if(e.packing.length){const n=new Map;for(const o of e.packing){const l=n.get(o.group)??[];l.push(o),n.set(o.group,l)}const r=[...n].map(([o,l])=>`<div class="pack-group">
      <p class="label">${a(o)}</p>
      <ul class="checklist">${l.map(t=>`<li>${t.done?"☑":"☐"} ${a(t.label)}</li>`).join("")}</ul>
    </div>`);i.push(`<div class="lb-block"><h3>Packing</h3>${r.join("")}</div>`)}return s.includePrivate&&e.docs.length&&i.push(`<div class="lb-block"><h3>Documents</h3>${e.docs.map(n=>`
      <div class="lb-item">
        <p class="label">${a(n.title)}</p>
        ${h(n.fields.map(r=>[r.label,r.value]))}
        ${n.note?.trim()?`<div class="note">${g(n.note)}</div>`:""}
      </div>`).join("")}</div>`),e.scratch?.trim()&&i.push(`<div class="lb-block"><h3>Notes</h3><div class="note">${g(e.scratch)}</div></div>`),i.length?`<section class="group"><h2>Logbook</h2>${i.join(`
`)}</section>`:""}function I(e){const s=e.config.theme.light,i=(n,r)=>s[n]||r;return`
  :root {
    --bg: ${i("bg","#f7f7f4")};
    --surface: ${i("surface","#ffffff")};
    --ink: ${i("ink","#1c1c1c")};
    --ink-soft: ${i("ink-soft","#4a4a4a")};
    --ink-faint: ${i("ink-faint","#8a8a8a")};
    --line: ${i("line","#e0e0da")};
    --accent: ${i("accent","#5f7f9c")};
  }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .jp { font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif; color: var(--ink-faint); font-weight: normal; }
  main { max-width: 44rem; margin: 0 auto; padding: 2.5rem 1.5rem 4rem; }
  h1, h2, h3, h4 { font-family: Georgia, "Times New Roman", serif; font-weight: 600; line-height: 1.25; color: var(--ink); }
  h1 { font-size: 2.1rem; margin: 0 0 .3rem; }
  h2 { font-size: 1.5rem; margin: 3rem 0 1rem; padding-bottom: .4rem; border-bottom: 2px solid var(--ink); }
  h3 { font-size: 1.2rem; margin: 1.8rem 0 .4rem; }
  h4 { font-size: 1rem; margin: 1.2rem 0 .3rem; }
  p { margin: .4rem 0; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  ul { margin: .4rem 0; padding-left: 1.2rem; }
  li { margin: .15rem 0; }
  code { background: var(--surface); border: 1px solid var(--line); border-radius: 3px; padding: 0 .25em; font-size: .9em; }
  .cover { text-align: center; margin-bottom: 1rem; }
  .cover-photo { width: 100%; max-height: 20rem; object-fit: cover; border-radius: 4px; margin-bottom: 1.4rem; }
  .cover-dates { font-size: 1.05rem; color: var(--ink-soft); }
  .cover-travellers { color: var(--ink-faint); font-size: .95rem; }
  .leg, .journey, .stay { margin-bottom: 1.4rem; }
  .leg-range, .seg-meta, .day-journey { color: var(--ink-soft); font-size: .9rem; }
  .leg-range { margin-top: 0; }
  .day { margin: .8rem 0 .8rem; padding-left: .9rem; border-left: 2px solid var(--line); }
  .day-plan, .day-places { margin: .3rem 0; }
  .day-places { list-style: none; padding-left: 0; }
  .day-places li::before { content: "→ "; color: var(--ink-faint); }
  .note { color: var(--ink-soft); font-size: .95rem; margin: .4rem 0; }
  .note p:first-child { margin-top: 0; }
  .note .label, .lb-item .label, .pack-group .label { font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 600; font-size: .75rem; text-transform: uppercase; letter-spacing: .06em; color: var(--ink-faint); margin-bottom: .1rem; }
  dl { margin: .4rem 0; display: grid; grid-template-columns: max-content 1fr; gap: .1rem .8rem; font-size: .9rem; }
  dt { color: var(--ink-faint); }
  dd { margin: 0; }
  .segment { margin: .6rem 0; }
  .seg-head { margin: .2rem 0; }
  .seg-times { color: var(--ink-soft); font-weight: normal; white-space: nowrap; }
  .change { color: var(--ink-faint); font-size: .85rem; margin: .2rem 0 .6rem .9rem; padding-left: .6rem; border-left: 2px dashed var(--line); }
  .stay-address { font-weight: 600; }
  .place-group, .lb-block { margin-bottom: 1.2rem; }
  .places { list-style: none; padding-left: 0; }
  .places li { padding: .2rem 0; border-bottom: 1px solid var(--line); }
  .place-meta { color: var(--ink-faint); font-size: .85rem; }
  .checklist { list-style: none; padding-left: 0; }
  .lb-item { margin: .6rem 0; }
  .empty { color: var(--ink-faint); font-style: italic; }
  footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--line); color: var(--ink-faint); font-size: .8rem; text-align: center; }
  @media print {
    body { background: #fff; }
    main { max-width: none; padding: 0; }
    a { color: inherit; }
    h2 { break-before: page; }
    .cover + * h2, h2:first-of-type { break-before: auto; }
    .leg, .journey, .stay, .day, .segment, .place-group, .lb-block { break-inside: avoid; }
  }`}function G(e,s){const i=e.meta.title||e.config.branding||"Trip",n=new Date().toLocaleDateString(e.config.locale||"en-GB",{day:"numeric",month:"long",year:"numeric"}),r=[z(e),T(e),S(e,s),P(e,s),D(e),L(e,s),`<footer>${a(i)} · exported ${a(n)} · made with ${a(w)}${s.includePrivate?" · includes private details":""}</footer>`].filter(Boolean).join(`
`);return`<!doctype html>
<html lang="${a(e.config.locale?.split("-")[0]||"en")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${a(i)}</title>
<style>${I(e)}</style>
</head>
<body>
<main>
${r}
</main>
</body>
</html>`}const C=e=>e.trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").slice(0,60)||"trip";function A(e,s){const i=G(e,s),n=new Blob([i],{type:"text/html;charset=utf-8"}),r=URL.createObjectURL(n),o=document.createElement("a");o.href=r,o.download=`${C(e.meta.title||e.config.branding||"trip")}.html`,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}export{G as buildTripHtml,A as downloadTripHtml};
