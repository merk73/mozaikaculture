// Fractal accumulation adapted from shader-effects-inc/shaders (MIT).
// See SOURCE.md and LICENSE.txt. WebGL value noise replaces the WebGPU simplex base.
const vertex = `attribute vec2 position; varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision mediump float;
varying vec2 uv; uniform vec2 resolution; uniform vec2 pointer; uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y)*2.-1.;}
float fractal(vec2 p){float sum=0.,total=0.,weight=.5,freq=2.;
for(int i=0;i<4;i++){float angle=float(i)*2.39996323;
vec2 drift=vec2(cos(angle),sin(angle))*time;
sum+=noise(p*freq+drift+vec2(4.7,3.29))*weight;
total+=weight;freq*=1.9;weight*=.5;}return clamp(sum/total*.5+.5,0.,1.);}
void main(){vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.);
p+=pointer*.045;
float field=fractal(p+vec2(fractal(p+vec2(1.3)),fractal(p-vec2(.9)))*.3);
float wisp=smoothstep(.38,.75,field);
float edge=smoothstep(0.,.17,uv.y)*(1.-smoothstep(.83,1.,uv.y));
float band=exp(-pow((uv.y-.42)*2.1,2.));
float side=smoothstep(.08,.58,uv.x);
float alpha=wisp*edge*band*side*.26;
gl_FragColor=vec4(.89,.025,.055,alpha);}`;

export function mountCulturalLight(hero) {
  const canvas = document.createElement('canvas');
  canvas.className = 'cultural-light'; canvas.setAttribute('aria-hidden','true');
  const gl = canvas.getContext('webgl', {alpha:true, antialias:false, depth:false, stencil:false, premultipliedAlpha:false, powerPreference:'low-power'});
  if (!gl) return () => {};
  const shaders=[];
  let program, buffer, frame=0, active=false, disposed=false, last=0, clock=0;
  let pointer=[0,0], target=[0,0];
  function compile(type,source) {
    const shader=gl.createShader(type); shaders.push(shader);
    gl.shaderSource(shader,source); gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw Error('Shader unavailable');
    return shader;
  }
  try {
    program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw Error('Shader unavailable');
    gl.useProgram(program);
    buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'position');
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  } catch { disposeResources(); return () => {}; }
  const uniforms=Object.fromEntries(['time','pointer','resolution'].map(name=>[name,gl.getUniformLocation(program,name)]));
  hero.prepend(canvas);
  function resize() {
    const rect=hero.getBoundingClientRect(), ratio=Math.min(1,960/Math.max(1,rect.width),600/Math.max(1,rect.height));
    canvas.width=Math.max(1,Math.round(rect.width*ratio)); canvas.height=Math.max(1,Math.round(rect.height*ratio));
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);
  }
  function tick(now) {
    frame=0;
    if(!active || document.hidden || disposed) return;
    if(!last || now-last>=32) {
      clock+=last?Math.min(now-last,70)*.000018:0; last=now;
      pointer=pointer.map((value,i)=>value+(target[i]-value)*.07);
      gl.uniform1f(uniforms.time,clock); gl.uniform2f(uniforms.pointer,...pointer);
      gl.drawArrays(gl.TRIANGLES,0,6);
      canvas.dataset.state='running';
    }
    frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame=0; last=0;
    if(active && !document.hidden && !disposed) frame=requestAnimationFrame(tick);
    else canvas.dataset.state='paused';
  }
  const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;sync();});
  observer.observe(hero);
  const sizeObserver=new ResizeObserver(resize); sizeObserver.observe(hero); resize();
  const move=event=>{const rect=hero.getBoundingClientRect();target=[(event.clientX-rect.left)/rect.width-.5,.5-(event.clientY-rect.top)/rect.height];};
  const leave=()=>{target=[0,0];};
  hero.addEventListener('pointermove',move,{passive:true}); hero.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',sync);
  canvas.addEventListener('webglcontextlost',dispose,{once:true});
  function disposeResources() {
    if(buffer) gl.deleteBuffer(buffer);
    if(program) gl.deleteProgram(program);
    shaders.forEach(shader=>gl.deleteShader(shader));
  }
  function dispose() {
    if(disposed) return; disposed=true; cancelAnimationFrame(frame);
    observer.disconnect(); sizeObserver.disconnect();
    hero.removeEventListener('pointermove',move); hero.removeEventListener('pointerleave',leave);
    document.removeEventListener('visibilitychange',sync);
    disposeResources(); canvas.remove();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
  return dispose;
}
