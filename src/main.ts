/**
 * Harley-Davidson Korea Official Website
 * Full interactive controller: Web Audio API V-Twin Engine Simulator,
 * Swiper.js Hero Slider, Lineup Filter, Test Ride Booking Flow & Spec Sheets.
 */

import Swiper from 'swiper';
import { initPageMotion } from './page-motion';
import { lineup2026 } from './lineup-2026';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

interface BikeSpec {
  id: string;
  name: string;
  category: string;
  catLabel: string;
  engine: string;
  displacement: string;
  power: string;
  torque: string;
  seatHeight: string;
  weight: string;
  fuel: string;
  special: string;
  image: string;
  desc: string;
}

const BIKE_DATABASE: Record<string, BikeSpec> = {
  SPORTSTER_S: {
    id: 'SPORTSTER_S',
    name: '스포스터 S (Sportster S)',
    category: 'SPORT',
    catLabel: 'SPORT & STREET',
    engine: 'Revolution Max 1250T (수랭식 DOHC V-Twin)',
    displacement: '1,252 cc',
    power: '121 HP (90 kW) @ 7,500 RPM',
    torque: '127 Nm @ 6,000 RPM',
    seatHeight: '755 mm',
    weight: '228 kg (공차중량)',
    fuel: '11.8 L',
    special: 'Brembo 모노블록 4-피스톤, 4인치 원형 TFT 터치 계기판, 5가지 라이딩 모드',
    image: new URL('./assets/images/harley_sportster_s_1794377474565.jpg', import.meta.url).href,
    desc: '공격적인 로우 슬렁 실루엣과 브론즈 마감의 레볼루션 맥스 엔진. 극한의 코너링 민첩성과 폭발적인 가속력을 겸비한 차세대 하이퍼 스포츠 크루저입니다.'
  },
  FAT_BOY_114: {
    id: 'FAT_BOY_114',
    name: '팻보이 114 (Fat Boy 114)',
    category: 'CRUISER',
    catLabel: 'CRUISER',
    engine: 'Milwaukee-Eight 114 (공/유랭식 푸시로드 45° V-Twin)',
    displacement: '1,868 cc',
    power: '94 HP (70 kW) @ 5,020 RPM',
    torque: '158 Nm @ 3,250 RPM',
    seatHeight: '675 mm',
    weight: '317 kg (공차중량)',
    fuel: '18.9 L',
    special: '전륜 160mm / 후륜 240mm 솔리드 디스크 알루미늄 휠, 2-into-2 크롬 숏 머플러',
    image: new URL('./assets/images/harley_fatboy_cruiser_1794377474921.jpg', import.meta.url).href,
    desc: '할리데이비슨 머슬 크루저의 영원한 상징. 거대한 솔리드 휠과 크롬 헤드램프 나셀, 1,868cc 밀워키 에이트 엔진이 뿜어내는 압도적인 토크로 도로를 지배합니다.'
  },
  STREET_GLIDE: {
    id: 'STREET_GLIDE',
    name: '스트리트 글라이드 (Street Glide)',
    category: 'TOURING',
    catLabel: 'GRAND AMERICAN TOURING',
    engine: 'Milwaukee-Eight 117 (가변 밸브 타이밍 및 수랭 실린더 헤드)',
    displacement: '1,923 cc',
    power: '105 HP (78 kW) @ 4,600 RPM',
    torque: '168 Nm @ 3,500 RPM',
    seatHeight: '715 mm',
    weight: '368 kg',
    fuel: '22.7 L',
    special: 'Skyline OS 12.3인치 와이드 TFT 터치 디스플레이, Rockford Fosgate 오디오, 64L 원터치 하드 새들백',
    image: new URL('./assets/images/harley_street_glide_1794377475372.jpg', import.meta.url).href,
    desc: '대륙 횡단 투어러의 완성형. 공기역학적으로 재설계된 배트윙 페어링과 12.3인치 디스플레이, 장거리 주행에서도 피로를 잊게 하는 궁극의 럭셔리 투어링 바이크.'
  },
  PAN_AMERICA: {
    id: 'PAN_AMERICA',
    name: '팬 아메리카 1250 스페셜 (Pan America 1250)',
    category: 'ADVENTURE',
    catLabel: 'ADVENTURE TOURING',
    engine: 'Revolution Max 1250 (150마력 가변 밸브 수랭 DOHC)',
    displacement: '1,252 cc',
    power: '150 HP (112 kW) @ 8,750 RPM',
    torque: '128 Nm @ 6,750 RPM',
    seatHeight: '830 ~ 875 mm (ARH 작동 시 정차 시 25mm 자동 다운)',
    weight: '258 kg',
    fuel: '21.2 L',
    special: '업계 최초 Adaptive Ride Height(차고 자동 제어), 세미 액티브 서스펜션, 알루미늄 스키드 플레이트',
    image: new URL('./assets/images/harley_pan_america_1794377476078.jpg', import.meta.url).href,
    desc: '끝없는 온로드에서 험준한 오프로드까지. 신호 대기 시 자동으로 시트고를 낮춰주는 혁신적인 ARH 시스템과 150마력의 거침없는 출력이 모험의 지평을 넓힙니다.'
  }
};

export interface DealerItem {
  id: string;
  name: string;
  tag: string;
  city: string;
  region: 'CAPITAL' | 'PROVINCE';
  address: string;
  hours: string;
  phone: string;
  testBikes: string;
  lat: number;
  lng: number;
}

