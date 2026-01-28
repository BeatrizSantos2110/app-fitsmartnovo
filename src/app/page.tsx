"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Utensils, Droplets, Bell, Target } from "lucide-react";
import Dashboard from "@/components/dashboard";
import WorkoutSection from "@/components/workout-section";
import NutritionSection from "@/components/nutrition-section";
import HydrationSection from "@/components/hydration-section";

export default function FitSmartApp() {
  // Perfil padrão do usuário (sem quiz)
  const [userProfile] = useState({
    name: "Atleta",
    age: 25,
    weight: 70,
    height: 170,
    gender: "male",
    goal: "maintain",
    activityLevel: "moderate",
    workoutLocation: "both",
    mealsPerDay: 4,
    dietaryRestrictions: [],
    targetCalories: 2200,
    bmi: 24.2,
    bmr: 1650,
    waterGoal: 8
  });
  
  // Estados compartilhados entre componentes
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [todayWorkouts, setTodayWorkouts] = useState<any[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FitSmart
                </h1>
                <p className="text-xs text-gray-600">Olá, {userProfile?.name || "Atleta"}!</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="w-4 h-4" />
              Lembretes
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="gap-2">
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">Treinos</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="gap-2">
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Alimentação</span>
            </TabsTrigger>
            <TabsTrigger value="hydration" className="gap-2">
              <Droplets className="w-4 h-4" />
              <span className="hidden sm:inline">Hidratação</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard 
              userProfile={userProfile} 
              todayMeals={todayMeals}
              todayWorkouts={todayWorkouts}
              waterIntake={waterIntake}
            />
          </TabsContent>

          <TabsContent value="workout" className="space-y-6">
            <WorkoutSection 
              userProfile={userProfile}
              onWorkoutComplete={(workout) => setTodayWorkouts([...todayWorkouts, workout])}
            />
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <NutritionSection 
              userProfile={userProfile}
              onMealAdd={(meal) => setTodayMeals([...todayMeals, meal])}
              todayMeals={todayMeals}
            />
          </TabsContent>

          <TabsContent value="hydration" className="space-y-6">
            <HydrationSection 
              userProfile={userProfile}
              waterIntake={waterIntake}
              onWaterIntakeChange={setWaterIntake}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
