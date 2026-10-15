import {describe,it,expect} from 'vitest';
import {routeMotion,projectRoute} from '../src/game/route-motion';
const route=[[0,0],[0,1],[1,1]];
describe('motion along route geometry',()=>{
 it('follows the corner rather than the direct station chord',()=>{const p=routeMotion(route,[0,0],[1,1]).at(.5);expect(p[0]).toBe(0);expect(p[1]).toBeGreaterThan(.5);});
 it('supports backwards movement and clamps endpoints',()=>{const p=routeMotion(route,[1,1],[0,0]);expect(p.at(0)).toEqual([1,1]);expect(p.at(1)).toEqual([0,0]);expect(p.at(2)).toEqual([0,0]);});
 it('resumes from an interrupted position on the route',()=>{const p=routeMotion(route,[0,.4],[1,1]);expect(p.at(0)).toEqual([0,.4]);expect(p.at(1)).toEqual([1,1]);});
 it('snaps station coordinates onto a segment instead of the nearest vertex',()=>{expect(projectRoute(route,[.1,.4]).point).toEqual([0,.4]);});
 it('handles duplicate vertices and zero-distance movement',()=>{const p=routeMotion([[0,0],[0,0],[0,1]],[0,.5],[0,.5]);expect(p.at(.5)).toEqual([0,.5]);});
});
