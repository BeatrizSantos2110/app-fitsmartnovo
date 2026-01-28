"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Home, Play, CheckCircle2, Clock, Flame, Plus } from "lucide-react";

interface WorkoutSectionProps {
  userProfile: any;
  onWorkoutComplete?: (workout: any) => void;
}

export default function WorkoutSection({ userProfile, onWorkoutComplete }: WorkoutSectionProps) {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [customWorkout, setCustomWorkout] = useState({ name: "", duration: "", calories: "" });
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage ao montar o componente
  useEffect(() => {
    const loadWorkoutData = () => {
      try {
        const savedCompletedExercises = localStorage.getItem("completedExercises");
        const savedTotalCalories = localStorage.getItem("totalCaloriesBurned");

        if (savedCompletedExercises) {
          const parsed = JSON.parse(savedCompletedExercises);
          setCompletedExercises(parsed);
        }

        if (savedTotalCalories) {
          setTotalCaloriesBurned(parseInt(savedTotalCalories));
        }
      } catch (error) {
        console.error("Erro ao carregar dados de treino:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadWorkoutData();
  }, []);

  // Salvar dados no localStorage sempre que mudarem (após carregamento inicial)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("completedExercises", JSON.stringify(completedExercises));
      } catch (error) {
        console.error("Erro ao salvar exercícios completados:", error);
      }
    }
  }, [completedExercises, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("totalCaloriesBurned", totalCaloriesBurned.toString());
      } catch (error) {
        console.error("Erro ao salvar calorias queimadas:", error);
      }
    }
  }, [totalCaloriesBurned, isLoaded]);

  const homeWorkouts = [
    {
      id: "1",
      name: "Treino HIIT Iniciante",
      duration: "20 min",
      calories: 180,
      level: "Iniciante",
      exercises: [
        { name: "Polichinelos", duration: "30s", rest: "15s", video: "https://www.youtube.com/embed/c4DAnQ6DtF8" },
        { name: "Agachamento", duration: "30s", rest: "15s", video: "https://www.youtube.com/embed/aclHkVaku9U" },
        { name: "Flexões (joelhos)", duration: "30s", rest: "15s", video: "https://www.youtube.com/embed/jWxvty2KROs" },
        { name: "Mountain Climbers", duration: "30s", rest: "15s", video: "https://www.youtube.com/embed/nmwgirgXLYM" },
        { name: "Prancha", duration: "30s", rest: "30s", video: "https://www.youtube.com/embed/ASdvN_XEl_c" },
      ]
    },
    {
      id: "2",
      name: "Treino de Força Corporal",
      duration: "30 min",
      calories: 250,
      level: "Intermediário",
      exercises: [
        { name: "Agachamento Búlgaro", duration: "45s", rest: "20s", video: "https://www.youtube.com/embed/2C-uSaDJZnI" },
        { name: "Flexões Diamante", duration: "45s", rest: "20s", video: "https://www.youtube.com/embed/J0DnG1_S92I" },
        { name: "Afundo Alternado", duration: "45s", rest: "20s", video: "https://www.youtube.com/embed/QOVaHwm-Q6U" },
        { name: "Prancha Lateral", duration: "30s cada", rest: "20s", video: "https://www.youtube.com/embed/K2VljzCC16g" },
        { name: "Burpees", duration: "45s", rest: "30s", video: "https://www.youtube.com/embed/TU8QYVW0gDU" },
      ]
    },
    {
      id: "3",
      name: "Cardio Intenso",
      duration: "25 min",
      calories: 300,
      level: "Avançado",
      exercises: [
        { name: "Burpees", duration: "60s", rest: "15s", video: "https://www.youtube.com/embed/TU8QYVW0gDU" },
        { name: "High Knees", duration: "60s", rest: "15s", video: "https://www.youtube.com/embed/8opcQdC-V-U" },
        { name: "Jump Squats", duration: "60s", rest: "15s", video: "https://www.youtube.com/embed/CVaEhXotL7M" },
        { name: "Mountain Climbers", duration: "60s", rest: "15s", video: "https://www.youtube.com/embed/nmwgirgXLYM" },
        { name: "Jumping Jacks", duration: "60s", rest: "30s", video: "https://www.youtube.com/embed/c4DAnQ6DtF8" },
      ]
    },
  ];

  const gymWorkouts = [
    {
      id: "4",
      name: "Treino de Peito e Tríceps",
      duration: "45 min",
      calories: 350,
      level: "Intermediário",
      exercises: [
        { name: "Supino Reto", duration: "4x12", rest: "60s", video: "https://www.youtube.com/embed/rT7DgCr-3pg" },
        { name: "Supino Inclinado", duration: "4x10", rest: "60s", video: "https://www.youtube.com/embed/SrqOu55lrYU" },
        { name: "Crucifixo", duration: "3x12", rest: "45s", video: "https://www.youtube.com/embed/eozdVDA78K0" },
        { name: "Tríceps Testa", duration: "3x12", rest: "45s", video: "https://www.youtube.com/embed/d_KZxkY_0cM" },
        { name: "Tríceps Corda", duration: "3x15", rest: "45s", video: "https://www.youtube.com/embed/2-LAMcpzODU" },
      ]
    },
    {
      id: "5",
      name: "Treino de Costas e Bíceps",
      duration: "45 min",
      calories: 350,
      level: "Intermediário",
      exercises: [
        { name: "Barra Fixa", duration: "4x8", rest: "90s", video: "https://www.youtube.com/embed/eGo4IYlbE5g" },
        { name: "Remada Curvada", duration: "4x10", rest: "60s", video: "https://www.youtube.com/embed/FWJR5Ve8bnQ" },
        { name: "Pulldown", duration: "3x12", rest: "45s", video: "https://www.youtube.com/embed/CAwf7n6Luuc" },
        { name: "Rosca Direta", duration: "3x12", rest: "45s", video: "https://www.youtube.com/embed/ykJmrZ5v0Oo" },
        { name: "Rosca Martelo", duration: "3x12", rest: "45s", video: "https://www.youtube.com/embed/zC3nLlEvin4" },
      ]
    },
    {
      id: "6",
      name: "Treino de Pernas",
      duration: "50 min",
      calories: 400,
      level: "Avançado",
      exercises: [
        { name: "Agachamento Livre", duration: "4x10", rest: "90s", video: "https://www.youtube.com/embed/ultWZbUMPL8" },
        { name: "Leg Press", duration: "4x12", rest: "60s", video: "https://www.youtube.com/embed/IZxyjW7MPJQ" },
        { name: "Cadeira Extensora", duration: "3x15", rest: "45s", video: "https://www.youtube.com/embed/YyvSfVjQeL0" },
        { name: "Mesa Flexora", duration: "3x15", rest: "45s", video: "https://www.youtube.com/embed/1Tq3QdYUuHs" },
        { name: "Panturrilha em Pé", duration: "4x20", rest: "45s", video: "https://www.youtube.com/embed/gwLzBJYoWlI" },
      ]
    },
  ];

  const workouts = userProfile.workoutLocation === "home" 
    ? homeWorkouts 
    : userProfile.workoutLocation === "gym" 
    ? gymWorkouts 
    : [...homeWorkouts, ...gymWorkouts];

  const handleCompleteWorkout = (workoutId: string, calories: number) => {
    if (!completedExercises.includes(workoutId)) {
      const newCompletedExercises = [...completedExercises, workoutId];
      const newTotalCalories = totalCaloriesBurned + calories;
      
      setCompletedExercises(newCompletedExercises);
      setTotalCaloriesBurned(newTotalCalories);

      // Notificar o componente pai se a função existir
      if (onWorkoutComplete) {
        onWorkoutComplete({ id: workoutId, calories });
      }
    }
  };

  const handleAddCustomWorkout = () => {
    if (customWorkout.name && customWorkout.duration && customWorkout.calories) {
      const calories = parseInt(customWorkout.calories);
      const newTotalCalories = totalCaloriesBurned + calories;
      
      setTotalCaloriesBurned(newTotalCalories);
      
      // Notificar o componente pai se a função existir
      if (onWorkoutComplete) {
        onWorkoutComplete({ 
          name: customWorkout.name, 
          duration: customWorkout.duration, 
          calories 
        });
      }
      
      setCustomWorkout({ name: "", duration: "", calories: "" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Seus Treinos</CardTitle>
          <CardDescription className="text-white/80">
            Treinos personalizados para {userProfile.workoutLocation === "home" ? "casa" : userProfile.workoutLocation === "gym" ? "academia" : "casa e academia"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Flame className="w-8 h-8 mb-2" />
              <div className="text-2xl font-bold">{totalCaloriesBurned}</div>
              <div className="text-white/80 text-sm">Calorias Queimadas Hoje</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <CheckCircle2 className="w-8 h-8 mb-2" />
              <div className="text-2xl font-bold">{completedExercises.length}</div>
              <div className="text-white/80 text-sm">Treinos Completos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Clock className="w-8 h-8 mb-2" />
              <div className="text-2xl font-bold">{workouts.length}</div>
              <div className="text-white/80 text-sm">Treinos Disponíveis</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Workout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Registrar Treino Personalizado
          </CardTitle>
          <CardDescription>
            Fez um treino diferente? Registre aqui para contabilizar as calorias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="workout-name">Nome do Treino</Label>
              <Input
                id="workout-name"
                placeholder="Ex: Corrida no parque"
                value={customWorkout.name}
                onChange={(e) => setCustomWorkout({ ...customWorkout, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="workout-duration">Duração</Label>
              <Input
                id="workout-duration"
                placeholder="Ex: 30 min"
                value={customWorkout.duration}
                onChange={(e) => setCustomWorkout({ ...customWorkout, duration: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="workout-calories">Calorias</Label>
              <Input
                id="workout-calories"
                type="number"
                placeholder="Ex: 250"
                value={customWorkout.calories}
                onChange={(e) => setCustomWorkout({ ...customWorkout, calories: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleAddCustomWorkout} className="mt-4" disabled={!customWorkout.name || !customWorkout.duration || !customWorkout.calories}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Treino
          </Button>
        </CardContent>
      </Card>

      {/* Workout Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          {(userProfile.workoutLocation === "home" || userProfile.workoutLocation === "both") && (
            <TabsTrigger value="home" className="gap-2">
              <Home className="w-4 h-4" />
              Casa
            </TabsTrigger>
          )}
          {(userProfile.workoutLocation === "gym" || userProfile.workoutLocation === "both") && (
            <TabsTrigger value="gym" className="gap-2">
              <Dumbbell className="w-4 h-4" />
              Academia
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                isCompleted={completedExercises.includes(workout.id)}
                onComplete={() => handleCompleteWorkout(workout.id, workout.calories)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="home" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                isCompleted={completedExercises.includes(workout.id)}
                onComplete={() => handleCompleteWorkout(workout.id, workout.calories)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gym" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gymWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                isCompleted={completedExercises.includes(workout.id)}
                onComplete={() => handleCompleteWorkout(workout.id, workout.calories)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WorkoutCard({ workout, isCompleted, onComplete }: any) {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  return (
    <>
      <Card className={`hover:shadow-lg transition-all ${isCompleted ? "border-green-500 bg-green-50" : ""}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{workout.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{workout.level}</Badge>
                {isCompleted && <Badge className="bg-green-600">Completo</Badge>}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-600" />
              <span>{workout.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>{workout.calories} cal</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Exercícios:</div>
            <div className="space-y-1">
              {workout.exercises.slice(0, 3).map((exercise: any, index: number) => (
                <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <Play className="w-3 h-3" />
                  {exercise.name}
                </div>
              ))}
              {workout.exercises.length > 3 && (
                <div className="text-sm text-gray-500">+ {workout.exercises.length - 3} exercícios</div>
              )}
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Ver Detalhes e Vídeos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{workout.name}</DialogTitle>
                <DialogDescription>
                  {workout.duration} • {workout.calories} calorias • {workout.level}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {workout.exercises.map((exercise: any, index: number) => (
                  <Card key={index} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedExercise(exercise)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{exercise.name}</div>
                          <div className="text-sm text-gray-600">
                            {exercise.duration} • Descanso: {exercise.rest}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                      {selectedExercise?.name === exercise.name && (
                        <div className="mt-4">
                          <iframe
                            width="100%"
                            height="315"
                            src={exercise.video}
                            title={exercise.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                          ></iframe>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          {!isCompleted && (
            <Button onClick={onComplete} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Marcar como Completo
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
}
