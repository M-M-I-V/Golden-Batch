# **🏭 Golden Batch Simulator: The Digital Twin**

**"Predict failures before you even turn on the machine."**

## **💡 The Problem**

In the semiconductor and manufacturing industry (especially here in the Philippines), "Trial and Error" is expensive. Running a production line with the wrong settings results in **scrap waste, energy loss, and downtime**.

Engineers often rely on gut feel or manual logbooks to set machine parameters.

## **🚀 The Solution**

**The Golden Batch Simulator** is a "Digital Twin" application. It uses a Machine Learning model to simulate the factory floor.

Engineers can adjust virtual inputs (Temperature, Pressure, Speed) and the AI predicts **instantaneously** if the resulting product will pass Quality Control. This allows for optimization without wasting a single gram of raw material.

## **🛠️ Tech Stack**

* **Frontend:** React.js (Vite) \+ Material UI (MUI) for the dashboard.  
* **Backend:** Python (Flask) for the API.  
* **Machine Learning:** Scikit-Learn (Decision Tree Classifier) for the predictive logic.  
* **Data:** Synthetic manufacturing dataset generated with Pandas.

## **⚡ How to Run This Project**

This project is a Monorepo. You need two terminals open.

### **Prerequisites**

* Node.js & npm  
* Python 3.9+

### **Terminal 1: The Backend (Python)**

1. Navigate to the backend folder:  
   cd backend

2. Create and activate virtual environment:  
   \# Windows  
   python \-m venv venv  
   venv\\Scripts\\activate

   \# Mac/Linux  
   python3 \-m venv venv  
   source venv/bin/activate

3. Install dependencies:  
   pip install \-r requirements.txt

4. **Train the Brain** (Generates the model.pkl):  
   python train\_model.py

5. Start the Server:  
   python app.py

   *Server will run on http://localhost:5000*

### **Terminal 2: The Frontend (React)**

1. Navigate to the frontend folder:  
   cd frontend

2. Install dependencies:  
   npm install

3. Start the UI:  
   npm run dev
