
import { BookCover } from '@/types/book';

// Mock data for book covers
// In a real implementation, this would be connected to the COBISS Plus API
const mockBookCovers: BookCover[] = [
  {
    id: "1",
    title: "Mali princ",
    author: "Antoine de Saint-Exupéry",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=700&h=1000&auto=format",
    year: "2017",
    publisher: "Mladinska knjiga",
    cobissUrl: "https://plus.cobiss.net/cobiss/si/sl/bib/290980864",
  },
  {
    id: "2",
    title: "Muca Copatarica",
    author: "Ela Peroci",
    coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=700&h=1000&auto=format",
    year: "2018",
    publisher: "Mladinska knjiga",
    cobissUrl: "https://plus.cobiss.net/cobiss/si/sl/bib/297246976",
  },
  {
    id: "3",
    title: "Zlatolaska in trije medvedi",
    author: "Robert Southey",
    coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&h=1000&auto=format",
    year: "2015",
    publisher: "Učila International",
    cobissUrl: "https://plus.cobiss.net/cobiss/si/sl/bib/280007680",
  },
  {
    id: "4",
    title: "Piki in prijatelji",
    author: "Kajetan Kovič",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=700&h=1000&auto=format",
    year: "2016",
    publisher: "DZS",
    cobissUrl: "https://plus.cobiss.net/cobiss/si/sl/bib/285868544",
  },
  {
    id: "5",
    title: "Grdi raček",
    author: "Hans Christian Andersen",
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=700&h=1000&auto=format",
    year: "2019",
    publisher: "Morfem",
    cobissUrl: "https://plus.cobiss.net/cobiss/si/sl/bib/303082496",
  }
];

// Function to fetch a random book cover
export const fetchRandomBookCover = async (): Promise<BookCover> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get a random book from the mock data
  const randomIndex = Math.floor(Math.random() * mockBookCovers.length);
  return mockBookCovers[randomIndex];
};

// Function to fetch a specific book cover by ID
export const fetchBookCoverById = async (id: string): Promise<BookCover | null> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find book by ID
  const book = mockBookCovers.find(book => book.id === id);
  return book || null;
};

// In a real implementation, you would add functions to connect to the actual COBISS Plus API
// For example:
/*
export const fetchBooksFromCobiss = async (query: string): Promise<BookCover[]> => {
  const response = await fetch(`https://plus.cobiss.net/api/search?query=${encodeURIComponent(query)}`);
  const data = await response.json();
  
  // Transform the API response to our BookCover type
  return data.results.map(item => ({
    id: item.id,
    title: item.title,
    author: item.author,
    coverUrl: item.coverUrl,
    cobissUrl: `https://plus.cobiss.net/cobiss/si/sl/bib/${item.id}`,
    year: item.year,
    publisher: item.publisher
  }));
};
*/
