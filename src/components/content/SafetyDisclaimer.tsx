import { Callout } from '@/components/content/Callout';

/**
 * 안전 콘텐츠 하단 공통 교육용 고지 (hs-semicon-infra 산업안전 트랙 등).
 * 법적·안전 문구를 단일 진실로 유지 — MDX 본문에서 `<SafetyDisclaimer />`로 사용.
 */
export function SafetyDisclaimer() {
  return (
    <Callout type="warning" title="이 자료는 교육용이에요">
      여기 정리한 위험과 대책은 반도체 안전을 이해하기 위한 교육 자료예요. 실제
      작업 현장에서는 반드시 각 물질의 정식 물질안전보건자료(MSDS/SDS)와 사업장
      안전보건관리자의 지침을 우선 따라야 해요.
    </Callout>
  );
}
