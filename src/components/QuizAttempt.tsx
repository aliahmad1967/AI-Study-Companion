"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizAttemptProps {
  quizTitle: string;
  questions: Question[];
  onQuizFinished: (score: number, total: number) => void;
  onBackToDetails: () => void;
}

export function QuizAttempt({ quizTitle, questions, onQuizFinished, onBackToDetails }: QuizAttemptProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionChange = (value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = value;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Last question, show results
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    onQuizFinished(score, questions.length);
    setShowResults(true);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <CardTitle>نتائج الاختبار: {quizTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-3xl font-bold">
            لقد حصلت على {score} من {questions.length}
          </p>
          <div className="space-y-2 text-right">
            {questions.map((q, index) => (
              <div key={index} className="p-2 border rounded-md">
                <p className="font-medium">
                  {index + 1}. {q.question}
                </p>
                <p className={`text-sm ${userAnswers[index] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                  إجابتك: {userAnswers[index] || "لم تجب"}
                  {userAnswers[index] === q.correctAnswer ? (
                    <CheckCircle2 className="inline-block h-4 w-4 mr-1" />
                  ) : (
                    <XCircle className="inline-block h-4 w-4 mr-1" />
                  )}
                </p>
                {userAnswers[index] !== q.correctAnswer && (
                  <p className="text-sm text-green-600">
                    الإجابة الصحيحة: {q.correctAnswer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={onBackToDetails}>العودة إلى تفاصيل الاختبار</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-right">
          {quizTitle} - سؤال {currentQuestionIndex + 1} من {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between text-right">
        <div className="mb-4">
          <p className="text-lg font-semibold mb-4">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </p>
          <RadioGroup
            onValueChange={handleOptionChange}
            value={userAnswers[currentQuestionIndex]}
            className="space-y-2"
            dir="rtl"
          >
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="text-base cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 border-t">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          السابق
        </Button>
        <Button onClick={handleNextQuestion}>
          {currentQuestionIndex === questions.length - 1 ? (
            <>
              <CheckCircle2 className="h-4 w-4 ml-2" />
              إنهاء الاختبار
            </>
          ) : (
            <>
              <ArrowLeft className="h-4 w-4 mr-2" />
              التالي
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}