import pandas as pd
import xgboost as xgb
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

# Load the dataset
data = pd.read_excel('career_jobs21.xlsx')

# Convert 'Agree'/'Disagree' to numerical values
response_columns = data.columns[:36]
data[response_columns] = data[response_columns].replace({'Agree': 1, 'Disagree': 0})

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

# Compute scores for each category
category_scores = {
    category: data.iloc[:, [q - 1 for q in questions]].sum(axis=1) for category, questions in categories.items()
}
scores_df = pd.DataFrame(category_scores)
data = pd.concat([data, scores_df], axis=1)

# Encode job recommendations
job_targets = data['RecommendedJobs']
le_jobs = LabelEncoder()
y_jobs = le_jobs.fit_transform(job_targets)

# Combine category scores for job prediction
X_combined = scores_df

# Split data for job prediction
X_train, X_test, y_train, y_test = train_test_split(X_combined, y_jobs, test_size=0.2, random_state=42)

# Train XGBoost for job prediction
model_jobs = xgb.XGBClassifier(objective="multi:softmax", num_class=len(le_jobs.classes_), eval_metric="mlogloss")
model_jobs.fit(X_train, y_train)

# Save the model and encoders
with open('job_model.pkl', 'wb') as f:
    pickle.dump(model_jobs, f)

with open('label_encoder.pkl', 'wb') as f:
    pickle.dump(le_jobs, f)

print("Model trained and saved successfully!")