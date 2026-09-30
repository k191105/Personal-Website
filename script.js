// Orthographic voxels: small, deterministic SVG geometry, without a 3D runtime.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const palettes = { light: ['#dce8e2','#b9d0c5','#92b1a4'], medium: ['#a5c7b9','#79a695','#518875'], dark: ['#658f9e','#486f82','#335164'] };
  function polygon(points, fill) {
    const p = document.createElementNS(NS, 'polygon');
    p.setAttribute('points', points.map(v => v.join(',')).join(' '));
    p.setAttribute('fill', fill); p.setAttribute('stroke', 'var(--tint)'); p.setAttribute('stroke-width', '.65');
    return p;
  }
  function draw(svg, blocks, scale, origin) {
    if (!svg || !blocks) return;
    const project = (x,y,z) => [origin[0]+(x-y)*scale, origin[1]+(x+y)*scale*.5-z*scale*1.05];
    blocks.sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]) || a[2]-b[2]);
    for (const [x,y,z,tone='light'] of blocks) {
      const g=document.createElementNS(NS,'g'); g.setAttribute('class','voxel'+(tone==='dark'?' accent-voxel':''));
      const a=project(x,y,z+1),b=project(x+1,y,z+1),c=project(x+1,y+1,z+1),d=project(x,y+1,z+1),e=project(x+1,y,z),f=project(x+1,y+1,z),h=project(x,y+1,z);
      const colors=palettes[tone];
      g.append(polygon([d,c,f,h],colors[1]),polygon([c,b,e,f],colors[2]),polygon([a,b,c,d],colors[0])); svg.append(g);
    }
  }
  const hero=[];
  for(let x=0;x<7;x++)for(let y=0;y<7;y++){
    if((x===0&&y<2)||(x>4&&y===6)||(x===6&&y<2))continue;
    const height=Math.max(1,4-Math.floor((Math.abs(x-3)+Math.abs(y-3))/1.65));
    for(let z=0;z<height;z++)hero.push([x,y,z,(x===3&&y===3)||(x===4&&y===2&&z===height-1)?'dark':z>1?'medium':'light']);
  }
  hero.push([7,3,0,'light'],[2,8,0,'medium']);
  const world = document.querySelector('#voxel-world');
  let turns = 0;
  function renderWorld() {
    if (!world) return;
    world.replaceChildren();
    const rotated = hero.map(([x,y,z,tone]) => {
      for (let i=0;i<turns;i++) [x,y]=[8-y,x];
      return [x,y,z,tone];
    });
    draw(world,rotated,23,[203,112]);
    world.setAttribute('aria-label', 'An abstract landscape of grey, green and blue cubes, viewed at '+(turns*90)+' degrees');
  }
  renderWorld();
  const turnButton = document.querySelector('[data-world-turn]');
  if (turnButton && world) turnButton.hidden = false;
  turnButton?.addEventListener('click', () => { turns=(turns+1)%4; renderWorld(); });
  const scenes={logic:[],path:[],books:[],museum:[]};
  for(let x=0;x<4;x++)for(let y=0;y<4;y++)if((x+y)%2===0||x===1)scenes.logic.push([x,y,0,x===2?'dark':'light']);
  scenes.logic.push([1,1,1,'medium'],[1,1,2,'dark'],[3,3,1,'medium']);
  for(let x=0;x<5;x++)for(let y=0;y<4;y++)scenes.path.push([x,y,0,(y===2&&x<4)||(x===3&&y===1)?'medium':'light']);
  scenes.path.push([3,0,1,'dark'],[0,2,1,'dark'],[2,0,1,'light']);
  for(let x=0;x<4;x++)for(let y=0;y<2;y++)for(let z=0;z<[2,3,4,2][x];z++)scenes.books.push([x,y,z,x===2?'dark':x===1?'medium':'light']);
  for(let x=0;x<5;x++)for(let y=0;y<3;y++)scenes.museum.push([x,y,0,'light']);
  for(const x of [0,2,4])for(let z=1;z<3;z++)scenes.museum.push([x,1,z,'medium']);
  for(let x=0;x<5;x++)scenes.museum.push([x,1,3,'light']);
  document.querySelectorAll('[data-voxel]').forEach(svg=>draw(svg,scenes[svg.dataset.voxel],18,[119,90]));
})();

// A small, persistent reading preference shared by all pages.
(() => {
  const button = document.querySelector('[data-theme-toggle]');
  let theme = 'light';
  try { theme = localStorage.getItem('krishiv-theme') === 'dark' ? 'dark' : 'light'; } catch (_) {}
  function apply() {
    document.documentElement.dataset.theme = theme;
    if (button) {
      button.textContent = theme === 'dark' ? '☀' : '◐';
      button.setAttribute('aria-label', 'Switch to '+(theme === 'dark' ? 'light' : 'dark')+' theme');
      button.setAttribute('title', button.getAttribute('aria-label'));
    }
  }
  apply();
  if (button) button.hidden = false;
  button?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    apply();
    try { localStorage.setItem('krishiv-theme', theme); } catch (_) {}
  });
})();
