
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Puzzle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-purple-100 p-4 rounded-full">
            <Puzzle size={64} className="text-purple-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900">Strani ni mogoče najti</h1>
        
        <p className="text-lg text-gray-600">
          Žal nismo mogli najti strani, ki jo iščete. Morda ste vnesli napačen URL ali pa je bila stran odstranjena.
        </p>
        
        <Button 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          size="lg"
          onClick={() => navigate('/')}
        >
          Nazaj na domačo stran
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
