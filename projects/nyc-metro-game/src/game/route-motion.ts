export type Point = [number,number];
const scale=Math.cos(40.75*Math.PI/180);
const distance=(a:number[],b:number[])=>Math.hypot((a[0]-b[0])*scale,a[1]-b[1]);
/** Project onto the actual polyline, including between its recorded vertices. */
export function projectRoute(points:number[][], point:Point) {
 let best=Infinity, along=0, travelled=0, projected:Point=[points[0][0],points[0][1]];
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],dx=(b[0]-a[0])*scale,dy=b[1]-a[1],length=distance(a,b);
  const t=length?Math.max(0,Math.min(1,(((point[0]-a[0])*scale)*dx+(point[1]-a[1])*dy)/(length*length))):0;
  const candidate:Point=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  const d=distance(point,candidate);if(d<best){best=d;along=travelled+t*length;projected=candidate;}travelled+=length;
 }
 return {point:projected,along};
}
export function routeMotion(points:number[][], from:Point, to:Point) {
 const start=projectRoute(points,from),end=projectRoute(points,to);
 const path:Point[]=[start.point];let travelled=0;
 const vertices:{point:Point;along:number}[]=[];
 for(let i=1;i<points.length;i++){travelled+=distance(points[i-1],points[i]);if(travelled>Math.min(start.along,end.along)&&travelled<Math.max(start.along,end.along))vertices.push({point:[points[i][0],points[i][1]],along:travelled});}
 if(end.along<start.along)vertices.reverse();path.push(...vertices.map(v=>v.point),end.point);
 const lengths=[0];for(let i=1;i<path.length;i++)lengths.push(lengths[i-1]+distance(path[i-1],path[i]));
 const total=lengths.at(-1)!;
 return {distance:total,at(progress:number):Point{
  const d=Math.max(0,Math.min(1,progress))*total;
  for(let i=1;i<path.length;i++){if(d<=lengths[i]){const span=lengths[i]-lengths[i-1],t=span?(d-lengths[i-1])/span:1;return [path[i-1][0]+(path[i][0]-path[i-1][0])*t,path[i-1][1]+(path[i][1]-path[i-1][1])*t];}}
  return end.point;
 }};
}
