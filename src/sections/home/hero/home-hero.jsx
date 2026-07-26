import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';

import { Box } from '@mui/material';

import { useLocales, useTranslate } from 'src/locales';

import patientsImg from '../images/patients.svg';
import innovationImg from '../images/innovation.svg';

// Uniform background pulled from the DigitalTrust hero.
const HERO_BG = 'linear-gradient(rgba(60, 176, 153, 0.7), rgba(112, 216, 192, 0.24))';

// Scoped styles adapted from the demo reference. All selectors are nested under
// `.hakeemna-hero` so the bare element rules (h1, .lead, ...) never leak onto the
// rest of the page. Every slide shares the DigitalTrust background gradient.
const heroCss = `
.hakeemna-hero{
  --teal-deep:#155e63;
  --ink:#0b2e33;
  --ink-soft:#25464b;
  --navy:#16255e;
  --accent:#f2704a;
  --white:#ffffff;
  --mint-pale:#d0f7fc;
  font-family:inherit;
  color:var(--ink);
}
.hakeemna-hero .slide{
  position:relative;
  min-height:600px;
  display:flex;align-items:center;
  overflow:hidden;
  border-bottom-left-radius:60px;
  border-bottom-right-radius:60px;
  background:${HERO_BG};
}
.hakeemna-hero .rail{position:absolute;left:22px;top:50%;transform:translateY(-50%);
  display:flex;flex-direction:column;gap:12px;z-index:6;}
.hakeemna-hero .rail button{width:4px;height:26px;border-radius:4px;background:rgba(11,46,51,.2);
  transition:.3s;cursor:pointer;border:0;padding:0;appearance:none;}
.hakeemna-hero .rail button.on{background:var(--accent);height:34px;}
.hakeemna-hero .inner{width:100%;max-width:1240px;margin:0 auto;padding:0 72px;position:relative;z-index:5;}
.hakeemna-hero .eyebrow{
  display:inline-flex;align-items:center;gap:10px;
  font-size:12px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;
  color:var(--teal-deep);margin-bottom:22px;
}
.hakeemna-hero .eyebrow .pulse{width:34px;height:12px;overflow:visible;}
.hakeemna-hero .eyebrow .pulse path{
  fill:none;stroke:var(--accent);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:60;stroke-dashoffset:60;animation:hh-draw 2.4s ease-in-out infinite;
}
@keyframes hh-draw{0%{stroke-dashoffset:60}45%{stroke-dashoffset:0}75%{stroke-dashoffset:0}100%{stroke-dashoffset:-60}}
.hakeemna-hero h1{font-family:inherit;font-weight:800;line-height:1.1;
  letter-spacing:-.01em;color:var(--ink);margin:0;}
.hakeemna-hero .lead{font-size:16.5px;font-weight:300;color:var(--ink-soft);max-width:620px;margin-top:26px;}
.hakeemna-hero .readmore{
  display:inline-flex;align-items:stretch;margin-top:34px;border-radius:12px;overflow:hidden;
  box-shadow:0 14px 30px -12px rgba(11,46,51,.4);text-decoration:none;transition:transform .25s ease;
}
.hakeemna-hero .readmore:hover{transform:translateY(-2px);}
.hakeemna-hero .readmore .label{background:var(--white);color:var(--ink);font-family:inherit;
  font-weight:700;font-size:16px;padding:15px 24px;}
.hakeemna-hero .readmore .arrow{background:var(--navy);display:flex;align-items:center;justify-content:center;
  padding:0 18px;transition:background .25s ease;}
.hakeemna-hero .readmore:hover .arrow{background:var(--accent);}
.hakeemna-hero .readmore .arrow svg{width:18px;height:18px;stroke:#fff;}
.hakeemna-hero .ambient{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;}
.hakeemna-hero .ambient .b{position:absolute;border-radius:50%;background:rgba(255,255,255,.5);
  filter:blur(1px);animation:hh-float 9s ease-in-out infinite;}
@keyframes hh-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}

/* SLIDE 1 - Electronic Innovation */
.hakeemna-hero .s1 h1{font-size:clamp(30px,4.4vw,60px);max-width:20ch;line-height:1.18;}
.hakeemna-hero .s1 .inner{display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:20px;
  padding-top:110px;padding-bottom:90px;}
.hakeemna-hero .s1 .copy{max-width:560px;}
.hakeemna-hero .grid-tex{position:absolute;inset:0;z-index:1;
  background-image:linear-gradient(rgba(21,94,99,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(21,94,99,.05) 1px,transparent 1px);
  background-size:52px 52px;-webkit-mask-image:radial-gradient(80% 70% at 60% 30%,#000,transparent 78%);
  mask-image:radial-gradient(80% 70% at 60% 30%,#000,transparent 78%);}
.hakeemna-hero .arch{position:relative;justify-self:end;align-self:center;width:100%;max-width:440px;z-index:5;
  animation:hh-cardfloat 7s ease-in-out infinite;}
.hakeemna-hero .arch-img{width:100%;height:auto;display:block;
  filter:drop-shadow(0 30px 60px rgba(11,46,51,.3));}

/* SLIDE 2 - Beneficiary */
.hakeemna-hero .s2 .inner{display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:20px;
  padding-top:110px;padding-bottom:90px;}
.hakeemna-hero .s2 h1{font-size:clamp(46px,7vw,104px);}
.hakeemna-hero .s2 .copy{max-width:560px;}
.hakeemna-hero .portrait{position:relative;justify-self:end;align-self:center;width:100%;max-width:440px;}
.hakeemna-hero .portrait .arch-img{filter:drop-shadow(0 30px 60px -18px rgba(11,46,51,.4));}
.hakeemna-hero .card{position:absolute;z-index:3;background:#fff;border-radius:14px;padding:10px 16px;
  box-shadow:0 12px 26px -10px rgba(11,46,51,.4);display:flex;align-items:center;gap:10px;
  font-size:13px;font-weight:500;color:var(--ink);animation:hh-cardfloat 6s ease-in-out infinite;}
.hakeemna-hero .card.tag{top:26px;left:-18px;}
.hakeemna-hero .card.ring{bottom:34px;right:-14px;flex-direction:column;gap:2px;text-align:center;animation-delay:-3s;}
.hakeemna-hero .card .dot{width:9px;height:9px;border-radius:50%;background:var(--accent);
  box-shadow:0 0 0 5px rgba(242,112,74,.18);animation:hh-ping 2s ease-out infinite;}
.hakeemna-hero .card.ring b{font-family:inherit;font-size:22px;color:var(--teal-deep);line-height:1;}
.hakeemna-hero .card.ring small{font-size:11px;color:var(--ink-soft);letter-spacing:.05em;}
@keyframes hh-cardfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes hh-ping{0%{box-shadow:0 0 0 0 rgba(242,112,74,.35)}70%{box-shadow:0 0 0 10px rgba(242,112,74,0)}100%{box-shadow:0 0 0 0 rgba(242,112,74,0)}}

/* SLIDE 3 - Unit Of Service */
.hakeemna-hero .s3 .inner{display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:24px;
  padding-top:110px;padding-bottom:90px;}
.hakeemna-hero .s3 h1{font-size:clamp(42px,6vw,92px);}
.hakeemna-hero .s3 .copy{max-width:600px;}
.hakeemna-hero .doctor{position:relative;justify-self:end;width:100%;max-width:420px;height:520px;}
.hakeemna-hero .doctor .stage{position:absolute;inset:0;border-radius:210px 210px 46px 46px;
  background:radial-gradient(85% 55% at 55% 18%, #fff 0%, var(--mint-pale) 50%, #8fd3c3 100%);
  box-shadow:inset 0 2px 0 rgba(255,255,255,.7),0 30px 60px -24px rgba(11,46,51,.35);overflow:hidden;}
.hakeemna-hero .doctor .stage::before{content:"";position:absolute;top:-20%;left:-20%;width:140%;height:140%;
  background:conic-gradient(from 0deg, transparent, rgba(255,255,255,.55), transparent 40%);
  animation:hh-spin 14s linear infinite;}
@keyframes hh-spin{to{transform:rotate(360deg)}}
.hakeemna-hero .doctor .doc-svg{position:absolute;bottom:0;left:50%;transform:translateX(-50%);z-index:2;height:88%;width:auto;}
.hakeemna-hero .vitals{position:absolute;top:64px;left:-26px;z-index:4;background:#fff;border-radius:16px;padding:14px 16px;
  box-shadow:0 16px 34px -12px rgba(11,46,51,.45);width:186px;animation:hh-cardfloat 6.5s ease-in-out infinite;}
.hakeemna-hero .vitals .vtop{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.hakeemna-hero .vitals .vtop span{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft);}
.hakeemna-hero .vitals .vtop b{font-family:inherit;color:var(--accent);font-size:18px;}
.hakeemna-hero .ecg{width:100%;height:34px;overflow:visible;}
.hakeemna-hero .ecg path{fill:none;stroke:var(--accent);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:220;stroke-dashoffset:220;animation:hh-trace 2.6s linear infinite;}
@keyframes hh-trace{to{stroke-dashoffset:-220}}
.hakeemna-hero .rec{position:absolute;bottom:70px;right:-22px;z-index:4;background:var(--navy);color:#fff;border-radius:14px;
  padding:12px 16px;box-shadow:0 16px 34px -12px rgba(11,46,51,.5);animation:hh-cardfloat 6s ease-in-out infinite;animation-delay:-2.5s;}
.hakeemna-hero .rec small{display:block;font-size:10px;letter-spacing:.14em;opacity:.7;text-transform:uppercase;}
.hakeemna-hero .rec b{font-family:inherit;font-size:20px;}

/* SLIDE 4 - Building Digital Trust */
.hakeemna-hero .s4 .inner{padding-top:120px;padding-bottom:120px;text-align:center;
  display:flex;flex-direction:column;align-items:center;}
.hakeemna-hero .s4 h1{font-size:clamp(44px,6.6vw,98px);}
.hakeemna-hero .s4 .lead{margin-left:auto;margin-right:auto;max-width:720px;}
.hakeemna-hero .s4 .eyebrow{justify-content:center;}
.hakeemna-hero .web{position:absolute;inset:0;z-index:1;opacity:.5;pointer-events:none;}
.hakeemna-hero .web line{stroke:rgba(21,94,99,.28);stroke-width:1;}
.hakeemna-hero .web circle{fill:var(--teal-deep);}
.hakeemna-hero .web .node{animation:hh-nodepulse 3.5s ease-in-out infinite;transform-origin:center;transform-box:fill-box;}
@keyframes hh-nodepulse{0%,100%{opacity:.4}50%{opacity:1}}

@media(max-width:900px){
  .hakeemna-hero .inner{padding:0 34px !important;}
  .hakeemna-hero .rail{display:none;}
  .hakeemna-hero .s1 .inner,.hakeemna-hero .s2 .inner,.hakeemna-hero .s3 .inner{grid-template-columns:1fr;gap:40px;
    padding-top:70px;padding-bottom:60px;justify-items:center;text-align:center;}
  .hakeemna-hero .s1 .copy,.hakeemna-hero .s2 .copy,.hakeemna-hero .s3 .copy{margin:0 auto;}
  .hakeemna-hero .s1 .eyebrow,.hakeemna-hero .s2 .eyebrow,.hakeemna-hero .s3 .eyebrow{justify-content:center;}
  .hakeemna-hero .s1 .lead,.hakeemna-hero .s2 .lead,.hakeemna-hero .s3 .lead{margin-left:auto;margin-right:auto;}
  .hakeemna-hero .arch,.hakeemna-hero .portrait,.hakeemna-hero .doctor{justify-self:center;max-width:340px;margin:0 auto;}
  .hakeemna-hero .doctor{height:460px;}
}
@media(max-width:600px){
  .hakeemna-hero .slide{min-height:auto;border-bottom-left-radius:36px;border-bottom-right-radius:36px;}
  .hakeemna-hero .inner{padding:0 22px !important;}
  .hakeemna-hero .s1 .inner,.hakeemna-hero .s2 .inner,.hakeemna-hero .s3 .inner,.hakeemna-hero .s4 .inner{
    grid-template-columns:1fr;padding-top:70px;padding-bottom:60px;}
  .hakeemna-hero .lead{font-size:15px;margin-top:20px;}
  .hakeemna-hero .eyebrow{font-size:11px;letter-spacing:.16em;margin-bottom:16px;}
  /* hide the decorative illustrations on small screens */
  .hakeemna-hero .arch,.hakeemna-hero .portrait,.hakeemna-hero .doctor{display:none;}
  .hakeemna-hero .readmore{margin-top:26px;}
  .hakeemna-hero .readmore .label{padding:12px 18px;font-size:15px;}
}
@media(prefers-reduced-motion:reduce){
  .hakeemna-hero *{animation:none !important;}
  .hakeemna-hero .eyebrow .pulse path{stroke-dashoffset:0;}
  .hakeemna-hero .ecg path{stroke-dashoffset:0;}
}
`;

