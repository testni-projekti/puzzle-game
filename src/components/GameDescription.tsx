
import React from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { BookOpen, Play, Gift, Info } from 'lucide-react';

interface GameDescriptionProps {
  open: boolean;
  onClose: () => void;
}

export const GameDescription: React.FC<GameDescriptionProps> = ({ 
  open, 
  onClose 
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-primary text-center">
            Knjižni Puzzle - Opis igre
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <AlertDialogDescription className="space-y-6 text-foreground">
          <section className="space-y-2 border-b pb-4">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">1. Zagon igre / Začetni zaslon</h3>
            </div>
            <p>
              Uporabnik vidi barvit in igriv začetni zaslon z naslovom: "Knjižni Puzzle".
              Na voljo so možnosti:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Izbira težavnosti (2×2, 2×3, 3×3, 3×4, 4×4, 4×5)</li>
              <li>Naključno izbrana naslovnica iz knjižnice COBISS Plus</li>
              <li>Začetek igre</li>
              <li>Povezava do COBISS Plus za odkrivanje več knjig</li>
            </ul>
          </section>

          <section className="space-y-2 border-b pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">2. Priprava sestavljanke</h3>
            </div>
            <p>Ko uporabnik začne igro, aplikacija:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Naloži sliko izbrane knjige (~700×1000 px)</li>
              <li>Razreže jo na ustrezno število kosov glede na izbrano težavnost</li>
              <li>Vsak košček se naključno pomeša in položi na polje</li>
              <li>Koščki so naključno zavrteni pri vseh težavnostih</li>
            </ul>
          </section>

          <section className="space-y-2 border-b pb-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">3. Igranje</h3>
            </div>
            <p>Cilj: Sestaviti razrezano naslovnico v pravilen položaj in orientacijo.</p>
            <p className="font-semibold">Interakcije:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Na računalniku:</strong> Z miško povlečeš kos + dvojni klik za zavrtenje</li>
              <li><strong>Na tablici/telefonu:</strong> S prstom povlečeš kos + dvojni tap za zavrtenje</li>
            </ul>
            <p>Ko je košček na pravem mestu in pravilno obrnjen, "zaskoči" na svoje mesto.</p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">4. Zaključek igre</h3>
            </div>
            <p>Ko so vsi koščki pravilno nameščeni:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Naslovnica se pokaže v celoti</li>
              <li>Predvaja se zvočni efekt za nagrado</li>
              <li>Prikaže se okno z informacijami o knjigi</li>
              <li>Možnost nadaljevanja z novo knjigo ali ponovno igro</li>
              <li>Povezava do knjige v sistemu COBISS Plus</li>
            </ul>
          </section>

          <div className="pt-4 text-center italic text-sm text-muted-foreground">
            <p>Namen igre je spodbuditi otroke k raziskovanju knjižnice COBISS Plus, povečati vizualno prepoznavnost knjig in omogočiti zabavno učenje.</p>
          </div>
        </AlertDialogDescription>
        
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="w-full">
            Začni igro
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
