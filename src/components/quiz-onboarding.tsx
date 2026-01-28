"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

interface QuizOnboardingProps {
  onComplete: (profile: any) => void;
}

export default function QuizOnboarding({ onComplete }: QuizOnboardingProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    goal: "",
    activityLevel: "",
    workoutLocation: "",
    dietaryRestrictions: [] as string[],
    allergies: "",
    mealsPerDay: "",
    waterIntake: "",
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Calcular valores personalizados
      const weight = parseFloat(formData.weight);
      const height = parseFloat(formData.height);
      const age = parseInt(formData.age);
      
      // Cálculo de TMB (Taxa Metabólica Basal) - Fórmula de Harris-Benedict
      let bmr = 0;
      if (formData.gender === "male") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }
      
      // Ajustar por nível de atividade
      const activityMultipliers: any = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
      };
      
      const tdee = bmr * (activityMultipliers[formData.activityLevel] || 1.2);
      
      // Ajustar por objetivo
      let targetCalories = tdee;
      if (formData.goal === "lose") {
        targetCalories = tdee - 500; // Déficit de 500 cal
      } else if (formData.goal === "gain") {
        targetCalories = tdee + 300; // Superávit de 300 cal
      }
      
      // Cálculo de água (35ml por kg)
      const waterGoal = Math.round((weight * 35) / 250); // Em copos de 250ml
      
      const profile = {
        ...formData,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        waterGoal,
        bmi: (weight / ((height / 100) ** 2)).toFixed(1),
      };
      
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleDietaryRestriction = (restriction: string) => {
    const current = formData.dietaryRestrictions;
    if (current.includes(restriction)) {
      updateFormData("dietaryRestrictions", current.filter(r => r !== restriction));
    } else {
      updateFormData("dietaryRestrictions", [...current, restriction]);
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Vamos Personalizar Seu Plano</CardTitle>
              <span className="text-sm text-gray-500">Passo {step} de {totalSteps}</span>
            </div>
            <CardDescription>
              Responda algumas perguntas para criar seu plano perfeito
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Informações Básicas */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Qual é o seu nome?</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ex: 25"
                    value={formData.age}
                    onChange={(e) => updateFormData("age", e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label>Sexo</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) => updateFormData("gender", value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-normal cursor-pointer">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-normal cursor-pointer">Feminino</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Medidas */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Ex: 70"
                    value={formData.weight}
                    onChange={(e) => updateFormData("weight", e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Ex: 170"
                    value={formData.height}
                    onChange={(e) => updateFormData("height", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Objetivo */}
          {step === 3 && (
            <div className="space-y-4">
              <Label>Qual é o seu objetivo principal?</Label>
              <RadioGroup
                value={formData.goal}
                onValueChange={(value) => updateFormData("goal", value)}
                className="space-y-3"
              >
                <Card className={`cursor-pointer transition-all ${formData.goal === "lose" ? "border-blue-600 bg-blue-50" : ""}`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value="lose" id="lose" />
                    <Label htmlFor="lose" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">Perder Peso</div>
                      <div className="text-sm text-gray-600">Reduzir gordura corporal</div>
                    </Label>
                  </CardContent>
                </Card>
                
                <Card className={`cursor-pointer transition-all ${formData.goal === "maintain" ? "border-blue-600 bg-blue-50" : ""}`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value="maintain" id="maintain" />
                    <Label htmlFor="maintain" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">Manter Peso</div>
                      <div className="text-sm text-gray-600">Manter forma atual</div>
                    </Label>
                  </CardContent>
                </Card>
                
                <Card className={`cursor-pointer transition-all ${formData.goal === "gain" ? "border-blue-600 bg-blue-50" : ""}`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value="gain" id="gain" />
                    <Label htmlFor="gain" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">Ganhar Massa</div>
                      <div className="text-sm text-gray-600">Aumentar músculos</div>
                    </Label>
                  </CardContent>
                </Card>
              </RadioGroup>
            </div>
          )}

          {/* Step 4: Nível de Atividade */}
          {step === 4 && (
            <div className="space-y-4">
              <Label>Qual é o seu nível de atividade física atual?</Label>
              <RadioGroup
                value={formData.activityLevel}
                onValueChange={(value) => updateFormData("activityLevel", value)}
                className="space-y-3"
              >
                <Card className={`cursor-pointer transition-all ${formData.activityLevel === "sedentary" ? "border-blue-600 bg-blue-50" : ""}`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value="sedentary" id="sedentary" />
                    <Label htmlFor="sedentary" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">Sedentário</div>
                      <div className="text-sm text-gray-600">Pouco ou nenhum exercício</div>
                    </Label>
                  </CardContent>
                </Card>
                
                <Card className={`cursor-pointer transition-all ${formData.activityLevel === "light" ? "border-blue-600 bg-blue-50" : ""}`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">Levemente Ativo</div>
                      <div className="text-sm text-gray-600">Exercício leve 1-3 dias/semana</div>
                    </Label>
                  </CardContent>
                </Card>
                
                <Card className={`cursor-pointer transition-all ${formData.activityLevel === "moderate" ? "border-blue-600 bg-blue-50" : ""}`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">Moderadamente Ativo</div>
                      <div className="text-sm text-gray-600">Exercício moderado 3-5 dias/semana</div>
                    </Label>
                  </CardContent>
                </Card>
                
                <Card className={`cursor-pointer transition-all ${formData.activityLevel === "active" ? "border-blue-600 bg-blue-50" : ""}`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">Muito Ativo</div>
                      <div className="text-sm text-gray-600">Exercício intenso 6-7 dias/semana</div>
                    </Label>
                  </CardContent>
                </Card>
              </RadioGroup>
            </div>
          )}

          {/* Step 5: Local de Treino */}
          {step === 5 && (
            <div className="space-y-4">
              <Label>Onde você prefere treinar?</Label>
              <RadioGroup
                value={formData.workoutLocation}
                onValueChange={(value) => updateFormData("workoutLocation", value)}
                className="space-y-3"
              >
                <Card className={`cursor-pointer transition-all ${formData.workoutLocation === "home" ? "border-blue-600 bg-blue-50" : ""}`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">Em Casa</div>
                      <div className="text-sm text-gray-600">Treinos com peso corporal e equipamentos básicos</div>
                    </Label>
                  </CardContent>
                </Card>
                
                <Card className={`cursor-pointer transition-all ${formData.workoutLocation === "gym" ? "border-blue-600 bg-blue-50" : ""}`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value="gym" id="gym" />
                    <Label htmlFor="gym" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">Na Academia</div>
                      <div className="text-sm text-gray-600">Acesso a equipamentos completos</div>
                    </Label>
                  </CardContent>
                </Card>
                
                <Card className={`cursor-pointer transition-all ${formData.workoutLocation === "both" ? "border-blue-600 bg-blue-50" : ""}`}>
                  <CardContent className="flex items-center space-x-3 p-4">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="font-normal cursor-pointer flex-1">
                      <div className="font-semibold">Ambos</div>
                      <div className="text-sm text-gray-600">Flexibilidade total</div>
                    </Label>
                  </CardContent>
                </Card>
              </RadioGroup>
            </div>
          )}

          {/* Step 6: Restrições Alimentares */}
          {step === 6 && (
            <div className="space-y-4">
              <Label>Você tem alguma restrição alimentar?</Label>
              <p className="text-sm text-gray-600">Selecione todas que se aplicam</p>
              
              <div className="space-y-3">
                {[
                  { id: "lactose", label: "Intolerância à Lactose", description: "Dificuldade em digerir laticínios" },
                  { id: "gluten", label: "Intolerância ao Glúten / Celíaco", description: "Sensibilidade ao trigo, centeio e cevada" },
                  { id: "vegetarian", label: "Vegetariano", description: "Não consome carne" },
                  { id: "vegan", label: "Vegano", description: "Não consome produtos de origem animal" },
                  { id: "nuts", label: "Alergia a Nozes", description: "Alergia a castanhas, amendoim, etc." },
                  { id: "seafood", label: "Alergia a Frutos do Mar", description: "Alergia a peixes e crustáceos" },
                  { id: "eggs", label: "Alergia a Ovos", description: "Não pode consumir ovos" },
                  { id: "soy", label: "Alergia à Soja", description: "Sensibilidade a produtos de soja" },
                  { id: "none", label: "Nenhuma Restrição", description: "Posso comer de tudo" },
                ].map((restriction) => (
                  <Card 
                    key={restriction.id}
                    className={`cursor-pointer transition-all ${
                      formData.dietaryRestrictions.includes(restriction.id) ? "border-blue-600 bg-blue-50" : ""
                    }`}
                    onClick={() => toggleDietaryRestriction(restriction.id)}
                  >
                    <CardContent className="flex items-center space-x-3 p-4">
                      <Checkbox
                        id={restriction.id}
                        checked={formData.dietaryRestrictions.includes(restriction.id)}
                        onCheckedChange={() => toggleDietaryRestriction(restriction.id)}
                      />
                      <Label htmlFor={restriction.id} className="font-normal cursor-pointer flex-1">
                        <div className="font-semibold">{restriction.label}</div>
                        <div className="text-sm text-gray-600">{restriction.description}</div>
                      </Label>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div>
                <Label htmlFor="allergies">Outras alergias ou observações</Label>
                <Input
                  id="allergies"
                  placeholder="Ex: Alergia a amendoim, não gosto de brócolis..."
                  value={formData.allergies}
                  onChange={(e) => updateFormData("allergies", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Step 7: Preferências Alimentares */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <Label>Quantas refeições você prefere fazer por dia?</Label>
                <RadioGroup
                  value={formData.mealsPerDay}
                  onValueChange={(value) => updateFormData("mealsPerDay", value)}
                  className="mt-3 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="3meals" />
                    <Label htmlFor="3meals" className="font-normal cursor-pointer">3 refeições (café, almoço, jantar)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="4meals" />
                    <Label htmlFor="4meals" className="font-normal cursor-pointer">4 refeições (+ 1 lanche)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="5meals" />
                    <Label htmlFor="5meals" className="font-normal cursor-pointer">5 refeições (+ 2 lanches)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6" id="6meals" />
                    <Label htmlFor="6meals" className="font-normal cursor-pointer">6 refeições (+ 3 lanches)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Quase lá!</span>
                </div>
                <p className="text-sm text-blue-800">
                  Estamos prontos para criar seu plano personalizado com base nas suas respostas.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <Button
              onClick={handleNext}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={
                (step === 1 && (!formData.name || !formData.age || !formData.gender)) ||
                (step === 2 && (!formData.weight || !formData.height)) ||
                (step === 3 && !formData.goal) ||
                (step === 4 && !formData.activityLevel) ||
                (step === 5 && !formData.workoutLocation) ||
                (step === 7 && !formData.mealsPerDay)
              }
            >
              {step === totalSteps ? "Finalizar" : "Próximo"}
              {step < totalSteps && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
