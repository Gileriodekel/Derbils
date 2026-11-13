import { config } from '../data/config';
import type { UiSettings } from './types';
export const settingsKey='creature-habitat.ui-settings';
export function defaultSettings():UiSettings{return {defaultSpeed:config.presentation.defaultSpeed,reducedMotion:null,socialOverlays:true,actionBubbles:true,textSize:config.presentation.defaultTextSize,highContrast:false,dismissedHints:[]};}
export function resolveReducedMotion(saved:boolean|null,mediaQueryMatches:boolean):boolean{return saved??mediaQueryMatches;}
export function readSettings(storage:Pick<Storage,'getItem'>):UiSettings {
  try {
    const saved=JSON.parse(storage.getItem(settingsKey)??'null'),defaults=defaultSettings();
    if(!saved||typeof saved!=='object')return defaults;
    return {defaultSpeed:config.clock.foregroundSpeeds.includes(saved.defaultSpeed)&&saved.defaultSpeed!==0?saved.defaultSpeed:defaults.defaultSpeed,
      reducedMotion:typeof saved.reducedMotion==='boolean'?saved.reducedMotion:null,socialOverlays:typeof saved.socialOverlays==='boolean'?saved.socialOverlays:true,
      actionBubbles:typeof saved.actionBubbles==='boolean'?saved.actionBubbles:true,
      textSize:config.presentation.textSizes.includes(saved.textSize)?saved.textSize:defaults.textSize,highContrast:saved.highContrast===true,
      dismissedHints:Array.isArray(saved.dismissedHints)?saved.dismissedHints.filter((s:unknown)=>typeof s==='string'):[]};
  }catch{return defaultSettings();}
}
export function writeSettings(storage:Pick<Storage,'setItem'>,settings:UiSettings):void{storage.setItem(settingsKey,JSON.stringify(settings));}
export function clearSettings(storage:Pick<Storage,'removeItem'>):void{storage.removeItem(settingsKey);}
