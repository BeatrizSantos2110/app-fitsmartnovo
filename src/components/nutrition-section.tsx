"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Utensils, Camera, Plus, Trash2, Apple, Beef, Egg, Wheat, Milk, Upload, Loader2, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface NutritionSectionProps {
  userProfile: any;
  onMealAdd?: (meal: Meal) => void;
  todayMeals?: Meal[];
}

interface Meal {
  id: number;
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  time: string;
  imageUrl?: string;
  analyzedByAI?: boolean;
}

export default function NutritionSection({ userProfile, onMealAdd, todayMeals = [] }: NutritionSectionProps) {
  const [meals, setMeals] = useState<Meal[]>(todayMeals);
  const [newMeal, setNewMeal] = useState({ name: "", calories: "", protein: "", carbs: "", fats: "" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalCalories = meals.reduce((sum, meal) => sum + parseInt(meal.calories || "0"), 0);
  const totalProtein = meals.reduce((sum, meal) => sum + parseInt(meal.protein || "0"), 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + parseInt(meal.carbs || "0"), 0);
  const totalFats = meals.reduce((sum, meal) => sum + parseInt(meal.fats || "0"), 0);

  const caloriesProgress = (totalCalories / userProfile.targetCalories) * 100;
  const remainingCalories = userProfile.targetCalories - totalCalories;

  const handleAddMeal = () => {
    if (newMeal.name && newMeal.calories) {
      const meal = { 
        ...newMeal, 
        id: Date.now(), 
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) 
      };
      setMeals([...meals, meal]);
      if (onMealAdd) onMealAdd(meal);
      setNewMeal({ name: "", calories: "", protein: "", carbs: "", fats: "" });
    }
  };

  const handleDeleteMeal = (id: number) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const analyzeFood = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    try {
      // Simula chamada à API de IA (GPT-4 Vision)
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          dietaryRestrictions: userProfile.dietaryRestrictions || [],
        }),
      });

      const data = await response.json();

      // Adiciona a refeição analisada
      const analyzedMeal: Meal = {
        id: Date.now(),
        name: data.foodName || "Refeição Fotografada",
        calories: data.calories?.toString() || "0",
        protein: data.protein?.toString() || "0",
        carbs: data.carbs?.toString() || "0",
        fats: data.fats?.toString() || "0",
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        imageUrl: selectedImage,
        analyzedByAI: true,
      };

      setMeals([...meals, analyzedMeal]);
      if (onMealAdd) onMealAdd(analyzedMeal);
      setPhotoDialogOpen(false);
      setSelectedImage(null);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Erro ao analisar imagem:', error);
      setIsAnalyzing(false);
      
      // Fallback: permite adicionar manualmente
      alert('Não foi possível analisar a imagem automaticamente. Por favor, adicione os dados manualmente.');
    }
  };

  const getDietaryRestrictionsText = () => {
    if (!userProfile.dietaryRestrictions || userProfile.dietaryRestrictions.length === 0) {
      return "Nenhuma restrição";
    }
    
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
    
    return userProfile.dietaryRestrictions.map((r: string) => labels[r] || r).join(", ");
  };

  const mealPlan = generateMealPlan(userProfile);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Sua Alimentação</CardTitle>
          <CardDescription className="text-white/80">
            Plano personalizado respeitando suas restrições
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Utensils className="w-8 h-8 mb-2" />
              <div className="text-2xl font-bold">{totalCalories}</div>
              <div className="text-white/80 text-sm">Calorias Consumidas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Beef className="w-8 h-8 mb-2" />
              <div className="text-2xl font-bold">{totalProtein}g</div>
              <div className="text-white/80 text-sm">Proteínas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Wheat className="w-8 h-8 mb-2" />
              <div className="text-2xl font-bold">{totalCarbs}g</div>
              <div className="text-white/80 text-sm">Carboidratos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Apple className="w-8 h-8 mb-2" />
              <div className="text-2xl font-bold">{totalFats}g</div>
              <div className="text-white/80 text-sm">Gorduras</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calorie Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Calórico Diário</CardTitle>
          <CardDescription>
            Meta: {userProfile.targetCalories} calorias • Restante: {remainingCalories > 0 ? remainingCalories : 0} cal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={Math.min(caloriesProgress, 100)} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Consumido: {totalCalories} cal</span>
            <span className={`font-semibold ${remainingCalories < 0 ? "text-red-600" : "text-green-600"}`}>
              {remainingCalories > 0 ? `${remainingCalories} cal restantes` : "Meta atingida!"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Dietary Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Milk className="w-5 h-5" />
            Suas Restrições Alimentares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userProfile.dietaryRestrictions && userProfile.dietaryRestrictions.length > 0 ? (
              userProfile.dietaryRestrictions.map((restriction: string) => {
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
                  <Badge key={restriction} variant="secondary" className="text-sm">
                    {labels[restriction] || restriction}
                  </Badge>
                );
              })
            ) : (
              <Badge variant="outline">Nenhuma restrição</Badge>
            )}
          </div>
          {userProfile.allergies && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm font-semibold text-yellow-900">Observações:</div>
              <div className="text-sm text-yellow-800">{userProfile.allergies}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Meal - COM FOTO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Registrar Refeição
          </CardTitle>
          <CardDescription>
            Tire uma foto do prato ou adicione manualmente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="meal-name">Nome da Refeição</Label>
              <Input
                id="meal-name"
                placeholder="Ex: Frango com batata doce"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="meal-calories">Calorias</Label>
              <Input
                id="meal-calories"
                type="number"
                placeholder="Ex: 450"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="meal-protein">Proteína (g)</Label>
              <Input
                id="meal-protein"
                type="number"
                placeholder="Ex: 35"
                value={newMeal.protein}
                onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="meal-carbs">Carbs (g)</Label>
              <Input
                id="meal-carbs"
                type="number"
                placeholder="Ex: 50"
                value={newMeal.carbs}
                onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="meal-fats">Gorduras (g)</Label>
            <Input
              id="meal-fats"
              type="number"
              placeholder="Ex: 15"
              value={newMeal.fats}
              onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
            />
          </div>
          
          <div className="flex gap-4">
            <Button onClick={handleAddMeal} disabled={!newMeal.name || !newMeal.calories}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Refeição
            </Button>
            
            <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Tirar Foto do Alimento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Analisar Alimento com IA</DialogTitle>
                  <DialogDescription>
                    Tire uma foto do seu prato e nossa IA calculará as calorias automaticamente
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {!selectedImage ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-4">
                        Tire uma foto ou faça upload de uma imagem do seu prato
                      </p>
                      <Button onClick={handleTakePhoto} variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Selecionar Foto
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden">
                        <img 
                          src={selectedImage} 
                          alt="Alimento selecionado" 
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      
                      {!isAnalyzing ? (
                        <div className="flex gap-2">
                          <Button 
                            onClick={analyzeFood} 
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Analisar e Adicionar
                          </Button>
                          <Button 
                            onClick={() => setSelectedImage(null)} 
                            variant="outline"
                          >
                            Trocar Foto
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-sm text-blue-900 font-medium">
                            Analisando alimento com IA...
                          </span>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 text-center">
                        💡 Nossa IA identifica os alimentos e calcula calorias, proteínas, carboidratos e gorduras automaticamente
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Meals Log */}
      {meals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Refeições de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meals.map((meal) => (
                <div key={meal.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {meal.imageUrl && (
                    <img 
                      src={meal.imageUrl} 
                      alt={meal.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{meal.name}</div>
                      {meal.analyzedByAI && (
                        <Badge variant="secondary" className="text-xs">
                          <Camera className="w-3 h-3 mr-1" />
                          IA
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {meal.time} • {meal.calories} cal
                      {meal.protein && ` • ${meal.protein}g proteína`}
                      {meal.carbs && ` • ${meal.carbs}g carbs`}
                      {meal.fats && ` • ${meal.fats}g gorduras`}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteMeal(meal.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meal Plan Suggestion */}
      <Card>
        <CardHeader>
          <CardTitle>Plano Alimentar Sugerido</CardTitle>
          <CardDescription>
            Baseado no seu objetivo de {userProfile.goal === "lose" ? "perder peso" : userProfile.goal === "gain" ? "ganhar massa" : "manter peso"} e suas restrições
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mealPlan.map((meal: any, index: number) => (
              <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-lg">{meal.name}</div>
                  <Badge variant="outline">{meal.calories} cal</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">{meal.time}</div>
                <div className="space-y-1">
                  {meal.foods.map((food: string, i: number) => (
                    <div key={i} className="text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {food}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Proteína: {meal.protein}g • Carbs: {meal.carbs}g • Gorduras: {meal.fats}g
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-900">
              💡 <strong>Dica:</strong> Este é um plano sugerido. Você pode adaptá-lo conforme sua preferência, sempre respeitando suas restrições alimentares.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function generateMealPlan(userProfile: any) {
  const isVegetarian = userProfile.dietaryRestrictions?.includes("vegetarian");
  const isVegan = userProfile.dietaryRestrictions?.includes("vegan");
  const hasLactose = userProfile.dietaryRestrictions?.includes("lactose");
  const hasGluten = userProfile.dietaryRestrictions?.includes("gluten");
  
  const mealsPerDay = parseInt(userProfile.mealsPerDay) || 3;
  const caloriesPerMeal = Math.round(userProfile.targetCalories / mealsPerDay);
  
  const proteinPerMeal = Math.round((userProfile.targetCalories * 0.3) / 4 / mealsPerDay);
  const carbsPerMeal = Math.round((userProfile.targetCalories * 0.4) / 4 / mealsPerDay);
  const fatsPerMeal = Math.round((userProfile.targetCalories * 0.3) / 9 / mealsPerDay);

  const mealPlan = [];

  // Café da Manhã
  mealPlan.push({
    name: "Café da Manhã",
    time: "07:00 - 08:00",
    calories: caloriesPerMeal,
    protein: proteinPerMeal,
    carbs: carbsPerMeal,
    fats: fatsPerMeal,
    foods: isVegan 
      ? [
          hasGluten ? "2 fatias de pão integral" : "2 tapiocas",
          "Pasta de amendoim (2 colheres)",
          "1 banana",
          "Leite de aveia (200ml)"
        ]
      : isVegetarian
      ? [
          hasGluten ? "2 fatias de pão integral" : "2 tapiocas",
          hasLactose ? "2 ovos mexidos" : "2 ovos mexidos com queijo",
          "1 fruta (banana ou maçã)",
          hasLactose ? "Café com leite sem lactose" : "Café com leite"
        ]
      : [
          hasGluten ? "2 fatias de pão integral" : "2 tapiocas",
          "2 ovos mexidos",
          hasLactose ? "30g de queijo sem lactose" : "30g de queijo branco",
          "1 fruta",
          "Café"
        ]
  });

  // Almoço
  mealPlan.push({
    name: "Almoço",
    time: "12:00 - 13:00",
    calories: caloriesPerMeal,
    protein: proteinPerMeal,
    carbs: carbsPerMeal,
    fats: fatsPerMeal,
    foods: isVegan
      ? [
          hasGluten ? "150g de arroz integral" : "150g de arroz",
          "100g de feijão",
          "Tofu grelhado (100g)",
          "Salada verde à vontade",
          "Legumes refogados"
        ]
      : isVegetarian
      ? [
          hasGluten ? "150g de arroz integral" : "150g de arroz",
          "100g de feijão",
          "2 ovos cozidos ou omelete",
          "Salada verde à vontade",
          "Legumes variados"
        ]
      : [
          hasGluten ? "150g de arroz integral" : "150g de arroz",
          "100g de feijão",
          "150g de frango grelhado",
          "Salada verde à vontade",
          "Legumes refogados"
        ]
  });

  // Lanche da Tarde (se aplicável)
  if (mealsPerDay >= 4) {
    mealPlan.push({
      name: "Lanche da Tarde",
      time: "15:00 - 16:00",
      calories: Math.round(caloriesPerMeal * 0.6),
      protein: Math.round(proteinPerMeal * 0.6),
      carbs: Math.round(carbsPerMeal * 0.6),
      fats: Math.round(fatsPerMeal * 0.6),
      foods: isVegan
        ? [
            "1 porção de frutas",
            "30g de castanhas",
            "Leite vegetal (200ml)"
          ]
        : [
            hasLactose ? "Iogurte sem lactose" : "Iogurte natural",
            "1 fruta",
            "30g de oleaginosas (castanhas, amêndoas)"
          ]
    });
  }

  // Jantar
  mealPlan.push({
    name: "Jantar",
    time: "19:00 - 20:00",
    calories: caloriesPerMeal,
    protein: proteinPerMeal,
    carbs: carbsPerMeal,
    fats: fatsPerMeal,
    foods: isVegan
      ? [
          "150g de batata doce",
          "Grão de bico (100g)",
          "Salada verde à vontade",
          "Legumes assados",
          "Azeite de oliva (1 colher)"
        ]
      : isVegetarian
      ? [
          "150g de batata doce ou mandioca",
          "Omelete de 2 ovos com legumes",
          "Salada verde à vontade",
          hasLactose ? "Queijo sem lactose" : "Queijo cottage"
        ]
      : [
          "150g de batata doce",
          "150g de peixe ou carne magra",
          "Salada verde à vontade",
          "Legumes grelhados",
          "Azeite de oliva"
        ]
  });

  // Ceia (se aplicável)
  if (mealsPerDay >= 5) {
    mealPlan.push({
      name: "Ceia",
      time: "21:30 - 22:00",
      calories: Math.round(caloriesPerMeal * 0.5),
      protein: Math.round(proteinPerMeal * 0.5),
      carbs: Math.round(carbsPerMeal * 0.3),
      fats: Math.round(fatsPerMeal * 0.5),
      foods: isVegan
        ? [
            "Leite vegetal (200ml)",
            "1 porção de frutas vermelhas"
          ]
        : [
            hasLactose ? "Iogurte sem lactose" : "Iogurte natural",
            "1 fruta ou oleaginosas"
          ]
    });
  }

  return mealPlan;
}
