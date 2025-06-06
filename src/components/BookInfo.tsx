
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookCover } from '@/types/book';
import { ExternalLink, Quote } from 'lucide-react';

interface BookInfoProps {
  book: BookCover | null;
}

export const BookInfo: React.FC<BookInfoProps> = ({ book }) => {
  if (!book) return null;

  const cobissUrl = book.cobissUrl || `https://www.cobiss.net/si/sl/bib/search?q=${encodeURIComponent(book.title)}`;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{book.title}</h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">Avtor:</span>
          <span className="text-gray-900 font-semibold">{book.author}</span>
        </div>
        
        {book.year && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Leto:</span>
            <span className="text-gray-900">{book.year}</span>
          </div>
        )}
        
        {book.publisher && (
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Založba:</span>
            <span className="text-gray-900">{book.publisher}</span>
          </div>
        )}
      </div>

      {book.quote && (
        <div className="bg-white/70 rounded-lg p-4 mb-4 border-l-4 border-blue-400">
          <div className="flex items-start gap-2">
            <Quote className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <p className="text-gray-700 italic text-sm leading-relaxed">
              "{book.quote}"
            </p>
          </div>
        </div>
      )}

      {book.description && (
        <div className="bg-white/50 rounded-lg p-4 mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {book.description}
          </p>
        </div>
      )}
      
      <div className="flex gap-3 pt-2">
        <Button 
          variant="default" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => window.open(cobissUrl, '_blank')}
        >
          <ExternalLink size={16} />
          <span>Odpri v COBISS Plus</span>
        </Button>
      </div>
    </div>
  );
};
