// Orthographic voxels: small, deterministic SVG geometry, without a 3D runtime.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const palettes = { light: ['#e3e6e7','#cbd0d4','#abb4be'], medium: ['#b9c2ca','#8795a3','#65778b'], dark: ['#697c93','#42566e','#2e4158'] };
  function polygon(points, fill) {
    const p = document.createElementNS(NS, 'polygon');
    p.setAttribute('points', points.map(v => v.join(',')).join(' '));
    p.setAttribute('fill', fill); p.setAttribute('stroke', '#fafaf8'); p.setAttribute('stroke-width', '.65');
    return p;
  }
  function draw(svg, blocks, scale, origin) {
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
  draw(document.querySelector('#voxel-world'),hero,23,[203,132]);
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
