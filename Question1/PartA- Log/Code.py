import pandas as pd
import os
from collections import Counter

# Settings
file_path = "logs.txt.xlsx"
chunk_size = 100000
output_dir = "log_chunks"
top_n = 10  # Number of most common error codes to retrieve

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Read the Excel file
df = pd.read_excel(file_path)

# Step 1: Split into smaller files
total_lines = len(df)
chunk_paths = []

for i in range(0, total_lines, chunk_size):
    chunk = df[i:i + chunk_size]
    chunk_filename = os.path.join(output_dir, f"chunk_{i // chunk_size}.txt")
    chunk.to_csv(chunk_filename, index=False, header=False)
    chunk_paths.append(chunk_filename)

# Step 2: Count error codes in each file
def count_errors_in_file(file_path):
    error_counter = Counter()
    with open(file_path, "r") as f:
        for line in f:
            if "Error:" in line:
                code = line.split("Error:")[1].strip()
                error_counter[code] += 1
    return error_counter

# Step 3: Merge counts from all files
merged_counts = Counter()
for path in chunk_paths:
    partial_counts = count_errors_in_file(path)
    merged_counts.update(partial_counts)

# Step 4: Find the top N most common error codes
top_errors = merged_counts.most_common(top_n)

# Output
print("🔥 Top N most common error codes:")
for code, count in top_errors:
    print(f"{code}: {count} times")

# סיבוכיות זמן:
# סיבוכיות הזמן של הקוד היא O(n) כך ש-n מסמל את מספר השורות בקובץ הExcel.
# הסיבה לכך היא כי הקוד עובר על כל שורה בקבץ בדיוק פעם אחת- בזמן הקריאה, בחלוקה לקבצים ובספירת השגיאות.
# הקריאה לmost_common(top_n) בסוף מוסיפה סיבוכיות של O(klogk) כך ש k מסמל את מספר סוגי השגיאות הקיימים.
# כיוון שk קטן בהרבה מ-n זה לא משפיע על הסיבוכיות הסופית.

# סיבוכיות מקום (זיכרון):
# סיבוכיות המקום של הקוד היא O(n), כאשר n הוא מספר השורות בקובץ.
# הסיבה לכך היא שכל הקובץ נטען בבת אחת לזיכרון בעזרת pandas.read_excel, כך שכל המידע נשמר במשתנה אחד מסוג DataFrame. בנוסף, יש שימוש במילון (Counter) לספירת מופעים של שגיאות – שבמקסימום יכול להגיע לגודל O(n) במקרה שיש הרבה קודים שונים.    
