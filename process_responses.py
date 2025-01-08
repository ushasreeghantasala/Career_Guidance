import sys
import pickle
import numpy as np

# Load the saved models
with open('job_model.pkl', 'rb') as f:
    model_jobs = pickle.load(f)

with open('label_encoder.pkl', 'rb') as f:
    le_jobs = pickle.load(f)

# Map questions to their respective categories
categories = {
    "Linguistic/Verbal": [7, 11, 15, 24],
    "Logical/Mathematical": [4, 28, 29, 33],
    "Musical": [1, 8, 17, 26],
    "Spatial/Visual": [3, 14, 18, 31],
    "Bodily/Kinesthetic": [6, 12, 16, 23],
    "Intrapersonal": [20, 25, 30, 32],
    "Interpersonal": [9, 21, 34, 35],
    "Naturalistic": [2, 10, 13, 36],
    "Existential": [5, 19, 22, 27],
}

# Get user responses from command line
user_responses = sys.argv[1].split(",")
user_responses = list(map(int, user_responses))

# Compute category scores from the user's responses
category_scores = {}
for category, questions in categories.items():
    category_scores[category] = sum(user_responses[q - 1] for q in questions)

# Create a list of the 9 category scores in the correct order
user_input = np.array([category_scores[category] for category in categories]).reshape(1, -1)

# Predict recommended job
job_pred = model_jobs.predict(user_input)
recommended_job = le_jobs.inverse_transform(job_pred)[0]

print(recommended_job)
