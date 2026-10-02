import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FieldValue, StaffField, Teacher } from '@/types/staff';
import { defaultFields, defaultTeachers } from '@/config/defaultStaff';
import { uid } from '@/lib/blocks';
import { F_NAME } from '@/types/staff';

interface StaffState {
  fields: StaffField[];
  teachers: Teacher[];
  /** Dinaikkan pada setiap perubahan - digunakan untuk mengukur semula halaman. */
  rev: number;
  addTeacher: (values?: Record<string, FieldValue>) => string;
  addTeachers: (rows: Record<string, FieldValue>[]) => void;
  updateTeacher: (id: string, patch: Partial<Omit<Teacher, 'id'>>) => void;
  setValue: (id: string, fieldId: string, value: FieldValue) => void;
  removeTeacher: (id: string) => void;
  addField: (field: Omit<StaffField, 'id'>) => void;
  updateField: (id: string, patch: Partial<Omit<StaffField, 'id' | 'locked'>>) => void;
  removeField: (id: string) => void;
  moveField: (id: string, dir: -1 | 1) => void;
  addOption: (fieldId: string, option: string) => void;
  renameOption: (fieldId: string, from: string, to: string) => void;
  removeOption: (fieldId: string, option: string) => void;
  replaceAll: (fields: StaffField[], teachers: Teacher[]) => void;
  reset: () => void;
}

const swap = <T,>(arr: T[], i: number, j: number) => {
  if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export const useStaffStore = create<StaffState>()(
  persist(
    (set) => {
      const bump = (fn: (s: StaffState) => Partial<StaffState>) => set((s) => ({ ...fn(s), rev: s.rev + 1 }));
      /** Pastikan nilai select/multi baharu wujud dalam pilihan medan. */
      const withOptions = (fields: StaffField[], values: Record<string, FieldValue>) =>
        fields.map((f) => {
          if (f.type !== 'select' && f.type !== 'multi') return f;
          const v = values[f.id];
          const vals = (Array.isArray(v) ? v : v ? [v] : []).filter((x) => x && !f.options.includes(x));
          return vals.length ? { ...f, options: [...f.options, ...vals] } : f;
        });

      return {
        fields: defaultFields(),
        teachers: defaultTeachers(),
        rev: 0,
        addTeacher: (values = {}) => {
          const id = uid();
          bump((s) => ({ teachers: [...s.teachers, { id, photo: '', values }], fields: withOptions(s.fields, values) }));
          return id;
        },
        // Tampal senarai: guru dengan nama sama dikemas kini, yang baharu ditambah.
        addTeachers: (rows) =>
          bump((s) => {
            let fields = s.fields;
            for (const r of rows) fields = withOptions(fields, r);
            const key = (v: unknown) => String(v ?? '').trim().toUpperCase();
            const teachers = [...s.teachers];
            for (const values of rows) {
              const i = teachers.findIndex((t) => key(t.values[F_NAME]) === key(values[F_NAME]));
              if (i >= 0) teachers[i] = { ...teachers[i], values: { ...teachers[i].values, ...values } };
              else teachers.push({ id: uid(), photo: '', values });
            }
            return { fields, teachers };
          }),
        updateTeacher: (id, patch) => bump((s) => ({ teachers: s.teachers.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
        setValue: (id, fieldId, value) =>
          bump((s) => ({ teachers: s.teachers.map((t) => (t.id === id ? { ...t, values: { ...t.values, [fieldId]: value } } : t)) })),
        removeTeacher: (id) => bump((s) => ({ teachers: s.teachers.filter((t) => t.id !== id) })),
        addField: (field) => bump((s) => ({ fields: [...s.fields, { ...field, id: uid() }] })),
        updateField: (id, patch) =>
          bump((s) => ({
            fields: s.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
            // Tukar jenis antara tunggal/berbilang: tukar bentuk nilai sedia ada
            teachers: patch.type
              ? s.teachers.map((t) => {
                  const v = t.values[id];
                  const nv = patch.type === 'multi' ? (Array.isArray(v) ? v : v ? [v] : []) : Array.isArray(v) ? v.join(', ') : v ?? '';
                  return { ...t, values: { ...t.values, [id]: nv } };
                })
              : s.teachers,
          })),
        removeField: (id) =>
          bump((s) => ({
            fields: s.fields.filter((f) => f.id !== id || f.locked),
            teachers: s.teachers.map((t) => {
              const { [id]: _drop, ...rest } = t.values;
              return s.fields.find((f) => f.id === id)?.locked ? t : { ...t, values: rest };
            }),
          })),
        moveField: (id, dir) =>
          bump((s) => {
            const i = s.fields.findIndex((f) => f.id === id);
            return { fields: swap(s.fields, i, i + dir) };
          }),
        addOption: (fieldId, option) =>
          bump((s) => ({
            fields: s.fields.map((f) => (f.id === fieldId && option && !f.options.includes(option) ? { ...f, options: [...f.options, option] } : f)),
          })),
        renameOption: (fieldId, from, to) =>
          bump((s) => ({
            fields: s.fields.map((f) => (f.id === fieldId ? { ...f, options: f.options.map((o) => (o === from ? to : o)) } : f)),
            teachers: s.teachers.map((t) => {
              const v = t.values[fieldId];
              const nv = Array.isArray(v) ? v.map((x) => (x === from ? to : x)) : v === from ? to : v;
              return { ...t, values: { ...t.values, [fieldId]: nv } };
            }),
          })),
        removeOption: (fieldId, option) =>
          bump((s) => ({ fields: s.fields.map((f) => (f.id === fieldId ? { ...f, options: f.options.filter((o) => o !== option) } : f)) })),
        replaceAll: (fields, teachers) => bump(() => ({ fields, teachers })),
        reset: () => bump(() => ({ fields: defaultFields(), teachers: defaultTeachers() })),
      };
    },
    {
      name: 'bpps2026-staff',
      version: 2,
      // v1: data contoh yang belum pernah disunting diganti dengan senarai sebenar; medan baharu ditambah.
      migrate: (persisted, version) => {
        const p = persisted as Partial<StaffState>;
        if (version < 2) {
          if (!p.rev) return { ...p, fields: defaultFields(), teachers: defaultTeachers(), rev: 1 } as StaffState;
          const have = new Set((p.fields ?? []).map((f) => f.id));
          p.fields = [...(p.fields ?? []), ...defaultFields().filter((f) => !have.has(f.id))];
        }
        return p as StaffState;
      },
    },
  ),
);
