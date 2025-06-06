
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { useTheme } from 'next-themes';

interface SettingsState {
  volume: number;
  soundEnabled: boolean;
  darkMode: boolean;
}

export const SettingsDialog: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsState>({
    volume: 50,
    soundEnabled: true,
    darkMode: theme === 'dark'
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('puzzleGameSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('puzzleGameSettings', JSON.stringify(settings));
  }, [settings]);

  const handleSoundToggle = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, soundEnabled: enabled }));
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, darkMode: enabled }));
    setTheme(enabled ? 'dark' : 'light');
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(event.target.value);
    setSettings(prev => ({ ...prev, volume }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-all duration-200 rounded-xl shadow-sm"
        >
          <Settings className="h-5 w-5" />
          Nastavitve
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            ⚙️ Nastavitve
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Zvok */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🔊 Zvok</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="sound-toggle" className="text-sm font-medium text-gray-700">
                  Omogoči zvok
                </label>
                <Switch
                  id="sound-toggle"
                  checked={settings.soundEnabled}
                  onCheckedChange={handleSoundToggle}
                />
              </div>
              
              {settings.soundEnabled && (
                <div className="space-y-2">
                  <label htmlFor="volume" className="text-sm font-medium text-gray-700">
                    Glasnost: {settings.volume}%
                  </label>
                  <input
                    id="volume"
                    type="range"
                    min="0"
                    max="100"
                    value={settings.volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Videz */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎨 Videz</h3>
            
            <div className="flex items-center justify-between">
              <label htmlFor="dark-mode-toggle" className="text-sm font-medium text-gray-700">
                Temni način
              </label>
              <Switch
                id="dark-mode-toggle"
                checked={settings.darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
