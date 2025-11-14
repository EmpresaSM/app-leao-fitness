"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Dumbbell, Flame, TrendingUp, Clock, Trophy, Apple, Heart, Zap, Star, Target, Award, MessageSquare, Send, Camera, Calendar, Music, Play, Pause, SkipForward, SkipBack, Scan, X, ThumbsUp, ThumbsDown, Smile, Frown, Meh, Check, ChevronRight, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  const [showPostWorkoutDialog, setShowPostWorkoutDialog] = useState(false);
  const [postWorkoutStep, setPostWorkoutStep] = useState(0);
  const [postWorkoutResponses, setPostWorkoutResponses] = useState<Array<{ questionId: string; answer: string }>>([]);
  const [postWorkoutCompleted, setPostWorkoutCompleted] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionalInfo, setNutritionalInfo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

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

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      // Buscar estatísticas do usuário
      const { data: stats } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (stats) {
        setUserStats(stats);
      }

      // Buscar treinos do usuário
      const { data: userWorkouts } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (userWorkouts && userWorkouts.length > 0) {
        setWorkouts(userWorkouts);
      } else {
        // Criar treinos padrão se não existirem
        const defaultWorkouts = [
          { user_id: user.id, day: "Segunda", focus: "Peito e Tríceps", exercises: 8, duration: "45 min", completed: false },
          { user_id: user.id, day: "Terça", focus: "Costas e Bíceps", exercises: 7, duration: "50 min", completed: false },
          { user_id: user.id, day: "Quarta", focus: "Pernas", exercises: 9, duration: "60 min", completed: false },
          { user_id: user.id, day: "Quinta", focus: "Ombros", exercises: 6, duration: "40 min", completed: false },
        ];

        const { data: newWorkouts } = await supabase
          .from("workouts")
          .insert(defaultWorkouts)
          .select();

        if (newWorkouts) {
          setWorkouts(newWorkouts);
        }
      }

      // Buscar conquistas do usuário
      const { data: userAchievements } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id);

      const allAchievements = [
        { id: "1", title: "Primeiro Treino", description: "Complete seu primeiro treino", points: 50, icon: "🎯" },
        { id: "2", title: "Sequência de 7 Dias", description: "Treine por 7 dias seguidos", points: 100, icon: "🔥" },
        { id: "3", title: "Guerreiro do Mês", description: "Complete 20 treinos em um mês", points: 200, icon: "💪" },
        { id: "4", title: "Mestre da Alimentação", description: "Siga o plano alimentar por 14 dias", points: 150, icon: "🥗" },
      ];

      const achievementsWithStatus = allAchievements.map(achievement => ({
        ...achievement,
        unlocked: userAchievements?.some(ua => ua.achievement_id === achievement.id && ua.unlocked) || false,
      }));

      setAchievements(achievementsWithStatus);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const startPostWorkoutDialog = () => {
    setShowPostWorkoutDialog(true);
    setPostWorkoutStep(0);
    setPostWorkoutResponses([]);
    setPostWorkoutCompleted(false);
  };

  const handlePostWorkoutAnswer = async (questionId: string, answer: string) => {
    const newResponses = [...postWorkoutResponses.filter(r => r.questionId !== questionId), { questionId, answer }];
    setPostWorkoutResponses(newResponses);
    
    if (postWorkoutStep < postWorkoutQuestions.length - 1) {
      setPostWorkoutStep(postWorkoutStep + 1);
    } else {
      setPostWorkoutCompleted(true);
      
      // Atualizar pontos
      if (userStats) {
        const newPoints = userStats.total_points + 50;
        const newLevel = Math.floor(newPoints / 200) + 1;
        
        await supabase
          .from("user_stats")
          .update({ total_points: newPoints, level: newLevel })
          .eq("user_id", user.id);
        
        setUserStats({ ...userStats, total_points: newPoints, level: newLevel });
      }
      
      setTimeout(() => {
        setShowPostWorkoutDialog(false);
        setPostWorkoutStep(0);
        setPostWorkoutResponses([]);
        setPostWorkoutCompleted(false);
      }, 3000);
    }
  };

  const analyzeFood = () => {
    setIsAnalyzing(true);
    setTimeout(async () => {
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
      
      // Adicionar pontos
      if (userStats) {
        const newPoints = userStats.total_points + 15;
        await supabase
          .from("user_stats")
          .update({ total_points: newPoints })
          .eq("user_id", user.id);
        
        setUserStats({ ...userStats, total_points: newPoints });
      }
    }, 2000);
  };

  const currentSong = workoutPlaylist[currentSongIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
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
                <h1 className="text-2xl sm:text-3xl font-bold">King Fitness</h1>
                <p className="text-sm opacity-90">Olá, {user?.user_metadata?.full_name || user?.email}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold">{userStats?.total_points || 0} pts</span>
                </div>
                <p className="text-xs mt-1">Nível {userStats?.level || 1}</p>
              </div>
              <Badge className="bg-green-500 text-white px-4 py-2">{userStats?.trial_days_left || 7} dias grátis</Badge>
              <Button onClick={handleLogout} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <LogOut className="w-5 h-5" />
              </Button>
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
                  <div key={workout.id} className={`p-4 rounded-xl border-2 transition-all ${workout.completed ? "bg-green-50 border-green-500" : "bg-white border-gray-200"}`}>
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
                {!capturedImage && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button onClick={() => setCapturedImage("demo")} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600" size="lg">
                        <Camera className="w-5 h-5 mr-2" />Simular Captura
                      </Button>
                    </div>
                  </div>
                )}

                {capturedImage && !nutritionalInfo && (
                  <div className="space-y-4">
                    <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                      <p className="text-gray-500">Imagem capturada</p>
                    </div>
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
