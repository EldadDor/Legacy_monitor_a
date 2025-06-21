import React from 'react';
import { useTheme, ThemeType } from '../../contexts/ThemeContextProvider';
import styles from './ThemeSelector.css';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { value: ThemeType; label: string; description: string }[] = [
    { 
      value: 'default', 
      label: 'Default', 
      description: 'Standard blue theme' 
    },
    { 
      value: 'dark-red', 
      label: 'Dark Red', 
      description: 'Dark theme with red and yellow accents' 
    },
    { 
      value: 'light', 
      label: 'Light', 
      description: 'Clean white theme' 
    }
  ];

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as ThemeType);
  };

  return (
    <div className={styles.themeSelector}>
      <label htmlFor="theme-select" className={styles.label}>
        <i className="fas fa-palette me-2"></i>
        Theme
      </label>
      <select
        id="theme-select"
        className={`form-select form-select-sm ${styles.select}`}
        value={theme}
        onChange={handleThemeChange}
      >
        {themes.map((themeOption) => (
          <option key={themeOption.value} value={themeOption.value}>
            {themeOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;