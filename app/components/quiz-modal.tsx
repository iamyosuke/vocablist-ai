// "use client";

// import { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { TRANSLATIONS } from "../constants";
// import ReactMarkdown from "react-markdown";
// import { Volume2 } from "lucide-react";
// import { Vocabulary } from "@prisma/client";

// interface QuizModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   words: Vocabulary[];
//   interfaceLanguage: string;
//   onComplete: (results: { wordId: string; isCorrect: boolean }[]) => void;
// }


// export function QuizModal({
//   open,
//   onOpenChange,
//   words,
//   interfaceLanguage,
//   onComplete,
// }: QuizModalProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [flashcards, setFlashcards] = useState<{ word: Vocabulary; isFlipped: boolean }[]>([]);
//   const [showResult, setShowResult] = useState(false);

//   const t = TRANSLATIONS[interfaceLanguage as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

//   // Initialize or reset flashcards when words prop changes or modal opens
//   useEffect(() => {
//     if (open && words.length > 0) {
//       setFlashcards(words.map(word => ({ word, isFlipped: false })));
//       setCurrentIndex(0);
//       setShowResult(false);
//     }
//   }, [open, words]);

//   const handleFlip = () => {
//     if (flashcards.length === 0) return;
    
//     setFlashcards(cards =>
//       cards.map((card, idx) =>
//         idx === currentIndex ? { ...card, isFlipped: !card.isFlipped } : card
//       )
//     );
//   };

//   const handleAnswer = (isCorrect: boolean) => {
//     if (flashcards.length === 0) return;

//     setFlashcards(cards =>
//       cards.map((card, idx) =>
//         idx === currentIndex ? { ...card, isCorrect } : card
//       )
//     );

//     if (currentIndex < flashcards.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setShowResult(true);
//       onComplete(
//         flashcards.map(card => ({
//           wordId: card.word.id,
//           isCorrect: card.isCorrect || false,
//         }))
//       );
//     }
//   };

//   const handleSpeak = () => {
//     if (flashcards.length === 0) return;
//     const utterance = new SpeechSynthesisUtterance(flashcards[currentIndex].word.word);
//     window.speechSynthesis.speak(utterance);
//   };

//   const handleClose = () => {
//     setCurrentIndex(0);
//     setFlashcards([]);
//     setShowResult(false);
//     onOpenChange(false);
//   };

//   // Guard against empty flashcards
//   if (flashcards.length === 0) {
//     return (
//       <Dialog open={open} onOpenChange={handleClose}>
//         <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               {t.quiz}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="text-center py-8">
//             <p className="text-gray-500">{t.noWords}</p>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   const currentCard = flashcards[currentIndex];
//   const correctCount = flashcards.filter(card => card.isCorrect).length;

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             {t.quiz}
//           </DialogTitle>
//         </DialogHeader>

//         {!showResult ? (
//           <div className="space-y-6">
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl" />
//               <div 
//                 className={`relative bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 transform ${
//                   currentCard.isFlipped ? 'scale-[0.98] bg-gray-50' : 'scale-100 hover:scale-[1.02]'
//                 }`}
//                 style={{ minHeight: '300px' }}
//                 onClick={handleFlip}
//               >
//                 <div className={`${currentCard.isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
//                   <div className="flex flex-col h-full justify-between">
//                     <div className="flex justify-between items-start">
//                       <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                         {currentCard.word.word}
//                       </h3>
//                       <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         className="rounded-full hover:bg-indigo-50"
//                         onClick={(e) => { 
//                           e.stopPropagation(); 
//                           handleSpeak(); 
//                         }}
//                       >
//                         <Volume2 className="h-5 w-5 text-indigo-600" />
//                       </Button>
//                     </div>
//                     <p className="text-sm text-gray-500 text-center absolute bottom-4 left-0 right-0">
//                       {t.tapToFlip}
//                     </p>
//                   </div>
//                 </div>
//                 <div className={`absolute inset-0 p-6 ${!currentCard.isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
//                   <div className="h-full overflow-auto prose prose-sm">
//                     <ReactMarkdown>{currentCard.word.meaning}</ReactMarkdown>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex justify-between text-sm text-gray-500">
//                 <span>{t.cardsRemaining}: {flashcards.length - currentIndex}</span>
//                 <span>{t.progress}: {currentIndex + 1}/{flashcards.length}</span>
//               </div>
//               <Progress value={(currentIndex / flashcards.length) * 100} className="h-2" />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <Button
//                 onClick={() => handleAnswer(false)}
//                 variant="outline"
//                 className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700"
//               >
//                 {t.incorrect}
//               </Button>
//               <Button
//                 onClick={() => handleAnswer(true)}
//                 className="bg-green-600 hover:bg-green-700 text-white"
//               >
//                 {t.correct}
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center space-y-6">
//             <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               {t.score}: {correctCount}/{flashcards.length}
//             </div>
//             <Progress value={(correctCount / flashcards.length) * 100} className="h-2" />
//             <Button onClick={handleClose} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
//               {t.finish}
//             </Button>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }