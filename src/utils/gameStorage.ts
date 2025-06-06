
import { ScoreResult } from './scoringSystem';

export interface GameResult {
    grid: string;
    time: number;
    points: number;
    maxPoints: number;
    rank: ScoreResult['rank'];
    date: string;
    hintsUsed: number; // Dodano
    pointsLostToHints: number; // Dodano
  }
  
  export interface GameStatistics {
    best: number;
    average: number;
    totalGames: number;
    totalPoints: number;
    averageTime: number; // Dodano
    totalHintsUsed: number; // Dodano
    totalPointsLostToHints: number; // Dodano
    successRate: number; // Dodano
  }
  
  export class GameStorage {
    // Shrani rezultat igre
    static saveResult(
      rows: number, 
      cols: number, 
      time: number, 
      points: number, 
      maxPoints: number, 
      rank: ScoreResult['rank'],
      hintsUsed: number = 0,
      pointsLostToHints: number = 0
    ): void {
      const result: GameResult = {
        grid: `${rows}x${cols}`,
        time,
        points,
        maxPoints,
        rank,
        date: new Date().toISOString(),
        hintsUsed,
        pointsLostToHints
      };
  
      const key = `results_${rows}x${cols}`;
      const results = this.getResults(rows, cols);
      results.push(result);
      localStorage.setItem(key, JSON.stringify(results));
  
      let totalPoints = parseInt(localStorage.getItem('totalPoints') || '0');
      totalPoints += points;
      localStorage.setItem('totalPoints', totalPoints.toString());
    }
  
    // Pridobi rezultate za doloceno velikost mreze
    static getResults(rows: number, cols: number): GameResult[] {
      const key = `results_${rows}x${cols}`;
      const results = localStorage.getItem(key);
      return results ? JSON.parse(results) : [];
    }
  
    // Pridobi statistiko za doloceno velikost mreze
    static getStatistics(rows: number, cols: number): GameStatistics {
      const results = this.getResults(rows, cols);
      
      if (results.length === 0) {
        return {
          best: 0,
          average: 0,
          totalGames: 0,
          totalPoints: 0,
          averageTime: 0,
          totalHintsUsed: 0,
          totalPointsLostToHints: 0,
          successRate: 0
        };
      }

      const best = Math.max(...results.map(r => r.points));
      const average = Math.floor(results.reduce((sum, r) => sum + r.points, 0) / results.length);
      const totalPoints = parseInt(localStorage.getItem('totalPoints') || '0');
      const averageTime = Math.floor(results.reduce((sum, r) => sum + r.time, 0) / results.length);
      const totalHintsUsed = results.reduce((sum, r) => sum + (r.hintsUsed || 0), 0);
      const totalPointsLostToHints = results.reduce((sum, r) => sum + (r.pointsLostToHints || 0), 0);
      const successRate = Math.round((results.length / results.length) * 100); // 100% za dokončane igre

      return {
        best,
        average,
        totalGames: results.length,
        totalPoints,
        averageTime,
        totalHintsUsed,
        totalPointsLostToHints,
        successRate
      };
    }
  
    static getTotalPoints(): number {
      return parseInt(localStorage.getItem('totalPoints') || '0');
    }
  
    static getAllResults(): GameResult[] {
      const allResults: GameResult[] = [];
      
      const gridSizes = [
        [2, 2], [2, 3], [3, 3], [3, 4], [4, 4], [4, 5]
      ];
  
      gridSizes.forEach(([rows, cols]) => {
        const results = this.getResults(rows, cols);
        allResults.push(...results);
      });
  
      return allResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Globalna statistika za vse igre
    static getGlobalStatistics(): GameStatistics {
      const allResults = this.getAllResults();
      
      if (allResults.length === 0) {
        return {
          best: 0,
          average: 0,
          totalGames: 0,
          totalPoints: 0,
          averageTime: 0,
          totalHintsUsed: 0,
          totalPointsLostToHints: 0,
          successRate: 0
        };
      }

      const best = Math.max(...allResults.map(r => r.points));
      const average = Math.floor(allResults.reduce((sum, r) => sum + r.points, 0) / allResults.length);
      const totalPoints = this.getTotalPoints();
      const averageTime = Math.floor(allResults.reduce((sum, r) => sum + r.time, 0) / allResults.length);
      const totalHintsUsed = allResults.reduce((sum, r) => sum + (r.hintsUsed || 0), 0);
      const totalPointsLostToHints = allResults.reduce((sum, r) => sum + (r.pointsLostToHints || 0), 0);

      return {
        best,
        average,
        totalGames: allResults.length,
        totalPoints,
        averageTime,
        totalHintsUsed,
        totalPointsLostToHints,
        successRate: 100 // Za dokončane igre
      };
    }
  }
