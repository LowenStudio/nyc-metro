import { describe,it,expect } from 'vitest';
import { transfersAt,otherRoutes } from './transfers';
import { services } from './services';
const stop=(name:string)=>services[0].stations.find(s=>s.name===name)!;
describe('station complex transfers',()=>{
 it('includes connected platforms at Times Square, including the shuttle',()=>{const ids=transfersAt(stop('Times Sq–42 St'),'1').map(s=>s.id);expect(ids).toEqual(expect.arrayContaining(['2','3','7','A','C','E','N','Q','R','W','GS']));expect(ids).not.toContain('1');});
 it('does not connect separate 23 St stations by their name',()=>{expect(transfersAt(stop('23 St'),'1').map(s=>s.id)).not.toContain('6');});
 it('shows no connections at the northern terminus',()=>{expect(transfersAt(services[0].stations[0],'1')).toEqual([]);});
 it('renders each other regular service exactly once with its official colour',()=>{for(const selected of services){const data=otherRoutes(selected.id);expect(data.features).toHaveLength(24);expect(data.features.some(f=>f.properties.id===selected.id)).toBe(false);for(const f of data.features){expect(f.properties.color).toBe(services.find(s=>s.id===f.properties.id)!.color);}}});
});