export const DEALER_ITEMS: DealerItem[] = [
  {
    id: 'HANNAM',
    name: '할리데이비슨 한남 본점',
    tag: 'HQ FLAGSHIP',
    city: '서울 용산구',
    region: 'CAPITAL',
    address: '서울특별시 용산구 한남대로 20길 61 (한남동)',
    hours: '09:30 ~ 19:00 (연중무휴)',
    phone: '02-749-1803',
    testBikes: '팻보이 114, 스포스터 S, 스트리트 글라이드',
    lat: 37.535848,
    lng: 127.009412
  },
  {
    id: 'GANGNAM',
    name: '할리데이비슨 강남점',
    tag: 'SEOUL URBAN',
    city: '서울 강남구',
    region: 'CAPITAL',
    address: '서울특별시 강남구 도산대로 168 (논현동)',
    hours: '10:00 ~ 19:30 (화요일 휴무)',
    phone: '02-545-1803',
    testBikes: '나잇스터, 스포스터 S, 브레이크아웃',
    lat: 37.519522,
    lng: 127.027814
  },
  {
    id: 'YONGIN',
    name: '할리데이비슨 용인점',
    tag: 'MEGA COMPLEX',
    city: '경기 용인시',
    region: 'CAPITAL',
    address: '경기도 용인시 처인구 백옥대로 1416 (유방동)',
    hours: '09:00 ~ 18:30 (대형 정비센터 구비)',
    phone: '031-338-1803',
    testBikes: '로드 글라이드, 팬 아메리카, 로우라이더 S',
    lat: 37.261221,
    lng: 127.214432
  },
  {
    id: 'ILSAN',
    name: '할리데이비슨 일산점',
    tag: 'WEST CAPITAL',
    city: '경기 고양시',
    region: 'CAPITAL',
    address: '경기도 고양시 일산서구 경의로 835 (덕이동)',
    hours: '09:30 ~ 19:00 (월요일 휴무)',
    phone: '031-925-1803',
    testBikes: '스포스터 S, 팻보이 114, 로드 글라이드',
    lat: 37.648215,
    lng: 126.782541
  },
  {
    id: 'SONGDO',
    name: '할리데이비슨 송도점',
    tag: 'INCHEON METRO',
    city: '인천 연수구',
    region: 'CAPITAL',
    address: '인천광역시 연수구 송도과학로 16번길 13-18 (송도동)',
    hours: '10:00 ~ 19:00 (연중무휴)',
    phone: '032-858-1803',
    testBikes: '스트리트 글라이드, 나잇스터, 팬 아메리카',
    lat: 37.382204,
    lng: 126.657512
  },
  {
    id: 'DAEJEON',
    name: '할리데이비슨 대전점',
    tag: 'CENTRAL HUB',
    city: '대전 유성구',
    region: 'PROVINCE',
    address: '대전광역시 유성구 유성대로 628 (구암동)',
    hours: '09:30 ~ 19:00 (월요일 휴무)',
    phone: '042-825-1803',
    testBikes: '팻보이 114, 브레이크아웃, 팬 아메리카',
    lat: 36.353312,
    lng: 127.329845
  },
  {
    id: 'DAEGU',
    name: '할리데이비슨 대구점',
    tag: 'DAEGU CHAPTER',
    city: '대구 동구',
    region: 'PROVINCE',
    address: '대구광역시 동구 공항로 192 (지저동)',
    hours: '09:30 ~ 19:00 (월요일 휴무)',
    phone: '053-984-1803',
    testBikes: '팬 아메리카 1250, 팻보이 114',
    lat: 35.894318,
    lng: 128.636621
  },
  {
    id: 'BUSAN',
    name: '할리데이비슨 부산점',
    tag: 'YEONGNAM HUB',
    city: '부산 남구',
    region: 'PROVINCE',
    address: '부산광역시 남구 유엔평화로 153 (대연동)',
    hours: '09:30 ~ 19:00 (해안 투어링 코스 연계)',
    phone: '051-752-1803',
    testBikes: '스트리트 글라이드, 팻보이 114, 스포스터 S',
    lat: 35.127845,
    lng: 129.096231
  },
  {
    id: 'GWANGJU',
    name: '할리데이비슨 광주점',
    tag: 'HONAM HUB',
    city: '광주 광산구',
    region: 'PROVINCE',
    address: '광주광역시 광산구 무진대로 293 (우산동)',
    hours: '09:30 ~ 19:00',
    phone: '062-959-1803',
    testBikes: '스포스터 S, 스트리트 글라이드',
    lat: 35.158512,
    lng: 126.812421
  }
];

const DEALERS_DATABASE: Record<string, string> = DEALER_ITEMS.reduce((acc, d) => {
  acc[d.id] = d.name;
  return acc;
}, {} as Record<string, string>);


// ==========================================
// 1. WEB AUDIO API: V-TWIN REAL-TIME SYNTHESIZER
// ==========================================
class VTwinSynthesizer {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private engineType: 'M8' | 'REVMAX' = 'M8';
  private targetRpm: number = 850;
  private currentRpm: number = 850;
  private idleRpm: number = 850;
  private maxRpm: number = 5500;
  private loopTimer: number | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  constructor() {}

