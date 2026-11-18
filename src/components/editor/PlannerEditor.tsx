import { CalendarDays } from 'lucide-react';
import type { PlannerBlock } from '@/types/book';
import { field } from './BlockEditor';

const MONTHS = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];

/** Penyunting Planner: bulan, senarai tugasan & catatan. Kalendar, cuti & aktiviti diisi automatik daripada Takwim Induk. */
export function PlannerEditor({ block, onChange }: { block: PlannerBlock; onChange: (b: PlannerBlock) => void }) {
  return (
    <div className="grid gap-3 text-sm">
      <p className="flex items-start gap-2 rounded-md bg-[#FBF6E6] p-2.5 text-xs text-muted">
        <CalendarDays size={16} className="mt-0.5 shrink-0 text-[#A07A1F]" />
        Kalendar, hari cuti (kelepasan am, perayaan KPM, cuti persekolahan) dan aktiviti setiap unit dimuatkan secara automatik daripada Takwim Induk bulan ini. Kemas kini hari cuti / aktiviti di Takwim Induk atau Takwim Tahunan Unit.
      </p>
      <label className="grid gap-1 font-medium">Bulan
        <select className={field} value={block.month} onChange={(e) => onChange({ ...block, month: Number(e.target.value) })}>
          {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
      </label>
      <label className="grid gap-1 font-medium">Senarai tugasan <span className="text-xs font-normal text-muted">(satu baris satu tugasan; baris kosong dicetak untuk ditulis tangan)</span>
        <textarea data-f="todo" className={`${field} min-h-[110px]`} value={(block.todo ?? []).join('\n')} onChange={(e) => onChange({ ...block, todo: e.target.value.split('\n') })} placeholder={'Hantar RPH minggu 1\nSemak buku latihan 4 Bestari'} />
      </label>
      <label className="grid gap-1 font-medium">Catatan
        <textarea data-f="notes" className={`${field} min-h-[80px]`} value={block.notes ?? ''} onChange={(e) => onChange({ ...block, notes: e.target.value })} />
      </label>
    </div>
  );
}
