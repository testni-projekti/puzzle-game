
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Difficulty = {
  cols: number;
  rows: number;
  label: string;
};

interface DifficultySelectorProps {
  difficulties: Difficulty[];
  selected: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulties,
  selected,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <p className="font-medium text-gray-700">Izberi težavnost:</p>
      <div className="flex flex-wrap gap-2">
        {difficulties.map((difficulty) => (
          <Button
            key={difficulty.label}
            variant={selected.label === difficulty.label ? "default" : "outline"}
            className={cn(
              "transition-all",
              selected.label === difficulty.label 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-primary/10"
            )}
            onClick={() => onChange(difficulty)}
          >
            {difficulty.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