const Pulse = (
  <svg className="pulse" viewBox="0 0 34 12">
    <path d="M0 6h7l3-4 4 8 3-6 3 2h11" />
  </svg>
);

function ReadMore({ href, curLangAr, label }) {
  return (
    <a className="readmore" href={href}>
      <span className="label">{label}</span>
      <span className="arrow">
        {curLangAr ? (
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        )}
      </span>
    </a>
  );
}

ReadMore.propTypes = {
  href: PropTypes.string,
  curLangAr: PropTypes.bool,
  label: PropTypes.string,
};

export default function HomeHero() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);

  const title = [
    t('Electronic innovation for a healthier future'),
    t('beneficiary'),
    t('unit of service'),
    t('Building Digital Trust'),
  ];

  const eyebrow = [
    t('Hakeemna 360'),
    t('For Patients'),
    t('For Providers'),
    t('Digital Presence'),
  ];

  const texts = [
    t(
      'Hakimna 360 is An integrated electronic system for organizing work between medical service providers (such as doctors, laboratories, a specialized medical center, a radiology center, and others) and all members of society. It also provides various services such as keeping personal medical records for individuals and integrated management of medical institutions.'
    ),
    t(
      'Hakimna 360 provides patients with flexible storage and management of medical data and information, facilitating access to information, medical history, and data collaboration at any time and at any time, and communicating efficiently with medical heroes.'
    ),
    t(
      'Hakeemna 360 platform enables healthcare providers to manage patient records electronically and manage their organizations efficiently and easily, paving the way for focusing on the most important things in your business, enhancing excellence and competitiveness. The platform meets the needs of medical institutions, clinics, laboratories, specialized medical centers, radiology centers, and others.'
    ),
    t(
      'In the current digital age, patients no longer search for doctors through traditional methods, but rather begin their journey on social media platforms. A strong digital presence for your medical institution and clinic has become the primary criterion for building a professional image and enhancing credibility. The content you provide is what drives patients to make the actual decision to book an appointment and attend the clinic.'
    ),
  ];

  const buttonInfo = [
    null,
    { label: t('Read more'), path: '/patients' },
    { label: t('Read more'), path: '/units' },
    { label: t('Read more'), path: '/digitaltrust' },
  ];

  const backgroundImages = ['', '', '', ''];

  const capitalizedText = (texts[currentIndex] || '').replace(/^([a-zA-Z؀-ۿ])/, (c) =>
    c.toUpperCase()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === texts.length - 1 ? 0 : prevIndex + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [texts.length]);

  const Eyebrow = (
    <span className="eyebrow">
      {Pulse}
      {eyebrow[currentIndex]}
    </span>
  );

  const slideClass = `slide s${currentIndex + 1}`;

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Hakeemna 360</title>
        <meta name="description" content={texts[currentIndex]} />
        <meta
          name="keywords"
          content="healthcare, electronic health records, medical platform, digital health"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title[currentIndex]} />
        <meta property="og:description" content={texts[currentIndex]} />
        <meta property="og:image" content={backgroundImages[currentIndex]} />
        <meta property="og:url" content="https://hakeemna.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalOrganization',
            name: 'Hakimna',
            url: 'https://hakeemna.com',
            description: texts[currentIndex],
            image: backgroundImages[currentIndex],
          })}
        </script>
      </Helmet>

      <Box className="hakeemna-hero" sx={{ mb: '100px' }} dir="ltr">
        <style>{heroCss}</style>

        <section className={slideClass}>
          {/* Slide rail / markers */}
          <div className="rail">
            {[0, 1, 2, 3].map((index) => (
              <button
                type="button"
                key={index}
                aria-label={`${t('Go to slide')} ${index + 1}`}
                className={currentIndex === index ? 'on' : ''}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          {/* ---------- SLIDE 1: Electronic Innovation ---------- */}
          {currentIndex === 0 && (
            <>
              <div className="grid-tex" />
              <div className="ambient">
                <span className="b" style={{ width: 10, height: 10, top: '30%', left: '20%' }} />
                <span
                  className="b"
                  style={{ width: 7, height: 7, top: '50%', left: '70%', animationDelay: '-3s' }}
                />
                <span
                  className="b"
                  style={{ width: 12, height: 12, top: '22%', left: '60%', animationDelay: '-5s' }}
                />
              </div>
              <div className="inner">
                <m.div className="copy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  {Eyebrow}
                  <h1>{title[0]}</h1>
                  <p className="lead">{capitalizedText}</p>
                </m.div>
                <m.div className="arch" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
                  <img className="arch-img" src={innovationImg} alt={title[0]} />
                </m.div>
              </div>
            </>
          )}

          {/* ---------- SLIDE 2: Beneficiary ---------- */}
          {currentIndex === 1 && (
            <div className="inner">
              <m.div className="copy" key="c2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                {Eyebrow}
                <h1>{title[1]}</h1>
                <p className="lead">{capitalizedText}</p>
                {buttonInfo[1] && (
                  <ReadMore href={buttonInfo[1].path} curLangAr={curLangAr} label={buttonInfo[1].label} />
                )}
              </m.div>
              <div className="portrait">
                <div className="card tag"><span className="dot" />{t('Family Records')}</div>
                <div className="card ring"><b>360°</b><small>{t('CARE')}</small></div>
                <img className="arch-img" src={patientsImg} alt={title[1]} />
              </div>
            </div>
          )}

          {/* ---------- SLIDE 3: Unit Of Service ---------- */}
          {currentIndex === 2 && (
            <div className="inner">
              <m.div className="copy" key="c3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                {Eyebrow}
                <h1>{title[2]}</h1>
                <p className="lead">{capitalizedText}</p>
                {buttonInfo[2] && (
                  <ReadMore href={buttonInfo[2].path} curLangAr={curLangAr} label={buttonInfo[2].label} />
                )}
              </m.div>
              <div className="doctor">
                <div className="vitals">
                  <div className="vtop"><span>{t('Active Patients')}</span><b>72</b></div>
                  <svg className="ecg" viewBox="0 0 160 34"><path d="M0 17h30l6-12 8 24 6-18 5 6h20l6-9 7 14 5-7h56" /></svg>
                </div>
                {/* <div className="rec"><small>{t('Records')}</small><b>1,248</b></div> */}
                <div className="stage">
                  <svg className="doc-svg" viewBox="0 0 180 300">
                    <path fill="#0b2e33" d="M90 24c-26 0-42 18-42 44 0 14 5 24 5 40l-8 40 90 0-8-40c0-16 5-26 5-40 0-26-16-44-42-44z" />
                    <ellipse cx="90" cy="70" rx="24" ry="27" fill="#f0c9a8" />
                    <path fill="#0b2e33" d="M66 60c0-22 12-36 24-36s24 14 24 36c-6-8-14-12-24-12s-18 4-24 12z" />
                    <path fill="#0b2e33" d="M62 66c-4 22-2 40 6 58l-10 4c-8-22-8-44 4-62zM118 66c4 22 2 40-6 58l10 4c8-22 8-44-4-62z" />
                    <path fill="#fff" d="M52 140c8-10 22-16 38-16s30 6 38 16c10 14 16 60 18 150H34c2-90 8-136 18-150z" stroke="rgba(11,46,51,.12)" strokeWidth="1.5" />
                    <path fill="none" stroke="rgba(11,46,51,.15)" strokeWidth="2" d="M90 128v150" />
                    <path fill="none" stroke="#155e63" strokeWidth="4" strokeLinecap="round" d="M74 130c-2 30-6 54 6 70M106 130c2 24 4 44-4 60" />
                    <circle cx="106" cy="196" r="8" fill="#155e63" />
                    <rect x="108" y="176" width="46" height="62" rx="5" fill="#16255e" transform="rotate(12 131 207)" />
                    <rect x="114" y="184" width="34" height="46" rx="2" fill="#d0f7fc" transform="rotate(12 131 207)" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* ---------- SLIDE 4: Building Digital Trust ---------- */}
          {currentIndex === 3 && (
            <>
              <svg className="web" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
                <line x1="120" y1="120" x2="320" y2="240" /><line x1="320" y1="240" x2="180" y2="420" />
                <line x1="320" y1="240" x2="560" y2="160" /><line x1="560" y1="160" x2="760" y2="300" />
                <line x1="760" y1="300" x2="620" y2="470" /><line x1="760" y1="300" x2="980" y2="200" />
                <line x1="980" y1="200" x2="1080" y2="400" /><line x1="180" y1="420" x2="440" y2="500" />
                <line x1="620" y1="470" x2="440" y2="500" /><line x1="980" y1="200" x2="1090" y2="120" />
                <circle className="node" cx="120" cy="120" r="3" /><circle className="node" cx="320" cy="240" r="4" style={{ animationDelay: '-.5s' }} />
                <circle className="node" cx="180" cy="420" r="3" style={{ animationDelay: '-1s' }} /><circle className="node" cx="560" cy="160" r="4" style={{ animationDelay: '-1.5s' }} />
                <circle className="node" cx="760" cy="300" r="4" style={{ animationDelay: '-2s' }} /><circle className="node" cx="620" cy="470" r="3" style={{ animationDelay: '-2.5s' }} />
                <circle className="node" cx="980" cy="200" r="4" style={{ animationDelay: '-3s' }} /><circle className="node" cx="1080" cy="400" r="3" style={{ animationDelay: '-3.5s' }} />
                <circle className="node" cx="440" cy="500" r="3" style={{ animationDelay: '-1.2s' }} /><circle className="node" cx="1090" cy="120" r="3" style={{ animationDelay: '-2.2s' }} />
              </svg>
              <div className="inner">
                <m.div key="c4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  {Eyebrow}
                  <h1>{title[3]}</h1>
                  <p className="lead">{capitalizedText}</p>
                  {buttonInfo[3] && (
                    <ReadMore href={buttonInfo[3].path} curLangAr={curLangAr} label={buttonInfo[3].label} />
                  )}
                </m.div>
              </div>
            </>
          )}
        </section>
      </Box>
    </>
  );
}
