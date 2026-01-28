"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Droplets, Plus, Minus, TrendingUp, Award, Bell } from "lucide-react";

interface HydrationSectionProps {
  userProfile: any;
}

export default function HydrationSection({ userProfile }: HydrationSectionProps) {
  const [waterIntake, setWaterIntake] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [showReminder, setShowReminder] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const waterGoal = userProfile.waterGoal || 8;
  const progress = (waterIntake / waterGoal) * 100;
  const remainingGlasses = Math.max(0, waterGoal - waterIntake);

  // Carregar dados do localStorage ao montar o componente
  useEffect(() => {
    const loadHydrationData = () => {
      try {
        const savedWaterIntake = localStorage.getItem("waterIntake");
        const savedHistory = localStorage.getItem("waterHistory");

        if (savedWaterIntake) {
          setWaterIntake(parseInt(savedWaterIntake));
        }

        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error("Erro ao carregar dados de hidratação:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadHydrationData();
  }, []);

  // Salvar dados no localStorage sempre que mudarem (após carregamento inicial)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("waterIntake", waterIntake.toString());
      } catch (error) {
        console.error("Erro ao salvar consumo de água:", error);
      }
    }
  }, [waterIntake, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("waterHistory", JSON.stringify(history));
      } catch (error) {
        console.error("Erro ao salvar histórico de água:", error);
      }
    }
  }, [history, isLoaded]);

  // Reminder system
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      
      // Show reminder during waking hours (7am - 10pm) if not at goal
      if (hour >= 7 && hour <= 22 && waterIntake < waterGoal) {
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 5000);
      }
    }, 3600000); // Check every hour

    return () => clearInterval(interval);
  }, [waterIntake, waterGoal]);

  const addWater = (amount: number = 1) => {
    const newIntake = waterIntake + amount;
    const newHistoryEntry = {
      amount,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };
    
    setWaterIntake(newIntake);
    setHistory([...history, newHistoryEntry]);
  };

  const removeWater = () => {
    if (waterIntake > 0) {
      setWaterIntake(waterIntake - 1);
      setHistory(history.slice(0, -1));
    }
  };

  const getMotivationalMessage = () => {
    const percentage = (waterIntake / waterGoal) * 100;
    
    if (percentage === 0) {
      return "Vamos começar! Beba seu primeiro copo de água 💧";
    } else if (percentage < 25) {
      return "Ótimo começo! Continue assim 🌟";
    } else if (percentage < 50) {
      return "Você está no caminho certo! 💪";
    } else if (percentage < 75) {
      return "Mais da metade! Você consegue! 🚀";
    } else if (percentage < 100) {
      return "Quase lá! Falta pouco para a meta! 🎯";
    } else {
      return "Parabéns! Meta atingida! 🎉🏆";
    }
  };

  const getHydrationBenefits = () => {
    return [
      {
        icon: "🔥",
        title: "Acelera o Metabolismo",
        description: "Beber água aumenta o gasto calórico em até 30% por 1 hora"
      },
      {
        icon: "💪",
        title: "Melhora Performance",
        description: "Hidratação adequada melhora força e resistência nos treinos"
      },
      {
        icon: "🧠",
        title: "Aumenta o Foco",
        description: "Água melhora concentração e função cognitiva"
      },
      {
        icon: "✨",
        title: "Pele Saudável",
        description: "Hidratação mantém a pele radiante e saudável"
      },
      {
        icon: "🍽️",
        title: "Controla Apetite",
        description: "Água antes das refeições ajuda a controlar a fome"
      },
      {
        icon: "🏃",
        title: "Recuperação Muscular",
        description: "Essencial para recuperação após exercícios"
      }
    ];
  };

  const getHydrationTips = () => {
    return [
      "Beba um copo de água ao acordar para ativar o metabolismo",
      "Mantenha uma garrafa de água sempre por perto",
      "Beba água antes, durante e depois dos treinos",
      "Se sentir fome, beba água primeiro - pode ser sede!",
      "Adicione limão ou frutas para dar sabor à água",
      "Configure lembretes no celular a cada 1-2 horas"
    ];
  };

  return (
    <div className="space-y-6">
      {/* Reminder Banner */}
      {showReminder && (
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <div className="flex-1">
                <div className="font-semibold">Hora de Beber Água! 💧</div>
                <div className="text-sm text-white/90">Mantenha-se hidratado para melhores resultados</div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => addWater(1)}>
                Bebi Água
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Progress Card */}
      <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Hidratação Diária</CardTitle>
          <CardDescription className="text-white/80">
            Meta: {waterGoal} copos de 250ml por dia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Water Counter */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="text-7xl font-bold">{waterIntake}</div>
              <div className="text-2xl text-white/80">/ {waterGoal}</div>
              <Droplets className="absolute -top-4 -right-4 w-12 h-12 text-white/30" />
            </div>
            
            <div className="text-lg font-semibold">{getMotivationalMessage()}</div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={Math.min(progress, 100)} className="h-4 bg-white/20" />
            <div className="flex justify-between text-sm">
              <span>{Math.round(progress)}% da meta</span>
              <span>{remainingGlasses} copos restantes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={removeWater}
              disabled={waterIntake === 0}
              className="gap-2"
            >
              <Minus className="w-5 h-5" />
              Remover
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => addWater(1)}
              className="gap-2 px-8"
            >
              <Plus className="w-5 h-5" />
              Bebi 1 Copo
            </Button>
          </div>

          {/* Quick Add */}
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => addWater(2)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              +2 copos
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addWater(3)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              +3 copos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Hoje</div>
                <div className="text-3xl font-bold text-blue-600">{waterIntake * 250}ml</div>
              </div>
              <Droplets className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Meta Diária</div>
                <div className="text-3xl font-bold text-cyan-600">{waterGoal * 250}ml</div>
              </div>
              <TrendingUp className="w-12 h-12 text-cyan-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Progresso</div>
                <div className="text-3xl font-bold text-purple-600">{Math.round(progress)}%</div>
              </div>
              <Award className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Hoje</CardTitle>
            <CardDescription>Registro de consumo de água</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.slice().reverse().map((entry, index) => (
                <div key={entry.timestamp} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">{entry.amount} copo{entry.amount > 1 ? 's' : ''}</div>
                      <div className="text-sm text-gray-600">{entry.amount * 250}ml</div>
                    </div>
                  </div>
                  <Badge variant="outline">{entry.time}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Benefícios da Hidratação</CardTitle>
          <CardDescription>Por que beber água é essencial para seus resultados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getHydrationBenefits().map((benefit, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                <div className="text-3xl mb-2">{benefit.icon}</div>
                <div className="font-semibold text-gray-900 mb-1">{benefit.title}</div>
                <div className="text-sm text-gray-600">{benefit.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Dicas para Manter a Hidratação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getHydrationTips().map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="text-sm text-gray-700">{tip}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calculation Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Como Calculamos Sua Meta?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            Sua meta de <strong>{waterGoal} copos ({waterGoal * 250}ml)</strong> foi calculada com base no seu peso de <strong>{userProfile.weight}kg</strong>.
          </p>
          <p>
            A recomendação é de <strong>35ml de água por kg de peso corporal</strong>, o que garante hidratação adequada para suas atividades diárias e treinos.
          </p>
          <p className="pt-2 border-t border-blue-200">
            💡 <strong>Dica:</strong> Em dias de treino intenso ou clima quente, considere aumentar a ingestão de água!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