  private initAudio() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master bus
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(320, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(4, this.ctx.currentTime);

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEngineType(type: 'M8' | 'REVMAX') {
    this.engineType = type;
    if (type === 'M8') {
      this.idleRpm = 850;
      this.maxRpm = 5500;
    } else {
      this.idleRpm = 1100;
      this.maxRpm = 8500;
    }
    this.currentRpm = Math.min(this.currentRpm, this.maxRpm);
    if (!this.isRunning) {
      this.currentRpm = this.idleRpm;
      this.targetRpm = this.idleRpm;
    }
  }

  public setThrottle(pct: number) {
    const min = this.idleRpm;
    const max = this.maxRpm;
    this.targetRpm = min + ((max - min) * (pct / 100));
  }

  public async toggleEngine(): Promise<boolean> {
    this.initAudio();

    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      await this.start();
      return true;
    }
  }

  private async start() {
    if (!this.ctx) return;
    this.isRunning = true;
    this.currentRpm = this.idleRpm;
    this.targetRpm = this.idleRpm;

    // Cranking starter burst
    this.playCrankingSound();

    this.loopTimer = window.setTimeout(() => {
      if (this.isRunning) {
        this.runCycle();
      }
    }, 400);
  }

  public stop() {
    this.isRunning = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public getCurrentRpm(): number {
    return Math.round(this.currentRpm);
  }

  private playCrankingSound() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(28, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(75, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.38);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  private runCycle() {
    if (!this.isRunning || !this.ctx || !this.filterNode) return;

    // Smooth RPM interpolation towards target
    const rpmDiff = this.targetRpm - this.currentRpm;
    this.currentRpm += rpmDiff * 0.18;

    // Calculate V-Twin 45° asymmetric timing
    // 2 revolutions per 4-stroke cycle = 720 degrees
    // Cylinder 1 fires at 0°, Cylinder 2 fires at 315°, next cycle starts at 720° (405° gap)
    const revsPerSec = this.currentRpm / 60;
    const cycleDuration = 2 / revsPerSec; // seconds for 720 deg
    
    // Asymmetric timing
    const t1 = (315 / 720) * cycleDuration;
    const t2 = (405 / 720) * cycleDuration;

    // Update filter cutoff with RPM
    const cutoff = Math.min(1800, 220 + (this.currentRpm * 0.28));
    this.filterNode.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.05);

    // Fire Cylinder 1
    this.triggerCylinderPulse(1);

    // Schedule Cylinder 2
    setTimeout(() => {
      if (this.isRunning) {
        this.triggerCylinderPulse(2);
      }
    }, t1 * 1000);

    // Schedule next cycle
    this.loopTimer = window.setTimeout(() => {
      this.runCycle();
    }, (t1 + t2) * 1000);
  }

  private triggerCylinderPulse(cylinder: 1 | 2) {
    if (!this.ctx || !this.filterNode) return;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const isM8 = this.engineType === 'M8';
    // Fundamental frequency based on engine style & RPM
    const baseFreq = isM8 ? (38 + (this.currentRpm * 0.018)) : (55 + (this.currentRpm * 0.024));
    // Minor variation between front and rear cylinder for authenticity
    const cylFreq = cylinder === 1 ? baseFreq : baseFreq * (isM8 ? 0.94 : 0.96);

    osc.type = isM8 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(cylFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(cylFreq * 0.5, this.ctx.currentTime + (isM8 ? 0.09 : 0.07));

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(cylFreq * 2.05, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(cylFreq, this.ctx.currentTime + 0.06);

    // Loudness and duration
    const pulseVol = isM8 ? 0.75 : 0.65;
    gain.gain.setValueAtTime(pulseVol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (isM8 ? 0.11 : 0.08));

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.filterNode);

    const now = this.ctx.currentTime;
    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.12);
    osc2.stop(now + 0.12);
  }
}

// Instantiate Sound Lab Engine
const soundLab = new VTwinSynthesizer();

// ==========================================
// 2. DOM CONTROLLER & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  for (const sectionId of ['engineering', 'collection']) {
    new Swiper(`#${sectionId} .engineering-swiper`, {
      modules: [Navigation],
      centeredSlides: true,
      slideToClickedSlide: true,
      initialSlide: matchMedia('(min-width: 1024px)').matches ? 1 : 0,
      slidesPerView: 1.12,
      spaceBetween: 16,
      speed: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360,
      navigation: { prevEl: `.${sectionId}-prev`, nextEl: `.${sectionId}-next` },
      breakpoints: {
        640: { slidesPerView: 1.8, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 32 }
      }
    });
  }
  document.querySelectorAll<HTMLElement>('.engineering-card').forEach(card => {
    const button = card.querySelector<HTMLButtonElement>('.engineering-toggle')!;
    const detail = card.querySelector<HTMLElement>('.engineering-detail')!;
    let pinned = false;
    const showDetail = (open: boolean) => {
      card.classList.toggle('is-open', open);
      detail.inert = !open;
      detail.setAttribute('aria-hidden', String(!open));
      button.setAttribute('aria-expanded', String(open));
    };
    card.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') showDetail(true);
    });
    card.addEventListener('pointerleave', () => showDetail(pinned));
    button.addEventListener('click', () => {
      pinned = !pinned;
      showDetail(pinned);
    });
    card.addEventListener('focusout', event => {
      if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) return;
      pinned = false;
      showDetail(false);
    });
  });
  // --- Initialize Swiper Hero Slider ---
  const heroSwiperEl = document.querySelector('.hero-swiper');
  let heroSwiper: Swiper | undefined;
  if (heroSwiperEl) {
    heroSwiper = new Swiper('.hero-swiper', {
      modules: [Autoplay, EffectFade, Navigation, Pagination],
      loop: true,
      autoHeight: true,
      speed: 900,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      navigation: {
        nextEl: '.hero-next-btn',
        prevEl: '.hero-prev-btn'
      },
      pagination: {
        el: '.hero-pagination',
        clickable: true
      }
    });
  }

  const scrollToTop = initPageMotion(heroSwiper);

  // --- Heritage 120 Years Hover Image Transition Controller ---
  const heritagePillars = document.querySelectorAll<HTMLElement>('.heritage-pillar');
  const heritageLayers = document.querySelectorAll<HTMLImageElement>('.heritage-bg-layer');

  function setActiveHeritagePillar(pillarIndex: string) {
    // Update background image opacity and subtle zoom
    heritageLayers.forEach((img) => {
      const imgIndex = img.getAttribute('data-bg-index');
      if (imgIndex === pillarIndex) {
        img.classList.remove('opacity-0', 'scale-95');
        img.classList.add('opacity-55', 'scale-100');
      } else {
        img.classList.remove('opacity-55', 'opacity-50', 'opacity-45', 'opacity-40', 'scale-100');
        img.classList.add('opacity-0', 'scale-95');
      }
    });

    // Update pillar item active styling
    heritagePillars.forEach((pillar) => {
      const pIdx = pillar.getAttribute('data-pillar');
      const numSpan = pillar.querySelector('.pillar-num');

      if (pIdx === pillarIndex) {
        pillar.classList.add('is-active', 'border-[#FF5500]', 'bg-white/[0.02]');
        pillar.classList.remove('border-white/15');
        if (numSpan) {
          numSpan.classList.add('text-[#FF5500]');
          numSpan.classList.remove('text-zinc-600');
        }
      } else {
        pillar.classList.remove('is-active', 'border-[#FF5500]', 'bg-white/[0.02]');
        pillar.classList.add('border-white/15');
        if (numSpan) {
          numSpan.classList.remove('text-[#FF5500]');
          numSpan.classList.add('text-zinc-600');
        }
      }
    });
  }

  heritagePillars.forEach((pillar) => {
    const pillarIndex = pillar.getAttribute('data-pillar');
    if (!pillarIndex) return;

    // Hover event for instant yet smooth fade in
    pillar.addEventListener('mouseenter', () => {
      setActiveHeritagePillar(pillarIndex);
    });

    // Focus & click event for accessibility and mobile touch support
    pillar.addEventListener('focus', () => {
      setActiveHeritagePillar(pillarIndex);
    });
    pillar.addEventListener('click', () => {
      setActiveHeritagePillar(pillarIndex);
    });
  });

  // --- Mobile Menu Toggle ---
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = document.getElementById('site-header')!;
  const topButton = document.getElementById('back-to-top')!;
  const root = document.documentElement;
  let lastY = Math.max(0, window.scrollY);

  function updateScrollNavigation() {
    const limit = Math.max(0, root.scrollHeight - root.clientHeight);
    const y = Math.min(limit, Math.max(0, window.scrollY));
    topButton.hidden = limit === 0 || y < limit / 2;
    if (y === 0 || Math.abs(y - lastY) >= 4) {
      const menuOpen = mobileMenu && mobileMenu.getClientRects().length > 0;
      root.classList.toggle('header-hidden', y > 0 && y > lastY && !menuOpen && !header.matches(':has(:focus-visible)'));
      lastY = y;
    }
  }
  window.addEventListener('scroll', updateScrollNavigation, { passive: true });
  window.addEventListener('resize', updateScrollNavigation);
  new ResizeObserver(updateScrollNavigation).observe(document.body);
  header.addEventListener('focusin', () => root.classList.remove('header-hidden'));
  topButton.addEventListener('click', scrollToTop);
  updateScrollNavigation();
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggleBtn && mobileMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // --- Initialize Lineup Swiper (Edge-to-Edge Single-Row Slider) ---
  const lineupSwiperEl = document.querySelector('.lineup-swiper');
  let lineupSwiper: Swiper | null = null;
  if (lineupSwiperEl) {
    const template = document.querySelector<HTMLTemplateElement>('#lineup-card-template')!;
    const wrapper = lineupSwiperEl.querySelector('.swiper-wrapper')!;
    for (const model of lineup2026) {
      const slide = template.content.cloneNode(true) as DocumentFragment;
      const card = slide.querySelector<HTMLElement>('.bike-card')!;
      card.dataset.cat = model.category;
      card.dataset.model = model.id;
      const image = card.querySelector('img')!;
      image.src = model.image;
      image.alt = model.name;
      for (const field of card.querySelectorAll<HTMLElement>('[data-field]')) {
        const key = field.dataset.field as keyof typeof model;
        field.textContent = key === 'power' ? model.power.split(' / ')[0] : model[key];
      }
      card.querySelector<HTMLButtonElement>('[data-action="spec"]')!.dataset.target = model.id;
      wrapper.append(slide);
    }
    lineupSwiper = new Swiper('.lineup-swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: 'auto',
      spaceBetween: 28,
      speed: 600,
      grabCursor: true,
      watchOverflow: true,
      navigation: {
        nextEl: '.lineup-next-btn',
        prevEl: '.lineup-prev-btn'
      },
      pagination: {
        el: '.lineup-pagination',
        clickable: true
      }
    });
  }

  // --- Lineup Category Filtering & Swiper Navigation ---
  const filterBtns = document.querySelectorAll('.lineup-filter-btn');
  const lineupGuides = document.querySelectorAll<HTMLElement>('[data-lineup-guide]');
  const bikeSlides = document.querySelectorAll<HTMLElement>('.lineup-swiper .swiper-slide');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.setAttribute('aria-pressed', String(b === btn));
        b.classList.remove('text-black', 'border-black', 'font-extrabold');
        b.classList.add('text-zinc-400', 'border-transparent', 'font-bold');
      });
      btn.classList.add('text-black', 'border-black', 'font-extrabold');
      btn.classList.remove('text-zinc-400', 'border-transparent', 'font-bold');

      const cat = btn.getAttribute('data-category');
      lineupGuides.forEach(guide => {
        guide.hidden = guide.dataset.lineupGuide !== cat;
      });
      const visibleSlides = Array.from(bikeSlides).filter(slide =>
        cat === 'ALL' || slide.querySelector('.bike-card')?.getAttribute('data-cat') === cat
      );
      lineupSwiper?.wrapperEl.replaceChildren(...visibleSlides);
      lineupSwiper?.update();
      lineupSwiper?.slideTo(0, 0);
    });
  });

  // --- Sound Lab Controls ---
  const starterBtn = document.getElementById('engine-starter-btn');
  const starterLabel = document.getElementById('starter-btn-label');
  const rpmDisplay = document.getElementById('rpm-display')!;
  const needle = document.getElementById('rpm-needle')!;
  const scale = document.getElementById('rpm-scale')!;
  const revButton = document.getElementById('rev-hold-btn') as HTMLButtonElement;
  const m8Button = document.getElementById('engine-select-m8')!;
  const revMaxButton = document.getElementById('engine-select-revmax')!;
  const engineDescription = document.getElementById('engine-desc-text')!;
  let scaleLimit = 6000;
  let throttle = 0;
  let held = false;
  let lastFrame = 0;
  let animation = 0;

  function drawScale(redline: number) {
    scaleLimit = Math.ceil(redline / 1000) * 1000;
    const marks: string[] = [];
    for (let rpm = 0; rpm <= scaleLimit; rpm += 250) {
      const angle = -120 + 240 * rpm / scaleLimit;
      const major = rpm % 1000 === 0;
      const ink = rpm >= redline ? '#fa7761' : '#ded8cc';
      marks.push(`<g transform="rotate(${angle})"><path d="M0 -137v${major ? 13 : 6}" stroke="${ink}" stroke-width="${major ? 3 : 1.5}"/>`);
      if (major) marks.push(`<text y="-99" fill="${ink}" font-size="23" font-weight="700">${rpm / 1000}</text>`);
      marks.push('</g>');
    }
    scale.innerHTML = marks.join('');
  }

  function renderRpm(rpm: number) {
    rpmDisplay.textContent = String(rpm).padStart(4, '0');
    needle.setAttribute('transform', `rotate(${-120 + 240 * rpm / scaleLimit})`);
  }

  function tick(now: number) {
    const elapsed = Math.min(now - lastFrame, 100);
    lastFrame = now;
    throttle = Math.max(0, Math.min(100, throttle + elapsed * (held ? 0.07 : -0.12)));
    soundLab.setThrottle(throttle);
    renderRpm(soundLab.getCurrentRpm());
    animation = requestAnimationFrame(tick);
  }

  function hold(active: boolean) {
    held = active && soundLab.getIsRunning();
    revButton.classList.toggle('is-held', held);
  }

  starterBtn?.addEventListener('click', async () => {
    const running = await soundLab.toggleEngine();
    cancelAnimationFrame(animation);
    throttle = 0;
    hold(false);
    revButton.disabled = !running;
    starterBtn.setAttribute('aria-pressed', String(running));
    if (starterLabel) starterLabel.textContent = running ? 'STOP ENGINE' : 'START ENGINE';
    renderRpm(running ? soundLab.getCurrentRpm() : 0);
    if (running) {
      lastFrame = performance.now();
      animation = requestAnimationFrame(tick);
    }
  });

  revButton.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    revButton.setPointerCapture(event.pointerId);
    hold(true);
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture', 'blur']) {
    revButton.addEventListener(event, () => hold(false));
  }
  for (const event of ['keydown', 'keyup'] as const) {
    revButton.addEventListener(event, key => {
      if (key.key !== ' ' && key.key !== 'Enter') return;
      key.preventDefault();
      hold(event === 'keydown');
    });
  }
  window.addEventListener('blur', () => hold(false));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      hold(false);
      throttle = 0;
      soundLab.setThrottle(0);
    }
  });

  function selectEngine(type: 'M8' | 'REVMAX') {
    const isM8 = type === 'M8';
    soundLab.setEngineType(type);
    m8Button.setAttribute('aria-pressed', String(isM8));
    revMaxButton.setAttribute('aria-pressed', String(!isM8));
    engineDescription.textContent = isM8
      ? 'Milwaukee-Eight 117 · 45도 협각 트윈 특유의 묵직한 저음 고동.'
      : 'Revolution Max 1250T · 60도 수랭식 트윈의 날카로운 고회전 사운드.';
    drawScale(isM8 ? 5500 : 8500);
    renderRpm(soundLab.getIsRunning() ? soundLab.getCurrentRpm() : 0);
  }
  m8Button.addEventListener('click', () => selectEngine('M8'));
  revMaxButton.addEventListener('click', () => selectEngine('REVMAX'));
  selectEngine('M8');

  // ==========================================
  // 6. GOOGLE MAPS DEALERSHIP LOCATOR (4:6 STICKY ARCHITECTURE)
  // ==========================================
  const dealerRegionBtns = document.querySelectorAll('.dealer-region-btn');
  const dealerCards = document.querySelectorAll('.dealer-card');
  const dealerMapEl = document.getElementById('dealer-map');
  
  let fallbackMap: HTMLIFrameElement | null = null;
  let activeDealerId = 'HANNAM';
  let googleMapInstance: google.maps.Map | null = null;
  const markersMap = new Map<string, { marker: google.maps.marker.AdvancedMarkerElement; pin: google.maps.marker.PinElement }>();

  // Function to activate and highlight selected dealer
  function setActiveDealer(id: string, scrollCard: boolean = false) {
    const dealer = DEALER_ITEMS.find((d) => d.id === id);
    if (!dealer) return;
    activeDealerId = id;

    // Pan Google Map
    if (googleMapInstance) {
      googleMapInstance.panTo({ lat: dealer.lat, lng: dealer.lng });
      googleMapInstance.setZoom(15);
    }

    // Update Marker Pins in Google Map
    markersMap.forEach(({ pin }, dealerKey) => {
      const isSelected = dealerKey === id;
      pin.background = isSelected ? '#FF5500' : '#111215';
      pin.borderColor = isSelected ? '#FFFFFF' : '#71717A';
      pin.glyphColor = isSelected ? '#000000' : '#FF5500';
      pin.scale = isSelected ? 1.25 : 0.95;
    });

    // Update Dealer Cards Styling in 6-area
    dealerCards.forEach((card) => {
      const cardId = card.getAttribute('data-dealer-id');
      const indicator = card.querySelector('.active-indicator');
      if (cardId === id) {
        card.classList.add('is-active', 'border-2', 'border-[#FF5500]', 'shadow-md');
        card.classList.remove('border-zinc-200', 'shadow-sm');
        if (indicator) indicator.classList.remove('hidden');
        if (scrollCard) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        card.classList.remove('is-active', 'border-2', 'border-[#FF5500]', 'shadow-md');
        card.classList.add('border-zinc-200', 'shadow-sm');
        if (indicator) indicator.classList.add('hidden');
      }
    });

    if (fallbackMap) {
      fallbackMap.title = dealer.name + " 위치";
      fallbackMap.src = `https://maps.google.com/maps?q=${dealer.lat},${dealer.lng}&z=15&output=embed`;
    }
  }


  // Handle Card Click to Synchronize with Map
  dealerCards.forEach((card) => {
    card.addEventListener('click', () => {
      const dealerId = card.getAttribute('data-dealer-id');
      if (dealerId) {
        setActiveDealer(dealerId, false);
      }
    });
  });

  // Recenter Button
  const recenterBtn = document.getElementById('map-recenter-btn');
  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      const cur = DEALER_ITEMS.find((d) => d.id === activeDealerId);
      if (cur && googleMapInstance) {
        googleMapInstance.panTo({ lat: cur.lat, lng: cur.lng });
        googleMapInstance.setZoom(15);
      }
    });
  }

  // Dealership Region Filter
  dealerRegionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      dealerRegionBtns.forEach((b) => {
        b.classList.remove('text-black', 'border-black', 'font-extrabold');
        b.classList.add('text-zinc-400', 'border-transparent', 'font-bold');
      });
      btn.classList.add('text-black', 'border-black', 'font-extrabold');
      btn.classList.remove('text-zinc-400', 'border-transparent', 'font-bold');

      const region = btn.getAttribute('data-region');
      let firstVisibleId: string | null = null;

      dealerCards.forEach((card) => {
        const cardRegion = card.getAttribute('data-region');
        const cardId = card.getAttribute('data-dealer-id');
        const matches = region === 'ALL' || cardRegion === region;

        if (matches) {
          (card as HTMLElement).style.display = 'flex';
          if (!firstVisibleId && cardId) firstVisibleId = cardId;
        } else {
          (card as HTMLElement).style.display = 'none';
        }

        // Adjust marker visibility on Google Map
        if (cardId && markersMap.has(cardId) && googleMapInstance) {
          const item = markersMap.get(cardId)!;
          item.marker.map = matches ? googleMapInstance : null;
        }
      });

      // If active dealer is outside the filtered view, switch to first visible
      const currentDealer = DEALER_ITEMS.find((d) => d.id === activeDealerId);
      if (currentDealer && region !== 'ALL' && currentDealer.region !== region && firstVisibleId) {
        setActiveDealer(firstVisibleId, false);
      }
    });
  });

  // Google Maps Asynchronous Initialization
  async function initGoogleMaps() {
    if (!dealerMapEl) return;

    const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

    try {
      if (!apiKey) throw new Error("Google Maps API key is missing");
      setOptions({
        key: apiKey,
        v: 'weekly',
      });

      const { Map } = (await importLibrary('maps')) as google.maps.MapsLibrary;
      const { AdvancedMarkerElement, PinElement } = (await importLibrary('marker')) as google.maps.MarkerLibrary;

      // Remove loading placeholder
      const placeholder = document.getElementById('map-loading-placeholder');
      if (placeholder) placeholder.remove();

      // Initialize Map with mandatory AI Studio attribution override
      googleMapInstance = new Map(dealerMapEl, {
        center: { lat: DEALER_ITEMS[0].lat, lng: DEALER_ITEMS[0].lng },
        zoom: 15,
        mapId: 'DEMO_MAP_ID',
        internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        scaleControl: true
      });

      // Create Advanced Markers with PinElement for all 9 dealerships
      DEALER_ITEMS.forEach((dealer) => {
        const isSelected = dealer.id === activeDealerId;
        const pin = new PinElement({
          background: isSelected ? '#FF5500' : '#111215',
          borderColor: isSelected ? '#FFFFFF' : '#71717A',
          glyphColor: isSelected ? '#000000' : '#FF5500',
          scale: isSelected ? 1.25 : 0.95
        });

        const marker = new AdvancedMarkerElement({
          map: googleMapInstance,
          position: { lat: dealer.lat, lng: dealer.lng },
          title: dealer.name,
          content: pin.element
        });

        marker.addListener('click', () => {
          setActiveDealer(dealer.id, true);
        });

        markersMap.set(dealer.id, { marker, pin });
      });

    } catch (err: unknown) {
      console.warn('Google Maps Platform initialization notice:', err);

      fallbackMap = document.createElement("iframe");
      fallbackMap.className = "h-full w-full border-0";
      fallbackMap.loading = "lazy";
      dealerMapEl.replaceChildren(fallbackMap);
      recenterBtn?.classList.add("hidden");
      setActiveDealer(activeDealerId);
    }
  }

  initGoogleMaps();



  // --- Modals Controller (Test Ride & Spec Sheet) ---
  const testRideModal = document.getElementById('test-ride-modal');
  const closeTestRideBtn = document.getElementById('close-test-ride-modal');
  const testRideFullForm = document.getElementById('test-ride-full-form');
  const bookingFormStep = document.getElementById('booking-form-step');
  const bookingSuccessStep = document.getElementById('booking-success-step');
  const voucherConfirmBtn = document.getElementById('voucher-confirm-btn');

  const modalModelSelect = document.getElementById('modal-model-select') as HTMLSelectElement;
  const modalDealerSelect = document.getElementById('modal-dealer-select') as HTMLSelectElement;
  const modalDateSelect = document.getElementById('modal-date-select') as HTMLInputElement;

  function setMinBookingDate() {
    if (modalDateSelect) {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      modalDateSelect.min = `${yyyy}-${mm}-${dd}`;
      modalDateSelect.value = `${yyyy}-${mm}-${dd}`;
    }
    const quickDate = document.getElementById('quick-date') as HTMLInputElement;
    if (quickDate && modalDateSelect) {
      quickDate.min = modalDateSelect.min;
      quickDate.value = modalDateSelect.value;
    }
  }
  setMinBookingDate();

  function openTestRideModal(modelId?: string, dealerId?: string, dateStr?: string) {
    if (modelId && modalModelSelect) {
      modalModelSelect.value = modelId;
    }
    if (dealerId && modalDealerSelect) {
      modalDealerSelect.value = dealerId;
    }
    if (dateStr && modalDateSelect) {
      modalDateSelect.value = dateStr;
    }

    if (bookingFormStep) bookingFormStep.classList.remove('hidden');
    if (bookingSuccessStep) bookingSuccessStep.classList.add('hidden');
    if (testRideModal) testRideModal.classList.remove('hidden');
  }

  function closeTestRideModal() {
    if (testRideModal) testRideModal.classList.add('hidden');
  }

  // Open triggers
  document.getElementById('open-test-ride-header')?.addEventListener('click', () => openTestRideModal());
  document.getElementById('open-test-ride-mobile')?.addEventListener('click', () => openTestRideModal());
  document.getElementById('hero-cta-test-ride')?.addEventListener('click', () => openTestRideModal());

  document.querySelectorAll('.open-test-ride-trigger').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openTestRideModal();
    });
  });

  if (closeTestRideBtn) closeTestRideBtn.addEventListener('click', closeTestRideModal);
  if (voucherConfirmBtn) voucherConfirmBtn.addEventListener('click', closeTestRideModal);

  // Close when clicking modal backdrop
  testRideModal?.addEventListener('click', (e) => {
    if (e.target === testRideModal) closeTestRideModal();
  });

  // Quick Bar Submit handler
  const quickForm = document.getElementById('quick-booking-form');
  const bookingBar = quickForm?.closest('section');
  if (bookingBar) {
    new ResizeObserver(() => {
      bookingBar.parentElement?.style.setProperty('--booking-bar-height', `${bookingBar.offsetHeight}px`);
    }).observe(bookingBar);
  }
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const quickModel = (document.getElementById('quick-model') as HTMLSelectElement).value;
      const quickDealer = (document.getElementById('quick-dealer') as HTMLSelectElement).value;
      const quickDate = (document.getElementById('quick-date') as HTMLInputElement).value;
      openTestRideModal(quickModel, quickDealer, quickDate);
    });
  }

  // Card & Dealer Booking Buttons
  document.querySelectorAll('[data-action="book"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modelId = btn.getAttribute('data-model-id');
      openTestRideModal(modelId || undefined);
    });
  });

  document.querySelectorAll('[data-action="book-at-dealer"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dealer = btn.getAttribute('data-dealer');
      openTestRideModal(undefined, dealer || undefined);
    });
  });

  // Full Booking Form Submit
  if (testRideFullForm) {
    testRideFullForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = (document.getElementById('modal-name-input') as HTMLInputElement).value;
      const selectedModel = modalModelSelect.value;
      const selectedDealer = modalDealerSelect.value;
      const selectedDate = modalDateSelect.value;

      // Fill voucher
      const bikeInfo = BIKE_DATABASE[selectedModel];
      const bikeTitle = bikeInfo ? bikeInfo.name.split(' (')[0] : selectedModel;
      const dealerTitle = DEALERS_DATABASE[selectedDealer] || selectedDealer;

      const randomCode = `HD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const voucherCodeEl = document.getElementById('voucher-code');
      const voucherBikeEl = document.getElementById('voucher-bike');
      const voucherDealerEl = document.getElementById('voucher-dealer');
      const voucherDateEl = document.getElementById('voucher-date');
      const voucherNameEl = document.getElementById('voucher-name');

      if (voucherCodeEl) voucherCodeEl.textContent = randomCode;
      if (voucherBikeEl) voucherBikeEl.textContent = bikeTitle;
      if (voucherDealerEl) voucherDealerEl.textContent = dealerTitle;
      if (voucherDateEl) voucherDateEl.textContent = selectedDate;
      if (voucherNameEl) voucherNameEl.textContent = `${nameInput} 님`;

      // Switch to voucher step
      if (bookingFormStep) bookingFormStep.classList.add('hidden');
      if (bookingSuccessStep) bookingSuccessStep.classList.remove('hidden');
    });
  }

  // --- Spec Sheet Modal ---
  const specModal = document.getElementById('spec-modal');
  const closeSpecModalBtn = document.getElementById('close-spec-modal');
  const closeSpecBottomBtn = document.getElementById('close-spec-bottom');
  const specToBookBtn = document.getElementById('spec-to-book-btn');

  let currentSpecModelId = 'FAT_BOY_114';

  function openSpecModal(modelId: string) {
    const catalogModel = lineup2026.find(model => model.id === modelId);
    const data = catalogModel ?? BIKE_DATABASE[modelId];
    if (!data) return;
    const bookingId = ({ 'sportster-s': 'SPORTSTER_S', 'street-glide': 'STREET_GLIDE' } as Record<string, string>)[modelId] ?? modelId;
    currentSpecModelId = bookingId;
    if (specToBookBtn) specToBookBtn.hidden = !BIKE_DATABASE[bookingId];
    const officialLink = document.querySelector<HTMLAnchorElement>('#spec-official-link')!;
    officialLink.hidden = !catalogModel;
    if (catalogModel) officialLink.href = catalogModel.officialUrl;

    const catLabel = document.getElementById('spec-cat-label');
    const title = document.getElementById('spec-title');
    const desc = document.getElementById('spec-desc');
    const img = document.getElementById('spec-img') as HTMLImageElement;
    const table = document.getElementById('spec-table');

    if (catLabel) catLabel.textContent = data.catLabel;
    if (title) title.textContent = data.name;
    if (desc) desc.textContent = data.desc;
    if (img) {
      img.src = data.image;
      img.alt = data.name;
    }

    if (table) {
      table.innerHTML = `
        <div class="p-3 bg-[#18191E] border border-white/5 rounded-sm">
          <span class="text-zinc-500 block text-[10px] uppercase">엔진 형식</span>
          <strong class="text-white text-xs">${data.engine}</strong>
        </div>
        <div class="p-3 bg-[#18191E] border border-white/5 rounded-sm">
          <span class="text-zinc-500 block text-[10px] uppercase">배기량</span>
          <strong class="text-white text-xs tabular-nums">${data.displacement}</strong>
        </div>
        <div class="p-3 bg-[#18191E] border border-white/5 rounded-sm">
          <span class="text-zinc-500 block text-[10px] uppercase">최고 출력</span>
          <strong class="text-white text-xs tabular-nums">${data.power}</strong>
        </div>
        <div class="p-3 bg-[#18191E] border border-white/5 rounded-sm">
          <span class="text-zinc-500 block text-[10px] uppercase">최대 토크</span>
          <strong class="text-white text-xs tabular-nums">${data.torque}</strong>
        </div>
        <div class="p-3 bg-[#18191E] border border-white/5 rounded-sm">
          <span class="text-zinc-500 block text-[10px] uppercase">${catalogModel ? '시트고 (미탑승)' : '시트고'}</span>
          <strong class="text-white text-xs tabular-nums">${data.seatHeight}</strong>
        </div>
        <div class="p-3 bg-[#18191E] border border-white/5 rounded-sm">
          <span class="text-zinc-500 block text-[10px] uppercase">차량 중량</span>
          <strong class="text-white text-xs tabular-nums">${data.weight}</strong>
        </div>
        <div class="p-3 bg-[#18191E] border border-white/5 rounded-sm">
          <span class="text-zinc-500 block text-[10px] uppercase">연료 탱크 용량</span>
          <strong class="text-white text-xs tabular-nums">${data.fuel}</strong>
        </div>
        ${'special' in data ? `<div class="p-3 bg-[#18191E] border border-white/5 rounded-sm col-span-2 sm:col-span-2">
          <span class="text-zinc-500 block text-[10px] uppercase">주요 특징 및 사양</span>
          <strong class="text-white text-xs leading-relaxed">${data.special}</strong>
        </div>` : ''}
      `;
    }

    if (specModal) specModal.classList.remove('hidden');
  }

  function closeSpecModal() {
    if (specModal) specModal.classList.add('hidden');
  }

  document.querySelectorAll('[data-action="spec"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) openSpecModal(target);
    });
  });

  if (closeSpecModalBtn) closeSpecModalBtn.addEventListener('click', closeSpecModal);
  if (closeSpecBottomBtn) closeSpecBottomBtn.addEventListener('click', closeSpecModal);

  specModal?.addEventListener('click', (e) => {
    if (e.target === specModal) closeSpecModal();
  });

  if (specToBookBtn) {
    specToBookBtn.addEventListener('click', () => {
      closeSpecModal();
      openTestRideModal(currentSpecModelId);
    });
  }
});
