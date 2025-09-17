from schemas import BMIResponse, CalorieResponse, BodyFatResponse

def calculate_bmi(height_cm: float, weight_kg: float) -> BMIResponse:
    """Calculate BMI and return category and ideal weight range"""
    height_m = height_cm / 100
    bmi = weight_kg / (height_m ** 2)
    
    # Determine BMI category
    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal weight"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"
    
    # Calculate ideal weight range (BMI 18.5-24.9)
    ideal_min_weight = 18.5 * (height_m ** 2)
    ideal_max_weight = 24.9 * (height_m ** 2)
    
    return BMIResponse(
        bmi=round(bmi, 1),
        category=category,
        ideal_weight_range={
            "min": round(ideal_min_weight, 1),
            "max": round(ideal_max_weight, 1)
        }
    )

def calculate_calories(age: int, gender: str, height_cm: float, weight_kg: float, 
                      activity_level: str, goal: str) -> CalorieResponse:
    """Calculate BMR, TDEE, and calorie goals"""
    
    # Calculate BMR using Mifflin-St Jeor Equation
    if gender.lower() == "male":
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    else:  # female
        bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
    
    # Activity multipliers
    activity_multipliers = {
        "sedentary": 1.2,
        "lightly_active": 1.375,
        "moderately_active": 1.55,
        "very_active": 1.725,
        "extremely_active": 1.9
    }
    
    multiplier = activity_multipliers.get(activity_level.lower(), 1.2)
    tdee = bmr * multiplier
    
    # Calculate calorie goal based on objective
    if goal.lower() == "weight_loss":
        calorie_goal = tdee - 500  # 500 calorie deficit for 1 lb/week loss
    elif goal.lower() == "weight_gain":
        calorie_goal = tdee + 500  # 500 calorie surplus for 1 lb/week gain
    else:  # maintenance
        calorie_goal = tdee
    
    # Macronutrient breakdown (40% carbs, 30% protein, 30% fat)
    protein_calories = calorie_goal * 0.30
    carb_calories = calorie_goal * 0.40
    fat_calories = calorie_goal * 0.30
    
    # Convert to grams (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
    protein_grams = protein_calories / 4
    carb_grams = carb_calories / 4
    fat_grams = fat_calories / 9
    
    return CalorieResponse(
        bmr=round(bmr, 0),
        tdee=round(tdee, 0),
        calorie_goal=round(calorie_goal, 0),
        macronutrient_breakdown={
            "protein": {
                "grams": round(protein_grams, 1),
                "calories": round(protein_calories, 0)
            },
            "carbohydrates": {
                "grams": round(carb_grams, 1),
                "calories": round(carb_calories, 0)
            },
            "fat": {
                "grams": round(fat_grams, 1),
                "calories": round(fat_calories, 0)
            }
        }
    )

def calculate_body_fat(age: int, gender: str, height_cm: float, weight_kg: float,
                      waist_cm: float, neck_cm: float, hip_cm: float = None) -> BodyFatResponse:
    """Calculate body fat percentage using Navy method"""
    
    if gender.lower() == "male":
        # Navy method for men
        body_fat = 495 / (1.0324 - 0.19077 * (waist_cm - neck_cm) / height_cm + 0.15456 * (waist_cm - neck_cm) / height_cm) - 450
    else:
        # Navy method for women (requires hip measurement)
        if hip_cm is None:
            raise ValueError("Hip measurement is required for women")
        
        body_fat = 495 / (1.29579 - 0.35004 * (waist_cm + hip_cm - neck_cm) / height_cm + 0.22100 * (waist_cm + hip_cm - neck_cm) / height_cm) - 450
    
    # Determine body fat category
    if gender.lower() == "male":
        if body_fat < 6:
            category = "Essential fat"
        elif body_fat < 14:
            category = "Athletes"
        elif body_fat < 18:
            category = "Fitness"
        elif body_fat < 25:
            category = "Average"
        else:
            category = "Obese"
        
        ideal_range = {"min": 8, "max": 19}
    else:  # female
        if body_fat < 10:
            category = "Essential fat"
        elif body_fat < 16:
            category = "Athletes"
        elif body_fat < 20:
            category = "Fitness"
        elif body_fat < 25:
            category = "Average"
        else:
            category = "Obese"
        
        ideal_range = {"min": 10, "max": 22}
    
    return BodyFatResponse(
        body_fat_percentage=round(body_fat, 1),
        category=category,
        ideal_range=ideal_range
    )
