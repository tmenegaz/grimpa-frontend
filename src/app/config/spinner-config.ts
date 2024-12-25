import { InjectionToken } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

export interface SpinnerConfig {
  mode: ProgressSpinnerMode;
  value: number;
  strokeWidth: number;
}

export const DEFAULT_SPINNER_CONFIG: SpinnerConfig = {
  mode: 'indeterminate',
  value: 80,
  strokeWidth: 6
};

export const SPINNER_CONFIG = new InjectionToken<SpinnerConfig>('spinner.config', {
  providedIn: 'root',
  factory: () => DEFAULT_SPINNER_CONFIG
});
