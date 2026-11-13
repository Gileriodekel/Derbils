import { config, skillKeys } from '../data/config';
import { derbilSvg, svgImage } from '../render/dynasty-art';
import { gallerySamples } from '../render/gallery';
import type { LifeStage } from '../sim/types';

export function createGallery(root: HTMLElement) {
  root.innerHTML = `<details class="gallery-view"><summary>Appearance gallery <span>VISUAL QA</span></summary>
    <p class="skills-note">Compare learned parts, inherited family traits, and unrelated founders.</p>
    <div class="gallery-controls"><label>Preset<select id="gallery-preset"><option value="presets">Base + skill presets</option>
      <option value="base">Base</option>${skillKeys.map(s => `<option value="${s}">${config.skillCatalog[s].name} maxed</option>`).join('')}
      <option value="all">All skills maxed</option><option value="progression">Same genes, different skills</option>
      <option value="family">Same skills, different genes · family</option><option value="random">20 random founders</option>
      <option value="ranges">Inherited color ranges</option></select></label>
      <label>Stage<select id="gallery-stage">${['baby', 'juvenile', 'adult', 'elder', 'egg', 'cocoon'].map(s => `<option${s === 'adult' ? ' selected' : ''}>${s}</option>`).join('')}</select></label>
      <label>Facing<select id="gallery-facing"><option value="right">Right</option><option value="left">Left</option></select></label></div>
    <div class="appearance-grid" aria-label="Sample Derbil appearances"></div></details>`;
  const samples = gallerySamples(), grid = root.querySelector('.appearance-grid')!;
  (grid as HTMLElement).style.gap = `${config.appearance.gallery.gridGap}px`;
  const preset = root.querySelector<HTMLSelectElement>('#gallery-preset')!;
  const stage = root.querySelector<HTMLSelectElement>('#gallery-stage')!;
  const facing = root.querySelector<HTMLSelectElement>('#gallery-facing')!;
  const details = root.querySelector('details')!;
  let suspended=false;
  function draw() {
    if(suspended)return;
    const selected = samples.filter(s => preset.value === 'presets' ? ['base', ...skillKeys, 'all'].includes(s.preset) : s.preset === preset.value);
    grid.replaceChildren(...selected.map(sample => {
      const figure = document.createElement('figure'), canvas = document.createElement('canvas'), caption = document.createElement('figcaption');
      figure.style.background = config.appearance.gallery.background;
      canvas.width = canvas.height = config.appearance.gallery.cellPixels;
      canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', `${sample.label}, ${stage.value}, facing ${facing.value}`);
      const ctx = canvas.getContext('2d')!, size = config.appearance.gallery.cellPixels;
      const creature = { ...sample.creature, stage: stage.value as LifeStage };
      const svg=derbilSvg(creature);
      const paint=()=>{const img=svgImage(svg,paint);if(!img.complete||!img.naturalWidth)return;
        ctx.resetTransform();ctx.clearRect(0,0,size,size);ctx.translate(size/2,size/2);if(facing.value==='left')ctx.scale(-1,1);
        const scale=Math.min(size/img.naturalWidth,size/img.naturalHeight);ctx.drawImage(img,-img.naturalWidth*scale/2,-img.naturalHeight*scale/2,img.naturalWidth*scale,img.naturalHeight*scale);};paint();
      caption.textContent = sample.label; figure.append(canvas, caption); return figure;
    }));
  }
  for (const select of [preset, stage, facing]) select.addEventListener('change', draw);
  details.addEventListener('toggle', () => { if (details.open) draw(); });
  return { setSuspended(value:boolean){suspended=value;if(!value){if(details.open)draw();}} };
}
