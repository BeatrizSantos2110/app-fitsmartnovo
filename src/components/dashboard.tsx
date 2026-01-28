"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Flame, Activity, Award, Calendar } from "lucide-react";

interface DashboardProps {
  userProfile: any;
  todayMeals?: any[];
  todayWorkouts?: any[];
  waterIntake?: number;
}

export default function Dashboard({ userProfile, todayMeals = [], todayWorkouts = [], waterIntake = 0 }: DashboardProps) {
  // Estado para calorias queimadas e treinos completos do localStorage
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
  const [currentWaterIntake, setCurrentWaterIntake] = useState(0);

  // Carregar dados do localStorage ao montar e quando mudar de aba
  useEffect(() => {
    const loadData = () => {
      // Dados de treino
      const savedTotalCalories = localStorage.getItem("totalCaloriesBurned");
      const savedCompletedExercises = localStorage.getItem("completedExercises");

      if (savedTotalCalories) {
        setCaloriesBurned(parseInt(savedTotalCalories));
      }

      if (savedCompletedExercises) {
        const exercises = JSON.parse(savedCompletedExercises);
        setWorkoutsCompleted(exercises.length);
      }

      // Dados de hidratação
      const savedWaterIntake = localStorage.getItem("waterIntake");
      if (savedWaterIntake) {
        setCurrentWaterIntake(parseInt(savedWaterIntake));
      }
    };

    // Carregar dados inicialmente
    loadData();

    // Atualizar dados a cada segundo para sincronizar com mudanças
    const interval = setInterval(loadData, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calcula calorias consumidas das refeições
  const caloriesConsumed = todayMeals.reduce((sum, meal) => sum + parseInt(meal.calories || "0"), 0);

  const caloriesRemaining = userProfile.targetCalories - caloriesConsumed + caloriesBurned;
  const caloriesProgress = (caloriesConsumed / userProfile.targetCalories) * 100;
  const waterProgress = (currentWaterIntake / userProfile.waterGoal) * 100;

  const getGoalText = () => {
    if (userProfile.goal === "lose") return "Perder Peso";
    if (userProfile.goal === "gain") return "Ganhar Massa";
    return "Manter Peso";
  };

  const getActivityLevelText = () => {
    const levels: any = {
      sedentary: "Sedentário",
      light: "Levemente Ativo",
      moderate: "Moderadamente Ativo",
      active: "Muito Ativo",
      veryActive: "Extremamente Ativo"
    };
    return levels[userProfile.activityLevel] || "Não definido";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Bem-vindo de volta, {userProfile.name}! 👋</CardTitle>
          <CardDescription className="text-white/80">
            Aqui está um resumo do seu progresso hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-white/80 text-sm">Meta Diária</div>
              <div className="text-2xl font-bold">{userProfile.targetCalories}</div>
              <div className="text-white/80 text-xs">calorias</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-white/80 text-sm">IMC</div>
              <div className="text-2xl font-bold">{userProfile.bmi}</div>
              <div className="text-white/80 text-xs">kg/m²</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-white/80 text-sm">Água Meta</div>
              <div className="text-2xl font-bold">{userProfile.waterGoal}</div>
              <div className="text-white/80 text-xs">copos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-white/80 text-sm">TMB</div>
              <div className="text-2xl font-bold">{userProfile.bmr}</div>
              <div className="text-white/80 text-xs">cal/dia</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calories Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Calorias Hoje
              </CardTitle>
              <div className="text-sm font-medium text-gray-600">
                {caloriesRemaining > 0 ? `${caloriesRemaining} restantes` : "Meta atingida"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consumidas</span>
                <span className="font-semibold">{caloriesConsumed} cal</span>
              </div>
              <Progress value={caloriesProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{caloriesConsumed}</div>
                <div className="text-xs text-gray-600">Consumidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{caloriesBurned}</div>
                <div className="text-xs text-gray-600">Queimadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userProfile.targetCalories}</div>
                <div className="text-xs text-gray-600">Meta</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Water Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Hidratação Hoje
              </CardTitle>
              <div className="text-sm font-medium text-gray-600">
                {currentWaterIntake}/{userProfile.waterGoal} copos
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span className="font-semibold">{Math.min(waterProgress, 100).toFixed(0)}%</span>
              </div>
              <Progress value={waterProgress} className="h-2" />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-900">
                💧 <strong>Dica:</strong> Beber água regularmente ajuda na queima de gordura e melhora o desempenho nos treinos!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Plano Alimentar Sugerido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Objetivo</div>
              <div className="font-semibold text-lg">{getGoalText()}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Nível de Atividade</div>
              <div className="font-semibold text-lg">{getActivityLevelText()}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Local de Treino</div>
              <div className="font-semibold text-lg">
                {userProfile.workoutLocation === "home" && "Em Casa"}
                {userProfile.workoutLocation === "gym" && "Academia"}
                {userProfile.workoutLocation === "both" && "Ambos"}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Refeições/Dia</div>
              <div className="font-semibold text-lg">{userProfile.mealsPerDay} refeições</div>
            </div>
          </div>

          {userProfile.dietaryRestrictions && userProfile.dietaryRestrictions.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-gray-600 mb-3">Restrições Alimentares</div>
              <div className="flex flex-wrap gap-2">
                {userProfile.dietaryRestrictions.map((restriction: string) => {
                  const labels: any = {
                    lactose: "Sem Lactose",
                    gluten: "Sem Glúten",
                    vegetarian: "Vegetariano",
                    vegan: "Vegano",
                    nuts: "Sem Nozes",
                    seafood: "Sem Frutos do Mar",
                    eggs: "Sem Ovos",
                    soy: "Sem Soja",
                    none: "Sem Restrições"
                  };
                  return (
                    <span key={restriction} className="text-sm font-medium text-gray-700">
                      {labels[restriction] || restriction}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Treinos Hoje</div>
                <div className="text-3xl font-bold text-blue-600">{workoutsCompleted}</div>
              </div>
              <Award className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Sequência</div>
                <div className="text-3xl font-bold text-green-600">0 dias</div>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Dias Ativos</div>
                <div className="text-3xl font-bold text-purple-600">1</div>
              </div>
              <Calendar className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
