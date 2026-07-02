# NL-to-SQL Assistant 🚀

An AI-powered Natural Language to SQL assistant that converts English questions into SQL queries, executes them on a database, and returns results in real time.

---

## 📌 Project Overview

This project allows users to interact with a database using simple English queries instead of writing SQL manually.

### Example:
**Input:**
> Show all employees earning more than 70000

**Generated SQL:**

SELECT * FROM employees WHERE salary > 70000;

**🏗️ System Architecture**

User Question (English)
↓
Backend API (FastAPI / Flask)
↓
LLM (GPT / OpenAI / Local Model)
↓
SQL Query Generation
↓
SQL Validation Layer
↓
Database Execution (SQLite)
↓
Results Returned to User


**⚙️ Tech Stack**
Python 🐍
FastAPI / Flask
SQLAlchemy
SQLite / PostgreSQL
OpenAI API / LLM Model
HTML, CSS, JavaScript (Frontend)

## 📁 Project Structure

```bash
sql_project/
│
├── app.py
├── requirements.txt
├── .env
│
├── database/
│   ├── database.py
│   └── app.db
│
├── services/
│   ├── llm_service.py
│   ├── sql_executor.py
│   └── validator.py
│
├── routes/
│   ├── upload.py
│   ├── query.py
│   └── schema.py
│
├── uploads/
│   └── (CSV / Excel files)
│
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/script.js
│
└── README.md
```

## 🚀 Features

```bash
Convert natural language → SQL
Execute SQL queries on database
Upload CSV / Excel files
Support multiple tables
Query validation (security layer)
Basic frontend interface
API-based architecture
```

---

## 📦 Installation & Setup

### 1. Clone repository
```bash
git clone https://github.com/your-username/sql_project.git
cd sql_project
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run project
```bash
python app.py
```

---

## 🧪 Example API Endpoints

```bash
POST /ask → Convert NL to SQL and return results
POST /upload → Upload CSV/Excel files
GET /tables → View database tables
GET /history → Query history
```

---

## 📈 Future Improvements

```bash
Support for JOIN queries
Subqueries & window functions
Multi-database support
SQL explanation feature
User authentication
Chat-like UI interface
```

**👨‍💻 Author**

Jashandeep Kaur
