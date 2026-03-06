import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export function useGameTheme() {
  const { darkMode } = useContext(ThemeContext);
  const isDark = !!darkMode;

  const accentGradient = 'linear-gradient(135deg,#4fc3f7,#7c4dff)';
  const panelBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';
  const titleColor = isDark ? '#ffffff' : '#111827';
  const subColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)';
  const cellBorder = isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)';
  const cellBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)';
  const unrevealedCellBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const smallBtn = {
    padding: '8px 14px',
    borderRadius: 12,
    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
    background: panelBg,
    color: isDark ? '#fff' : '#111',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'var(--body-font)',
    transition: 'all 0.14s ease',
  };

  const styles = {
    isDark,
    accentGradient,
    panelBg,
    titleColor,
    subColor,
    cellBorder,
    cellBg,
    unrevealedCellBg,
    smallBtn,
  };

  return styles;
}
