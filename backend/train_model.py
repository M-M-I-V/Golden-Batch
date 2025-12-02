import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
import joblib

def generate_and_train():
    n_samples = 1000
    np.random.seed(42)

    temps = np.random.randint(100, 201, n_samples)
    pressures = np.random.randint(10, 51, n_samples)

    df = pd.DataFrame({
        'temperature': temps,
        'pressure': pressures
    })

    def check_quality(row):
        if row['temperature'] > 180 and row['pressure'] < 30:
            return 1 # Pass
        return 0 # Fail
    
    df['quality'] = df.apply(check_quality, axis = 1)

    print(f"   - Created {n_samples} samples.")
    print(f"   - Golden Batches found: {df['quality'].sum()}")

    X = df[['temperature', 'pressure']]
    y = df['quality']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = DecisionTreeClassifier()
    model.fit(X_train, y_train)

    score = model.score(X_test, y_test)
    print(f"   - Model Accuracy: {score * 100:.2f}%")

    print("Saving model to 'model.pkl'...")
    joblib.dump(model, 'model.pkl')

if __name__ == "__main__":
    generate_and_train()