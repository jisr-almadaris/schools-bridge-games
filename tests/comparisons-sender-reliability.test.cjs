const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const globalNodeModules=execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim();
const ts=require(require.resolve('typescript',{paths:[path.resolve(__dirname,'../game-comarisons'), globalNodeModules]}));
const source=fs.readFileSync('game-comarisons/src/bridge.ts','utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText;

const settle=()=>new Promise(resolve=>setImmediate(resolve));
function setup(){
  const items=new Map();
  const local={getItem:k=>items.get(k)||null,setItem:(k,v)=>items.set(k,String(v)),removeItem:k=>items.delete(k),key:i=>Array.from(items.keys())[i]||null,get length(){return items.size}};
  const timers=[];
  const listeners={};
  const messages=[];
  const opener={closed:false,postMessage:(body,origin)=>messages.push({body,origin})};
  const ctx={
    exports:{},console:{log(){},info(){},warn(){}},
    Math,Date,URLSearchParams,JSON,
    location:{hash:'',origin:'https://jisr-almadaris.github.io'},
    opener,localStorage:local,sessionStorage:{getItem:k=>items.get(k)||null,setItem:(k,v)=>items.set(k,String(v))},
    crypto:{randomUUID:()=>`test-${Date.now()}-12345678`},
    setInterval:(fn,ms)=>{timers.push({fn,ms,stopped:false});return timers.length},
    clearInterval:(id)=>{if(timers[id-1])timers[id-1].stopped=true},
    setTimeout(){return 1},clearTimeout(){},
    addEventListener:(name,fn)=>{(listeners[name] ||= []).push(fn)},
    removeEventListener:(name,fn)=>{listeners[name]=(listeners[name]||[]).filter(x=>x!==fn)},
    document:{getElementById(){return null}}
  };
  ctx.window=ctx; ctx.parent=ctx;
  vm.runInNewContext(compiled,ctx,{filename:'bridge-transpiled.js'});
  const fire=(data)=>{for (const fn of listeners.message||[]) fn({origin:'https://jisr-almadaris.github.io',source:opener,data});};
  return {ctx, messages,timers,fire,storage:items};
}
test('sender retries the SAME event and removes it only on a trusted backend-saved acknowledgement',async()=>{
  const s=setup();
  const ready=s.ctx.exports.prepareBridgeSession();
  assert.equal(s.messages[0].body.type,'ready');
  s.fire({source:'schools-bridge-host',type:'identity',activityId:'game-comparisons',
    name:'سارة محمد خالد',school:'التاسعة والعشرون',visitor_id:'v-test-123'});
  await ready;
  s.ctx.exports.reportCompleted(2,8);
  const first=s.messages.find(x=>x.body.type==='completed').body;
  assert.ok(first.delivery_id);
  const key='jisr-comparisons-pending-v2::'+first.delivery_id;
  assert.equal(JSON.parse(s.storage.get(key)).packet.delivery_id,first.delivery_id);
  // Simulate a lost message: timer must replay the SAME delivery id.
  const t=s.timers.at(-1);
  t.fn();
  const events=s.messages.filter(x=>x.body.type==='completed');
  assert.equal(events.length,2);
  assert.equal(events[0].body.delivery_id,events[1].body.delivery_id);
  s.fire({source:'schools-bridge-host',type:'saved',activityId:'game-comparisons',delivery_id:first.delivery_id});
  assert.equal(s.storage.has(key),false);
  assert.equal(t.stopped,true);
});
