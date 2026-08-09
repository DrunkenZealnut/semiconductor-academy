import type { ComponentType } from 'react';

/**
 * 공용 모듈 라우트 자료원의 MDX 로더 (source → module 2단 레지스트리).
 * 이름은 교과서 카테고리에서 출발했으나 실제 역할은 공용 라우트
 * `/sources/[source]/[module]`이 담당하는 **모든** 자료원의 레지스트리다
 * (교과서 8권 + 독립 자료원 first-semiconductor·cert-equip-maintenance).
 * daegu-hs-process는 전용 라우트 + daeguMdx.tsx 유지 — 여기 등록 금지(라우트 이중 생성).
 * 새 자료원 추가: REGISTRY에 source 항목 + 모듈 로더 등록, sources.ts sections에도
 * 완성 모듈만 함께 등록. 주의 — sections에만 등록하고 로더를 빠뜨리면 빌드는 통과하고
 * "본문 준비 중" 자리표시 페이지가 공개 배포된다(반대로 REGISTRY 로더가 없는 MDX 경로를
 * 가리키면 빌드 실패). 등록 후 해당 모듈 페이지 렌더를 눈으로 확인할 것.
 */
const REGISTRY: Record<string, Record<string, () => Promise<{ default: ComponentType }>>> = {
  'first-semiconductor': {
    // 1장 — 반도체의 기초
    '001-what-is-semiconductor': () =>
      import('@/content/sources/first-semiconductor/001-what-is-semiconductor.mdx'),
    '002-semiconductor-types': () =>
      import('@/content/sources/first-semiconductor/002-semiconductor-types.mdx'),
    '003-silicon': () => import('@/content/sources/first-semiconductor/003-silicon.mdx'),
    '004-silicon-solid-forms': () =>
      import('@/content/sources/first-semiconductor/004-silicon-solid-forms.mdx'),
    '005-n-type-silicon': () =>
      import('@/content/sources/first-semiconductor/005-n-type-silicon.mdx'),
    '006-p-type-silicon': () =>
      import('@/content/sources/first-semiconductor/006-p-type-silicon.mdx'),
    '007-energy-band-1': () =>
      import('@/content/sources/first-semiconductor/007-energy-band-1.mdx'),
    '008-energy-band-2': () =>
      import('@/content/sources/first-semiconductor/008-energy-band-2.mdx'),
    '009-compound-semiconductor': () =>
      import('@/content/sources/first-semiconductor/009-compound-semiconductor.mdx'),
    'col-1-oxide-organic': () =>
      import('@/content/sources/first-semiconductor/col-1-oxide-organic.mdx'),
    // 2장 — 반도체 소자
    '010-resistor': () => import('@/content/sources/first-semiconductor/010-resistor.mdx'),
    '011-capacitor': () => import('@/content/sources/first-semiconductor/011-capacitor.mdx'),
    '012-pn-diode': () => import('@/content/sources/first-semiconductor/012-pn-diode.mdx'),
    '013-photodiode': () => import('@/content/sources/first-semiconductor/013-photodiode.mdx'),
    '014-led': () => import('@/content/sources/first-semiconductor/014-led.mdx'),
    '015-laser-diode': () => import('@/content/sources/first-semiconductor/015-laser-diode.mdx'),
    '016-transistor-types': () =>
      import('@/content/sources/first-semiconductor/016-transistor-types.mdx'),
    '017-nmos': () => import('@/content/sources/first-semiconductor/017-nmos.mdx'),
    '018-pmos': () => import('@/content/sources/first-semiconductor/018-pmos.mdx'),
    '019-cmos': () => import('@/content/sources/first-semiconductor/019-cmos.mdx'),
    '020-jfet': () => import('@/content/sources/first-semiconductor/020-jfet.mdx'),
    '021-mesfet': () => import('@/content/sources/first-semiconductor/021-mesfet.mdx'),
    '022-bjt': () => import('@/content/sources/first-semiconductor/022-bjt.mdx'),
    'col-2-transistor-birth': () =>
      import('@/content/sources/first-semiconductor/col-2-transistor-birth.mdx'),
    // 3장 — 반도체 집적회로 · 로직
    '023-integrated-circuit': () =>
      import('@/content/sources/first-semiconductor/023-integrated-circuit.mdx'),
    '024-ic-classification': () =>
      import('@/content/sources/first-semiconductor/024-ic-classification.mdx'),
    '025-integration-scale': () =>
      import('@/content/sources/first-semiconductor/025-integration-scale.mdx'),
    '026-ic-by-function': () =>
      import('@/content/sources/first-semiconductor/026-ic-by-function.mdx'),
    '027-boolean-algebra': () =>
      import('@/content/sources/first-semiconductor/027-boolean-algebra.mdx'),
    '028-not-gate': () => import('@/content/sources/first-semiconductor/028-not-gate.mdx'),
    '029-or-gate': () => import('@/content/sources/first-semiconductor/029-or-gate.mdx'),
    '030-and-gate': () => import('@/content/sources/first-semiconductor/030-and-gate.mdx'),
    '031-adder': () => import('@/content/sources/first-semiconductor/031-adder.mdx'),
    '032-subtractor': () => import('@/content/sources/first-semiconductor/032-subtractor.mdx'),
    '033-comparator': () => import('@/content/sources/first-semiconductor/033-comparator.mdx'),
    '034-mpu': () => import('@/content/sources/first-semiconductor/034-mpu.mdx'),
    '035-mcu': () => import('@/content/sources/first-semiconductor/035-mcu.mdx'),
    '036-dsp': () => import('@/content/sources/first-semiconductor/036-dsp.mdx'),
    '037-asic': () => import('@/content/sources/first-semiconductor/037-asic.mdx'),
    '038-pld': () => import('@/content/sources/first-semiconductor/038-pld.mdx'),
    '039-system-ic': () => import('@/content/sources/first-semiconductor/039-system-ic.mdx'),
    '040-ccd': () => import('@/content/sources/first-semiconductor/040-ccd.mdx'),
    'col-3-first-computer': () =>
      import('@/content/sources/first-semiconductor/col-3-first-computer.mdx'),
    // 4장 — 반도체 집적회로 · 메모리
    '041-flip-flop': () => import('@/content/sources/first-semiconductor/041-flip-flop.mdx'),
    '042-memory-structure': () =>
      import('@/content/sources/first-semiconductor/042-memory-structure.mdx'),
    '043-dram': () => import('@/content/sources/first-semiconductor/043-dram.mdx'),
    '044-sram': () => import('@/content/sources/first-semiconductor/044-sram.mdx'),
    '045-mask-rom': () => import('@/content/sources/first-semiconductor/045-mask-rom.mdx'),
    '046-flash-memory': () =>
      import('@/content/sources/first-semiconductor/046-flash-memory.mdx'),
    '047-multi-level-cell': () =>
      import('@/content/sources/first-semiconductor/047-multi-level-cell.mdx'),
    'col-4-scaling-law': () =>
      import('@/content/sources/first-semiconductor/col-4-scaling-law.mdx'),
    // 5장 — IC 설계
    '048-ic-development': () =>
      import('@/content/sources/first-semiconductor/048-ic-development.mdx'),
    '049-hierarchical-design': () =>
      import('@/content/sources/first-semiconductor/049-hierarchical-design.mdx'),
    '050-design-rule': () => import('@/content/sources/first-semiconductor/050-design-rule.mdx'),
    '051-device-design': () =>
      import('@/content/sources/first-semiconductor/051-device-design.mdx'),
    '052-process-design': () =>
      import('@/content/sources/first-semiconductor/052-process-design.mdx'),
    'col-5-industry-split': () =>
      import('@/content/sources/first-semiconductor/col-5-industry-split.mdx'),
    // 6장 — 실리콘 웨이퍼 만드는 법
    '053-silicon-abundance': () =>
      import('@/content/sources/first-semiconductor/053-silicon-abundance.mdx'),
    '054-polysilicon': () => import('@/content/sources/first-semiconductor/054-polysilicon.mdx'),
    '055-cz-growth': () => import('@/content/sources/first-semiconductor/055-cz-growth.mdx'),
    '056-wafer-slicing': () =>
      import('@/content/sources/first-semiconductor/056-wafer-slicing.mdx'),
    '057-wafer-quality': () =>
      import('@/content/sources/first-semiconductor/057-wafer-quality.mdx'),
    '058-epi-soi': () => import('@/content/sources/first-semiconductor/058-epi-soi.mdx'),
    'col-6-wafer-requirements': () =>
      import('@/content/sources/first-semiconductor/col-6-wafer-requirements.mdx'),
    // 7장 — IC 만들기 ① 전공정
    '059-front-back-end': () =>
      import('@/content/sources/first-semiconductor/059-front-back-end.mdx'),
    '060-feol-1': () => import('@/content/sources/first-semiconductor/060-feol-1.mdx'),
    '061-feol-2': () => import('@/content/sources/first-semiconductor/061-feol-2.mdx'),
    '062-beol': () => import('@/content/sources/first-semiconductor/062-beol.mdx'),
    '063-thin-film': () => import('@/content/sources/first-semiconductor/063-thin-film.mdx'),
    '064-lithography': () => import('@/content/sources/first-semiconductor/064-lithography.mdx'),
    '065-etching': () => import('@/content/sources/first-semiconductor/065-etching.mdx'),
    '066-doping': () => import('@/content/sources/first-semiconductor/066-doping.mdx'),
    '067-thermal-process': () =>
      import('@/content/sources/first-semiconductor/067-thermal-process.mdx'),
    '068-cmp': () => import('@/content/sources/first-semiconductor/068-cmp.mdx'),
    '069-cleaning': () => import('@/content/sources/first-semiconductor/069-cleaning.mdx'),
    '070-wafer-test': () => import('@/content/sources/first-semiconductor/070-wafer-test.mdx'),
    'col-7-cleanroom': () => import('@/content/sources/first-semiconductor/col-7-cleanroom.mdx'),
    // 8장 — IC 만들기 ② 후공정
    '071-dicing': () => import('@/content/sources/first-semiconductor/071-dicing.mdx'),
    '072-die-bonding': () => import('@/content/sources/first-semiconductor/072-die-bonding.mdx'),
    '073-wire-bonding': () =>
      import('@/content/sources/first-semiconductor/073-wire-bonding.mdx'),
    '074-molding': () => import('@/content/sources/first-semiconductor/074-molding.mdx'),
    '075-lead-finish': () => import('@/content/sources/first-semiconductor/075-lead-finish.mdx'),
    '076-package-types': () =>
      import('@/content/sources/first-semiconductor/076-package-types.mdx'),
    '077-final-test': () => import('@/content/sources/first-semiconductor/077-final-test.mdx'),
    'col-8-reliability': () =>
      import('@/content/sources/first-semiconductor/col-8-reliability.mdx'),
    // 9장 — 반도체의 최첨단기술
    '078-larger-wafer': () =>
      import('@/content/sources/first-semiconductor/078-larger-wafer.mdx'),
    '079-strained-silicon': () =>
      import('@/content/sources/first-semiconductor/079-strained-silicon.mdx'),
    '080-finfet': () => import('@/content/sources/first-semiconductor/080-finfet.mdx'),
    '081-immersion-double-patterning': () =>
      import('@/content/sources/first-semiconductor/081-immersion-double-patterning.mdx'),
    '082-euv': () => import('@/content/sources/first-semiconductor/082-euv.mdx'),
    '083-maskless-imprint': () =>
      import('@/content/sources/first-semiconductor/083-maskless-imprint.mdx'),
    '084-emerging-memory': () =>
      import('@/content/sources/first-semiconductor/084-emerging-memory.mdx'),
    '085-feram-mram': () => import('@/content/sources/first-semiconductor/085-feram-mram.mdx'),
    '086-pram-reram': () => import('@/content/sources/first-semiconductor/086-pram-reram.mdx'),
    '087-high-k-metal-gate': () =>
      import('@/content/sources/first-semiconductor/087-high-k-metal-gate.mdx'),
    '088-low-k-dram-capacitor': () =>
      import('@/content/sources/first-semiconductor/088-low-k-dram-capacitor.mdx'),
    'col-9-more-moore': () =>
      import('@/content/sources/first-semiconductor/col-9-more-moore.mdx'),
  },
  'hs-semicon-basics': {
    'semicon-overview': () => import('@/content/sources/hs-semicon-basics/semicon-overview.mdx'),
    'semicon-industry': () => import('@/content/sources/hs-semicon-basics/semicon-industry.mdx'),
    'semicon-careers': () => import('@/content/sources/hs-semicon-basics/semicon-careers.mdx'),
    'physical-properties': () =>
      import('@/content/sources/hs-semicon-basics/physical-properties.mdx'),
    'semicon-fundamentals': () =>
      import('@/content/sources/hs-semicon-basics/semicon-fundamentals.mdx'),
    'passive-components': () =>
      import('@/content/sources/hs-semicon-basics/passive-components.mdx'),
    diode: () => import('@/content/sources/hs-semicon-basics/diode.mdx'),
    bjt: () => import('@/content/sources/hs-semicon-basics/bjt.mdx'),
    mosfet: () => import('@/content/sources/hs-semicon-basics/mosfet.mdx'),
    'cmos-image-sensor': () =>
      import('@/content/sources/hs-semicon-basics/cmos-image-sensor.mdx'),
  },
  'hs-basic-tech-1': {
    'electronic-devices': () =>
      import('@/content/sources/hs-basic-tech-1/electronic-devices.mdx'),
    'dc-circuits': () => import('@/content/sources/hs-basic-tech-1/dc-circuits.mdx'),
    measurement: () => import('@/content/sources/hs-basic-tech-1/measurement.mdx'),
    milling: () => import('@/content/sources/hs-basic-tech-1/milling.mdx'),
    'drafting-standards': () =>
      import('@/content/sources/hs-basic-tech-1/drafting-standards.mdx'),
    'drawing-methods': () => import('@/content/sources/hs-basic-tech-1/drawing-methods.mdx'),
    'sectional-views': () => import('@/content/sources/hs-basic-tech-1/sectional-views.mdx'),
    'pneumatics-basics': () =>
      import('@/content/sources/hs-basic-tech-1/pneumatics-basics.mdx'),
    'pneumatics-equipment': () =>
      import('@/content/sources/hs-basic-tech-1/pneumatics-equipment.mdx'),
    'hydraulics-equipment': () =>
      import('@/content/sources/hs-basic-tech-1/hydraulics-equipment.mdx'),
    'c-basics': () => import('@/content/sources/hs-basic-tech-1/c-basics.mdx'),
    'c-programming': () => import('@/content/sources/hs-basic-tech-1/c-programming.mdx'),
  },
  'hs-basic-tech-2': {
    'ac-circuits': () => import('@/content/sources/hs-basic-tech-2/ac-circuits.mdx'),
    'digital-circuits': () => import('@/content/sources/hs-basic-tech-2/digital-circuits.mdx'),
    'equipment-manufacturing': () =>
      import('@/content/sources/hs-basic-tech-2/equipment-manufacturing.mdx'),
    'machine-tools': () => import('@/content/sources/hs-basic-tech-2/machine-tools.mdx'),
    'special-projections': () =>
      import('@/content/sources/hs-basic-tech-2/special-projections.mdx'),
    'development-drawings': () =>
      import('@/content/sources/hs-basic-tech-2/development-drawings.mdx'),
    'cad-drafting': () => import('@/content/sources/hs-basic-tech-2/cad-drafting.mdx'),
    'electropneumatic-circuits': () =>
      import('@/content/sources/hs-basic-tech-2/electropneumatic-circuits.mdx'),
    'pneumatics-maintenance': () =>
      import('@/content/sources/hs-basic-tech-2/pneumatics-maintenance.mdx'),
    'pneumatics-practice': () =>
      import('@/content/sources/hs-basic-tech-2/pneumatics-practice.mdx'),
    'electrohydraulic-circuits': () =>
      import('@/content/sources/hs-basic-tech-2/electrohydraulic-circuits.mdx'),
    'hydraulics-practice': () =>
      import('@/content/sources/hs-basic-tech-2/hydraulics-practice.mdx'),
    'microprocessor-basics': () =>
      import('@/content/sources/hs-basic-tech-2/microprocessor-basics.mdx'),
    'microprocessor-practice': () =>
      import('@/content/sources/hs-basic-tech-2/microprocessor-practice.mdx'),
    'arduino-practice': () => import('@/content/sources/hs-basic-tech-2/arduino-practice.mdx'),
  },
  'hs-photo-etch': {
    'process-overview': () => import('@/content/sources/hs-photo-etch/process-overview.mdx'),
    'photo-process': () => import('@/content/sources/hs-photo-etch/photo-process.mdx'),
    photomask: () => import('@/content/sources/hs-photo-etch/photomask.mdx'),
    'fab-cleanroom': () => import('@/content/sources/hs-photo-etch/fab-cleanroom.mdx'),
    'track-equipment': () => import('@/content/sources/hs-photo-etch/track-equipment.mdx'),
    'exposure-equipment': () =>
      import('@/content/sources/hs-photo-etch/exposure-equipment.mdx'),
    'stepper-structure': () => import('@/content/sources/hs-photo-etch/stepper-structure.mdx'),
    'track-operation': () => import('@/content/sources/hs-photo-etch/track-operation.mdx'),
    'stepper-operation': () => import('@/content/sources/hs-photo-etch/stepper-operation.mdx'),
    'photo-practice': () => import('@/content/sources/hs-photo-etch/photo-practice.mdx'),
    'etch-process': () => import('@/content/sources/hs-photo-etch/etch-process.mdx'),
    'etch-equipment': () => import('@/content/sources/hs-photo-etch/etch-equipment.mdx'),
    'etcher-structure': () => import('@/content/sources/hs-photo-etch/etcher-structure.mdx'),
    'etcher-maintenance': () =>
      import('@/content/sources/hs-photo-etch/etcher-maintenance.mdx'),
    'etch-practice': () => import('@/content/sources/hs-photo-etch/etch-practice.mdx'),
  },
  'hs-assembly-inspection': {
    'packaging-overview': () =>
      import('@/content/sources/hs-assembly-inspection/packaging-overview.mdx'),
    'sawing-process': () =>
      import('@/content/sources/hs-assembly-inspection/sawing-process.mdx'),
    'sawing-equipment': () =>
      import('@/content/sources/hs-assembly-inspection/sawing-equipment.mdx'),
    'sawing-operation': () =>
      import('@/content/sources/hs-assembly-inspection/sawing-operation.mdx'),
    'sawing-practice': () =>
      import('@/content/sources/hs-assembly-inspection/sawing-practice.mdx'),
    'diebond-process': () =>
      import('@/content/sources/hs-assembly-inspection/diebond-process.mdx'),
    'diebond-equipment': () =>
      import('@/content/sources/hs-assembly-inspection/diebond-equipment.mdx'),
    'diebond-operation': () =>
      import('@/content/sources/hs-assembly-inspection/diebond-operation.mdx'),
    'diebond-practice': () =>
      import('@/content/sources/hs-assembly-inspection/diebond-practice.mdx'),
    'inspection-overview': () =>
      import('@/content/sources/hs-assembly-inspection/inspection-overview.mdx'),
    'probe-test': () =>
      import('@/content/sources/hs-assembly-inspection/probe-test.mdx'),
    'particle-counter': () =>
      import('@/content/sources/hs-assembly-inspection/particle-counter.mdx'),
  },
  'hs-thinfilm-diffusion': {
    'thinfilm-process': () =>
      import('@/content/sources/hs-thinfilm-diffusion/thinfilm-process.mdx'),
    'diffusion-process': () =>
      import('@/content/sources/hs-thinfilm-diffusion/diffusion-process.mdx'),
    'thinfilm-equipment': () =>
      import('@/content/sources/hs-thinfilm-diffusion/thinfilm-equipment.mdx'),
    'thinfilm-maintenance': () =>
      import('@/content/sources/hs-thinfilm-diffusion/thinfilm-maintenance.mdx'),
    'thinfilm-practice': () =>
      import('@/content/sources/hs-thinfilm-diffusion/thinfilm-practice.mdx'),
    'diffusion-equipment': () =>
      import('@/content/sources/hs-thinfilm-diffusion/diffusion-equipment.mdx'),
    'diffusion-maintenance': () =>
      import('@/content/sources/hs-thinfilm-diffusion/diffusion-maintenance.mdx'),
    'diffusion-practice': () =>
      import('@/content/sources/hs-thinfilm-diffusion/diffusion-practice.mdx'),
  },
  'hs-equipment-maintenance': {
    'industry-trend': () =>
      import('@/content/sources/hs-equipment-maintenance/industry-trend.mdx'),
    'process-wafer-photo': () =>
      import('@/content/sources/hs-equipment-maintenance/process-wafer-photo.mdx'),
    'process-etch-deposition': () =>
      import('@/content/sources/hs-equipment-maintenance/process-etch-deposition.mdx'),
    'process-frontend-backend': () =>
      import('@/content/sources/hs-equipment-maintenance/process-frontend-backend.mdx'),
    'element-vacuum-gas': () =>
      import('@/content/sources/hs-equipment-maintenance/element-vacuum-gas.mdx'),
    'element-plasma': () =>
      import('@/content/sources/hs-equipment-maintenance/element-plasma.mdx'),
    'element-pneumatic-thermal': () =>
      import('@/content/sources/hs-equipment-maintenance/element-pneumatic-thermal.mdx'),
    'element-power': () =>
      import('@/content/sources/hs-equipment-maintenance/element-power.mdx'),
    'design-concept-mechanical': () =>
      import('@/content/sources/hs-equipment-maintenance/design-concept-mechanical.mdx'),
    'design-electrical': () =>
      import('@/content/sources/hs-equipment-maintenance/design-electrical.mdx'),
    'design-control-software': () =>
      import('@/content/sources/hs-equipment-maintenance/design-control-software.mdx'),
    'maintenance-fundamentals': () =>
      import('@/content/sources/hs-equipment-maintenance/maintenance-fundamentals.mdx'),
    'maintenance-setup': () =>
      import('@/content/sources/hs-equipment-maintenance/maintenance-setup.mdx'),
    'maintenance-by-type': () =>
      import('@/content/sources/hs-equipment-maintenance/maintenance-by-type.mdx'),
  },
  'hs-semicon-infra': {
    'safety-management': () =>
      import('@/content/sources/hs-semicon-infra/safety-management.mdx'),
    'safety-diffusion': () =>
      import('@/content/sources/hs-semicon-infra/safety-diffusion.mdx'),
    'safety-photo': () => import('@/content/sources/hs-semicon-infra/safety-photo.mdx'),
    'safety-etch': () => import('@/content/sources/hs-semicon-infra/safety-etch.mdx'),
    'safety-deposition': () =>
      import('@/content/sources/hs-semicon-infra/safety-deposition.mdx'),
    'safety-ion-implant': () =>
      import('@/content/sources/hs-semicon-infra/safety-ion-implant.mdx'),
    'safety-cmp': () => import('@/content/sources/hs-semicon-infra/safety-cmp.mdx'),
    'safety-backend-mechanical': () =>
      import('@/content/sources/hs-semicon-infra/safety-backend-mechanical.mdx'),
    'safety-backend-chemical': () =>
      import('@/content/sources/hs-semicon-infra/safety-backend-chemical.mdx'),
    'safety-backend-test': () =>
      import('@/content/sources/hs-semicon-infra/safety-backend-test.mdx'),
  },
  'cert-equip-maintenance': {
    intro: () => import('@/content/sources/cert-equip-maintenance/intro.mdx'),
    'photo-process': () =>
      import('@/content/sources/cert-equip-maintenance/photo-process.mdx'),
    'etch-process': () =>
      import('@/content/sources/cert-equip-maintenance/etch-process.mdx'),
    'diffusion-process': () =>
      import('@/content/sources/cert-equip-maintenance/diffusion-process.mdx'),
    'deposition-process': () =>
      import('@/content/sources/cert-equip-maintenance/deposition-process.mdx'),
    'clean-cmp-process': () =>
      import('@/content/sources/cert-equip-maintenance/clean-cmp-process.mdx'),
    'assembly-process': () =>
      import('@/content/sources/cert-equip-maintenance/assembly-process.mdx'),
    'automation-plc': () =>
      import('@/content/sources/cert-equip-maintenance/automation-plc.mdx'),
    'pneumatics-hydraulics': () =>
      import('@/content/sources/cert-equip-maintenance/pneumatics-hydraulics.mdx'),
    'industrial-safety': () =>
      import('@/content/sources/cert-equip-maintenance/industrial-safety.mdx'),
    'electrical-facility': () =>
      import('@/content/sources/cert-equip-maintenance/electrical-facility.mdx'),
    'chemical-facility': () =>
      import('@/content/sources/cert-equip-maintenance/chemical-facility.mdx'),
    'environment-management': () =>
      import('@/content/sources/cert-equip-maintenance/environment-management.mdx'),
  },
};

export function listSchoolTextSourceIds(): string[] {
  return Object.keys(REGISTRY);
}

/** 공용 라우트가 이 자료원을 담당하는지 — REGISTRY 키 멤버십 */
export function isSchoolTextSource(sourceId: string): boolean {
  return Object.prototype.hasOwnProperty.call(REGISTRY, sourceId);
}

/** 이 모듈에 대한 로더가 등록돼 있는지 — sections↔REGISTRY 정합성 검증용 */
export function hasModuleLoader(sourceId: string, moduleId: string): boolean {
  const registry = REGISTRY[sourceId];
  return registry !== undefined && Object.prototype.hasOwnProperty.call(registry, moduleId);
}

export async function loadSchoolTextMdx(
  sourceId: string,
  moduleId: string,
): Promise<ComponentType | null> {
  const loader = REGISTRY[sourceId]?.[moduleId];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}
