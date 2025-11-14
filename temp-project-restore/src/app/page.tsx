"use client";

import { useState, useRef } from "react";
import { Dumbbell, Flame, TrendingUp, Clock, Trophy, Apple, Heart, Zap, Star, Target, Award, MessageSquare, Send, Camera, Calendar, Music, Play, Pause, SkipForward, SkipBack, Scan, X, ThumbsUp, ThumbsDown, Smile, Frown, Meh, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function LeaoFitness() {
  const [currentView, setCurrentView] = useState<"landing" | "quiz" | "dashboard">("landing");
  const [quizStep, setQuizStep] = useState(0);
  const [userProfile, setUserProfile] = useState<Record<string, string>>({});
  const [totalPoints, setTotalPoints] = useState(450);
  const [level, setLevel] = useState(3);
  const [trialDaysLeft] = useState(7);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPostWorkoutDialog, setShowPostWorkoutDialog] = useState(false);
  const [postWorkoutStep, setPostWorkoutStep] = useState(0);
  const [postWorkoutResponses, setPostWorkoutResponses] = useState<Array<{ questionId: string; answer: string }>>([]);
  const [postWorkoutCompleted, setPostWorkoutCompleted] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionalInfo, setNutritionalInfo] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quizSteps = [
    {
      question: "Você já treina regularmente?",
      options: [
        { value: "sim", label: "Sim, treino regularmente" },
        { value: "nao", label: "Não, estou começando agora" },
      ],
    },
    {
      question: "Qual é seu objetivo principal?",
      options: [
        { value: "perder", label: "Perder peso" },
        { value: "ganhar", label: "Ganhar massa muscular" },
        { value: "resistencia", label: "Melhorar resistência" },
      ],
    },
    {
      question: "Quantos dias na semana você pode se dedicar ao treino?",
      options: [
        { value: "1-2", label: "1-2 dias" },
        { value: "3-4", label: "3-4 dias" },
        { value: "5+", label: "5 ou mais dias" },
      ],
    },
  ];

  const workoutPlaylist = [
    { id: "1", title: "Eye of the Tiger", artist: "Survivor", duration: "4:05", bpm: 109, genre: "Rock" },
    { id: "2", title: "Stronger", artist: "Kanye West", duration: "5:12", bpm: 104, genre: "Hip Hop" },
    { id: "3", title: "Till I Collapse", artist: "Eminem", duration: "4:57", bpm: 171, genre: "Hip Hop" },
    { id: "4", title: "Thunderstruck", artist: "AC/DC", duration: "4:52", bpm: 133, genre: "Rock" },
  ];

  const postWorkoutQuestions = [
    {
      id: "difficulty",
      question: "Como você avaliaria a dificuldade do treino de hoje?",
      type: "choice" as const,
      options: [
        { value: "muito-facil", label: "Muito Fácil", icon: Smile },
        { value: "facil", label: "Fácil", icon: Smile },
        { value: "moderado", label: "Moderado", icon: Meh },
        { value: "dificil", label: "Difícil", icon: Frown },
      ],
    },
    {
      id: "completion",
      question: "Você conseguiu completar todos os exercícios?",
      type: "choice" as const,
      options: [
        { value: "sim-completo", label: "Sim, completei tudo!", icon: ThumbsUp },
        { value: "quase", label: "Quase tudo", icon: Meh },
        { value: "metade", label: "Cerca de metade", icon: Meh },
      ],
    },
    {
      id: "notes",
      question: "Quer compartilhar algo sobre o treino? (Opcional)",
      type: "text" as const,
    },
  ];

  const achievements = [
    { id: "1", title: "Primeiro Treino", description: "Complete seu primeiro treino", points: 50, unlocked: true, icon: "🎯" },
    { id: "2", title: "Sequência de 7 Dias", description: "Treine por 7 dias seguidos", points: 100, unlocked: true, icon: "🔥" },
    { id: "3", title: "Guerreiro do Mês", description: "Complete 20 treinos em um mês", points: 200, unlocked: true, icon: "💪" },
    { id: "4", title: "Mestre da Alimentação", description: "Siga o plano alimentar por 14 dias", points: 150, unlocked: false, icon: "🥗" },
  ];

  const workouts = [
    { day: "Segunda", focus: "Peito e Tríceps", exercises: 8, duration: "45 min", completed: true },
    { day: "Terça", focus: "Costas e Bíceps", exercises: 7, duration: "50 min", completed: true },
    { day: "Quarta", focus: "Pernas", exercises: 9, duration: "60 min", completed: false },
    { day: "Quinta", focus: "Ombros", exercises: 6, duration: "40 min", completed: false },
  ];

  const mealExamples = {
    breakfast: [
      {
        name: "Omelete Proteico com Aveia",
        calories: 450,
        protein: 32,
        carbs: 38,
        fats: 18,
        ingredients: ["3 ovos inteiros", "1 clara", "50g aveia", "1 banana", "Café preto"],
      },
    ],
    lunch: [
      {
        name: "Frango Grelhado com Batata Doce",
        calories: 650,
        protein: 55,
        carbs: 68,
        fats: 15,
        ingredients: ["200g peito de frango", "250g batata doce", "Salada verde", "Azeite"],
      },
    ],
    dinner: [
      {
        name: "Peixe Grelhado com Legumes",
        calories: 550,
        protein: 48,
        carbs: 45,
        fats: 18,
        ingredients: ["200g tilápia", "Brócolis", "Couve-flor", "Batata inglesa 150g"],
      },
    ],
  };

  const handleQuizAnswer = (value: string) => {
    const keys = ["treina", "objetivo", "frequencia"];
    setUserProfile({ ...userProfile, [keys[quizStep]]: value });
    if (quizStep < quizSteps.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setCurrentView("dashboard");
    }
  };

  const startPostWorkoutDialog = () => {
    setShowPostWorkoutDialog(true);
    setPostWorkoutStep(0);
    setPostWorkoutResponses([]);
    setPostWorkoutCompleted(false);
  };

  const handlePostWorkoutAnswer = (questionId: string, answer: string) => {
    const newResponses = [...postWorkoutResponses.filter(r => r.questionId !== questionId), { questionId, answer }];
    setPostWorkoutResponses(newResponses);
    if (postWorkoutStep < postWorkoutQuestions.length - 1) {
      setPostWorkoutStep(postWorkoutStep + 1);
    } else {
      setPostWorkoutCompleted(true);
      setTotalPoints(totalPoints + 50);
      setTimeout(() => {
        setShowPostWorkoutDialog(false);
        setPostWorkoutStep(0);
        setPostWorkoutResponses([]);
        setPostWorkoutCompleted(false);
      }, 3000);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      alert("Não foi possível acessar a câmera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setCapturedImage(null);
    setNutritionalInfo(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setCapturedImage(canvas.toDataURL("image/jpeg"));
        if (videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
      }
    }
  };

  const analyzeFood = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setNutritionalInfo({
        foodName: "Prato de Frango Grelhado com Arroz e Salada",
        calories: 520,
        protein: 45,
        carbs: 52,
        fats: 12,
        fiber: 8,
        sodium: 380,
        servingSize: "1 prato (350g)",
      });
      setIsAnalyzing(false);
      setTotalPoints(totalPoints + 15);
    }, 2000);
  };

  const currentSong = workoutPlaylist[currentSongIndex];

  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Dumbbell className="w-12 h-12 sm:w-16 sm:h-16" />
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">Leão Fitness</h1>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold">🌴 Tropicalize Seu Treino! 🌴</p>
              <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
                O aplicativo de saúde e boa forma que vai transformar sua rotina de exercícios e alimentação no Brasil
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="text-lg font-semibold">7 DIAS DE TESTE GRÁTIS</span>
                <Star className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  size="lg"
                  onClick={() => setCurrentView("quiz")}
                  className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-2xl"
                >
                  Começar Teste Grátis <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">O Que Oferecemos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Dumbbell, title: "Treinos Personalizados", description: "Rotinas focadas em grupos musculares específicos", color: "from-orange-400 to-orange-600" },
              { icon: Apple, title: "Planos de Alimentação", description: "Exemplos detalhados de refeições com calorias e macronutrientes", color: "from-green-400 to-green-600" },
              { icon: Scan, title: "Análise Nutricional com IA", description: "Tire foto dos alimentos e receba análise completa", color: "from-blue-400 to-blue-600" },
              { icon: Music, title: "Músicas Motivacionais", description: "Playlists energizantes para turbinar seus treinos", color: "from-purple-400 to-purple-600" },
              { icon: MessageSquare, title: "Personal Virtual", description: "Diálogo interativo após cada treino com dicas personalizadas", color: "from-cyan-400 to-cyan-600" },
              { icon: Trophy, title: "Sistema de Conquistas", description: "Ganhe pontos e desbloqueie conquistas conforme progride", color: "from-yellow-400 to-yellow-600" },
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "quiz") {
    const currentQuestion = quizSteps[quizStep];
    const progress = ((quizStep + 1) / quizSteps.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                Pergunta {quizStep + 1} de {quizSteps.length}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView("landing")}>Voltar</Button>
            </div>
            <Progress value={progress} className="mb-4" />
            <CardTitle className="text-2xl sm:text-3xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={handleQuizAnswer} className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer text-lg">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-10 h-10" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Leão Fitness</h1>
                <p className="text-sm opacity-90">Seu Personal Trainer Digital</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold">{totalPoints} pts</span>
                </div>
                <p className="text-xs mt-1">Nível {level}</p>
              </div>
              <Badge className="bg-green-500 text-white px-4 py-2">{trialDaysLeft} dias grátis</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="treinos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-2 bg-white p-2 rounded-xl shadow-lg">
            <TabsTrigger value="treinos">
              <Dumbbell className="w-4 h-4 mr-2" />Treinos
            </TabsTrigger>
            <TabsTrigger value="alimentacao">
              <Apple className="w-4 h-4 mr-2" />Alimentação
            </TabsTrigger>
            <TabsTrigger value="scanner">
              <Scan className="w-4 h-4 mr-2" />Scanner
            </TabsTrigger>
            <TabsTrigger value="musicas">
              <Music className="w-4 h-4 mr-2" />Músicas
            </TabsTrigger>
            <TabsTrigger value="conquistas">
              <Trophy className="w-4 h-4 mr-2" />Conquistas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="treinos" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />Seus Treinos da Semana
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workouts.map((workout, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 transition-all ${workout.completed ? "bg-green-50 border-green-500" : "bg-white border-gray-200"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{workout.day}</h3>
                          {workout.completed && <Check className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-gray-700 font-semibold">{workout.focus}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />{workout.exercises} exercícios
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />{workout.duration}
                          </span>
                        </div>
                      </div>
                      <Button
                        className={workout.completed ? "bg-green-500" : "bg-gradient-to-r from-orange-500 to-yellow-500"}
                        onClick={workout.completed ? undefined : startPostWorkoutDialog}
                      >
                        {workout.completed ? "Concluído" : "Iniciar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alimentacao" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Apple className="w-6 h-6 text-green-500" />Plano Alimentar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="breakfast">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="breakfast">Café</TabsTrigger>
                    <TabsTrigger value="lunch">Almoço</TabsTrigger>
                    <TabsTrigger value="dinner">Jantar</TabsTrigger>
                  </TabsList>
                  {Object.entries(mealExamples).map(([mealType, meals]) => (
                    <TabsContent key={mealType} value={mealType} className="space-y-4">
                      {meals.map((meal, index) => (
                        <Card key={index} className="border-2">
                          <CardHeader>
                            <CardTitle className="text-lg">{meal.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                              <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <p className="text-2xl font-bold text-orange-600">{meal.calories}</p>
                                <p className="text-xs">Calorias</p>
                              </div>
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{meal.protein}g</p>
                                <p className="text-xs">Proteína</p>
                              </div>
                              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">{meal.carbs}g</p>
                                <p className="text-xs">Carboidratos</p>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{meal.fats}g</p>
                                <p className="text-xs">Gorduras</p>
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold mb-2">Ingredientes:</p>
                              <ul className="space-y-1">
                                {meal.ingredients.map((ing, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm">
                                    <Check className="w-4 h-4 text-green-500" />{ing}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Scan className="w-6 h-6 text-blue-500" />Scanner Nutricional com IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!capturedImage && !showCamera && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button onClick={startCamera} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600" size="lg">
                        <Camera className="w-5 h-5 mr-2" />Abrir Câmera
                      </Button>
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-1" size="lg">
                        <Scan className="w-5 h-5 mr-2" />Escolher Foto
                      </Button>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                    </div>
                  </div>
                )}

                {showCamera && (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-xl overflow-hidden">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={capturePhoto} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600" size="lg">
                        <Camera className="w-5 h-5 mr-2" />Capturar
                      </Button>
                      <Button onClick={stopCamera} variant="outline" size="lg">
                        <X className="w-5 h-5 mr-2" />Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {capturedImage && !nutritionalInfo && (
                  <div className="space-y-4">
                    <img src={capturedImage} alt="Food" className="w-full rounded-xl" />
                    <div className="flex gap-4">
                      <Button onClick={analyzeFood} disabled={isAnalyzing} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600" size="lg">
                        {isAnalyzing ? "Analisando..." : "Analisar"}
                      </Button>
                      <Button onClick={() => setCapturedImage(null)} variant="outline" size="lg">Cancelar</Button>
                    </div>
                  </div>
                )}

                {nutritionalInfo && (
                  <div className="space-y-6">
                    <img src={capturedImage!} alt="Food" className="w-full rounded-xl" />
                    <Card className="border-2 border-green-500 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-xl text-green-600">Análise Concluída! (+15 pontos)</CardTitle>
                        <CardDescription className="text-lg font-semibold text-gray-900">{nutritionalInfo.foodName}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-white rounded-lg">
                            <p className="text-3xl font-bold text-orange-600">{nutritionalInfo.calories}</p>
                            <p className="text-sm">Calorias</p>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">{nutritionalInfo.protein}g</p>
                            <p className="text-sm">Proteína</p>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg">
                            <p className="text-3xl font-bold text-yellow-600">{nutritionalInfo.carbs}g</p>
                            <p className="text-sm">Carboidratos</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Button onClick={() => { setCapturedImage(null); setNutritionalInfo(null); }} variant="outline" className="w-full" size="lg">
                      Analisar Outro
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="musicas" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Music className="w-6 h-6 text-purple-500" />Playlist Motivacional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold">{currentSong.title}</h3>
                      <p className="text-purple-100">{currentSong.artist}</p>
                    </div>
                    <div className="flex items-center justify-center gap-6">
                      <Button onClick={() => setCurrentSongIndex((currentSongIndex - 1 + workoutPlaylist.length) % workoutPlaylist.length)} variant="ghost" size="icon" className="text-white">
                        <SkipBack className="w-6 h-6" />
                      </Button>
                      <Button onClick={() => setIsPlaying(!isPlaying)} size="icon" className="w-16 h-16 bg-white text-purple-600">
                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                      </Button>
                      <Button onClick={() => setCurrentSongIndex((currentSongIndex + 1) % workoutPlaylist.length)} variant="ghost" size="icon" className="text-white">
                        <SkipForward className="w-6 h-6" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  {workoutPlaylist.map((song, index) => (
                    <div key={song.id} onClick={() => setCurrentSongIndex(index)} className={`p-4 rounded-xl border-2 cursor-pointer ${index === currentSongIndex ? "bg-purple-50 border-purple-500" : "bg-white border-gray-200"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${index === currentSongIndex ? "bg-purple-500" : "bg-gray-200"}`}>
                            <Music className={`w-6 h-6 ${index === currentSongIndex ? "text-white" : "text-gray-600"}`} />
                          </div>
                          <div>
                            <h4 className="font-semibold">{song.title}</h4>
                            <p className="text-sm text-gray-600">{song.artist}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{song.bpm} BPM</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conquistas" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />Suas Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className={`border-2 ${achievement.unlocked ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-500" : "bg-gray-50 border-gray-200 opacity-60"}`}>
                      <CardContent className="pt-6 text-center space-y-3">
                        <div className="text-5xl">{achievement.icon}</div>
                        <div>
                          <h3 className="font-bold text-lg">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        <Badge className={achievement.unlocked ? "bg-yellow-500 text-white" : "bg-gray-300"}>
                          {achievement.points} pontos
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showPostWorkoutDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl shadow-2xl border-0">
            {!postWorkoutCompleted ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
                      Pergunta {postWorkoutStep + 1} de {postWorkoutQuestions.length}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => setShowPostWorkoutDialog(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <Progress value={((postWorkoutStep + 1) / postWorkoutQuestions.length) * 100} className="mb-4" />
                  <CardTitle className="text-2xl">{postWorkoutQuestions[postWorkoutStep].question}</CardTitle>
                </CardHeader>
                <CardContent>
                  {postWorkoutQuestions[postWorkoutStep].type === "choice" ? (
                    <div className="space-y-3">
                      {postWorkoutQuestions[postWorkoutStep].options?.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <Button
                            key={option.value}
                            onClick={() => handlePostWorkoutAnswer(postWorkoutQuestions[postWorkoutStep].id, option.value)}
                            variant="outline"
                            className="w-full justify-start text-left p-4 h-auto"
                          >
                            {IconComponent && <IconComponent className="w-5 h-5 mr-3" />}
                            <span>{option.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Textarea placeholder="Compartilhe seus pensamentos..." className="min-h-[120px]" />
                      <Button onClick={() => handlePostWorkoutAnswer(postWorkoutQuestions[postWorkoutStep].id, "")} className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600">
                        Continuar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="pt-6 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Parabéns! 🎉</h2>
                  <p className="text-lg text-gray-600">Você ganhou 50 pontos!</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
