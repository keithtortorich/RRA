import {readFileSync} from "node:fs";
import {JSDOM,VirtualConsole} from "jsdom";
import assert from "node:assert/strict";
let passed=0,failed=0;
function test(name,fn){try{fn();passed++;console.log("ok -",name)}catch(e){failed++;console.error("FAIL -",name,e.message)}}
function fresh(){
 const html=readFileSync(new URL("../docs/index.html",import.meta.url),"utf8");
 const unwrapped=html.replace('(function(){\n"use strict";\n',"").replace(/\n\}\)\(\);\n<\/script>/,"\n</script>");
 return new JSDOM(unwrapped,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://example.test/"});
}
{
 const d=fresh(),w=d.window,doc=w.document;
 test("RRA branding",()=>{assert.match(doc.title,/RRA/);assert.doesNotMatch(doc.body.innerHTML,/NETBUILD\.PRO|Sizzle/)});
 test("five active slots preserved",()=>assert.equal(w.eval("MAX_SLOTS"),5));
 test("campaign is 25 targets",()=>assert.equal(w.eval("campaignStats().targetTotal"),25));
 test("quality model preserved",()=>assert.deepEqual(Array.from(doc.getElementById("cQuality").options).map(x=>x.textContent),["KNOWN","ESTIMATED","BENCHMARK"]));
 test("modeled leak never becomes documented revenue",()=>{w.eval("STATE.prospects[0].evidence=[{id:'e',issue:'Leak',leakId:'HVAC-LEAK-001',quality:'ESTIMATED',impact:9000,priority:1}];STATE.prospects[0].topLeakId='e'");assert.equal(w.eval("sprintRecord(STATE.prospects[0]).documentedRecoveredRevenue"),0)});
 test("WON is not PAID",()=>{w.eval("STATE.prospects[0].outcome='WON';STATE.prospects[0].wonDetails={tier:'good',amount:997}");assert.equal(w.eval("preSeedMetrics().paidSprints"),0)});
 test("explicit PAID counts as paid Sprint",()=>{w.eval("sprintRecord(STATE.prospects[0]).paymentStatus='PAID'");assert.equal(w.eval("preSeedMetrics().paidSprints"),1)});
 test("CAC unknown when spend unknown",()=>{w.eval("STATE.settings.acquisitionSpend=null");assert.equal(w.eval("preSeedMetrics().cac"),null)});
 test("profit excludes founder hours",()=>assert.equal(w.eval("sprintProfit({amount:997,directDeliveryCost:150,deliveryHours:99})"),847));
 test("ROI hidden without documented recovery",()=>assert.doesNotMatch(w.eval("buildProofRecord(STATE.prospects[0])"),/Customer ROI:/));
 test("customer ROI uses Sprint price only",()=>{w.eval("var q=sprintRecord(STATE.prospects[0]);q.amount=997;q.directDeliveryCost=100;q.documentedRecoveredRevenue=3000");const t=w.eval("buildProofRecord(STATE.prospects[0])");assert.match(t,/Customer ROI: 201%/);assert.doesNotMatch(t,/173%/)});
}
{
 const errors=[],html=readFileSync(new URL("../docs/index.html",import.meta.url),"utf8"),vc=new VirtualConsole();vc.on("jsdomError",e=>errors.push(e.message));
 const d=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"https://example.test/",virtualConsole:vc});
 test("shipped app boots without jsdom runtime errors",()=>assert.deepEqual(errors,[]));
 test("pre-seed scoreboard renders five metrics",()=>assert.equal(d.window.document.querySelectorAll("#preSeedStats .stat").length,5));
}
console.log("\n"+passed+" passed, "+failed+" failed");process.exit(failed?1:0);
