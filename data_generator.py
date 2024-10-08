import random
from datetime import datetime, timedelta

def generate_synthetic_data():
    now = datetime.now()
    week_ago = now - timedelta(days=7)
    
    visits = []
    intakes = []
    urine_outputs = []
    
    # Generate bathroom visits
    for _ in range(random.randint(30, 50)):  # 30-50 visits per week
        visit_time = week_ago + timedelta(seconds=random.randint(0, 7*24*60*60))
        visits.append(visit_time.isoformat())
    
    # Generate liquid intakes
    for _ in range(random.randint(20, 35)):  # 20-35 liquid intakes per week
        intake_time = week_ago + timedelta(seconds=random.randint(0, 7*24*60*60))
        liquid_amount = random.randint(100, 500)  # 100-500 ml
        intakes.append({
            "timestamp": intake_time.isoformat(),
            "liquidAmount": liquid_amount,
            "foodType": None
        })
    
    # Generate food intakes
    food_types = ["Breakfast", "Lunch", "Dinner", "Snack"]
    for _ in range(random.randint(15, 25)):  # 15-25 food intakes per week
        intake_time = week_ago + timedelta(seconds=random.randint(0, 7*24*60*60))
        food_type = random.choice(food_types)
        intakes.append({
            "timestamp": intake_time.isoformat(),
            "liquidAmount": None,
            "foodType": food_type
        })
    
    # Generate urine outputs
    for _ in range(random.randint(30, 50)):  # 30-50 urine outputs per week
        output_time = week_ago + timedelta(seconds=random.randint(0, 7*24*60*60))
        urine_amount = random.randint(100, 500)  # 100-500 ml
        urine_outputs.append({
            "timestamp": output_time.isoformat(),
            "amount": urine_amount
        })
    
    return {
        "visits": sorted(visits),
        "intakes": sorted(intakes, key=lambda x: x["timestamp"]),
        "urineOutputs": sorted(urine_outputs, key=lambda x: x["timestamp"])
    }
