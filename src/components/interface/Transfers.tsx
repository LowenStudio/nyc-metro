import { transfersAt } from '../../data/transfers';
import type { Station } from '../../data/stations';
export default function Transfers({station,serviceId}:{station:Station;serviceId:string}) {
 const routes=transfersAt(station,serviceId);
 return <div className="station-transfers" aria-label={`Transfers at ${station.name}`} aria-live="polite">
  {routes.length>0&&<><span className="transfer-label">transfer</span><span className="transfer-routes">{routes.map(s=><span key={s.id} className="transfer-bullet" style={{backgroundColor:s.color,color:s.textColor??'#fff'}} title={`${s.name} · regular daytime service`} aria-label={`${s.bullet??s.id}: ${s.name}`}>{s.bullet??s.id}{s.bullet==='S'&&<small>{s.id==='GS'?'42':s.id==='FS'?'F':'R'}</small>}</span>)}</span></>}
 </div>;
}
