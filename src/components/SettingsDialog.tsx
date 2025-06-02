
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { useTheme } from 'next-themes';

interface SettingsState {
  volume: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export const SettingsDialog: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsState>({
    volume: 50,
    soundEnabled: true,
    musicEnabled: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('gameSettings', JSON.stringify(updated));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Settings className="h-4 w-4" />
          Nastavitve
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nastavitve igre</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Volume Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Glasnost: {settings.volume}%</label>
            <Slider
              value={[settings.volume]}
              onValueChange={(value) => updateSettings({ volume: value[0] })}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Zvočni efekti</label>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
            />
          </div>

          {/* Background Music */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Glasba v ozadju</label>
            <Switch
              checked={settings.musicEnabled}
              onCheckedChange={(checked) => updateSettings({ musicEnabled: checked })}
            />
          </div>

          {/* Theme Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tema</label>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className="flex-1"
              >
                Svetla
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="flex-1"
              >
                Temna
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
                className="flex-1"
              >
                Sistem
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
