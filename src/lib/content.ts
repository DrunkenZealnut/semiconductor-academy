import processesJson from '@/data/processes.json';
import chemicalsJson from '@/data/chemicals.json';
import termsJson from '@/data/terms.json';
import type { Process, Chemical, Term, ProcessId } from './types';

export const processes = processesJson as Process[];
export const chemicals = chemicalsJson as Chemical[];
export const terms = termsJson as Term[];

export function getProcessBySlug(slug: string): Process | undefined {
  return processes.find((p) => p.slug === slug);
}

export function getProcessById(id: ProcessId): Process | undefined {
  return processes.find((p) => p.id === id);
}

export function getChemicalById(id: string): Chemical | undefined {
  return chemicals.find((c) => c.id === id);
}

export function getTermById(id: string): Term | undefined {
  return terms.find((t) => t.id === id);
}

export function getChemicalsByProcess(processId: ProcessId): Chemical[] {
  return chemicals.filter((c) => c.usedIn.includes(processId));
}

export function getProcessesByChemical(chemicalId: string): Process[] {
  const chem = getChemicalById(chemicalId);
  if (!chem) return [];
  return chem.usedIn
    .map(getProcessById)
    .filter((p): p is Process => Boolean(p));
}

export function getOrderedProcesses(): Process[] {
  return [...processes].sort((a, b) => a.order - b.order);
}
